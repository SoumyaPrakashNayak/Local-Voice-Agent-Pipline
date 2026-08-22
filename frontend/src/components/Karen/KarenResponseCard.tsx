import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KarenResponse } from '../../services/karenService';
import { navigateKaren } from '../../services/karenNavigationService';
import { ArrowRight, Sparkles } from 'lucide-react';

interface KarenResponseCardProps {
  response: KarenResponse;
  onActionTriggered?: () => void;
}

export function KarenResponseCard({ response, onActionTriggered }: KarenResponseCardProps) {
  const navigate = useNavigate();

  const handleActionClick = (route: string) => {
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
    <div className="glass bg-surface-2/80 border border-border-soft rounded-2xl p-5 space-y-4 animate-fade-in shadow-lg relative overflow-hidden">
      {/* Visual badge top-right */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-2 border-b border-border-soft/60 pb-2">
        <Sparkles size={14} className="text-brand animate-pulse" />
        <span className="text-[10px] font-bold font-mono tracking-widest text-brand uppercase">KAREN INTELLIGENCE</span>
      </div>

      <div className="space-y-1 text-text">
        {renderResponseText(response.response)}
      </div>

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
