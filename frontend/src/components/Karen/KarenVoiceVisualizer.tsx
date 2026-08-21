import React from 'react';
import { KarenListeningState } from './KarenProvider';

interface KarenVoiceVisualizerProps {
  state: KarenListeningState;
}

export function KarenVoiceVisualizer({ state }: KarenVoiceVisualizerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
      {/* 1. IDLE STATE: Subtle pulsing glow ring */}
      {state === 'IDLE' && (
        <div className="absolute w-24 h-24 rounded-full border border-brand/20 bg-brand/5 animate-pulse" />
      )}

      {/* 2. LISTENING STATE: Bouncing audio equalizer bars around the center */}
      {state === 'LISTENING' && (
        <div className="flex items-end justify-center gap-1.5 h-16 w-32 relative">
          <style>{`
            @keyframes eq-bounce {
              0%, 100% { height: 10%; }
              50% { height: 100%; }
            }
            .eq-bar {
              width: 3px;
              background-color: var(--brand-bright, #E3C077);
              border-radius: 9999px;
              animation: eq-bounce 1s ease-in-out infinite;
            }
          `}</style>
          <div className="eq-bar h-1" style={{ animationDelay: '0.1s', animationDuration: '0.8s' }} />
          <div className="eq-bar h-2" style={{ animationDelay: '0.3s', animationDuration: '1.2s' }} />
          <div className="eq-bar h-3" style={{ animationDelay: '0.0s', animationDuration: '0.9s' }} />
          <div className="eq-bar h-4" style={{ animationDelay: '0.5s', animationDuration: '1.4s' }} />
          <div className="eq-bar h-5" style={{ animationDelay: '0.2s', animationDuration: '0.7s' }} />
          <div className="eq-bar h-4" style={{ animationDelay: '0.4s', animationDuration: '1.1s' }} />
          <div className="eq-bar h-3" style={{ animationDelay: '0.1s', animationDuration: '0.9s' }} />
          <div className="eq-bar h-2" style={{ animationDelay: '0.3s', animationDuration: '1.3s' }} />
          <div className="eq-bar h-1" style={{ animationDelay: '0.2s', animationDuration: '0.8s' }} />
        </div>
      )}

      {/* 3. PROCESSING STATE: Rotating orbital particles */}
      {state === 'PROCESSING' && (
        <div className="relative w-36 h-36 flex items-center justify-center">
          <style>{`
            @keyframes orbit-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes orbit-spin-rev {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
            .orbit-ring-1 {
              border: 1px dashed rgba(79, 168, 184, 0.45);
              animation: orbit-spin 4s linear infinite;
            }
            .orbit-ring-2 {
              border: 1.5px dotted rgba(198, 161, 91, 0.55);
              animation: orbit-spin-rev 6s linear infinite;
            }
          `}</style>
          {/* Inner ring */}
          <div className="orbit-ring-1 absolute w-28 h-28 rounded-full" />
          {/* Outer ring */}
          <div className="orbit-ring-2 absolute w-36 h-36 rounded-full" />
        </div>
      )}

      {/* 4. RESPONDING STATE: Radiating sound wave rings */}
      {state === 'RESPONDING' && (
        <div className="relative w-44 h-44 flex items-center justify-center">
          <style>{`
            @keyframes ripple {
              0% { transform: scale(0.6); opacity: 0.9; }
              100% { transform: scale(1.4); opacity: 0; }
            }
            .ripple-ring {
              border: 1.5px solid rgba(79, 168, 184, 0.25);
              animation: ripple 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            }
          `}</style>
          <div className="ripple-ring absolute w-24 h-24 rounded-full" style={{ animationDelay: '0s' }} />
          <div className="ripple-ring absolute w-24 h-24 rounded-full" style={{ animationDelay: '0.6s' }} />
          <div className="ripple-ring absolute w-24 h-24 rounded-full" style={{ animationDelay: '1.2s' }} />
        </div>
      )}
    </div>
  );
}
