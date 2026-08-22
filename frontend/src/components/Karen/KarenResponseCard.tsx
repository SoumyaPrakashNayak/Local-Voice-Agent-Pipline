import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KarenResponse } from '../../services/karenService';
import { navigateKaren } from '../../services/karenNavigationService';
import { useKaren } from './KarenProvider';
import { ArrowRight, Sparkles, Volume2, VolumeX, Play, Pause, Square, RotateCcw } from 'lucide-react';

interface KarenResponseCardProps {
  response: KarenResponse;
  onActionTriggered?: () => void;
}

export function KarenResponseCard({ response, onActionTriggered }: KarenResponseCardProps) {
  const navigate = useNavigate();
  const {
    isSpeaking,
    isPaused,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    replaySpeaking,
    speakResponse
  } = useKaren();

  const handleActionClick = (route: string) => {
    stopSpeaking();
    navigateKaren(route, navigate);
    if (onActionTriggered) {
      onActionTriggered();
    }
  };

  // Split lines to render markdown-like bullet points and bold markers
  const renderResponseText = (text: string) => {
    return text.split('\n').map((line, index) => {
      let content: React.ReactNode = line;

      // Handle bullet points
      const isBullet = line.trim().startsWith('•');
      if (isBullet) {
        content = line.trim().substring(1).trim();
      }

      // Handle bold formatting **text**
      if (typeof content === 'string' && content.includes('**')) {
        const parts = content.split('**');
        content = parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-brand-bright font-bold">{part}</strong> : part));
      }

      if (isBullet) {
        return (
          <li key={index} className="ml-4 list-disc text-text-dim text-[13px] leading-relaxed my-1">
            {content}
          </li>
        );
      }

      return (
        <p key={index} className="text-text text-[13px] leading-relaxed my-1">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="glass bg-surface-2/90 border border-border-soft rounded-2xl p-5 space-y-4 animate-fade-in shadow-lg relative overflow-hidden">
      {/* Visual badge top-right */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-brand/5 rounded-full blur-xl pointer-events-none" />

      {/* Card Header with Voice Controls */}
      <div className="flex items-center justify-between border-b border-border-soft/60 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-brand animate-pulse" />
          <span className="text-[10px] font-bold font-mono tracking-widest text-brand uppercase">KAREN INTELLIGENCE</span>
        </div>

        {/* Audio Controls Bar */}
        <div className="flex items-center gap-1.5 bg-surface px-2 py-1 rounded-lg border border-border-soft shadow-inner">
          {/* Speaking Wave Pulse Indicator */}
          {isSpeaking && !isPaused && (
            <div className="flex items-center gap-0.5 px-1 mr-1">
              <span className="w-1 h-3 bg-brand animate-pulse rounded-full" />
              <span className="w-1 h-4 bg-brand-bright animate-pulse rounded-full delay-75" />
              <span className="w-1 h-2 bg-brand animate-pulse rounded-full delay-150" />
            </div>
          )}

          {/* Play / Replay */}
          <button
            type="button"
            onClick={() => replaySpeaking()}
            className="p-1.5 rounded-md hover:bg-surface-hover text-text-dim hover:text-brand transition-colors"
            title="Replay voice response"
          >
            <RotateCcw size={13} />
          </button>

          {/* Pause / Resume */}
          {isSpeaking && !isPaused ? (
            <button
              type="button"
              onClick={pauseSpeaking}
              className="p-1.5 rounded-md hover:bg-surface-hover text-warning transition-colors"
              title="Pause voice"
            >
              <Pause size={13} />
            </button>
          ) : isPaused ? (
            <button
              type="button"
              onClick={resumeSpeaking}
              className="p-1.5 rounded-md hover:bg-surface-hover text-brand transition-colors"
              title="Resume voice"
            >
              <Play size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => speakResponse(response.response)}
              className="p-1.5 rounded-md hover:bg-surface-hover text-brand transition-colors"
              title="Play voice"
            >
              <Volume2 size={13} />
            </button>
          )}

          {/* Stop Voice */}
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-1.5 rounded-md hover:bg-surface-hover text-danger-bright transition-colors"
              title="Stop voice"
            >
              <Square size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Complete Text Response */}
      <div className="space-y-1 text-text leading-relaxed">
        {renderResponseText(response.response)}
      </div>

      {/* Interactive Action Buttons */}
      {response.actions && response.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border-soft/45">
          {response.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleActionClick(action.route)}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                action.primary
                  ? 'bg-brand text-bg hover:bg-brand-bright shadow shadow-brand/10'
                  : 'bg-bg-elev border border-border hover:bg-surface-hover text-text-dim hover:text-text'
              }`}
            >
              {action.label}
              <ArrowRight size={12} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
