/**
 * Direct Google Gemini Live Voice Client Service for AIRA
 * Communicates directly with Gemini Live WebSocket using ephemeral tokens.
 * Zero LiveKit dependency.
 * Dedicated 24kHz PCM browser playback queue and unified Gemini Puck voice.
 * Fast path for deterministic command recognition with per-turn deduplication.
 */

import { GoogleGenAI } from '@google/genai';

export interface GeminiLiveCallbacks {
  onStateChange: (state: GeminiLiveState) => void;
  onUserTranscript: (transcript: string, isFinal: boolean) => void;
  onAssistantTranscript: (text: string) => void;
  onToolCall: (name: string, args: any) => Promise<any>;
  onError: (error: string) => void;
  onAudioLevel?: (level: number) => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export type GeminiLiveState =
  | 'IDLE'
  | 'REQUESTING_MIC'
  | 'CONNECTING'
  | 'LISTENING'
  | 'USER_SPEAKING'
  | 'PROCESSING'
  | 'EXECUTING_ACTION'
  | 'AIRA_SPEAKING'
  | 'ERROR'
  | 'DISCONNECTED';

export interface GeminiLiveDiagnostics {
  microphoneReady: boolean;
  permissionGranted: boolean;
  geminiConnected: boolean;
  model: string;
  inputSampleRate: number;
  resamplingActive: boolean;
  audioFramesSent: number;
  audioBytesSent: number;
  lastTranscript: string;
  lastResponse: string;
  lastTool: string;
}

export interface FastCommandResult {
  toolName: string;
  args: Record<string, any>;
  confidence: number;
}

/**
 * Fast deterministic intent parser for high-confidence UI commands
 */
export function parseFastCommand(text: string): FastCommandResult | null {
  const clean = text.toLowerCase().trim().replace(/^[,\.\?!]+|[,\.\?!]+$/g, '');
  if (!clean) return null;

  // 1. Knowledge Graph Commands
  // "open the knowledge graph for fir 504", "show relationships for fir 504", "open fir 504's knowledge graph", "open fir 504 graph"
  const kgMatch =
    clean.match(/(?:open|show|view|display)\s+(?:the\s+)?(?:knowledge\s+graph|relationships|investigation\s+graph|graph|connections)\s+(?:for|of|in)?\s*(?:fir|case)?\s*(\d{1,5})/i) ||
    clean.match(/(?:open|show|view)\s+(?:fir|case)?\s*(\d{1,5})(?:'s)?\s+(?:knowledge\s+graph|relationships|investigation\s+graph|graph|connections)/i);
  if (kgMatch) {
    return {
      toolName: 'open_fir_knowledge_graph',
      args: { fir_id: kgMatch[1] },
      confidence: 0.99,
    };
  }

  // 2. Open FIR Commands
  // "open fir 504", "open case 504", "view fir 504", "show fir 504"
  const firMatch =
    clean.match(/^(?:open|view|show|display|go\s+to)\s+(?:fir|case|investigation)(?:\s+number)?\s*(\d{1,5})$/i) ||
    clean.match(/^(?:fir|case)\s*(\d{1,5})$/i);
  if (firMatch) {
    return {
      toolName: 'open_fir',
      args: { fir_id: firMatch[1] },
      confidence: 0.99,
    };
  }

  // 3. Show My Cases
  if (/^(?:show|open|view|list)\s+(?:my\s+cases|my\s+active\s+cases|my\s+investigations)$/i.test(clean)) {
    return {
      toolName: 'show_my_cases',
      args: {},
      confidence: 0.99,
    };
  }

  // 4. Show Pending Cases
  if (/^(?:show|open|view|list)\s+(?:pending\s+cases|pending\s+docket|pending\s+fir[s]?)$/i.test(clean)) {
    return {
      toolName: 'show_pending_cases',
      args: {},
      confidence: 0.99,
    };
  }

  // 5. Evidence Vault
  if (/^(?:open|show|view|go\s+to)\s+(?:evidence\s+vault|evidence|vault)$/i.test(clean)) {
    return {
      toolName: 'open_evidence_vault',
      args: {},
      confidence: 0.99,
    };
  }

  // 6. Network Explorer
  if (/^(?:open|show|view|go\s+to)\s+(?:network\s+explorer|network|crime\s+network)$/i.test(clean)) {
    return {
      toolName: 'open_network_explorer',
      args: {},
      confidence: 0.99,
    };
  }

  // 7. Crime Hotspots / Reports
  if (/^(?:show|open|view)\s+(?:crime\s+hotspots|hotspots|analytics|reports)$/i.test(clean)) {
    return {
      toolName: 'show_crime_hotspots',
      args: {},
      confidence: 0.99,
    };
  }

  return null;
}

const AIRA_SYSTEM_INSTRUCTIONS = `You are AIRA, the authoritative State Intelligence Copilot for the Odisha Police S.I.R.I.S. system.

You assist investigating officers with navigation, entity intelligence retrieval, and case inspection.

Strict Rules:
1. Keep spoken confirmations brief and direct (maximum 1 concise sentence).
2. Never invent FIR information, suspect names, vehicle numbers, or legal sections.
3. Never invent arbitrary URLs or routes.
4. When the user asks to open or view an FIR (e.g., "Open FIR 504", "View FIR 504", "Open case 504", "Open FIR number 504"), you MUST call open_fir({ fir_id: "504" }).
5. When the user asks to open or view the knowledge graph or relationships for an FIR (e.g., "Open the knowledge graph for FIR 504", "Show the knowledge graph for FIR 504", "Open FIR 504's knowledge graph", "Show me the graph for FIR 504", "Show relationships for FIR 504", "Open the FIR 504 investigation graph", "Visualize FIR 504", "Show FIR 504 connections"), you MUST call open_fir_knowledge_graph({ fir_id: "504" }).
6. When the user asks for details or a summary of an FIR (e.g., "Tell me about FIR 504", "Explain FIR 504"), call get_fir_details({ fir_id: "504" }).
7. When the user asks to see active cases or pending cases, call show_my_cases() or show_pending_cases().
8. When the user asks for Evidence Vault, call open_evidence_vault().
9. When the user asks for Network Explorer, call open_network_explorer().
10. When the user asks for crime hotspots or reports, call show_crime_hotspots() or generate_report().
11. When the user asks for legal provisions, call open_legal_intelligence().
12. Do NOT give conversational preamble when a tool action is requested. Invoke the tool immediately.`;

const S_I_R_I_S_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'open_fir',
        description: 'Opens a specific FIR case workspace in S.I.R.I.S. by FIR number or Case ID (e.g. 504, 541, CR-KHD-2026-00504).',
        parameters: {
          type: 'OBJECT',
          properties: {
            fir_id: {
              type: 'STRING',
              description: 'FIR number or case ID, e.g. "504", "541", "CR-KHD-2026-00504"',
            },
          },
          required: ['fir_id'],
        },
      },
      {
        name: 'open_fir_knowledge_graph',
        description: 'Opens the entity relationship knowledge graph for a specific FIR by FIR number or Case ID (e.g. 504, 541, CR-KHD-2026-00504).',
        parameters: {
          type: 'OBJECT',
          properties: {
            fir_id: {
              type: 'STRING',
              description: 'FIR number or case ID, e.g. "504", "541"',
            },
          },
          required: ['fir_id'],
        },
      },
      {
        name: 'get_fir_details',
        description: 'Retrieves verified facts, suspects, vehicles, BNS sections, and summary of an FIR (e.g. 504, 541).',
        parameters: {
          type: 'OBJECT',
          properties: {
            fir_id: {
              type: 'STRING',
              description: 'FIR number or case ID, e.g. "504", "541"',
            },
          },
          required: ['fir_id'],
        },
      },
      {
        name: 'show_my_cases',
        description: 'Navigates to active investigations assigned to the current officer.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'show_pending_cases',
        description: 'Navigates to the pending case docket across active police stations.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'open_evidence_vault',
        description: 'Navigates to the Evidence Vault for document ingestion and entity extraction.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'open_network_explorer',
        description: 'Navigates to Network Explorer to inspect multi-hop cross-station relationships and graphs.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'show_crime_hotspots',
        description: 'Navigates to district analytics and geographic crime hotspot intelligence.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'find_similar_crimes',
        description: 'Searches multi-station records for similar modus operandi and pattern matches.',
        parameters: {
          type: 'OBJECT',
          properties: {
            crime_type: { type: 'STRING', description: 'Crime category, e.g. "burglary", "theft"' },
          },
        },
      },
      {
        name: 'open_cctv',
        description: 'Opens live CCTV surveillance camera grid and license-plate tracking feeds.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'generate_report',
        description: 'Navigates to the automated charge-sheet and report generation desk.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'show_case_timeline',
        description: 'Opens the chronological investigation timeline and activity audit for a case.',
        parameters: {
          type: 'OBJECT',
          properties: {
            fir_id: { type: 'STRING', description: 'FIR number, e.g. "504"' },
          },
        },
      },
      {
        name: 'check_cross_station_matches',
        description: 'Scans and displays cross-station entity matches (vehicles, phones, suspects).',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'open_legal_intelligence',
        description: 'Opens the Bharatiya Nyaya Sanhita (BNS) legal provisions scanner and statutory guide.',
        parameters: { type: 'OBJECT', properties: {} },
      },
    ],
  },
];

