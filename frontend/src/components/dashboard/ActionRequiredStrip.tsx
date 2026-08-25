import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight, Clock, UserX, AlertTriangle, Network } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ActionRequiredStrip() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      label: '15 overdue investigations',
      icon: Clock,
      onClick: () => navigate('/cases?filter=overdue'),
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: '8 inactive cases',
      icon: AlertCircle,
      onClick: () => navigate('/cases?filter=inactive'),
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: '2 overloaded officers',
      icon: UserX,
      onClick: () => navigate('/officers'),
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: '4 unresolved intelligence matches',
      icon: Network,
      onClick: () => navigate('/intelligence/alerts'),
      color: 'text-sky-600 dark:text-sky-400',
    },
  ];

  return (
    <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs font-sans text-xs">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-500/20 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={12} strokeWidth={2.5} />
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          ACTION REQUIRED:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="flex items-center gap-1.5 font-medium text-text-dim hover:text-text dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-colors group cursor-pointer"
            >
              <Icon size={12} className={item.color} />
              <span className="group-hover:underline underline-offset-2">{item.label}</span>
              {idx < items.length - 1 && (
                <span className="hidden sm:inline text-border-soft dark:text-[#26334A] ml-2">·</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/intelligence/alerts')}
        className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5 shrink-0 ml-auto sm:ml-0"
      >
        <span>REVIEW ALL</span>
        <ChevronRight size={12} />
      </button>
    </div>
  );
}
