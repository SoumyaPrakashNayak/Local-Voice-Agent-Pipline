import React from 'react';
import { AiraResponse, AiraAction } from '../../services/airaService';
import { Shield, FileText, ChevronRight, Scale, Car, Phone, MapPin, Sparkles } from 'lucide-react';

interface AiraResponseCardProps {
  response: AiraResponse;
  onExecuteAction: (action: AiraAction) => void;
}

export function AiraResponseCard({ response, onExecuteAction }: AiraResponseCardProps) {
  const caseData = response.caseData;

  return (
    <div className="rounded-xl bg-surface/95 border border-border-soft p-4 shadow-card space-y-3 animate-fade-in text-sm">
      {/* Header / Intent Badge */}
      <div className="flex items-center justify-between border-b border-border-soft pb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-brand" />
          <span className="text-[10px] font-mono font-bold text-text-dim uppercase tracking-wider">
            {response.intent.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          RESOLVED
        </span>
      </div>

      {/* Response Message Body */}
      <div className="text-text leading-relaxed font-sans text-sm">
        {response.response.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {line.includes('**') ? (
              <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ) : (
              line
            )}
            {idx < response.response.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>

      {/* Structured Case Details Preview (if case was resolved) */}
      {caseData && (
        <div className="rounded-lg bg-bg-elev/80 border border-border-soft p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand">{caseData.firNumber}</span>
            <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
              caseData.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              caseData.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {caseData.priority} PRIORITY
            </span>
          </div>

          <div className="text-text-dim">
            <span className="text-text-faint">Crime:</span> {caseData.crimeType} · <span className="text-text-faint">Status:</span> {caseData.status}
          </div>

          {caseData.suspects && caseData.suspects.length > 0 && (
            <div className="text-text-dim">
              <span className="text-text-faint">Suspects:</span> {caseData.suspects.join(', ')}
            </div>
          )}

          {caseData.entities && caseData.entities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {caseData.entities.map((ent, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-border-soft text-[10px] font-mono text-cyan-300"
                >
                  {ent.type === 'VEHICLE' && <Car size={10} />}
                  {ent.type === 'PHONE' && <Phone size={10} />}
                  {ent.type === 'LOCATION' && <MapPin size={10} />}
                  {ent.value}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {response.actions && response.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border-soft">
          {response.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => onExecuteAction(action)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                action.primary
                  ? 'bg-brand text-bg hover:bg-brand-bright shadow-lg shadow-brand/20'
                  : 'bg-bg-elev border border-border hover:bg-surface-hover text-text'
              }`}
            >
              {action.label}
              <ChevronRight size={12} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
