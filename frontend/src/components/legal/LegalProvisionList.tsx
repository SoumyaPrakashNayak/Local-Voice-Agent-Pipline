import React, { useState } from 'react';
import { Scale, ShieldAlert, AlertTriangle } from 'lucide-react';
import { LegalProvision } from '../../mockServices/legalProvisionMockData';
import { ProvisionCard } from './ProvisionCard';
import { ProvisionDetailsDrawer } from './ProvisionDetailsDrawer';

interface LegalProvisionListProps {
  provisions: LegalProvision[];
  title?: string;
  showDisclaimer?: boolean;
  compact?: boolean;
}

export function LegalProvisionList({
  provisions,
  title = 'Legal Intelligence',
  showDisclaimer = true,
  compact = false,
}: LegalProvisionListProps) {
  const [selectedProvision, setSelectedProvision] = useState<LegalProvision | null>(null);

  if (!provisions || provisions.length === 0) {
    return (
      <div className="text-xs text-text-dim text-center py-6 italic">
        No legal provisions identified yet. Run AI analysis to extract applicable BNS sections.
      </div>
    );
  }

  // Sort: PRIMARY first, then RELATED, then SUPPORTING
  const sorted = [...provisions].sort((a, b) => {
    const order = { PRIMARY: 0, RELATED: 1, SUPPORTING: 2 };
    return order[a.tier] - order[b.tier];
  });

  return (
    <>
      {/* Drawer */}
      <ProvisionDetailsDrawer
        provision={selectedProvision}
        onClose={() => setSelectedProvision(null)}
      />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
            <Scale size={14} className="text-brand" />
            {title}
          </h3>
          {provisions.length > 1 && (
            <span className="text-[10px] font-mono text-text-faint bg-surface-2 px-2 py-0.5 rounded border border-border">
              {provisions.length} provisions identified
            </span>
          )}
        </div>

        {/* Disclaimer banner */}
        {showDisclaimer && (
          <div className="flex items-start gap-2 bg-warning/10 border border-warning/30 rounded-xl p-3">
            <AlertTriangle size={13} className="text-warning shrink-0 mt-0.5" />
            <p className="text-[10px] text-text-dim leading-relaxed">
              <strong className="text-warning uppercase">AI-Assisted Legal Intelligence</strong> —
              Requires authorized officer review. Does not constitute final legal determination.
            </p>
          </div>
        )}

        {/* Provision grid */}
        <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
          {sorted.map((provision) => (
            <ProvisionCard
              key={provision.section}
              provision={provision}
              onViewDetails={setSelectedProvision}
              compact={compact}
            />
          ))}
        </div>
      </div>
    </>
  );
}
