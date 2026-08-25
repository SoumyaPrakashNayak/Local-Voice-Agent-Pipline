import React, { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DataPoint {
  date: string;
  value: number;
}

const DEFAULT_TREND_DATA: DataPoint[] = [
  { date: '01 Aug', value: 24 },
  { date: '04 Aug', value: 45 },
  { date: '07 Aug', value: 36 },
  { date: '10 Aug', value: 58 },
  { date: '13 Aug', value: 49 },
  { date: '16 Aug', value: 72 },
  { date: '18 Aug', value: 88 },
  { date: '21 Aug', value: 79 },
  { date: '24 Aug', value: 92 },
];

export function FirRegistrationTrendChart() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<string>('This Month');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = DEFAULT_TREND_DATA;
  const width = 460;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 36 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const yMax = 100;
  const yTicks = [100, 75, 50, 25, 0];

  // Calculate points
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.value / yMax) * chartH;
    return { x, y, data: d };
  });

  // Construct smooth bezier curve path
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${padding.top + chartH} L ${points[0].x},${padding.top + chartH} Z`;

  return (
    <div className="bg-surface dark:bg-[#0F1726] border border-border dark:border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-xs h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-bold font-sans text-text dark:text-[#F8FAFC] tracking-wide">
            {t('dashboard.firTrend', 'FIR Registration Trend')}
          </h3>
          <Info size={13} className="text-text-faint dark:text-[#64748B] cursor-help" />
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-surface-2 dark:bg-[#151E31] border border-border dark:border-[#26334A] text-text-dim dark:text-[#94A3B8] text-[11px] font-medium font-sans px-2.5 py-1 pr-6 rounded-lg outline-none cursor-pointer hover:border-brand/40 transition-colors"
          >
            <option value="This Month">{t('dashboard.thisMonth', 'This Month')}</option>
            <option value="Last 30 Days">{t('dashboard.last30Days', 'Last 30 Days')}</option>
            <option value="This Quarter">{t('dashboard.thisQuarter', 'This Quarter')}</option>
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full aspect-[2.4/1] min-h-[160px] select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="fir-trend-gradient-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y-axis labels */}
          {yTicks.map((val) => {
            const y = padding.top + chartH - (val / yMax) * chartH;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-border-soft/60 dark:text-[#1E293B]"
                  strokeWidth="0.75"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                  className="fill-text-faint dark:fill-[#64748B]"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#fir-trend-gradient-2)" />

          {/* Main Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points with interactive hover halos */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />

                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill="#F59E0B"
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : 3.5}
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />

                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="ui-monospace, monospace"
                  className="fill-text-faint dark:fill-[#64748B]"
                >
                  {pt.data.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-surface dark:bg-[#151E31] border border-border dark:border-[#26334A] rounded-lg px-2.5 py-1 shadow-lg text-center backdrop-blur-md"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100}%`,
            }}
          >
            <div className="text-[9px] font-mono text-text-faint dark:text-[#64748B]">
              {points[hoveredIndex].data.date}
            </div>
            <div className="text-xs font-bold font-mono text-amber-500">
              {points[hoveredIndex].data.value} FIRs
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Metric Row */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border-soft dark:border-[#1E293B] text-center font-mono">
        <div>
          <div className="text-[9px] text-text-faint dark:text-[#64748B] uppercase tracking-wider">
            {t('dashboard.totalFirs', 'TOTAL FIRS')}
          </div>
          <div className="text-sm font-bold text-text dark:text-[#F8FAFC]">797</div>
        </div>
        <div>
          <div className="text-[9px] text-text-faint dark:text-[#64748B] uppercase tracking-wider">
            {t('dashboard.resolved', 'RESOLVED')}
          </div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">89</div>
        </div>
        <div>
          <div className="text-[9px] text-text-faint dark:text-[#64748B] uppercase tracking-wider">
            {t('dashboard.pending', 'PENDING')}
          </div>
          <div className="text-sm font-bold text-amber-600 dark:text-amber-400">223</div>
        </div>
        <div>
          <div className="text-[9px] text-text-faint dark:text-[#64748B] uppercase tracking-wider">
            {t('dashboard.closureRate', 'CLOSURE RATE')}
          </div>
          <div className="text-sm font-bold text-sky-600 dark:text-sky-400">28.5%</div>
        </div>
      </div>
    </div>
  );
}
