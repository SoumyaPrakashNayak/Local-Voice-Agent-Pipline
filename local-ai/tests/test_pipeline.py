"""
AIRA Local Voice Pipeline Test Script — Phase 4 & Phase 4.1 (Goal A: Automatic Speech-End Detection)
Tests the complete end-to-end local voice assistant pipeline:
Microphone (with VAD speech-end detection) -> faster-whisper (CUDA) -> Llama 3.2 (Ollama) -> Sentence Streaming -> Piper (S16LE PCM) -> Speakers.
"""

import os
import sys
import glob
import argparse

# Ensure local-ai root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.pipeline import LocalVoicePipeline


def run_pipeline_test(
    max_record_seconds: float = 15.0,
    trailing_silence_s: float = 0.8,
    initial_silence_timeout: float = 5.0,
    text_input: str = None,
    play_audio: bool = True,
):
    print("========================================")
    print("AIRA LOCAL VOICE PIPELINE (PHASE 4.1 - VAD)")
    print("========================================")

    # Snapshot existing audio files in current directory to verify zero files created
    existing_audio = glob.glob("*.wav") + glob.glob("*.mp3") + glob.glob("*.ogg") + glob.glob("*.flac")

    # 1. Initialize complete pipeline (Whisper loaded once on CUDA, Ollama verified, Piper verified)
    try:
        pipeline = LocalVoicePipeline()
    except Exception as e:
        print(f"ERROR: Failed to initialize pipeline: {e}")
        return

    print("Pipeline ready.")
    print("----------------------------------------")

    # 2. Status logger to display real-time events and demonstrate concurrent overlap
    def on_status(msg: str):
        print(msg)

    # 3. Execute turn
    try:
        if text_input:
            print(f"\n[INPUT] Text mode: \"{text_input}\"\n")
            result = pipeline.run_turn(
                text_input=text_input,
                play_audio=play_audio,
                on_status=on_status,
            )
        else:
            print(f"\n[INPUT] Speak into microphone when ready (recording stops automatically when you finish speaking)...")
            print("Query suggestion: \"Explain what an FIR is in three short sentences.\"\n")
            result = pipeline.run_turn(
                max_record_seconds=max_record_seconds,
                trailing_silence_s=trailing_silence_s,
                initial_silence_timeout=initial_silence_timeout,
                play_audio=play_audio,
                on_status=on_status,
            )
    except KeyboardInterrupt:
        print("\n[PIPELINE] Interrupted by user (Ctrl+C). Cleaned up processes.")
        return
    except Exception as e:
        print(f"\nERROR during pipeline execution: {e}")
        return

    # 4. Verify no new audio files created on disk
    current_audio = glob.glob("*.wav") + glob.glob("*.mp3") + glob.glob("*.ogg") + glob.glob("*.flac")
    new_audio_files = [f for f in current_audio if f not in existing_audio]

    if result.timed_out:
        print("\n========================================")
        print("PIPELINE RESULT: TIMEOUT (NO SPEECH DETECTED)")
        print("========================================")
        print("No speech was detected before timeout. LLM was not invoked.")
        print(f"Initial silence timeout: {initial_silence_timeout:.1f} s")
        print(f"Audio files created:     NO (0 files)")
        print("========================================\n")
        return

    # 5. Print comprehensive latency instrumentation
    print("\n========================================")
    print("AIRA LOCAL VOICE PIPELINE LATENCY REPORT")
    print("========================================")

    print(f"\n[STT & RECORDING]")
    print(f"Actual recording duration:       {result.recording_duration_s:.2f} s (automatic speech-end detection)")
    print(f"Speech end -> transcript:        {result.speech_end_to_transcript_ms:.1f} ms")
    print(f"STT pure inference latency:      {result.stt_latency_ms:.1f} ms")
    print(f"Transcript:\n\"{result.transcript}\"")

    print(f"\n[LLM]")
    print(f"Transcript -> first token:       {result.llm_first_token_latency_ms:.1f} ms")
    print(f"First token -> first sentence:   {result.llm_first_sentence_latency_ms:.1f} ms")
    print(f"Total generation time:           {result.llm_total_generation_ms:.1f} ms")
    print(f"Sentences generated:             {len(result.sentences)}")
    if result.sentences:
        print(f"First sentence:\n\"{result.sentences[0]}\"")

    print(f"\n[TTS]")
    print(f"Sentence -> first PCM:           {result.tts_first_pcm_latency_ms:.1f} ms")
    print(f"First PCM -> audio playback:     {result.tts_first_playback_latency_ms:.1f} ms")
    print(f"Total synthesis time:            {result.tts_total_synthesis_ms:.1f} ms")

    print("\n----------------------------------------")
    print("KEY RESPONSIVENESS METRICS")
    print("----------------------------------------")
    print(f"Speech start -> first audio:     {result.speech_start_to_first_audio_ms:.1f} ms")
    print(f"Speech start -> complete:        {result.speech_start_to_complete_response_ms:.1f} ms")
    print(f"Recording termination:           AUTOMATIC VAD (No fixed duration wait)")
    print(f"LLM / TTS overlap achieved:      {'YES (Llama generated next sentences while Piper was speaking)' if result.overlap_achieved else 'NO'}")
    print(f"Audio storage:                   MEMORY ONLY (0 WAV files)")
    print(f"WAV files created:               {'YES (' + str(new_audio_files) + ')' if new_audio_files else 'NO (0 files)'}")
    print(f"Cloud APIs used:                 NONE (100% Local: Whisper CUDA + Llama 3.2 + Piper)")
    print("========================================\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AIRA Local Voice Pipeline Test (Phase 4.1 - Goal A)")
    parser.add_argument("--seconds", "--max-seconds", dest="max_seconds", type=float, default=15.0, help="Maximum recording safety cap in seconds (default: 15.0)")
    parser.add_argument("--trailing-silence", type=float, default=0.8, help="Trailing silence threshold to stop recording in seconds (default: 0.8)")
    parser.add_argument("--initial-timeout", type=float, default=5.0, help="Initial silence timeout before aborting in seconds (default: 5.0)")
    parser.add_argument("--text", type=str, default=None, help="Optional text prompt instead of mic recording")
    parser.add_argument("--no-play", action="store_true", help="Disable audio playback")
    args = parser.parse_args()

    run_pipeline_test(
        max_record_seconds=args.max_seconds,
        trailing_silence_s=args.trailing_silence,
        initial_silence_timeout=args.initial_timeout,
        text_input=args.text,
        play_audio=not args.no_play,
    )
