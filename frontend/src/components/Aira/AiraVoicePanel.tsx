import React, { useState } from 'react';
import { useAira } from './AiraProvider';
import { AiraVoiceVisualizer } from './AiraVoiceVisualizer';
import { AiraResponseCard } from './AiraResponseCard';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Send,
  Radio,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Activity,
  Cpu,
} from 'lucide-react';

export function AiraVoicePanel() {
  const {
    isOpen,
    setIsOpen,
    listeningState,
    transcript,
    errorMessage,
    response,
    audioLevel,
    geminiConnected,
    diagnostics,
    showDiagnostics,
    setShowDiagnostics,
    startListening,
    stopListening,
    handleSubmitQuery,
    executeAction,
    resetAira,
    isSpeaking,
  } = useAira();

  const [textInput, setTextInput] = useState('');

  if (!isOpen) return null;

  const isListening =
    listeningState === 'LISTENING' || listeningState === 'REQUESTING_MIC' || listeningState === 'CONNECTING';
  const isProcessing = listeningState === 'PROCESSING';

  const handleMicToggle = () => {
    if (isListening || listeningState === 'USER_SPEAKING') {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleSubmitQuery(textInput);
      setTextInput('');
    }
  };

  const quickCommands = [
    'Open FIR 504',
    'Open knowledge graph for FIR 504',
    'Tell me about FIR 504',
    'Show my cases',
    'Show pending cases',
    'Open Evidence Vault',
    'Open Network Explorer',
    'Show crime hotspots',
    'Scan applicable BNS provisions',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] max-h-[85vh] bg-[#0B1120]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden animate-slide-up text-text font-sans select-none">
      {/* Top Accent Line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* ── Panel Header ── */}
      <div className="px-5 py-3.5 border-b border-border-soft flex items-center justify-between bg-surface/60">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-full bg-[#070d1e] border border-cyan-400/50 p-1 flex items-center justify-center shadow">
            <img src="/AIRA.png" alt="AIRA" className="w-full h-full object-contain" />
            <div
              className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${geminiConnected ? 'bg-emerald-400' : 'bg-cyan-400'
                } border border-bg animate-pulse`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-text font-display tracking-wide">
                AIRA <span className="text-cyan-400 text-xs font-mono font-normal">INTELLIGENCE</span>
              </h3>
            </div>
            <p className="text-[10px] text-text-dim font-mono flex items-center gap-1.5">
              <span>Odisha Police AI Copilot</span>
              {geminiConnected && (
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded text-[9px]">
                  AIRA LIVE ACTIVE
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            title="Toggle Gemini Live Diagnostics"
            className={`p-1.5 rounded-lg transition-colors ${showDiagnostics ? 'bg-cyan-500/20 text-cyan-300' : 'text-text-dim hover:text-text hover:bg-surface'
              }`}
          >
            <Activity size={14} />
          </button>
          <button
            onClick={resetAira}
            title="Reset Conversation"
            className="p-1.5 rounded-lg text-text-dim hover:text-text hover:bg-surface transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => {
              stopListening();
              setIsOpen(false);
            }}
            title="Close Assistant"
            className="p-1.5 rounded-lg text-text-dim hover:text-text hover:bg-surface transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Optional Diagnostics HUD (Phase 25) ── */}
      {showDiagnostics && (
        <div className="px-4 py-2.5 bg-black/70 border-b border-cyan-500/30 text-[10px] font-mono space-y-1.5 animate-fade-in">
          <div className="text-cyan-400 font-bold tracking-wider flex items-center justify-between">
            <span>AIRA DIAGNOSTICS</span>
            <span className="text-[9px] text-text-dim">{diagnostics.model}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-text-muted">
            <div className="flex items-center justify-between">
              <span>Microphone:</span>
              <span className={diagnostics.microphoneReady ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                {diagnostics.microphoneReady ? '● READY' : '● NOT READY'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Permission:</span>
              <span className={diagnostics.permissionGranted ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {diagnostics.permissionGranted ? '● GRANTED' : '● PENDING'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gemini Live:</span>
              <span className={diagnostics.geminiConnected ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                {diagnostics.geminiConnected ? '● CONNECTED' : '● DISCONNECTED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Resampling:</span>
              <span className={diagnostics.resamplingActive ? 'text-emerald-400 font-bold' : 'text-text-faint'}>
                {diagnostics.resamplingActive ? '● 16kHz PCM' : '● IDLE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Frames Sent:</span>
              <span className="text-cyan-300 font-bold">
                {diagnostics.audioFramesSent} ({Math.round(diagnostics.audioBytesSent / 1024)} KB)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Tool:</span>
              <span className="text-amber-300 truncate max-w-[90px]">
                {diagnostics.lastTool || 'none'}
              </span>
            </div>
          </div>
          {diagnostics.lastTranscript && (
            <div className="truncate text-cyan-300">
              <span className="text-text-dim">User Transcript: </span>"{diagnostics.lastTranscript}"
            </div>
          )}
        </div>
      )}

      {/* ── Status & Waveform Center ── */}
      <div className="px-5 py-4 bg-gradient-to-b from-surface/80 to-bg-elev/40 border-b border-border-soft/60 flex flex-col items-center gap-3">
        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border ${listeningState === 'REQUESTING_MIC' || listeningState === 'CONNECTING'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              : isSpeaking || listeningState === 'AIRA_SPEAKING'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : listeningState === 'USER_SPEAKING'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : isProcessing
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : isListening
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                      : listeningState === 'ERROR'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-surface border-border-soft text-text-dim'
              }`}
          >
            {listeningState === 'REQUESTING_MIC' && <Radio size={12} className="animate-spin text-amber-300" />}
            {listeningState === 'CONNECTING' && <Radio size={12} className="animate-spin text-amber-300" />}
            {listeningState === 'USER_SPEAKING' && <Mic size={12} className="text-emerald-400 animate-pulse" />}
            {isSpeaking && <Volume2 size={12} className="text-amber-300" />}
            {isListening && <Mic size={12} className="text-cyan-400 animate-pulse" />}
            {isProcessing && <Sparkles size={12} className="text-purple-300 animate-spin" />}

            {listeningState === 'REQUESTING_MIC' && 'REQUESTING MICROPHONE...'}
            {listeningState === 'CONNECTING' && 'CONNECTING TO AIRA...'}
            {listeningState === 'USER_SPEAKING' && 'HEARING SPEECH...'}
            {listeningState === 'LISTENING' && 'LISTENING — SPEAK NATURALLY'}
            {listeningState === 'PROCESSING' && 'REASONING & ROUTING...'}
            {listeningState === 'AIRA_SPEAKING' && 'AIRA SPEAKING'}
            {listeningState === 'IDLE' && 'READY · PUSH TO TALK'}
            {listeningState === 'ERROR' && 'AUDIO / MIC NOTICE'}
            {listeningState === 'DISCONNECTED' && 'DISCONNECTED'}
          </span>
        </div>

        {/* Real-time Visualizer Canvas */}
        <AiraVoiceVisualizer state={listeningState} audioLevel={audioLevel} />

        {/* Live Streaming Transcript */}
        <div className="w-full min-h-[36px] bg-bg/70 border border-border-soft rounded-xl px-3 py-2 text-xs flex items-center justify-center text-center">
          {transcript ? (
            <p className="text-cyan-300 font-mono italic animate-fade-in">"{transcript}"</p>
          ) : isListening ? (
            <p className="text-text-faint text-[11px]">Listening... speak naturally (e.g. "Tell me about FIR 504")</p>
          ) : (
            <p className="text-text-faint text-[11px]">Ready for voice or text query</p>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-full">
            <AlertCircle size={13} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* ── Scrollable Body: Response & Suggestions ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px]">
        {/* Latest Response Card */}
        {response ? (
          <AiraResponseCard response={response} onExecuteAction={executeAction} />
        ) : (
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-text-dim flex items-center gap-1.5">
              <HelpCircle size={12} className="text-cyan-400" />
              <span>Supported Voice Commands</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {quickCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmitQuery(cmd)}
                  className="text-left px-2.5 py-2 rounded-lg bg-surface/70 border border-border-soft hover:border-cyan-500/50 hover:bg-surface text-[11px] text-text transition-all truncate group flex items-center justify-between"
                >
                  <span className="truncate group-hover:text-cyan-300">"{cmd}"</span>
                  <ChevronRight size={10} className="text-text-faint group-hover:text-cyan-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer: PTT Microphone Button & Text Fallback ── */}
      <div className="p-4 bg-surface/80 border-t border-border-soft flex flex-col gap-3">
        {/* Main PTT Button */}
        <button
          onClick={handleMicToggle}
          disabled={listeningState === 'CONNECTING' || listeningState === 'REQUESTING_MIC'}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg ${isListening || listeningState === 'USER_SPEAKING'
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20'
            }`}
        >
          {isListening || listeningState === 'USER_SPEAKING' ? (
            <>
              <MicOff size={16} />
              <span>STOP LISTENING</span>
            </>
          ) : (
            <>
              <Mic size={16} />
              <span>TAP TO SPEAK (AIRA IS LIVE)</span>
            </>
          )}
        </button>

        {/* Text Query Form Fallback */}
        <form onSubmit={handleTextSubmit} className="relative flex items-center">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type a query (e.g. 'Open FIR 504')..."
            className="w-full bg-bg/90 border border-border-soft rounded-xl pl-3 pr-10 py-2 text-xs text-text placeholder:text-text-faint focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
