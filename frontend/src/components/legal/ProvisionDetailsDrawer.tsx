import React, { useEffect } from 'react';
import {
  X, Scale, ShieldAlert, CheckCircle, FileText,
  TrendingUp, BookOpen, AlertTriangle, ChevronRight
} from 'lucide-react';
import { LegalProvision, getTierLabel, getRelevanceColor } from '../../mockServices/legalProvisionMockData';
import { TierBadge, RelevanceBar } from './ProvisionCard';

interface ProvisionDetailsDrawerProps {
  provision: LegalProvision | null;
  onClose: () => void;
}

export function ProvisionDetailsDrawer({ provision, onClose }: ProvisionDetailsDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!provision) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Legal Provision Details — ${provision.section}`}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-surface border-l border-border-soft shadow-glass overflow-y-auto animate-slide-in flex flex-col"
        style={{ animation: 'slideInRight 0.25s ease-out' }}
      >
        {/* Inline keyframe */}
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);   opacity: 1; }
          }
        `}</style>

        {/* ── Header ── */}
        <div className="sticky top-0 bg-surface border-b border-border-soft z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-brand" />
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-[0.15em]">Legal Intelligence</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-dim hover:text-text hover:bg-surface-hover transition-colors"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Top gold accent bar */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent" />
        </div>

        {/* ── Body ── */}
        <div className="flex-1 px-6 py-6 space-y-6">

          {/* Provision identity */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center font-bold text-brand font-mono text-sm">
                  §{provision.sectionNumber}
                </div>
                <div>
                  <div className="text-xs font-mono text-text-faint mb-0.5">{provision.section}</div>
                  <h2 className="text-xl font-bold text-text font-display">{provision.title}</h2>
                  <div className="text-xs text-text-dim mt-0.5">{provision.category}</div>
                </div>
              </div>
              <TierBadge tier={provision.tier} />
            </div>
          </div>

          <hr className="border-border-soft" />

          {/* Provision Summary */}
          <section>
            <h3 className="text-[10px] uppercase font-bold text-text-dim tracking-[0.15em] mb-3 flex items-center gap-2">
              <BookOpen size={12} className="text-brand" /> Provision Summary
            </h3>
            <div className="bg-surface-2 border border-border-soft rounded-xl p-4">
              <p className="text-sm text-text leading-relaxed">{provision.provisionSummary}</p>
              <p className="text-[10px] text-text-faint italic mt-3 border-t border-border-soft pt-2">
                Demonstration summary — not verbatim statutory text. Source: {provision.source}
              </p>
            </div>
          </section>

          <hr className="border-border-soft" />

          {/* Relevance to This Case */}
          <section>
            <h3 className="text-[10px] uppercase font-bold text-text-dim tracking-[0.15em] mb-3 flex items-center gap-2">
              <TrendingUp size={12} className="text-brand" /> Relevance to This Case
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-sm font-bold uppercase tracking-wider ${getRelevanceColor(provision.relevanceLevel)}`}>
                  {provision.relevanceLevel}
                </span>
                <div className="flex-1">
                  <RelevanceBar value={provision.relevance} level={provision.relevanceLevel} />
                </div>
              </div>
              <div className="bg-surface-2 border border-border-soft rounded-xl p-4">
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider mb-1">
                  Why S.I.R.I.S identified this provision:
                </p>
                <p className="text-sm text-text leading-relaxed">{provision.caseReason}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-text-faint font-mono">
                <span className="bg-accent/10 text-accent-bright px-2 py-0.5 rounded border border-accent/20 font-bold">
                  AI CONFIDENCE: {Math.round(provision.aiConfidence * 100)}%
                </span>
              </div>
            </div>
          </section>

          <hr className="border-border-soft" />

          {/* Key Elements */}
          <section>
            <h3 className="text-[10px] uppercase font-bold text-text-dim tracking-[0.15em] mb-3 flex items-center gap-2">
              <CheckCircle size={12} className="text-success" /> Key Elements
            </h3>
            <ul className="space-y-2">
              {provision.keyElements.map((el, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text">
                  <CheckCircle size={14} className="text-success shrink-0 mt-0.5" />
                  {el}
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-border-soft" />

          {/* AI Analysis — Supporting Evidence */}
          <section>
            <h3 className="text-[10px] uppercase font-bold text-text-dim tracking-[0.15em] mb-3 flex items-center gap-2">
              <ShieldAlert size={12} className="text-brand" /> AI Analysis
            </h3>
            <div className="bg-surface-2 border border-border-soft rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider mb-2">
                Evidence supporting this suggestion:
              </p>
              {provision.supportingEvidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-text">
                  <span className="text-brand font-bold">•</span> {ev}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-border-soft" />

          {/* Procedural Info */}
          <section>
            <h3 className="text-[10px] uppercase font-bold text-text-dim tracking-[0.15em] mb-3 flex items-center gap-2">
              <FileText size={12} className="text-brand" /> Procedural Classification
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2 border border-border-soft rounded-xl p-3">
                <div className="text-[10px] font-bold text-text-faint uppercase tracking-wider mb-1">BNSS Classification</div>
                <div className="text-sm font-bold text-accent-bright">{provision.bnssClassification}</div>
              </div>
              <div className="bg-surface-2 border border-border-soft rounded-xl p-3">
                <div className="text-[10px] font-bold text-text-faint uppercase tracking-wider mb-1">Punishment</div>
                <div className="text-sm font-bold text-danger-bright">{provision.punishmentSummary}</div>
              </div>
            </div>
          </section>

          <hr className="border-border-soft" />

          {/* Source */}
          <section>
            <h3 className="text-[10px] uppercase font-bold text-text-dim tracking-[0.15em] mb-2">Source</h3>
            <p className="text-sm text-text font-semibold">{provision.source}</p>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="sticky bottom-0 bg-surface border-t border-border-soft px-6 py-4 space-y-3">
          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-surface-2 border border-border text-text text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-surface-hover transition-colors flex items-center justify-center gap-1.5">
              <FileText size={13} /> View Case Facts
            </button>
            <button className="flex-1 bg-brand text-bg text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-bright transition-colors flex items-center justify-center gap-1.5">
              <ChevronRight size={13} /> Add to Analysis
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-warning/10 border border-warning/30 rounded-lg p-3">
            <AlertTriangle size={13} className="text-warning shrink-0 mt-0.5" />
            <p className="text-[10px] text-text-dim leading-relaxed">
              <strong className="text-warning uppercase">AI-Assisted Legal Intelligence.</strong>{' '}
              Requires authorized officer and legal review. Does not constitute final legal determination.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
