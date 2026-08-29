"""
AIRA Local Voice Pipeline — Phase 4 & Phase 4.1
Full local end-to-end voice assistant: STT (Whisper + VAD) -> LLM (Llama 3.2) -> Overlapped Sentence Streaming -> TTS (Piper S16LE).
"""

import re
import sys
import time
import queue
import threading
from dataclasses import dataclass, field
from typing import List, Optional, Callable, Dict, Any, Tuple
import numpy as np

from .stt import LocalSTT, TranscriptionResult
from .llm import LocalLLM, LLMResult
from .tts import LocalTTS, TTSResult


@dataclass
class SentenceEvent:
    """A sentence chunk passed from LLM stream to TTS worker queue."""
    index: int
    text: str
    created_at: float


@dataclass
class PipelineResult:
    """Detailed timing and diagnostic summary for an end-to-end voice turn."""
    transcript: str
    full_response: str
    sentences: List[str]
    
    # Latencies in milliseconds
    recording_duration_s: float
    stt_latency_ms: float
    speech_end_to_transcript_ms: float
    llm_first_token_latency_ms: float
    llm_first_sentence_latency_ms: float
    tts_first_pcm_latency_ms: float
    tts_first_playback_latency_ms: float
    
    # Key perceived responsiveness metrics
    speech_start_to_first_audio_ms: float
    speech_start_to_complete_response_ms: float
    
    # Component totals
    llm_total_generation_ms: float
    tts_total_synthesis_ms: float
    
    # Diagnostics
    timed_out: bool = False
    overlap_achieved: bool = True
    audio_format: str = "S16LE 16000Hz Mono"
    stt_device: str = "CUDA"
    llm_model: str = "llama3.2:latest"
    tts_voice: str = "en_US-amy-low"


