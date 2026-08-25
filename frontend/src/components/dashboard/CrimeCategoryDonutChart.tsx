import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface CrimeCategory {
  key: string;
  defaultName: string;
  count: number;
  percentage: number;
  color: string;
}

const CATEGORIES: CrimeCategory[] = [
  { key: 'cat.cyber', defaultName: 'Cyber Crime', count: 42, percentage: 35, color: '#3B82F6' },
  { key: 'cat.financial', defaultName: 'Financial Fraud', count: 30, percentage: 25, color: '#38BDF8' },
  { key: 'cat.theft', defaultName: 'Theft', count: 18, percentage: 15, color: '#F59E0B' },
  { key: 'cat.extortion', defaultName: 'Extortion', count: 12, percentage: 10, color: '#F97316' },
  { key: 'cat.assault', defaultName: 'Assault', count: 10, percentage: 8, color: '#EF4444' },
  { key: 'cat.other', defaultName: 'Other Crimes', count: 8, percentage: 7, color: '#94A3B8' },
];

export function CrimeCategoryDonutChart() {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalCases = 120;
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-surface dark:bg-[#0F1726] border border-border dark:border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-xs h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-xs font-bold font-sans text-text dark:text-[#F8FAFC] tracking-wide">
          {t('dashboard.casesByCrime', 'Cases by Crime Category')}
        </h3>
      </div>

      {/* Chart + Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
        {/* Donut Chart SVG with Center Badge */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {CATEGORIES.map((cat, idx) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += cat.percentage;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={cat.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Metric Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-bold font-display text-text dark:text-[#F8FAFC] leading-none">
              {hoveredIdx !== null ? CATEGORIES[hoveredIdx].count : totalCases}
            </span>
            <span className="text-[9px] font-mono font-medium text-text-faint dark:text-[#94A3B8] uppercase mt-1">
              {hoveredIdx !== null ? t(CATEGORIES[hoveredIdx].key, CATEGORIES[hoveredIdx].defaultName) : t('dashboard.activeCases', 'Active Cases')}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={cat.key}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-surface-hover dark:bg-[#151E31]' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-text dark:text-[#E2E8F0] font-medium truncate">
                    {t(cat.key, cat.defaultName)}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-text-dim dark:text-[#94A3B8] shrink-0 font-medium">
                  {cat.percentage}% <span className="text-text-faint dark:text-[#64748B]">({cat.count})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
