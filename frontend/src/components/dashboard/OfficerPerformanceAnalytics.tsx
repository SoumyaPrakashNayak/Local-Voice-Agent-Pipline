import React from 'react';
import { Users, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMockState } from '../../mockServices/MockStateContext';
import { useLanguage } from '../../context/LanguageContext';

interface OfficerMetric {
  id: string;
  name: string;
  rank: string;
  activeCases: number;
  closedCases: number;
  pending: number;
  avgResolutionDays: number;
  resolutionRate: number;
  workload: 'NORMAL' | 'HIGH' | 'OVERLOADED';
}

const DEFAULT_OFFICERS: OfficerMetric[] = [
  { id: 'INV-001', name: 'SI Ranjan Samal', rank: 'Sub-Inspector', activeCases: 14, closedCases: 38, pending: 4, avgResolutionDays: 24, resolutionRate: 73, workload: 'OVERLOADED' },
  { id: 'INV-002', name: 'SI Ashok Mishra', rank: 'Sub-Inspector', activeCases: 11, closedCases: 42, pending: 3, avgResolutionDays: 19, resolutionRate: 79, workload: 'HIGH' },
  { id: 'INV-003', name: 'SI Monalisa Dash', rank: 'Sub-Inspector', activeCases: 8, closedCases: 31, pending: 2, avgResolutionDays: 22, resolutionRate: 79, workload: 'NORMAL' },
  { id: 'INV-004', name: 'SI Sanjukta Behera', rank: 'Sub-Inspector', activeCases: 7, closedCases: 29, pending: 1, avgResolutionDays: 18, resolutionRate: 80, workload: 'NORMAL' },
  { id: 'INV-005', name: 'Insp. Aditya Pattnaik', rank: 'Inspector', activeCases: 6, closedCases: 54, pending: 2, avgResolutionDays: 15, resolutionRate: 90, workload: 'NORMAL' },
];

export function OfficerPerformanceAnalytics() {
  const { t } = useLanguage();
  const { state } = useMockState();
  const navigate = useNavigate();

  const officers: OfficerMetric[] = DEFAULT_OFFICERS;

  return (
    <div className="bg-surface dark:bg-[#0F1726] border border-border dark:border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-xs h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-bold font-sans text-text dark:text-[#F8FAFC] tracking-wide">
            Investigation Team Performance & Caseload Distribution
          </h3>
        </div>

        <button
          onClick={() => navigate('/officers')}
          className="text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
        >
          <span>Manage Officers</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Grid: Left Table, Right Caseload Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto">
        {/* Officer Table (8 Cols) */}
        <div className="lg:col-span-8 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-soft dark:border-[#1E293B] text-[9px] uppercase font-mono tracking-wider text-text-faint dark:text-[#64748B]">
                <th className="py-2 px-1 font-semibold">Investigator</th>
                <th className="py-2 px-1 font-semibold text-center">Active</th>
                <th className="py-2 px-1 font-semibold text-center">Closed</th>
                <th className="py-2 px-1 font-semibold text-center">Avg Days</th>
                <th className="py-2 px-1 font-semibold text-center">Resolution</th>
                <th className="py-2 px-1 font-semibold text-center">Workload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft/50 dark:divide-[#1E293B]/60">
              {officers.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate('/officers')}
                  className="hover:bg-surface-hover dark:hover:bg-[#151E31] cursor-pointer transition-colors"
                >
                  <td className="py-2 px-1 font-medium text-text dark:text-[#F8FAFC]">
                    <div>{o.name}</div>
                    <div className="text-[10px] text-text-faint dark:text-[#64748B]">{o.rank}</div>
                  </td>
                  <td className="py-2 px-1 text-center font-mono font-bold text-text dark:text-[#F8FAFC]">
                    {o.activeCases}
                  </td>
                  <td className="py-2 px-1 text-center font-mono text-emerald-600 dark:text-emerald-400">
                    {o.closedCases}
                  </td>
                  <td className="py-2 px-1 text-center font-mono text-text-dim dark:text-[#94A3B8]">
                    {o.avgResolutionDays}d
                  </td>
                  <td className="py-2 px-1 text-center font-mono font-bold text-sky-600 dark:text-sky-400">
                    {o.resolutionRate}%
                  </td>
                  <td className="py-2 px-1 text-center">
                    <span
                      className={`text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                        o.workload === 'OVERLOADED'
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25'
                          : o.workload === 'HIGH'
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25'
                          : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                      }`}
                    >
                      {o.workload}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Caseload Distribution Bars (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-2/60 dark:bg-[#151E31]/60 border border-border-soft dark:border-[#1E293B] rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase font-bold text-text-faint dark:text-[#64748B] mb-2">
            Active Caseload vs Capacity
          </div>
          <div className="space-y-2.5">
            {officers.map((o) => {
              const maxCap = 15;
              const pct = Math.min(100, Math.round((o.activeCases / maxCap) * 100));
              return (
                <div key={`bar-${o.id}`} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-text dark:text-[#E2E8F0] truncate max-w-[130px]">{o.name}</span>
                    <span className="font-mono text-[10px] text-text-dim dark:text-[#94A3B8]">
                      {o.activeCases} / {maxCap} cases
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface dark:bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 90
                          ? 'bg-rose-500'
                          : pct >= 70
                          ? 'bg-amber-500'
                          : 'bg-sky-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