export class GeminiLiveService {
  private callbacks: GeminiLiveCallbacks;
  private session: any = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private playbackContext: AudioContext | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isConnected = false;
  private currentTranscript = '';
  private nextPlaybackTime = 0;
  private audioFramesSent = 0;
  private audioBytesSent = 0;
  private animFrameId: number | null = null;
  private activeAudioSources: AudioBufferSourceNode[] = [];

  // Per-Turn Action Deduplication
  private currentTurnId = 1;
  private executedTurnActions = new Set<string>();

  // Precise Latency Instrumentation Timestamps
  private micAudioFirstReceivedAt = 0;
  private firstPartialTranscriptAt = 0;
  private lastPartialTranscriptAt = 0;
  private turnStartedAt = 0;
  private turnEndedAt = 0;
  private geminiToolCallAt = 0;
  private toolExecutionStartedAt = 0;
  private toolExecutionFinishedAt = 0;
  private frontendActionAt = 0;
  private firstResponseAudioAt = 0;

  constructor(callbacks: GeminiLiveCallbacks) {
    this.callbacks = callbacks;
  }

  public getDiagnostics(): GeminiLiveDiagnostics {
    return {
      microphoneReady: Boolean(this.mediaStream?.active),
      permissionGranted: Boolean(this.mediaStream),
      geminiConnected: this.isConnected,
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      inputSampleRate: this.audioContext?.sampleRate || 0,
      resamplingActive: Boolean(this.processorNode),
      audioFramesSent: this.audioFramesSent,
      audioBytesSent: this.audioBytesSent,
      lastTranscript: this.currentTranscript,
      lastResponse: '',
      lastTool: '',
    };
  }

