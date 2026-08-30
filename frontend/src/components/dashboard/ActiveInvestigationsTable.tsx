import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useMockState } from '../../mockServices/MockStateContext';
import { useLanguage } from '../../context/LanguageContext';

interface ActiveInvestigationItem {
  id: string;
  caseId: string;
  title: string;
  officer: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  daysActive: number;
  progress: number;
}

const DEFAULT_INVESTIGATIONS: ActiveInvestigationItem[] = [
  { id: 'OD-BBSR-2026-0001', caseId: 'FIR 541', title: 'Vehicle Theft', officer: 'SI Ranjan Samal', risk: 'HIGH', daysActive: 64, progress: 51 },
  { id: 'OD-BBSR-2026-0001', caseId: 'FIR-2026-BBSR-0001', title: 'Burglary', officer: 'SI Ranjan Samal', risk: 'HIGH', daysActive: 118, progress: 72 },
  { id: 'OD-BBSR-2026-0001', caseId: 'FIR-2026-BBSR-0001', title: 'Assault', officer: 'SI Ashok Mishra', risk: 'LOW', daysActive: 118, progress: 72 },
  { id: 'OD-BBSR-2026-0042', caseId: 'FIR-2026-BBSR-0002', title: 'Extortion', officer: 'SI Monalisa Dash', risk: 'LOW', daysActive: 64, progress: 51 },
  { id: 'OD-BBSR-2026-0042', caseId: 'FIR-2026-BBSR-0003', title: 'Chain Snatching', officer: 'SI Sanjukta Behera', risk: 'MEDIUM', daysActive: 37, progress: 35 },
];

export function ActiveInvestigationsTable() {
  const navigate = useNavigate();
  const { state } = useMockState();
  const { t } = useLanguage();

  const investigations: ActiveInvestigationItem[] = state.cases.length > 0
    ? state.cases.slice(0, 5).map((c, idx) => ({
        id: c.id,
        caseId: c.firNumber || `FIR-${idx + 540}`,
        title: c.crimeType,
        officer: state.users.find((u) => u.id === c.investigatorId)?.name || 'SI Ranjan Samal',
        risk: c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'HIGH' : c.priority === 'MEDIUM' ? 'MEDIUM' : 'LOW',
        daysActive: idx === 0 ? 64 : idx === 1 ? 118 : idx === 2 ? 118 : idx === 3 ? 64 : 37,
        progress: c.status === 'SOLVED' ? 100 : idx % 2 === 0 ? 51 : 72,
      }))
    : DEFAULT_INVESTIGATIONS;

  return (
    <div className="bg-surface dark:bg-[#0F1726] border border-border dark:border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-xs h-full interactive-panel">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold leading-section text-text dark:text-[#E8ECEF]">
          {t('dashboard.activeInvestigations', 'Active Investigations')}
        </h3>
        <button
          onClick={() => navigate('/cases')}
          className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
        >
          <span>{t('dashboard.viewAll', 'View All')}</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto my-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-soft dark:border-[#1E293B] text-[11px] uppercase font-mono tracking-wider text-text-faint dark:text-[#7A8B99] opacity-80">
              <th className="py-2 px-1 font-semibold">{t('dashboard.caseId', 'Case ID')}</th>
              <th className="py-2 px-1 font-semibold">{t('dashboard.caseTitle', 'Case Title')}</th>
              <th className="py-2 px-1 font-semibold">{t('dashboard.officer', 'Investigating Officer')}</th>
              <th className="py-2 px-1 font-semibold text-center">{t('dashboard.risk', 'Risk')}</th>
              <th className="py-2 px-1 font-semibold">{t('dashboard.daysActive', 'Days Active')}</th>
              <th className="py-2 px-1 font-semibold">{t('dashboard.progress', 'Progress')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft/50 dark:divide-[#1E293B]/60">
            {investigations.map((item, idx) => {
              return (
                <tr
                  key={`${item.caseId}-${idx}`}
                  onClick={() => navigate(`/cases/${item.id}`)}
                  className="hover:bg-surface-hover dark:hover:bg-[#151E31] cursor-pointer transition-colors group interactive-table-row"
                >
                  <td className="py-2 px-1 font-mono text-xs font-semibold text-text dark:text-[#E8ECEF] group-hover:text-brand dark:group-hover:text-sky-400 transition-colors">
                    {item.caseId}
                  </td>
                  <td className="py-2 px-1 font-sans text-xs text-text-dim dark:text-[#A8B5C0] font-normal truncate max-w-[110px]">
                    {item.title}
                  </td>
                  <td className="py-2 px-1 font-sans text-xs text-text dark:text-[#E8ECEF] font-normal truncate max-w-[120px]">
                    {item.officer}
                  </td>
                  <td className="py-2 px-1 text-center">
                    <span
                      className={`text-[9.5px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border ${
                        item.risk === 'HIGH'
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25'
                          : item.risk === 'MEDIUM'
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25'
                          : 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/25'
                      }`}
                    >
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-2 px-1 font-mono text-xs text-text-dim dark:text-[#A8B5C0]">
                    {item.daysActive} {t('dashboard.days', 'days')}
                  </td>
                  <td className="py-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 bg-surface-2 dark:bg-[#1E293B] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold text-text dark:text-[#E8ECEF]">
                        {item.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
