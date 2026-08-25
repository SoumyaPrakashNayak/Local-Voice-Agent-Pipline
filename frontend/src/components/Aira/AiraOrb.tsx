import React from 'react';
import { useAira } from './AiraProvider';
import { Mic, MicOff, Volume2, Sparkles, Shield, Radio } from 'lucide-react';

export function AiraOrb() {
  const { isOpen, setIsOpen, listeningState, startListening, stopListening, isSpeaking, audioLevel } = useAira();

  const handleOrbClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      startListening();
    } else {
      setIsOpen(false);
      stopListening();
    }
  };

  const isListening =
    listeningState === 'LISTENING' || listeningState === 'REQUESTING_MIC' || listeningState === 'CONNECTING';
  const isProcessing = listeningState === 'PROCESSING';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none">
      {/* Status Pill Badge */}
      {!isOpen && (
        <div
          onClick={handleOrbClick}
          className="cursor-pointer glass px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs text-text shadow-lg hover:border-cyan-400/60 transition-all flex items-center gap-2 animate-fade-in group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono font-bold text-[11px] text-cyan-300 group-hover:text-cyan-200">
            AIRA VOICE
          </span>
        </div>
      )}

      {/* Floating Interactive Orb Button */}
      <button
        onClick={handleOrbClick}
        aria-label="Toggle AIRA Voice Assistant"
        className={`relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none shadow-2xl ${
          isOpen
            ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)] scale-105'
            : 'hover:scale-110 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
        }`}
      >
        {/* Animated Glow Rings */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            listeningState === 'LISTENING' && audioLevel > 0.08
              ? 'bg-cyan-500/40 animate-ping'
              : isSpeaking
              ? 'bg-amber-500/30 animate-pulse'
              : isProcessing
              ? 'bg-purple-500/30 animate-spin'
              : isListening
              ? 'bg-cyan-500/20 animate-pulse'
              : 'bg-cyan-500/10'
          }`}
        />

        {/* Orb Core Background with Gradient Border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0b1329] via-[#111f3d] to-[#0d2847] p-[1.5px] border border-cyan-500/40">
          <div className="w-full h-full rounded-full bg-[#070d1e] flex items-center justify-center overflow-hidden relative">
            {/* AIRA Emblem Image */}
            <img
              src="/AIRA.png"
              alt="AIRA Emblem"
              className={`w-10 h-10 object-contain transition-transform duration-300 ${
                isSpeaking ? 'scale-110' : isListening ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        </div>

        {/* State Indicator Icon Overlay */}
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-bg border border-border-soft flex items-center justify-center text-xs shadow">
          {isSpeaking ? (
            <Volume2 size={11} className="text-amber-400" />
          ) : isListening ? (
            <Mic size={11} className="text-cyan-400 animate-pulse" />
          ) : (
            <Radio size={11} className="text-text-dim" />
          )}
        </div>
      </button>
    </div>
  );
}