  /**
   * Start microphone capture, initialize playback context, and connect directly to Gemini Live API
   */
  public async start(): Promise<void> {
    if (this.isConnected && this.session) {
      return;
    }

    try {
      this.callbacks.onStateChange('REQUESTING_MIC');
      console.log('[AIRA AUDIO] Requesting microphone access...');

      // 1. Initialize and unlock Playback AudioContext directly on user gesture
      await this.setupPlaybackAudioContext();

      // 2. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.mediaStream = stream;
      console.log('[AIRA AUDIO] Microphone permission granted.');

      this.callbacks.onStateChange('CONNECTING');
      console.log('[AIRA GEMINI] Fetching secure ephemeral token from backend...');

      // 3. Fetch ephemeral token from server
      const tokenUrl = import.meta.env.VITE_GEMINI_TOKEN_URL || 'http://localhost:3001/api/gemini/live-token';
      const tokenRes = await fetch(tokenUrl);
      if (!tokenRes.ok) {
        throw new Error(`Token server returned HTTP ${tokenRes.status}`);
      }
      const tokenData = await tokenRes.json();
      if (!tokenData.token) {
        throw new Error(tokenData.error || 'Empty token received from server');
      }

      console.log(`[AIRA GEMINI] Voice configuration:`, {
        model: tokenData.model || 'gemini-2.5-flash-native-audio-preview-12-2025',
        voice: tokenData.voice || 'Puck',
      });

      // 4. Connect to Gemini Live using @google/genai SDK
      const ai = new GoogleGenAI({
        apiKey: tokenData.token,
        httpOptions: { apiVersion: 'v1alpha' },
      });

      const session = await ai.live.connect({
        model: tokenData.model || 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: ['AUDIO' as any],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: tokenData.voice || 'Puck',
              },
            },
          },
          systemInstruction: {
            parts: [{ text: AIRA_SYSTEM_INSTRUCTIONS }],
          },
          tools: S_I_R_I_S_TOOLS as any,
        } as any,
        callbacks: {
          onopen: () => {
            console.log('[AIRA GEMINI] Direct WebSocket connected to Gemini Live!');
            this.isConnected = true;
            this.callbacks.onStateChange('LISTENING');
          },
          onmessage: async (msg: any) => {
            await this.handleServerMessage(msg);
          },
          onerror: (err: any) => {
            console.error('[AIRA GEMINI ERROR]:', err?.message || err);
            this.callbacks.onError(err?.message || 'Gemini Live WebSocket error');
            this.callbacks.onStateChange('ERROR');
          },
          onclose: (e: any) => {
            console.log(`[AIRA GEMINI] Live session closed: code=${e.code}, reason="${e.reason}"`);
            this.isConnected = false;
            this.callbacks.onStateChange('DISCONNECTED');
          },
        },
      });

      this.session = session;

      // 5. Setup Input Audio Pipeline (Capture -> Resample to 16kHz -> PCM 16-bit -> Base64 -> Gemini)
      await this.setupInputAudioPipeline(stream);
    } catch (err: any) {
      console.error('[AIRA ERROR] Start failed:', err);
      this.cleanup();
      this.callbacks.onError(err?.message || 'Failed to initialize AIRA voice session.');
      this.callbacks.onStateChange('ERROR');
    }
  }

  /**
   * Send a text or predefined button command to Gemini Live session using the Puck voice
   */
  public async sendTextCommand(text: string): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Ensure playback context is unlocked on user button/key interaction
    await this.setupPlaybackAudioContext();

    if (!this.isConnected || !this.session) {
      await this.start();
    }

    if (!this.session) {
      console.error('[AIRA GEMINI ERROR] Session not available to send text command');
      return;
    }

    this.micAudioFirstReceivedAt = performance.now();
    this.turnStartedAt = performance.now();
    this.firstPartialTranscriptAt = 0;
    this.lastPartialTranscriptAt = 0;
    this.firstResponseAudioAt = 0;
    this.currentTurnId++;

    this.callbacks.onStateChange('PROCESSING');
    console.log(`[AIRA GEMINI] Sending text command to Gemini Live: "${cleanText}"`);

    try {
      await this.session.sendClientContent({
        turns: [
          {
            role: 'user',
            parts: [{ text: cleanText }],
          },
        ],
        turnComplete: true,
      });
    } catch (err) {
      console.error('[AIRA GEMINI ERROR] Failed to send client content:', err);
    }
  }

  /**
   * Resamples incoming Float32Array buffer to 16,000 Hz 16-bit signed PCM (mono)
   */
  private resampleTo16k(inputData: Float32Array, inputSampleRate: number): Int16Array {
    if (inputSampleRate === 16000) {
      const result = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        result[i] = Math.max(-32768, Math.min(32767, Math.floor(inputData[i] * 32767)));
      }
      return result;
    }

    const ratio = inputSampleRate / 16000;
    const newLength = Math.round(inputData.length / ratio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetInput = 0;

    while (offsetResult < newLength) {
      const nextOffsetInput = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetInput; i < nextOffsetInput && i < inputData.length; i++) {
        accum += inputData[i];
        count++;
      }
      const avg = count > 0 ? accum / count : 0;
      result[offsetResult] = Math.max(-32768, Math.min(32767, Math.floor(avg * 32767)));
      offsetResult++;
      offsetInput = nextOffsetInput;
    }

    return result;
  }

  /**
   * Converts Int16Array to Base64
   */
  private int16ToBase64(int16Array: Int16Array): string {
    const uint8 = new Uint8Array(int16Array.buffer, int16Array.byteOffset, int16Array.byteLength);
    let binary = '';
    const len = uint8.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }

  /**
   * Setup AudioContext & ScriptProcessor to stream PCM chunks to Gemini
   */
  private async setupInputAudioPipeline(stream: MediaStream): Promise<void> {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioCtx();
    this.audioContext = audioCtx;

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const source = audioCtx.createMediaStreamSource(stream);

    // Setup Visualizer Analyser
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.4;
    source.connect(analyser);
    this.analyserNode = analyser;

    // Start Visualizer Loop
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const checkLevel = () => {
      if (this.analyserNode) {
        this.analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length / 255;
        this.callbacks.onAudioLevel?.(avg);
      }
      this.animFrameId = requestAnimationFrame(checkLevel);
    };
    checkLevel();

    // ScriptProcessor to capture PCM frames
    const bufferSize = 2048;
    const processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
    this.processorNode = processor;

    processor.onaudioprocess = (e) => {
      if (!this.isConnected || !this.session) return;

      const inputChannelData = e.inputBuffer.getChannelData(0);
      const pcm16 = this.resampleTo16k(inputChannelData, audioCtx.sampleRate);
      if (pcm16.length === 0) return;

      if (!this.micAudioFirstReceivedAt) {
        this.micAudioFirstReceivedAt = performance.now();
        this.turnStartedAt = performance.now();
      }

      const base64Audio = this.int16ToBase64(pcm16);

      this.audioFramesSent++;
      this.audioBytesSent += pcm16.byteLength;

      try {
        this.session.sendRealtimeInput({
          media: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Audio,
          },
        });
      } catch (err) {
        console.warn('[AIRA AUDIO] Notice sending PCM chunk:', err);
      }
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);

    console.log(`[AIRA AUDIO] PCM 16kHz Streamer active. Source sample rate: ${audioCtx.sampleRate} Hz`);
  }

  /**
   * Setup & unlock Output AudioContext for progressive 24kHz PCM streaming playback
   */
  private async setupPlaybackAudioContext(): Promise<void> {
    if (!this.playbackContext || this.playbackContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.playbackContext = new AudioCtx();
    }

    if (this.playbackContext.state === 'suspended') {
      try {
        await this.playbackContext.resume();
        console.log('[AIRA AUDIO OUT] AudioContext resumed, state:', this.playbackContext.state);
      } catch (err) {
        console.error('[AIRA AUDIO ERROR] Failed to resume playback context:', err);
      }
    }

    console.log('[AIRA AUDIO OUT] AudioContext:', {
      state: this.playbackContext.state,
      sampleRate: this.playbackContext.sampleRate,
    });

    this.nextPlaybackTime = this.playbackContext.currentTime;
  }

  /**
   * Enqueue 24kHz PCM audio chunk for progressive playback
   */
  private playPcmChunk(base64Data: string, mimeType: string = 'audio/pcm;rate=24000'): void {
    if (!this.playbackContext || this.playbackContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.playbackContext = new AudioCtx();
    }
    const ctx = this.playbackContext!;

    if (ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          console.log('[AIRA AUDIO OUT] AudioContext resumed');
        })
        .catch((e) => {
          console.error('[AIRA AUDIO ERROR] Failed to resume AudioContext:', e);
        });
    }

    if (!this.firstResponseAudioAt) {
      this.firstResponseAudioAt = performance.now();
      const speechStart = this.micAudioFirstReceivedAt || this.turnStartedAt;
      if (speechStart) {
        const firstAudioMs = Math.round(this.firstResponseAudioAt - speechStart);
        console.log(`[AIRA LATENCY] speech_start -> first_response_audio: ${firstAudioMs} ms`);
      }
    }

    try {
      // Decode Base64 string to raw binary
      const binaryString = atob(base64Data);
      const rawBytes = binaryString.length;
      const sampleCount = Math.floor(rawBytes / 2);

      console.log('[AIRA AUDIO OUT] Audio part received:', {
        bytes: rawBytes,
        sampleRate: 24000,
        channels: 1,
        mimeType,
      });

      // Little-endian 16-bit signed PCM to 32-bit Float [-1.0, 1.0]
      const float32 = new Float32Array(sampleCount);
      for (let i = 0; i < sampleCount; i++) {
        const byte1 = binaryString.charCodeAt(i * 2);
        const byte2 = binaryString.charCodeAt(i * 2 + 1);
        let int16 = (byte2 << 8) | byte1;
        if (int16 >= 0x8000) {
          int16 -= 0x10000;
        }
        float32[i] = int16 / 32768.0;
      }

      console.log('[AIRA AUDIO OUT] Base64 decoded:', {
        pcmBytes: rawBytes,
        pcmSamples: sampleCount,
      });

      // Create AudioBuffer at 24,000 Hz
      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      console.log('[AIRA AUDIO OUT] AudioBuffer:', {
        length: audioBuffer.length,
        duration: Number(audioBuffer.duration.toFixed(4)),
        sampleRate: audioBuffer.sampleRate,
        numberOfChannels: audioBuffer.numberOfChannels,
      });

      const sourceNode = ctx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(ctx.destination);
      console.log('[AIRA AUDIO OUT] Connected to destination');

      const currentTime = ctx.currentTime;
      // Seamless queueing without overlap or gaps
      const startTime = Math.max(currentTime + 0.01, this.nextPlaybackTime);
      console.log('[AIRA AUDIO OUT] Scheduling playback:', {
        startTime: Number(startTime.toFixed(4)),
        currentTime: Number(currentTime.toFixed(4)),
      });

      sourceNode.start(startTime);
      console.log('[AIRA AUDIO OUT] AudioBufferSource.start() called');
      this.nextPlaybackTime = startTime + audioBuffer.duration;

      this.activeAudioSources.push(sourceNode);
      this.callbacks.onSpeakingChange?.(true);
      this.callbacks.onStateChange('AIRA_SPEAKING');
      console.log('[AIRA AUDIO OUT] PLAYBACK STARTED');

      sourceNode.onended = () => {
        const idx = this.activeAudioSources.indexOf(sourceNode);
        if (idx > -1) {
          this.activeAudioSources.splice(idx, 1);
        }
        if (this.activeAudioSources.length === 0) {
          this.callbacks.onSpeakingChange?.(false);
          this.callbacks.onStateChange('LISTENING');
          console.log('[AIRA AUDIO OUT] PLAYBACK ENDED');
        }
      };
    } catch (err: any) {
      console.error('[AIRA AUDIO ERROR]', {
        message: err?.message || err,
        stack: err?.stack || '',
      });
    }
  }

  /**
   * Stop any playing audio immediately (e.g. user interruption)
   */
  private stopAudioPlayback(): void {
    for (const src of this.activeAudioSources) {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    }
    this.activeAudioSources = [];
    if (this.playbackContext) {
      this.nextPlaybackTime = this.playbackContext.currentTime;
    }
    this.callbacks.onSpeakingChange?.(false);
  }

  /**
   * Handle incoming Gemini Live server WebSocket message
   */
  private async handleServerMessage(msg: any): Promise<void> {
    if (!msg) return;

    // 1. Tool Calls (with per-turn deduplication against fast path actions)
    if (msg.toolCall && msg.toolCall.functionCalls) {
      this.geminiToolCallAt = performance.now();
      const speechStart = this.micAudioFirstReceivedAt || this.turnStartedAt || this.geminiToolCallAt;
      console.log(`[AIRA LATENCY] speech_start -> tool_call: ${Math.max(0, Math.round(this.geminiToolCallAt - speechStart))} ms`);

      this.callbacks.onStateChange('EXECUTING_ACTION');
      console.log('[AIRA TOOL] Function call received from Gemini:', msg.toolCall.functionCalls);

      const functionResponses: any[] = [];
      for (const fc of msg.toolCall.functionCalls) {
        const actionKey = `${this.currentTurnId}:${fc.name}:${JSON.stringify(fc.args || {})}`;
        this.toolExecutionStartedAt = performance.now();

        // Check if already executed on fast path during this turn
        if (this.executedTurnActions.has(actionKey)) {
          console.log(`[AIRA TOOL] duplicate suppressed: ${fc.name} (already executed on fast path)`);
          this.toolExecutionFinishedAt = performance.now();
          functionResponses.push({
            id: fc.id,
            name: fc.name,
            response: { output: { success: true, action: fc.name, status: 'ALREADY_EXECUTED_FAST_PATH' } },
          });
        } else {
          this.executedTurnActions.add(actionKey);
          console.log(`[AIRA TOOL] Executing: ${fc.name} | args:`, fc.args);
          try {
            const result = await this.callbacks.onToolCall(fc.name, fc.args || {});
            this.toolExecutionFinishedAt = performance.now();
            const toolExecMs = Math.max(0, Math.round(this.toolExecutionFinishedAt - this.toolExecutionStartedAt));
            console.log(`[AIRA LATENCY] Tool execution: ${toolExecMs} ms`);

            functionResponses.push({
              id: fc.id,
              name: fc.name,
              response: { output: result },
            });
          } catch (err: any) {
            this.toolExecutionFinishedAt = performance.now();
            functionResponses.push({
              id: fc.id,
              name: fc.name,
              response: { error: err?.message || 'Execution error' },
            });
          }
        }
      }

      // Send tool response back to Gemini Live
      if (this.session && functionResponses.length > 0) {
        try {
          await this.session.sendToolResponse({ functionResponses });
          console.log('[AIRA TOOL] Sent tool responses to Gemini Live');
        } catch (e) {
          console.error('[AIRA TOOL ERROR] Failed to send tool response:', e);
        }
      }
      return;
    }

    // 2. Server Content
    if (msg.serverContent) {
      const sc = msg.serverContent;

      // User Interruption
      if (sc.interrupted) {
        console.log('[AIRA GEMINI] User interrupted assistant speech');
        this.stopAudioPlayback();
        this.callbacks.onStateChange('USER_SPEAKING');
      }

      // Real-time User Partial Transcription & Fast Path Checking
      if (sc.inputTranscription && sc.inputTranscription.text) {
        const text = sc.inputTranscription.text;
        if (!this.firstPartialTranscriptAt) {
          this.firstPartialTranscriptAt = performance.now();
          const speechStart = this.micAudioFirstReceivedAt || this.turnStartedAt;
          if (speechStart) {
            console.log(`[AIRA LATENCY] speech_start -> partial_transcript: ${Math.max(0, Math.round(this.firstPartialTranscriptAt - speechStart))} ms`);
          }
        }
        this.lastPartialTranscriptAt = performance.now();
        this.currentTranscript += text;
        console.log(`[AIRA TRANSCRIPT PARTIAL] "${this.currentTranscript}"`);
        this.callbacks.onUserTranscript(this.currentTranscript, Boolean(sc.turnComplete));
        if (this.activeAudioSources.length === 0) {
          this.callbacks.onStateChange('USER_SPEAKING');
        }

        // Fast Path Check on Partial Transcript for Deterministic Commands
        const fastMatch = parseFastCommand(this.currentTranscript);
        if (fastMatch) {
          const actionKey = `${this.currentTurnId}:${fastMatch.toolName}:${JSON.stringify(fastMatch.args)}`;
          if (!this.executedTurnActions.has(actionKey)) {
            this.executedTurnActions.add(actionKey);
            this.frontendActionAt = performance.now();
            const speechStart = this.micAudioFirstReceivedAt || this.turnStartedAt;
            const fastActionMs = speechStart ? Math.max(0, Math.round(this.frontendActionAt - speechStart)) : 0;
            console.log(`[AIRA FAST PATH] High-confidence deterministic command recognized: ${fastMatch.toolName} | args: ${JSON.stringify(fastMatch.args)}`);
            console.log(`[AIRA LATENCY] speech_start -> fast_action: ${fastActionMs} ms`);

            // Execute fast authoritative UI action immediately
            this.callbacks.onToolCall(fastMatch.toolName, fastMatch.args).catch((err) => {
              console.error('[AIRA FAST PATH ERROR] Fast tool execution error:', err);
            });
          }
        }
      }

      // Output Transcription
      if (sc.outputTranscription && sc.outputTranscription.text) {
        console.log(`[AIRA GEMINI] OUTPUT TRANSCRIPT: "${sc.outputTranscription.text}"`);
        this.callbacks.onAssistantTranscript(sc.outputTranscription.text);
      }

      // Native Audio Output Chunks (Gemini Puck Voice)
      if (sc.modelTurn && sc.modelTurn.parts) {
        console.log('[AIRA AUDIO OUT] Gemini model turn received');
        for (const part of sc.modelTurn.parts) {
          const partKeys = Object.keys(part || {});
          console.log('[AIRA AUDIO OUT] Model part:', partKeys);

          if (part.text) {
            this.callbacks.onAssistantTranscript(part.text);
          }
          if (part.inlineData && part.inlineData.data) {
            this.playPcmChunk(part.inlineData.data, part.inlineData.mimeType || 'audio/pcm;rate=24000');
          }
        }
      }

      // Turn Completion
      if (sc.turnComplete) {
        this.turnEndedAt = performance.now();
        console.log('[AIRA GEMINI] Turn completed');
        if (this.currentTranscript) {
          console.log(`[AIRA TRANSCRIPT FINAL] "${this.currentTranscript}"`);
          this.callbacks.onUserTranscript(this.currentTranscript, true);
        }

        // Print Structured Latency Summary
        const speechStart = this.micAudioFirstReceivedAt || this.turnStartedAt || this.turnEndedAt;
        console.log(`[AIRA LATENCY]
first_audio=${Math.round(this.micAudioFirstReceivedAt)}
first_partial_transcript=${Math.round(this.firstPartialTranscriptAt)}
turn_start=${Math.round(this.turnStartedAt)}
turn_end=${Math.round(this.turnEndedAt)}
tool_call=${Math.round(this.geminiToolCallAt)}
tool_execution=${Math.round(this.toolExecutionFinishedAt)}
frontend_action=${Math.round(this.frontendActionAt)}
first_audio_response=${Math.round(this.firstResponseAudioAt)}`);

        if (this.firstPartialTranscriptAt && speechStart) {
          console.log(`[AIRA LATENCY] speech_start -> partial_transcript: ${Math.max(0, Math.round(this.firstPartialTranscriptAt - speechStart))} ms`);
        }
        if (this.turnEndedAt && speechStart) {
          console.log(`[AIRA LATENCY] speech_start -> turn_end: ${Math.max(0, Math.round(this.turnEndedAt - speechStart))} ms`);
        }
        if (this.geminiToolCallAt && speechStart) {
          console.log(`[AIRA LATENCY] speech_start -> tool_call: ${Math.max(0, Math.round(this.geminiToolCallAt - speechStart))} ms`);
        }
        if (this.frontendActionAt && speechStart) {
          console.log(`[AIRA LATENCY] speech_start -> frontend_action: ${Math.max(0, Math.round(this.frontendActionAt - speechStart))} ms`);
        }
        if (this.firstResponseAudioAt && speechStart) {
          console.log(`[AIRA LATENCY] speech_start -> first_response_audio: ${Math.max(0, Math.round(this.firstResponseAudioAt - speechStart))} ms`);
        }

        // Reset turn state
        this.currentTurnId++;
        this.currentTranscript = '';
        this.micAudioFirstReceivedAt = 0;
        this.firstPartialTranscriptAt = 0;
        this.lastPartialTranscriptAt = 0;
        this.turnStartedAt = 0;
      }
    }
  }

  /**
   * Stop voice session and release microphone
   */
  public stop(): void {
    this.cleanup();
    this.callbacks.onStateChange('IDLE');
  }

  private cleanup(): void {
    this.isConnected = false;
    this.stopAudioPlayback();

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    if (this.playbackContext) {
      try {
        this.playbackContext.close();
      } catch (e) {}
      this.playbackContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.session) {
      try {
        this.session.close();
      } catch (e) {}
      this.session = null;
    }

    this.currentTranscript = '';
    this.audioFramesSent = 0;
    this.audioBytesSent = 0;
    this.executedTurnActions.clear();
  }
}
