import React from 'react';
import {
  Briefcase, Clock, Flame, ShieldAlert,
  FileText, CheckCircle2, AlertTriangle, Users
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface IntelligenceSummaryKpisProps {
  stats?: {
    totalFirs?: number;
    activeCases?: number;
    casesClosed?: number;
    pendingCases?: number;
    overdueWork?: number;
    highPriority?: number;
    activeOfficers?: number;
    intelAlerts?: number;
  };
}

export function IntelligenceSummaryKpis({ stats }: IntelligenceSummaryKpisProps) {
  const { t } = useLanguage();

  const activeCasesVal = stats?.activeCases ?? 120;
  const pendingCasesVal = stats?.pendingCases ?? 100;
  const highPriorityVal = stats?.highPriority ?? 12;
  const intelAlertsVal = stats?.intelAlerts ?? 6;

  const totalFirsVal = stats?.totalFirs ?? 797;
  const casesClosedVal = stats?.casesClosed ?? 552;
  const overdueWorkVal = stats?.overdueWork ?? 15;
  const activeOfficersVal = stats?.activeOfficers ?? 23;

  const primaryCards = [
    {
      title: t('dashboard.activeCases', 'ACTIVE CASES'),
      value: activeCasesVal,
      icon: Briefcase,
      trend: '↑ 3.1%',
      trendLabel: t('dashboard.last30Days', 'vs last 30 days'),
      sparklineColor: '#38BDF8',
      sparklinePoints: [12, 14, 13, 16, 15, 18, 17, 22],
      accentClass: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
      badgeBorder: 'border-l-sky-500',
    },
    {
      title: t('dashboard.pendingCases', 'PENDING CASES'),
      value: pendingCasesVal,
      icon: Clock,
      trend: '↓ 2.1%',
      trendLabel: t('dashboard.last30Days', 'vs last 30 days'),
      sparklineColor: '#A855F7',
      sparklinePoints: [25, 24, 22, 23, 20, 19, 18, 16],
      accentClass: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      badgeBorder: 'border-l-purple-500',
    },
    {
      title: t('dashboard.highPriority', 'HIGH PRIORITY'),
      value: highPriorityVal,
      icon: Flame,
      trend: '↑ 1.8%',
      trendLabel: 'critical watchlist',
      sparklineColor: '#EF4444',
      sparklinePoints: [8, 9, 10, 11, 10, 12, 13, 15],
      accentClass: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      badgeBorder: 'border-l-rose-500',
    },
    {
      title: t('dashboard.intelAlerts', 'INTEL ALERTS'),
      value: intelAlertsVal,
      icon: ShieldAlert,
      trend: '↑ 6.3%',
      trendLabel: 'pattern matches',
      sparklineColor: '#F59E0B',
      sparklinePoints: [4, 5, 4, 6, 5, 7, 6, 8],
      accentClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      badgeBorder: 'border-l-amber-500',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Primary 4-Metric Focused Operational Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {primaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative bg-surface dark:bg-[#0F1726] border border-border dark:border-[#1E293B] rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-brand/40 dark:hover:border-sky-500/40 transition-all duration-200 border-l-4 ${card.badgeBorder}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 ${card.accentClass}`}>
                    <Icon size={13} strokeWidth={2.2} />
                  </div>
                  <span className="text-xs font-medium leading-label text-text-dim dark:text-[#A8B5C0] truncate">
                    {card.title}
                  </span>
                </div>
                <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 shrink-0">
                  {card.trend}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2 my-1">
                <span className="text-3xl sm:text-4xl font-semibold font-mono tracking-data leading-none text-text dark:text-[#E8ECEF]">
                  {card.value}
                </span>
                <div className="w-16 h-4 shrink-0 opacity-80">
                  <MiniSparkline points={card.sparklinePoints} color={card.sparklineColor} />
                </div>
              </div>

              <div className="text-[11px] font-normal text-text-faint dark:text-[#7A8B99] opacity-80 truncate">
                {card.trendLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Compact Telemetry Strip */}
      <div className="bg-surface/70 dark:bg-[#0F1726]/70 border border-border-soft dark:border-[#1E293B] rounded-lg px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-text-dim dark:text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <FileText size={12} className="text-text-faint dark:text-[#64748B]" />
          <span>{t('dashboard.totalFirs', 'Total FIRs')}:</span>
          <strong className="text-text dark:text-[#F8FAFC]">{totalFirsVal}</strong>
        </div>
        <span className="hidden sm:inline text-border-soft dark:text-[#26334A]">|</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>{t('dashboard.casesClosed', 'Cases Closed')}:</span>
          <strong className="text-emerald-600 dark:text-emerald-400">{casesClosedVal}</strong>
        </div>
        <span className="hidden sm:inline text-border-soft dark:text-[#26334A]">|</span>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-500" />
          <span>{t('dashboard.overdueWork', 'Overdue Work')}:</span>
          <strong className="text-amber-600 dark:text-amber-400">{overdueWorkVal}</strong>
        </div>
        <span className="hidden sm:inline text-border-soft dark:text-[#26334A]">|</span>
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-sky-500" />
          <span>{t('dashboard.activeOfficers', 'Active Officers')}:</span>
          <strong className="text-sky-600 dark:text-sky-400">{activeOfficersVal}</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Sparkline ──────────────────────────────────────────────────────────
function MiniSparkline({ points, color }: { points: number[]; color: string }) {
  const width = 64;
  const height = 16;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathData = coords.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point}`;
    const [x, y] = point.split(',').map(Number);
    const [prevX, prevY] = arr[i - 1].split(',').map(Number);
    const cpX1 = prevX + (x - prevX) / 2;
    const cpY1 = prevY;
    const cpX2 = prevX + (x - prevX) / 2;
    const cpY2 = y;
    return `${acc} C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