class LocalVoicePipeline:
    """
    Complete local voice pipeline orchestrating STT, LLM, and TTS with sentence streaming and local VAD.
    
    Features:
    - Zero cloud APIs (100% local on RTX 3050 GPU + CPU).
    - Automatic speech-end detection (VAD): Stops recording naturally when the user finishes speaking.
    - Overlapped streaming: Sentence 1 begins synthesizing/speaking while Llama continues generating Sentence 2+.
    - Zero temporary audio files written to disk (in-memory S16LE PCM stream).
    - Precise end-to-end latency measurement across all pipeline boundaries.
    - Graceful cancellation and cleanup on interruption.
    """

    def __init__(
        self,
        stt: Optional[LocalSTT] = None,
        llm: Optional[LocalLLM] = None,
        tts: Optional[LocalTTS] = None,
        system_prompt: Optional[str] = None,
    ):
        print("[PIPELINE] Initializing local voice pipeline components...")
        
        # 1. Initialize or assign STT
        if stt is not None:
            self.stt = stt
        else:
            self.stt = LocalSTT(model_size="small", device="cuda", compute_type="float16")

        # 2. Initialize or assign LLM
        if llm is not None:
            self.llm = llm
        else:
            self.llm = LocalLLM(host="http://127.0.0.1:11434", model="llama3.2:latest")

        # 3. Initialize or assign TTS
        if tts is not None:
            self.tts = tts
        else:
            self.tts = LocalTTS(
                piper_path=r"D:\piper\piper.exe",
                model_path=r"D:\piper\en_US-amy-low.onnx",
                sample_rate=16000,
                channels=1,
            )

        self.system_prompt = system_prompt or (
            "You are AIRA, a local police investigation assistant. "
            "Answer clearly and concisely in 2 to 3 short sentences. "
            "Do not invent facts. Avoid markdown asterisks, bullets, or headers."
        )

        self.stop_event = threading.Event()
        print("[PIPELINE] All local components initialized and ready.\n")

    @staticmethod
    def _extract_sentences(text_buffer: str) -> Tuple[List[str], str]:
        """
        Extract completed sentences from a text buffer based on punctuation boundaries.
        Returns (list_of_completed_sentences, remaining_uncompleted_buffer).
        """
        parts = re.split(r'(?<=[.?!])\s+|\n+', text_buffer)
        if len(parts) > 1:
            completed = [p.strip() for p in parts[:-1] if p.strip()]
            remaining = parts[-1]
            return completed, remaining
        return [], text_buffer

    def run_turn(
        self,
        record_seconds: Optional[float] = None,
        max_record_seconds: float = 15.0,
        initial_silence_timeout: float = 5.0,
        trailing_silence_s: float = 1.2,
        speech_threshold: Optional[float] = None,
        audio_input: Optional[np.ndarray] = None,
        text_input: Optional[str] = None,
        play_audio: bool = True,
        on_status: Optional[Callable[[str], None]] = None,
    ) -> PipelineResult:
        """
        Execute one complete turn of the local voice pipeline.
        
        Steps:
        1. Capture speech from microphone using automatic VAD speech-end detection.
        2. Transcribe using faster-whisper on CUDA.
        3. Stream prompt to local Llama 3.2.
        4. Detect sentence boundaries in real time.
        5. Concurrently synthesize & play each sentence via Piper without waiting for LLM completion.
        6. Measure and record full latency breakdown.
        """
        self.stop_event.clear()

        # Handle record_seconds backward compatibility as max safety cap
        max_rec = record_seconds if record_seconds is not None else max_record_seconds

        def log_status(msg: str):
            if on_status:
                on_status(msg)

        # ---------------------------------------------------------------------
        # STAGE 1: Audio Input & STT Transcription
        # ---------------------------------------------------------------------
        t_speech_start = time.perf_counter()
        t_speech_end = t_speech_start
        actual_rec_duration_s = 0.0
        stt_latency_ms = 0.0
        speech_end_to_transcript_ms = 0.0

        if text_input:
            transcript = text_input.strip()
            t_transcript_available = time.perf_counter()
            actual_rec_duration_s = 0.0
            stt_latency_ms = 0.0
            speech_end_to_transcript_ms = 0.0
        else:
            if audio_input is not None:
                audio = audio_input
                actual_rec_duration_s = len(audio) / 16000.0
                t_speech_end = time.perf_counter()
            else:
                log_status("[STT] Listening for speech (auto-detect speech end)...")
                audio, vad_meta = self.stt.record_until_silence(
                    max_seconds=max_rec,
                    initial_silence_timeout=initial_silence_timeout,
                    trailing_silence_s=trailing_silence_s,
                    speech_threshold=speech_threshold,
                    on_speech_detected=lambda: log_status("[STT] Speech detected..."),
                    on_speech_ended=lambda: log_status("[STT] Speech ended..."),
                )
                actual_rec_duration_s = vad_meta.get("recording_duration_s", 0.0)
                t_speech_end = vad_meta.get("speech_end_time", time.perf_counter())

                if not vad_meta.get("speech_detected") or len(audio) == 0:
                    log_status("[STT] No speech detected before timeout.")
                    return PipelineResult(
                        transcript="",
                        full_response="",
                        sentences=[],
                        recording_duration_s=0.0,
                        stt_latency_ms=0.0,
                        speech_end_to_transcript_ms=0.0,
                        llm_first_token_latency_ms=0.0,
                        llm_first_sentence_latency_ms=0.0,
                        tts_first_pcm_latency_ms=0.0,
                        tts_first_playback_latency_ms=0.0,
                        speech_start_to_first_audio_ms=0.0,
                        speech_start_to_complete_response_ms=round((time.perf_counter() - t_speech_start) * 1000.0, 1),
                        llm_total_generation_ms=0.0,
                        tts_total_synthesis_ms=0.0,
                        timed_out=True,
                        overlap_achieved=False,
                    )

            log_status("[STT] Transcribing speech...")
            stt_res = self.stt.transcribe(audio)
            t_transcript_available = time.perf_counter()
            stt_latency_ms = stt_res.transcription_time_ms
            speech_end_to_transcript_ms = (t_transcript_available - t_speech_end) * 1000.0
            transcript = stt_res.text.strip()

        if not transcript:
            log_status("[STT] Empty transcript returned.")
            return PipelineResult(
                transcript="",
                full_response="",
                sentences=[],
                recording_duration_s=actual_rec_duration_s,
                stt_latency_ms=stt_latency_ms,
                speech_end_to_transcript_ms=speech_end_to_transcript_ms,
                llm_first_token_latency_ms=0.0,
                llm_first_sentence_latency_ms=0.0,
                tts_first_pcm_latency_ms=0.0,
                tts_first_playback_latency_ms=0.0,
                speech_start_to_first_audio_ms=0.0,
                speech_start_to_complete_response_ms=round((time.perf_counter() - t_speech_start) * 1000.0, 1),
                llm_total_generation_ms=0.0,
                tts_total_synthesis_ms=0.0,
                timed_out=False,
                overlap_achieved=False,
            )

        log_status(f"[STT] You said: \"{transcript}\"")

        # ---------------------------------------------------------------------
        # STAGE 2: Setup Concurrent Overlapped TTS Worker
        # ---------------------------------------------------------------------
        tts_queue: queue.Queue = queue.Queue()
        sentences_collected: List[str] = []
        tts_results: List[TTSResult] = []
        
        t_first_sentence_ready: Optional[float] = None
        t_first_tts_start: Optional[float] = None
        t_first_tts_pcm: Optional[float] = None
        t_first_audio_playback: Optional[float] = None
        t_tts_worker_done: Optional[float] = None
        tts_worker_error: List[Exception] = []

        def tts_worker():
            nonlocal t_first_tts_start, t_first_tts_pcm, t_first_audio_playback, t_tts_worker_done
            sentence_count = 0

            while not self.stop_event.is_set():
                try:
                    event: Optional[SentenceEvent] = tts_queue.get(timeout=0.1)
                except queue.Empty:
                    continue

                if event is None:
                    tts_queue.task_done()
                    break

                sentence_count += 1
                sentence_text = event.text

                log_status(f"[TTS] Speaking sentence {sentence_count}: \"{sentence_text}\"")

                t_synth_start = time.perf_counter()
                if t_first_tts_start is None:
                    t_first_tts_start = t_synth_start

                try:
                    stream = self.tts.speak_stream(
                        text=sentence_text,
                        play_audio=play_audio,
                        block_until_playback_finished=True,
                    )
                    
                    while True:
                        try:
                            chunk = next(stream)
                            now = time.perf_counter()
                            if t_first_tts_pcm is None:
                                t_first_tts_pcm = now
                            if t_first_audio_playback is None and play_audio:
                                t_first_audio_playback = now
                        except StopIteration as e:
                            res: TTSResult = e.value
                            tts_results.append(res)
                            break

                    log_status(f"[TTS] Finished sentence {sentence_count}")

                except Exception as e:
                    tts_worker_error.append(e)
                finally:
                    tts_queue.task_done()

            t_tts_worker_done = time.perf_counter()

        tts_thread = threading.Thread(target=tts_worker, daemon=True)
        tts_thread.start()

        # ---------------------------------------------------------------------
        # STAGE 3: Stream from LLM & Split Sentences in Real-Time
        # ---------------------------------------------------------------------
        t_llm_start = time.perf_counter()
        t_llm_first_token: Optional[float] = None
        full_llm_tokens: List[str] = []
        buffer = ""
        sentence_index = 0

        log_status("[LLM] Generating response...")

        try:
            llm_stream = self.llm.stream_response(
                prompt=transcript,
                system_prompt=self.system_prompt,
            )

            for token in llm_stream:
                if self.stop_event.is_set():
                    break

                now = time.perf_counter()
                if t_llm_first_token is None:
                    t_llm_first_token = now

                full_llm_tokens.append(token)
                buffer += token

                completed_sentences, buffer = self._extract_sentences(buffer)
                for sentence in completed_sentences:
                    if sentence:
                        sentence_index += 1
                        sentences_collected.append(sentence)
                        if t_first_sentence_ready is None:
                            t_first_sentence_ready = time.perf_counter()
                        
                        log_status(f"[LLM] Sentence {sentence_index} ready: \"{sentence}\"")
                        tts_queue.put(SentenceEvent(index=sentence_index, text=sentence, created_at=time.perf_counter()))

            # Flush any remaining buffer text
            remaining = buffer.strip()
            if remaining and not self.stop_event.is_set():
                sentence_index += 1
                sentences_collected.append(remaining)
                if t_first_sentence_ready is None:
                    t_first_sentence_ready = time.perf_counter()
                log_status(f"[LLM] Sentence {sentence_index} ready (final): \"{remaining}\"")
                tts_queue.put(SentenceEvent(index=sentence_index, text=remaining, created_at=time.perf_counter()))

        except Exception as e:
            self.stop_event.set()
            tts_queue.put(None)
            tts_thread.join(timeout=1.0)
            raise RuntimeError(f"LLM streaming failed: {e}") from e

        t_llm_done = time.perf_counter()
        full_response = "".join(full_llm_tokens).strip()

        # Signal TTS worker and wait for playback
        tts_queue.put(None)
        tts_thread.join(timeout=30.0)

        t_all_complete = time.perf_counter()

        if tts_worker_error:
            raise RuntimeError(f"TTS playback worker error: {tts_worker_error[0]}") from tts_worker_error[0]

        # ---------------------------------------------------------------------
        # STAGE 4: Latency Calculations & Diagnostics
        # ---------------------------------------------------------------------
        t_llm_first_tok = t_llm_first_token or t_llm_start
        t_first_sent = t_first_sentence_ready or t_llm_done
        t_first_pcm = t_first_tts_pcm or t_first_sent
        t_first_play = t_first_audio_playback or t_first_pcm

        transcript_to_first_tok = (t_llm_first_tok - t_transcript_available) * 1000.0
        first_tok_to_first_sent = (t_first_sent - t_llm_first_tok) * 1000.0
        first_sent_to_first_pcm = (t_first_pcm - t_first_sent) * 1000.0
        first_pcm_to_play = (t_first_play - t_first_pcm) * 1000.0
        
        speech_to_first_play = (t_first_play - t_speech_start) * 1000.0
        speech_to_complete = (t_all_complete - t_speech_start) * 1000.0
        llm_total_ms = (t_llm_done - t_llm_start) * 1000.0
        tts_total_synth = sum(r.total_synthesis_time_ms for r in tts_results)

        overlap_achieved = (t_llm_done > t_first_play) or (len(sentences_collected) > 1 and t_llm_done > t_first_sent)

        stt_info = self.stt.get_device_info()
        tts_info = self.tts.get_info()

        return PipelineResult(
            transcript=transcript,
            full_response=full_response,
            sentences=sentences_collected,
            recording_duration_s=round(actual_rec_duration_s, 2),
            stt_latency_ms=round(stt_latency_ms, 1),
            speech_end_to_transcript_ms=round(max(0.0, speech_end_to_transcript_ms), 1),
            llm_first_token_latency_ms=round(transcript_to_first_tok, 1),
            llm_first_sentence_latency_ms=round(first_tok_to_first_sent, 1),
            tts_first_pcm_latency_ms=round(first_sent_to_first_pcm, 1),
            tts_first_playback_latency_ms=round(first_pcm_to_play, 1),
            speech_start_to_first_audio_ms=round(speech_to_first_play, 1),
            speech_start_to_complete_response_ms=round(speech_to_complete, 1),
            llm_total_generation_ms=round(llm_total_ms, 1),
            tts_total_synthesis_ms=round(tts_total_synth, 1),
            timed_out=False,
            overlap_achieved=overlap_achieved,
            stt_device=stt_info.get("device", "cuda").upper(),
            llm_model=self.llm.model,
            tts_voice=tts_info.get("model_name", "en_US-amy-low"),
        )
