import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Shield, TrendingUp } from 'lucide-react';
import { LegalProvision, getTierLabel, getRelevanceColor } from '../../mockServices/legalProvisionMockData';

interface ProvisionCardProps {
  provision: LegalProvision;
  onViewDetails: (provision: LegalProvision) => void;
  compact?: boolean;
}

// ─── Tier Badge ───────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: LegalProvision['tier'] }) {
  const styles = {
    PRIMARY: 'bg-brand/20 text-brand border-brand/30',
    RELATED: 'bg-accent/15 text-accent-bright border-accent/30',
    SUPPORTING: 'bg-surface-2 text-text-dim border-border',
  }[tier];

  return (
    <span className={`text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded border ${styles}`}>
      {getTierLabel(tier)}
    </span>
  );
}

// ─── Relevance Bar ────────────────────────────────────────────────────────────
function RelevanceBar({ value, level }: { value: number; level: LegalProvision['relevanceLevel'] }) {
  const barColor = { HIGH: 'bg-success', MEDIUM: 'bg-warning', LOW: 'bg-text-dim' }[level];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${getRelevanceColor(level)}`}>{value}%</span>
    </div>
  );
}

// ─── Hover Preview ────────────────────────────────────────────────────────────
function HoverPreview({ provision, anchorRef }: { provision: LegalProvision; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchorRef.current || !previewRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const ph = previewRef.current.offsetHeight || 260;
    const pw = previewRef.current.offsetWidth || 280;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.top + window.scrollY - ph - 10;
    let left = rect.left + window.scrollX;

    if (top < 0) top = rect.bottom + window.scrollY + 10;
    if (left + pw > vw) left = vw - pw - 12;
    if (left < 8) left = 8;

    setPos({ top, left });
  }, [anchorRef]);

  return (
    <div
      ref={previewRef}
      className="fixed z-50 w-72 bg-surface border border-border rounded-xl shadow-glass p-4 space-y-3 animate-fade-in pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-mono text-text-dim mb-0.5">{provision.section}</div>
          <div className="font-bold text-text text-sm">{provision.title}</div>
        </div>
        <TierBadge tier={provision.tier} />
      </div>

      <p className="text-xs text-text-dim leading-relaxed border-t border-border-soft pt-2">
        {provision.shortDescription}
      </p>

      <div>
        <div className="text-[10px] uppercase font-bold text-text-faint mb-1 tracking-wider">Relevance</div>
        <RelevanceBar value={provision.relevance} level={provision.relevanceLevel} />
      </div>

      <div>
        <div className="text-[10px] uppercase font-bold text-text-faint mb-1.5 tracking-wider">Key Elements</div>
        <ul className="space-y-0.5">
          {provision.keyElements.slice(0, 3).map((el, i) => (
            <li key={i} className="text-[11px] text-text-dim flex items-start gap-1.5">
              <span className="text-brand mt-0.5">•</span> {el}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-[10px] text-text-faint font-mono border-t border-border-soft pt-2 flex items-center gap-1">
        <ChevronRight size={10} className="text-brand" /> Click to view full provision
      </div>
    </div>
  );
}

// ─── Main ProvisionCard ───────────────────────────────────────────────────────
export function ProvisionCard({ provision, onViewDetails, compact = false }: ProvisionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const showPreview = isHovered || isFocused;

  const tierBorderColor = {
    PRIMARY: 'border-l-brand',
    RELATED: 'border-l-accent-bright',
    SUPPORTING: 'border-l-border',
  }[provision.tier];

  const tierBgHover = {
    PRIMARY: 'hover:border-brand/60',
    RELATED: 'hover:border-accent-bright/40',
    SUPPORTING: 'hover:border-border',
  }[provision.tier];

  return (
    <>
      {showPreview && <HoverPreview provision={provision} anchorRef={cardRef} />}

      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${provision.section} — ${provision.title}. Click to view details.`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={() => onViewDetails(provision)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewDetails(provision); }}}
        className={`
          group relative bg-surface border border-border-soft rounded-xl cursor-pointer
          border-l-4 ${tierBorderColor} ${tierBgHover}
          transition-all duration-200 outline-none
          focus-visible:ring-2 focus-visible:ring-brand/50
          ${compact ? 'p-3' : 'p-4'}
          ${isHovered || isFocused ? 'shadow-card bg-surface-hover' : ''}
        `}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono border ${
              provision.tier === 'PRIMARY'
                ? 'bg-brand/10 text-brand border-brand/30'
                : provision.tier === 'RELATED'
                ? 'bg-accent/10 text-accent-bright border-accent/30'
                : 'bg-surface-2 text-text-dim border-border'
            }`}>
              §{provision.sectionNumber.length > 3 ? provision.sectionNumber.slice(-3) : provision.sectionNumber}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-text-faint">{provision.section}</div>
              <div className="font-bold text-text text-sm leading-tight truncate">{provision.title}</div>
            </div>
          </div>
          <TierBadge tier={provision.tier} />
        </div>

        {/* Description — only in non-compact */}
        {!compact && (
          <p className="text-xs text-text-dim mb-3 leading-relaxed line-clamp-2">
            {provision.shortDescription}
          </p>
        )}

        {/* Relevance */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-text-faint tracking-wider flex items-center gap-1">
              <TrendingUp size={10} /> Relevance
            </span>
          </div>
          <RelevanceBar value={provision.relevance} level={provision.relevanceLevel} />
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-faint font-mono">{provision.bnssClassification}</span>
          <span className="text-[11px] text-brand font-bold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            View details <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </>
  );
}

export { TierBadge, RelevanceBar };
