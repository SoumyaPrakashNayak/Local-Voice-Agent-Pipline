import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, FileText, Search, Activity, Lock, Users, MapPin, Building,
  Briefcase, TrendingUp, Compass, Award, Plus, UserPlus, CheckCircle,
  Eye, Check, X, Shield, ArrowRight, Calendar, AlertCircle, FileBarChart, Sparkles, Scale,
  ChevronRight, Printer, Download, RefreshCw, File, Network, Bot
} from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { CaseRecord, User, Station } from '../mockServices/types';

// ─── StatCard Helper ─────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, danger, highlight }: any) {
  return (
    <div className={`glass p-5 rounded-xl border border-border-soft transition-all duration-200 hover:border-border ${
      danger ? 'border-danger/30 bg-danger/5' : highlight ? 'border-brand/30 bg-brand/5' : 'bg-surface'
    }`}>
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
        danger ? 'text-danger-bright' : highlight ? 'text-brand' : 'text-text-dim'
      }`}>
        <Icon size={14} /> {title}
      </div>
      <div className={`text-2xl font-display font-bold ${
        danger ? 'text-danger-bright' : highlight ? 'text-brand' : 'text-text'
      }`}>{value}</div>
    </div>
  );
}

// 1. STATE COMMAND CENTER (SUPER_ADMIN)
// ─────────────────────────────────────────────────────────────────────────────
function SuperAdminDashboard() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  // ─── Filter States ───
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterStation, setFilterStation] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterTime, setFilterTime] = useState('30D');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Interactive selected items for details
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedDistrictDetail, setSelectedDistrictDetail] = useState(null);
  const [selectedStationProfile, setSelectedStationProfile] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // ─── Dynamic Data Filtering ───
  const filteredCases = useMemo(() => {
    return state.cases.filter(c => {
      // District filter
      if (filterDistrict !== 'ALL') {
        const station = state.stations.find(s => s.id === c.stationId);
        if (station?.district !== filterDistrict) return false;
      }
      // Station filter
      if (filterStation !== 'ALL' && c.stationId !== filterStation) return false;
      // Category filter
      if (filterCategory !== 'ALL' && !c.crimeType.toLowerCase().includes(filterCategory.toLowerCase())) return false;
      // Status filter
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
      // Priority filter
      if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;
      return true;
    });
  }, [state.cases, state.stations, filterDistrict, filterStation, filterCategory, filterStatus, filterPriority]);

  // ─── Statistics Calculations (Consistent with State) ───
  const totalFIRsCount = filteredCases.length;
  const activeCasesCount = filteredCases.filter(c => c.status === 'INVESTIGATING').length;
  const closedCasesCount = filteredCases.filter(c => c.status === 'SOLVED' || c.status === 'CLOSED').length;
  const pendingCasesCount = filteredCases.filter(c => c.status === 'PENDING').length;
  const overdueCasesCount = filteredCases.filter(c => c.priority === 'CRITICAL' && c.status === 'INVESTIGATING').length;
  const highPriorityCount = filteredCases.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length;
  
  const activeOfficersCount = state.users.filter(u => u.role === 'OFFICER').length;
  const totalStationsCount = state.stations.length;
  const totalAlertsCount = state.alerts.length;
  const crossStationCount = 12; // dynamic representation of matches

  // ─── Sparkline SVG helper ───
  const renderSparkline = (points, color) => {
    const width = 50;
    const height = 16;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return x + ',' + y;
    }).join(' ');
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={coords} />
      </svg>
    );
  };

  // ─── Odisha Districts Map Data ───
  const DISTRICTS = [
    { name: 'Khordha', cx: 310, cy: 220, r: 42, color: 'fill-brand/20 stroke-brand/60', hotspot: 'Khandagiri PS cluster', trend: '↑ 14.8%', cases: 24 },
    { name: 'Cuttack', cx: 350, cy: 160, r: 38, color: 'fill-accent/20 stroke-accent/60', hotspot: 'Badambadi PS cluster', trend: '↑ 18.2%', cases: 18 },
    { name: 'Sundargarh', cx: 160, cy: 80, r: 48, color: 'fill-purple-500/15 stroke-purple-500/40', hotspot: 'Rourkela Sector-4', trend: '↑ 11.2%', cases: 12 },
    { name: 'Ganjam', cx: 220, cy: 300, r: 46, color: 'fill-orange-500/15 stroke-orange-500/40', hotspot: 'Berhampur Town PS circle', trend: '↓ 9.4%', cases: 9 },
    { name: 'Puri', cx: 330, cy: 280, r: 35, color: 'fill-emerald-500/15 stroke-emerald-500/40', hotspot: 'Temple Crowds', trend: '↓ 8.2%', cases: 11 },
    { name: 'Sambalpur', cx: 190, cy: 150, r: 40, color: 'fill-amber-500/15 stroke-amber-500/40', hotspot: 'Sambalpur Central', trend: '↑ 6.4%', cases: 7 }
  ];

  // ─── Station Performance calculations ───
  const stationPerformanceList = useMemo(() => {
    return state.stations.map(s => {
      const stCases = state.cases.filter(c => c.stationId === s.id);
      const total = stCases.length;
      const closed = stCases.filter(c => c.status === 'SOLVED' || c.status === 'CLOSED').length;
      const active = stCases.filter(c => c.status === 'INVESTIGATING').length;
      const pending = stCases.filter(c => c.status === 'PENDING').length;
      const overdue = stCases.filter(c => c.priority === 'CRITICAL').length;
      const resRate = total > 0 ? Math.round((closed / total) * 100) : 0;
      return {
        ...s,
        total,
        closed,
        active,
        pending,
        overdue,
        resRate,
        trend: resRate > 65 ? '↑' : '↓'
      };
    });
  }, [state.cases, state.stations]);

  // Split Top Performing and Needs Attention
  const topStations = useMemo(() => {
    return [...stationPerformanceList].sort((a, b) => b.resRate - a.resRate).slice(0, 5);
  }, [stationPerformanceList]);

  const needsAttentionStations = useMemo(() => {
    return [...stationPerformanceList].sort((a, b) => a.resRate - b.resRate).slice(0, 5);
  }, [stationPerformanceList]);

  // District Crime Overview list
  const districtCrimeOverview = useMemo(() => {
    const list = ['Khordha', 'Cuttack', 'Sundargarh', 'Ganjam', 'Puri', 'Sambalpur', 'Balasore', 'Koraput'];
    return list.map(dist => {
      const distStations = state.stations.filter(s => s.district === dist);
      const sIds = distStations.map(s => s.id);
      const distCases = state.cases.filter(c => sIds.includes(c.stationId));
      const active = distCases.filter(c => c.status === 'INVESTIGATING').length;
      const closed = distCases.filter(c => c.status === 'SOLVED').length;
      const pending = distCases.filter(c => c.status === 'PENDING').length;
      return {
        district: dist,
        firs: distCases.length,
        active,
        closed,
        pending,
        highPriority: distCases.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length,
        trend: active > closed ? '↑' : '↓'
      };
    });
  }, [state.cases, state.stations]);

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto pb-12">
      {/* Header and Live Operations Roster */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft pb-4">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2.5">
            <Building className="text-brand animate-pulse" size={24} /> STATE POLICE INTELLIGENCE COMMAND CENTER
          </h2>
          <p className="text-sm text-text-dim mt-1">Statewide Operations Console · Odisha Police Headquarters</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-brand/10 border border-brand/30 text-brand px-3.5 py-1.5 rounded-lg font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-brand rounded-full animate-ping" />
            LIVE OVERWATCH ACTIVE
          </div>
        </div>
      </div>

      {/* ─── Interactive Filters console ─── */}
      <div className="glass p-4 rounded-xl bg-surface border border-border-soft grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1.5">District</label>
          <select
            value={filterDistrict}
            onChange={e => { setFilterDistrict(e.target.value); setFilterStation('ALL'); }}
            className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2 outline-none cursor-pointer"
          >
            <option value="ALL">All Districts</option>
            <option value="Khordha">Khordha</option>
            <option value="Cuttack">Cuttack</option>
            <option value="Sundargarh">Sundargarh</option>
            <option value="Ganjam">Ganjam</option>
            <option value="Puri">Puri</option>
            <option value="Sambalpur">Sambalpur</option>
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1.5">Police Station</label>
          <select
            value={filterStation}
            onChange={e => setFilterStation(e.target.value)}
            className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2 outline-none cursor-pointer"
          >
            <option value="ALL">All Stations</option>
            {state.stations
              .filter(s => filterDistrict === 'ALL' || s.district === filterDistrict)
              .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1.5">Crime Category</label>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2 outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Theft">Theft</option>
            <option value="Vehicle Theft">Vehicle Theft</option>
            <option value="Burglary">Burglary</option>
            <option value="Robbery">Robbery</option>
            <option value="Assault">Assault</option>
            <option value="Cyber">Cyber Fraud</option>
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1.5">Time Frame</label>
          <select
            value={filterTime}
            onChange={e => setFilterTime(e.target.value)}
            className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2 outline-none cursor-pointer"
          >
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1.5">Case Status</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="INVESTIGATING">Active</option>
            <option value="SOLVED">Solved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1.5">Priority</label>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2 outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* ─── 1. STATEWIDE KPI STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3">
        {[
          { title: 'Total FIRs', val: totalFIRsCount, trend: '↑ 8.4%', pts: [42, 45, 43, 46, 48, 49], sub: 'vs prev 30d' },
          { title: 'Active Cases', val: activeCasesCount, trend: '↑ 3.2%', pts: [12, 14, 13, 15, 12, 16], sub: 'in progress', highlight: true },
          { title: 'Cases Closed', val: closedCasesCount, trend: '↑ 11.7%', pts: [28, 30, 29, 31, 30, 32], sub: 'resolution rate' },
          { title: 'Pending Cases', val: pendingCasesCount, trend: '↓ 5.1%', pts: [8, 7, 9, 8, 6, 5], sub: 'awaiting action' },
          { title: 'Overdue Cases', val: overdueCasesCount, trend: '↓ 8.4%', pts: [4, 4, 3, 2, 2, 1], sub: 'target exceeded', danger: overdueCasesCount > 0 },
          { title: 'High Priority', val: highPriorityCount, trend: '↑ 2.1%', pts: [5, 6, 5, 7, 8, 9], sub: 'critical watchlist', danger: highPriorityCount > 5 },
          { title: 'Active Officers', val: activeOfficersCount, trend: 'Steady', pts: [84, 84, 84, 84, 84, 84], sub: 'deployed roster' },
          { title: 'Police Stations', val: totalStationsCount, trend: 'Steady', pts: [12, 12, 12, 12, 12, 12], sub: 'Odisha directory' },
          { title: 'State Alerts', val: totalAlertsCount, trend: '↑ 4.2%', pts: [14, 16, 15, 18, 17, 20], sub: 'pattern matches', danger: totalAlertsCount > 5 },
          { title: 'Cross-Station Links', val: crossStationCount, trend: '↑ 12.8%', pts: [8, 9, 10, 11, 11, 12], sub: 'entity matches', highlight: true }
        ].map((k, i) => (
          <div key={i} className={`glass p-4 rounded-xl border border-border-soft flex flex-col justify-between min-h-[96px] ${
            k.danger ? 'border-danger/30 bg-danger/5' : k.highlight ? 'border-brand/30 bg-brand/5' : 'bg-surface'
          }`}>
            <div className="text-[9px] font-bold uppercase tracking-wider text-text-dim flex justify-between items-center">
              <span>{k.title}</span>
              <span className={`text-[9px] font-bold ${k.trend.includes('↓') ? 'text-success' : 'text-warning'}`}>{k.trend}</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-display font-bold text-text">{k.val}</span>
              {renderSparkline(k.pts, k.danger ? 'var(--danger-bright)' : 'var(--brand)')}
            </div>
            <span className="text-[8px] text-text-faint font-mono tracking-wide mt-1 block uppercase">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* ─── 2. FIR REGISTRATION TREND + STATEWIDE CASE STATUS ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly FIR Trend line representation */}
        <div className="lg:col-span-2 glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text flex items-center gap-2">
                <TrendingUp size={14} className="text-brand" /> Monthly FIR Registration Analytics
              </h3>
              <p className="text-[10px] text-text-dim mt-0.5">Crime intake time-series trend over the past 6 months</p>
            </div>
            <div className="flex gap-1">
              {['7D', '30D', '3M', '6M', '1Y'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterTime(t)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                    filterTime === t ? 'bg-brand text-bg' : 'bg-surface-2 hover:bg-surface-hover text-text-dim'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-48 w-full relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-soft)" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="var(--border-soft)" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border-soft)" strokeDasharray="3 3" strokeWidth="0.5" />
              
              {/* Chart line */}
              <path
                d="M 20 120 Q 100 80 180 95 T 340 50 T 480 30"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2.5"
              />
              <path
                d="M 20 120 Q 100 80 180 95 T 340 50 T 480 30 L 480 150 L 20 150 Z"
                fill="url(#chartGrad)"
              />
              {/* Dots */}
              <circle cx="20" cy="120" r="4" fill="var(--brand)" />
              <circle cx="100" cy="88" r="4" fill="var(--brand)" />
              <circle cx="180" cy="95" r="4" fill="var(--brand)" />
              <circle cx="260" cy="80" r="4" fill="var(--brand)" />
              <circle cx="340" cy="50" r="4" fill="var(--brand)" />
              <circle cx="420" cy="40" r="4" fill="var(--brand)" />
              <circle cx="480" cy="30" r="4" fill="var(--brand)" />
            </svg>
            {/* Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[9px] font-mono text-text-faint">
              <span>Jul 2025</span>
              <span>Aug 2025</span>
              <span>Sep 2025</span>
              <span>Oct 2025</span>
              <span>Nov 2025</span>
              <span>Dec 2025</span>
            </div>
          </div>
        </div>

        {/* Statewide Case Status Segmented Bar/Donut */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text flex items-center justify-between">
              <span>Statewide Case Status</span>
              <span className="text-[10px] font-mono text-brand font-bold">{totalFIRsCount} total</span>
            </h3>
            <p className="text-[10px] text-text-dim mt-0.5">Ratio distribution of active case registries</p>
          </div>

          <div className="py-4">
            {/* Multi-segmented progress bar */}
            <div className="h-6 bg-surface-2 rounded-lg overflow-hidden flex">
              <div className="bg-success h-full hover:opacity-80 transition-opacity" style={{ width: `${(closedCasesCount / (totalFIRsCount || 1)) * 100}%` }} title="Closed/Solved" />
              <div className="bg-accent-bright h-full hover:opacity-80 transition-opacity" style={{ width: `${(activeCasesCount / (totalFIRsCount || 1)) * 100}%` }} title="Active" />
              <div className="bg-warning h-full hover:opacity-80 transition-opacity" style={{ width: `${(pendingCasesCount / (totalFIRsCount || 1)) * 100}%` }} title="Pending" />
              <div className="bg-danger-bright h-full hover:opacity-80 transition-opacity" style={{ width: `${(overdueCasesCount / (totalFIRsCount || 1)) * 100}%` }} title="Overdue" />
            </div>
          </div>

          {/* Legend Table */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-dim"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Closed Cases</span>
              <span className="font-bold font-mono text-text">{closedCasesCount} ({Math.round(closedCasesCount / (totalFIRsCount || 1) * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-dim"><span className="w-2.5 h-2.5 rounded-full bg-accent-bright" /> Active Cases</span>
              <span className="font-bold font-mono text-text">{activeCasesCount} ({Math.round(activeCasesCount / (totalFIRsCount || 1) * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-dim"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> Pending Cases</span>
              <span className="font-bold font-mono text-text">{pendingCasesCount} ({Math.round(pendingCasesCount / (totalFIRsCount || 1) * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-dim"><span className="w-2.5 h-2.5 rounded-full bg-danger-bright" /> Overdue cases</span>
              <span className="font-bold font-mono text-text">{overdueCasesCount} ({Math.round(overdueCasesCount / (totalFIRsCount || 1) * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. STATE CRIME HOTSPOT MAP ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Odisha SVG Map area */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 bg-surface-2 border border-border-soft flex flex-col relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <h3 className="font-bold text-sm uppercase tracking-wider text-text flex items-center gap-2">
              <MapPin size={14} className="text-brand" /> Interactive Odisha Police Map Interface
            </h3>
            <p className="text-[10px] text-text-dim mt-0.5">Click any district node to expand operational parameters</p>
          </div>

          <div className="w-full flex items-center justify-center py-6">
            <svg viewBox="0 0 500 400" className="w-full max-w-md h-auto">
              <g opacity="0.08" stroke="currentColor">
                <line x1="0" y1="100" x2="500" y2="100" />
                <line x1="0" y1="200" x2="500" y2="200" />
                <line x1="0" y1="300" x2="500" y2="300" />
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
                <line x1="400" y1="0" x2="400" y2="400" />
              </g>

              {DISTRICTS.map(d => {
                const isSelected = selectedDistrictDetail === d.name;
                return (
                  <g
                    key={d.name}
                    onClick={() => setSelectedDistrictDetail(isSelected ? null : d.name)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={d.cx}
                      cy={d.cy}
                      r={d.r}
                      className={`transition-all duration-300 ${d.color} ${
                        isSelected ? 'fill-brand/35 stroke-brand stroke-2 shadow-lg scale-105' : 'hover:fill-brand/30'
                      }`}
                    />
                    <circle cx={d.cx} cy={d.cy} r="3" fill="var(--danger-bright)" className="animate-pulse" />
                    <text
                      x={d.cx}
                      y={d.cy + 3}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="var(--text)"
                      className="pointer-events-none uppercase font-mono tracking-wider font-bold"
                    >
                      {d.name}
                    </text>
                    <text
                      x={d.cx}
                      y={d.cy + 13}
                      textAnchor="middle"
                      fontSize="7"
                      fill="var(--text-dim)"
                      className="pointer-events-none font-mono"
                    >
                      {d.cases} Cases
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hotspot details side panel */}
        <div className="space-y-4">
          {selectedDistrictDetail ? (
            <div className="glass rounded-xl p-5 bg-surface border border-border-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border-soft pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-brand">
                  {selectedDistrictDetail} Regional Overlook
                </h3>
                <button type="button" onClick={() => setSelectedDistrictDetail(null)} className="text-[10px] text-text-dim hover:text-text">
                  Dismiss
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-surface-2 border border-border p-2 rounded-lg">
                  <div className="text-base font-bold text-text font-mono">
                    {state.stations.filter(s => s.district === selectedDistrictDetail).length}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-text-dim">Stations</div>
                </div>
                <div className="bg-surface-2 border border-border p-2 rounded-lg">
                  <div className="text-base font-bold text-text font-mono">
                    {state.cases.filter(c => state.stations.find(s => s.id === c.stationId)?.district === selectedDistrictDetail).length}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-text-dim">Cases</div>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1">
                  Active Regional Hotspot
                </div>
                <div className="text-xs font-semibold text-text">
                  {DISTRICTS.find(d => d.name === selectedDistrictDetail)?.hotspot} Area
                </div>
                <div className="text-[10px] text-text-dim mt-1.5 flex items-center justify-between">
                  <span>Hotspot trend:</span>
                  <span className="font-bold text-warning">
                    {DISTRICTS.find(d => d.name === selectedDistrictDetail)?.trend}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-5 bg-surface border border-border-soft text-center py-12 text-text-dim flex flex-col justify-center items-center h-full min-h-[300px]">
              <MapPin className="mb-3 text-text-faint opacity-50" size={32} />
              <p className="text-sm font-semibold">Select Region on Map</p>
              <p className="text-xs text-text-dim mt-1 max-w-xs mx-auto">
                Click any district bubble on the interactive state map to show active regional hotspots and performance stats.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── 4. CRIME CATEGORY TRENDS (Increasing vs. Decreasing) ─── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Crime category trends card */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
          <div className="border-b border-border-soft pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">Crime Trend Intelligence</h3>
            <span className="text-[9px] font-mono text-text-faint uppercase">Compared with previous 30 days</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Increasing */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-danger-bright bg-danger/10 border border-danger/25 px-2 py-0.5 rounded">Increasing</span>
              {[
                { label: 'Cyber Fraud', val: '↑ 24.8%', color: 'text-danger-bright' },
                { label: 'Vehicle Theft', val: '↑ 17.3%', color: 'text-danger-bright' },
                { label: 'Burglary', val: '↑ 11.2%', color: 'text-danger-bright' }
              ].map(t => (
                <div key={t.label} className="flex justify-between items-center text-xs bg-surface-2 border border-border-soft p-2.5 rounded-lg">
                  <span className="text-text-dim font-medium">{t.label}</span>
                  <span className={`font-bold font-mono ${t.color}`}>{t.val}</span>
                </div>
              ))}
            </div>

            {/* Decreasing */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 border border-success/25 px-2 py-0.5 rounded">Decreasing</span>
              {[
                { label: 'Chain Snatching', val: '↓ 18.4%', color: 'text-success' },
                { label: 'Assault', val: '↓ 12.7%', color: 'text-success' },
                { label: 'House Theft', val: '↓ 8.2%', color: 'text-success' }
              ].map(t => (
                <div key={t.label} className="flex justify-between items-center text-xs bg-surface-2 border border-border-soft p-2.5 rounded-lg">
                  <span className="text-text-dim font-medium">{t.label}</span>
                  <span className={`font-bold font-mono ${t.color}`}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investigation Efficiency */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
          <div className="border-b border-border-soft pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">Investigation Efficiency (2025 vs 2026)</h3>
            <span className="text-[9px] font-mono text-text-faint uppercase">Operational metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Avg Closure Time', val: '71 Days', trend: '↓ 15.5% faster', sub: 'Target: 90 days' },
              { label: 'Cases in Target', val: '84.2%', trend: '↑ 4.2% increase', sub: 'vs previous period' },
              { label: 'Resolution Rate', val: '66.8%', trend: '↑ 2.1% increase', sub: 'State target: 75%' },
              { label: 'Active Watchlist', val: `${highPriorityCount} Cases`, trend: 'Action flag active', sub: 'Requires state level review', danger: true }
            ].map((e, i) => (
              <div key={i} className="p-3 bg-surface-2 border border-border rounded-lg text-xs flex flex-col justify-between">
                <span className="text-text-dim uppercase text-[9px] tracking-wider font-bold mb-1">{e.label}</span>
                <div className="text-lg font-bold text-text mt-1">{e.val}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-border-soft/40 text-[9px] font-mono text-text-faint">
                  <span>{e.trend}</span>
                  <span>{e.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 5. POLICE STATION PERFORMANCE ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5 bg-surface border border-border-soft space-y-4">
          <div className="border-b border-border-soft pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">Police Station Caseload & Performance</h3>
            <span className="text-[9px] font-mono text-text-faint uppercase">Top 10 stations dynamically computed</span>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-soft text-text-dim text-[9px] uppercase font-mono">
                  <th className="py-2.5 px-2">Station</th>
                  <th className="py-2.5 px-2">District</th>
                  <th className="py-2.5 px-2 text-center">FIRs</th>
                  <th className="py-2.5 px-2 text-center">Active</th>
                  <th className="py-2.5 px-2 text-center">Closed</th>
                  <th className="py-2.5 px-2 text-center">Pending</th>
                  <th className="py-2.5 px-2 text-center">Overdue</th>
                  <th className="py-2.5 px-2 text-center">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft/40 font-mono">
                {stationPerformanceList.slice(0, 10).map(s => (
                  <tr key={s.id} className="hover:bg-surface-hover/20 transition-colors">
                    <td className="py-2.5 px-2 font-semibold text-text font-sans">{s.name}</td>
                    <td className="py-2.5 px-2 text-text-dim font-sans">{s.district}</td>
                    <td className="py-2.5 px-2 text-center">{s.total}</td>
                    <td className="py-2.5 px-2 text-center text-accent-bright">{s.active}</td>
                    <td className="py-2.5 px-2 text-center text-success">{s.closed}</td>
                    <td className="py-2.5 px-2 text-center text-warning">{s.pending}</td>
                    <td className="py-2.5 px-2 text-center text-danger-bright">{s.overdue}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        s.resRate > 65 ? 'text-success bg-success/10' :
                        s.resRate > 45 ? 'text-warning bg-warning/10' :
                        'text-danger-bright bg-danger/10'
                      }`}>{s.resRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers / Action Required mini split */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-xl bg-surface border border-border-soft space-y-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded">Top Performing Stations</span>
            <div className="space-y-2">
              {topStations.slice(0, 3).map(s => (
                <div key={s.id} className="flex justify-between items-center text-xs bg-surface-2 p-2.5 border border-border-soft rounded-lg">
                  <span className="font-semibold text-text truncate max-w-[160px]">{s.name}</span>
                  <span className="font-bold text-success">{s.resRate}% solved</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-4 rounded-xl bg-surface border border-border-soft space-y-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-danger-bright bg-danger/15 border border-danger/30 px-2 py-0.5 rounded">Requires Leadership Attention</span>
            <div className="space-y-2">
              {needsAttentionStations.slice(0, 3).map(s => (
                <div key={s.id} className="flex justify-between items-center text-xs bg-surface-2 p-2.5 border border-border-soft rounded-lg">
                  <span className="font-semibold text-text truncate max-w-[160px]">{s.name}</span>
                  <span className="font-bold text-danger-bright">{s.resRate}% solved</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 6. DISTRICT CRIME OVERVIEW ─── */}
      <div className="glass rounded-2xl p-5 bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text">District Crime Overview Registry</h3>
          <span className="text-[9px] font-mono text-text-faint uppercase">Odisha District level metrics</span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {districtCrimeOverview.map(d => (
            <div key={d.district} className="p-4 bg-surface-2 border border-border-soft rounded-xl space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-border-soft pb-1">
                <span className="font-bold text-text text-sm uppercase tracking-wide">{d.district}</span>
                <span className={`text-[10px] font-bold font-mono ${d.trend === '↑' ? 'text-danger-bright' : 'text-success'}`}>{d.trend} Trend</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs">
                <div>
                  <div className="text-text font-bold">{d.firs}</div>
                  <div className="text-[8px] uppercase text-text-faint">FIRs</div>
                </div>
                <div>
                  <div className="text-accent-bright font-bold">{d.active}</div>
                  <div className="text-[8px] uppercase text-text-faint">Active</div>
                </div>
                <div>
                  <div className="text-success font-bold">{d.closed}</div>
                  <div className="text-[8px] uppercase text-text-faint">Closed</div>
                </div>
              </div>
              <div className="text-[9px] font-semibold text-text-dim flex justify-between items-center pt-2 border-t border-border-soft/60">
                <span>Priority: {d.highPriority}</span>
                <span>Status: normal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 7. EMERGING CRIME ZONES ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1">
            <ShieldAlert size={14} className="text-brand" /> Emerging Crime Intelligence Zones
          </h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { zone: '⚠ KHORDHA', desc: 'Vehicle theft increased 21% across 4 police stations.', style: 'border-danger/30 bg-danger/5 text-danger-bright' },
            { zone: '⚠ CUTTACK', desc: 'Cyber fraud increased 18% in business parks.', style: 'border-danger/30 bg-danger/5 text-danger-bright' },
            { zone: '⚠ SAMBALPUR', desc: 'Burglary cluster pattern detected at nights.', style: 'border-warning/30 bg-warning/5 text-warning' },
            { zone: '✓ GANJAM', desc: 'Overall reported crime rates decreased 9.4%.', style: 'border-success/30 bg-success/5 text-success' }
          ].map((z, i) => (
            <div key={i} className={`p-4 border rounded-xl space-y-1.5 ${z.style}`}>
              <div className="text-[10px] font-bold uppercase tracking-wider font-mono">{z.zone}</div>
              <p className="text-xs text-text leading-relaxed">{z.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 8. STATE INVESTIGATION WATCHLIST ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text">State Investigation Watchlist (High-Priority / Overdue)</h3>
        </div>

        <div className="space-y-3">
          {state.cases
            .filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH')
            .slice(0, 4)
            .map(c => {
              const stationName = state.stations.find(s => s.id === c.stationId)?.name || c.stationId;
              return (
                <div key={c.id} className="p-4 bg-surface-2 border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-text">{c.id}</span>
                      <span className="text-[9px] uppercase tracking-wider text-danger-bright bg-danger/10 border border-danger/20 px-1.5 py-0.5 rounded font-mono font-bold">
                        {c.priority} Priority
                      </span>
                      <span className="text-[9px] text-text-dim font-mono">{c.firNumber}</span>
                    </div>
                    <h4 className="text-sm font-bold text-text leading-tight">{c.title}</h4>
                    <p className="text-xs text-text-dim">
                      Station: <span className="font-semibold text-text">{stationName}</span> · 
                      Crime Type: <span className="font-semibold text-text">{c.crimeType}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] text-text-faint font-mono uppercase tracking-wide shrink-0">
                      ⚠ Cross-station link detected
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="bg-brand text-bg px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-bright transition-all flex items-center gap-1 shrink-0"
                    >
                      Open Case <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ─── 9. CROSS-STATION STATE INTELLIGENCE ─── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* State Intelligence Network stats */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
          <div className="border-b border-border-soft pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">State Intelligence Network Matrix</h3>
            <span className="text-[9px] font-mono text-text-faint uppercase">Entity relationship resolution</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Cross-Station links', val: '1,284 links', sub: 'Active relationships' },
              { label: 'Entity Matches', val: '642 matches', sub: 'Cross resolved' },
              { label: 'Pattern Matches', val: '381 matches', sub: 'MO classification' },
              { label: 'Location Matches', val: '173 matches', sub: 'Geographic overlap' },
              { label: 'High Confidence', val: '88 networks', sub: 'Linked crime rings' },
              { label: 'Graph Resolution', val: '99.4%', sub: 'Engine accuracy' }
            ].map((mat, i) => (
              <div key={i} className="p-3 bg-surface-2 border border-border rounded-lg text-xs flex flex-col justify-between">
                <span className="text-text-dim text-[9px] font-bold uppercase tracking-wider mb-1">{mat.label}</span>
                <div className="text-base font-bold text-text font-mono mt-1">{mat.val}</div>
                <span className="text-[8px] text-text-faint font-mono mt-1">{mat.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Activity Logs */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4 flex flex-col">
          <div className="border-b border-border-soft pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">Live System Activity Feed</h3>
            <span className="text-[9px] font-mono text-text-faint uppercase">Audit Overlook</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 flex-1 pr-1 text-xs">
            {[
              { text: 'New cross-station relationship resolved: Phone +91-9876543210 matched.', type: 'intelligence' },
              { text: 'Investigation watchlist alert: Case OD-BBSR-2026-0001 requires attention.', type: 'alert' },
              { text: 'State commander inspected Khandagiri PS case registries.', type: 'audit' },
              { text: 'Crime trend anomaly: Cyber Fraud increased 18.2% in Cuttack.', type: 'trend' },
              { text: 'Access request approved: Bhubaneswar PS granted access to Cuttack case.', type: 'governance' }
            ].map((act, i) => (
              <div key={i} className="p-3 bg-surface-2 border border-border-soft rounded-lg flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  act.type === 'intelligence' ? 'bg-brand' :
                  act.type === 'alert' ? 'bg-danger-bright animate-pulse' :
                  act.type === 'audit' ? 'bg-accent-bright' : 'bg-warning'
                }`} />
                <div className="flex-1">
                  <p className="text-text-dim leading-snug">{act.text}</p>
                  <span className="text-[8px] text-text-faint font-mono uppercase tracking-wider mt-1 block">type: {act.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// 2. POLICE STATION COMMAND CENTER (STATION_ADMIN / IIC)
// ─────────────────────────────────────────────────────────────────────────────
function IICDashboard() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  // ─── Logged-In User Context ───
  const myStationId = state.currentUser?.stationId || 'OP-BBSR-CAP';
  const myStation = state.stations.find(s => s.id === myStationId) || {
    id: 'OP-BBSR-CAP',
    name: 'Khandagiri Police Station',
    district: 'Khordha',
    city: 'Bhubaneswar',
    status: 'ACTIVE'
  };

  const stationName = myStation.name;
  const districtName = myStation.district;
  const stationCode = 'KHD-KND-014';

  // ─── Filter States ───
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [activeRequestTab, setActiveRequestTab] = useState('incoming');
  
  // Modals
  const [assigningCase, setAssigningCase] = useState(null);
  const [newOfficerId, setNewOfficerId] = useState('');
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);

  // Form State for new Officer
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerRank, setNewOfficerRank] = useState('Sub-Inspector');
  const [newOfficerRole, setNewOfficerRole] = useState('OFFICER');
  const [newOfficerContact, setNewOfficerContact] = useState('');
  
  // ─── Dynamic Dataset Computations ───
  const stationCases = useMemo(() => {
    return state.cases.filter(c => c.stationId === myStationId);
  }, [state.cases, myStationId]);

  // Base Offsets for realism to match spec mock numbers
  const totalFIRsCount = stationCases.length + 790; // ~842
  const activeCasesCount = stationCases.filter(c => c.status === 'INVESTIGATING').length + 115; // ~127
  const closedCasesCount = stationCases.filter(c => c.status === 'SOLVED' || c.status === 'CLOSED').length + 550; // ~564
  const pendingCasesCount = stationCases.filter(c => c.status === 'PENDING').length + 100; // ~103
  const overdueCount = stationCases.filter(c => c.priority === 'CRITICAL' && c.status === 'INVESTIGATING').length + 15; // ~18
  const highPriorityCount = stationCases.filter(c => (c.priority === 'HIGH' || c.priority === 'CRITICAL')).length + 8; // ~12
  const officersCount = state.users.filter(u => u.stationId === myStationId && u.role === 'OFFICER').length + 18; // ~24
  const alertsCount = state.alerts.filter(a => !a.isRead && stationCases.some(c => c.id === a.relatedCaseId)).length + 6; // ~9

  // ─── Sparkline SVG helper ───
  const renderSparkline = (points, color) => {
    const width = 50;
    const height = 16;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return x + ',' + y;
    }).join(' ');
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={coords} />
      </svg>
    );
  };

  // ─── Filter Cases logic ───
  const filteredCases = useMemo(() => {
    return stationCases.filter(c => {
      // Primary Tab Filter
      if (activeFilter === 'ACTIVE' && c.status !== 'INVESTIGATING') return false;
      if (activeFilter === 'PENDING' && c.status !== 'PENDING') return false;
      if (activeFilter === 'OVERDUE' && !(c.priority === 'CRITICAL' && c.status === 'INVESTIGATING')) return false;
      if (activeFilter === 'HIGH PRIORITY' && c.priority !== 'HIGH' && c.priority !== 'CRITICAL') return false;
      
      // Selected Officer filter
      if (selectedOfficer && c.investigatorId !== selectedOfficer) return false;
      
      // Selected Hotspot filter
      if (selectedHotspot) {
        if (selectedHotspot === 'PATRAPADA JUNCTION' && !c.title.toLowerCase().includes('theft') && !c.description.toLowerCase().includes('patrapada')) return false;
        if (selectedHotspot === 'KHANDAGIRI CHHAK' && !c.title.toLowerCase().includes('burglary') && !c.description.toLowerCase().includes('khandagiri')) return false;
      }

      return true;
    });
  }, [stationCases, activeFilter, selectedOfficer, selectedHotspot]);

  // ─── Officer Workloads calculations ───
  const stationOfficers = useMemo(() => {
    return state.users.filter(u => u.stationId === myStationId);
  }, [state.users, myStationId]);

  const officerWorkloads = useMemo(() => {
    return stationOfficers.map(officer => {
      const active = state.cases.filter(c => c.investigatorId === officer.id && c.status === 'INVESTIGATING').length;
      const closed = state.cases.filter(c => c.investigatorId === officer.id && (c.status === 'SOLVED' || c.status === 'CLOSED')).length;
      const pending = state.cases.filter(c => c.investigatorId === officer.id && c.status === 'PENDING').length;
      
      // workload percentage
      const workloadPercent = Math.min(100, Math.round((active * 2 + pending) * 15 + 30));
      let workloadStatus = 'NORMAL';
      if (workloadPercent > 80) workloadStatus = 'OVERLOADED';
      else if (workloadPercent > 60) workloadStatus = 'HIGH WORKLOAD';

      const avgTime = officer.id === 'INV-BBSR-001' ? 63 : officer.id === 'INV-BBSR-002' ? 57 : 71;
      const resRate = active + closed > 0 ? Math.round((closed / (active + closed + pending)) * 100) : 75;

      return {
        officer,
        active,
        closed,
        pending,
        workloadPercent,
        workloadStatus,
        avgTime,
        resRate
      };
    });
  }, [stationOfficers, state.cases]);

  // Overloaded count
  const overloadedCount = officerWorkloads.filter(w => w.workloadStatus === 'OVERLOADED' || w.workloadStatus === 'HIGH WORKLOAD').length;

  // Add Officer Submit
  const handleAddOfficerSubmit = (e) => {
    e.preventDefault();
    if (!newOfficerName.trim()) return;
    const newOfficerIdStr = 'INV-KHD-' + String(state.users.length + 1).padStart(3, '0');
    const newOfficer = {
      id: newOfficerIdStr,
      name: newOfficerName,
      role: newOfficerRole,
      stationId: myStationId,
      status: 'ACTIVE',
      rank: newOfficerRank
    };
    dispatch({ type: 'ADD_USER', payload: newOfficer });
    
    // Add Alert
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: 'ALT-' + Date.now(),
        type: 'PATTERN_DETECTED',
        message: `Officer ${newOfficerName} deployed under station code ${stationCode} by IIC Ramesh.`,
        createdAt: new Date().toISOString(),
        isRead: false
      }
    });

    setNewOfficerName('');
    setShowAddOfficerModal(false);
  };

  // Reassignment Confirm
  const handleConfirmReassign = () => {
    if (!assigningCase) return;
    const updated = { ...assigningCase, investigatorId: newOfficerId };
    dispatch({ type: 'UPDATE_CASE', payload: updated });
    
    // Log Alert/Event
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: 'ALT-' + Date.now(),
        type: 'PATTERN_DETECTED',
        message: `${assigningCase.id} assigned to ${state.users.find(u => u.id === newOfficerId)?.name} by IIC Ramesh.`,
        relatedCaseId: assigningCase.id,
        createdAt: new Date().toISOString(),
        isRead: false
      }
    });

    setAssigningCase(null);
  };

  // Cross Station Intelligence List
  const crossStationIntelList = useMemo(() => {
    // Generate matches from access requests or target cases
    return [
      {
        id: 'CS-01',
        caseId: 'CR-KHD-2026-004821',
        entity: 'Mobile Number (+91-9876543210)',
        extCase: 'CR-CTC-2026-00981',
        station: 'Cuttack Sadar Police Station',
        similarity: '94%',
        reason: 'Matched suspect contact number during night call logs',
        status: state.accessRequests.find(r => r.targetCaseId === 'OD-CTC-2026-00981')?.status || 'RESTRICTED'
      },
      {
        id: 'CS-02',
        caseId: 'CR-KHD-2026-004799',
        entity: 'Vehicle Plate (OD-05-XY-7777)',
        extCase: 'CR-PAT-2026-00421',
        station: 'Patia Police Station',
        similarity: '89%',
        reason: 'Overlapping vehicle sightings in residential burglary clusters',
        status: state.accessRequests.find(r => r.targetCaseId === 'OD-RKL-2026-0117')?.status || 'RESTRICTED'
      }
    ];
  }, [state.accessRequests]);

  // Request Access trigger
  const handleRequestAccess = (match) => {
    const newReq = {
      id: 'REQ-' + String(state.accessRequests.length + 1).padStart(3, '0'),
      requestingStationId: myStationId,
      requestingOfficerId: state.currentUser?.id || 'IIC-BBSR-01',
      targetStationId: match.station.includes('Cuttack') ? 'OP-CTC-CITY' : 'OP-RKL-CEN',
      targetCaseId: match.extCase === 'CR-CTC-2026-00981' ? 'OD-CTC-2026-00981' : 'OD-RKL-2026-0117',
      reason: `Cross-station linkage detected on entity: ${match.entity}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ACCESS_REQUEST', payload: newReq });
  };

  // Hotspots list
  const HOTSPOTS = [
    { name: 'PATRAPADA JUNCTION', cx: 150, cy: 120, cases: 17, vehicleTheft: 8, theft: 5, robbery: 4, trend: '↑ 13%', related: 12 },
    { name: 'KHANDAGIRI CHHAK', cx: 320, cy: 200, cases: 22, vehicleTheft: 10, theft: 7, robbery: 5, trend: '↑ 18%', related: 15 },
    { name: 'DUMUDUMA APARTMENTS', cx: 210, cy: 280, cases: 14, vehicleTheft: 5, theft: 6, robbery: 3, trend: '↓ 4%', related: 9 }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto pb-12">
      {/* ─── Add Officer Modal ─── */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddOfficerSubmit} className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-glass text-xs">
            <div className="flex items-center justify-between border-b border-border-soft pb-2">
              <h3 className="font-bold text-sm uppercase text-text">Deploy Station Investigator</h3>
              <button type="button" onClick={() => setShowAddOfficerModal(false)} className="text-text-dim hover:text-text font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-dim tracking-wider mb-1">Station Code</label>
                <input type="text" readOnly value={stationCode} className="w-full bg-surface-2 border border-border rounded p-2 text-text-faint outline-none font-mono cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-dim tracking-wider mb-1">Officer Name</label>
                <input required type="text" value={newOfficerName} onChange={e => setNewOfficerName(e.target.value)} placeholder="e.g. SI Priyadarshini Nayak" className="w-full bg-surface-2 border border-border rounded p-2 text-text outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-dim tracking-wider mb-1">Rank</label>
                <select value={newOfficerRank} onChange={e => setNewOfficerRank(e.target.value)} className="w-full bg-surface-2 border border-border rounded p-2 text-text outline-none cursor-pointer">
                  <option value="Inspector">Inspector</option>
                  <option value="Sub-Inspector">Sub-Inspector</option>
                  <option value="Asst. Sub-Inspector">Asst. Sub-Inspector</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-dim tracking-wider mb-1">Role Group</label>
                <select value={newOfficerRole} onChange={e => setNewOfficerRole(e.target.value)} className="w-full bg-surface-2 border border-border rounded p-2 text-text outline-none cursor-pointer">
                  <option value="OFFICER">Investigator (OFFICER)</option>
                  <option value="STATION_ADMIN">IIC Admin (STATION_ADMIN)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAddOfficerModal(false)} className="flex-1 bg-surface-2 border border-border font-bold py-2 rounded-lg hover:bg-surface-hover transition-colors">Cancel</button>
              <button type="submit" className="flex-1 bg-brand text-bg font-bold py-2 rounded-lg hover:bg-brand-bright transition-colors">Save Officer</button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Case Reassignment Modal ─── */}
      {assigningCase && (
        <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-glass text-xs">
            <div className="flex items-center justify-between border-b border-border-soft pb-2">
              <h3 className="font-bold text-sm uppercase text-text">Assign Case Investigator</h3>
              <button type="button" onClick={() => setAssigningCase(null)} className="text-text-dim hover:text-text font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-1">
              <p className="text-text-dim"><strong>Case ID:</strong> {assigningCase.id}</p>
              <p className="text-text-dim"><strong>Title:</strong> {assigningCase.title}</p>
              <p className="text-text-dim"><strong>Priority:</strong> {assigningCase.priority}</p>
              <p className="text-text-dim"><strong>Current:</strong> {state.users.find(u => u.id === assigningCase.investigatorId)?.name || 'Unassigned'}</p>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-text-dim tracking-wider mb-1.5">Select New Investigator</label>
              <select
                value={newOfficerId}
                onChange={e => setNewOfficerId(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded p-2.5 text-text outline-none cursor-pointer focus:border-brand"
              >
                <option value="">-- Select Officer (Shows Workload) --</option>
                {officerWorkloads.map(o => (
                  <option key={o.officer.id} value={o.officer.id}>{o.officer.name} ({o.officer.rank}) — {o.workloadPercent}% Workload</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setAssigningCase(null)} className="flex-1 bg-surface-2 border border-border font-bold py-2 rounded-lg hover:bg-surface-hover">Cancel</button>
              <button type="button" onClick={handleConfirmReassign} disabled={!newOfficerId} className="flex-1 bg-brand text-bg font-bold py-2 rounded-lg hover:bg-brand-bright disabled:opacity-50">Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mock Report Popup ─── */}
      {selectedReportType && (
        <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-glass text-xs">
            <div className="flex items-center justify-between border-b border-border-soft pb-2">
              <h3 className="font-bold text-sm uppercase text-text flex items-center gap-1.5">
                <FileBarChart size={16} className="text-brand" /> {selectedReportType} Report Preview
              </h3>
              <button type="button" onClick={() => setSelectedReportType(null)} className="text-text-dim hover:text-text font-bold text-lg">&times;</button>
            </div>
            <div className="bg-surface-2 border border-border-soft p-4 rounded-lg font-mono space-y-2 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {"ODISHA POLICE DEPARTMENT - OPERATIONS REGISTRY\n" +
               "STATION CODE: " + stationCode + " · KHANDAGIRI PS\n" +
               "--------------------------------------------------\n" +
               "REPORT: " + selectedReportType.toUpperCase() + "\n" +
               "DATE GENERATED: " + new Date().toLocaleDateString() + "\n" +
               "GENERATED BY: IIC Ramesh\n\n" +
               "SUMMARY STATISTICS:\n" +
               "- Total Logged FIRs: " + totalFIRsCount + "\n" +
               "- Active Files: " + activeCasesCount + "\n" +
               "- Closed Files: " + closedCasesCount + "\n" +
               "- Average Completion Window: 63 Days\n" +
               "- Access Request Signals: Active (Incoming/Outgoing)\n\n" +
               "OPERATIONAL COMPLIANCE:\n" +
               "All files processed according to BNS provisions.\n" +
               "No security warnings flagged."}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setSelectedReportType(null)} className="bg-surface-2 border border-border px-4 py-2 rounded font-bold text-text hover:bg-surface-hover transition-colors">Close</button>
              <button type="button" onClick={() => { alert('PDF Download Initiated.'); setSelectedReportType(null); }} className="bg-brand text-bg px-4 py-2 rounded font-bold hover:bg-brand-bright transition-colors flex items-center gap-1"><Download size={12}/> Generate PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Dashboard Identity Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft pb-4">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2.5">
            <Building className="text-brand" size={24} /> POLICE STATION COMMAND
          </h2>
          <p className="text-sm text-text-dim mt-1">
            {stationName} · {districtName} District · Code: <span className="font-mono font-bold text-text">{stationCode}</span> · Status: <span className="text-success font-bold font-mono">OPERATIONAL</span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowAddOfficerModal(true)}
            className="bg-surface-2 border border-border text-text px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-surface-hover transition-colors flex items-center gap-1.5"
          >
            <UserPlus size={14} /> + Add Officer
          </button>
          <button
            onClick={() => navigate('/cases/new')}
            className="bg-brand text-bg px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-brand-bright transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> Register FIR
          </button>
        </div>
      </div>

      {/* ─── 3. TOP KPI STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { title: 'Total FIRs', val: totalFIRsCount, trend: '↑ 5.2%', pts: [40, 42, 41, 43, 44, 45], sub: 'cumulative log' },
          { title: 'Active Cases', val: activeCasesCount, trend: '↑ 3.1%', pts: [12, 14, 13, 15, 12, 16], sub: 'in progress', highlight: true },
          { title: 'Cases Closed', val: closedCasesCount, trend: '↑ 8.4%', pts: [28, 30, 29, 31, 30, 32], sub: 'solved files' },
          { title: 'Pending Cases', val: pendingCasesCount, trend: '↓ 2.1%', pts: [8, 7, 9, 8, 6, 5], sub: 'awaiting intake' },
          { title: 'Overdue Work', val: overdueCount, trend: '↓ 12.4%', pts: [4, 4, 3, 2, 2, 1], sub: 'target exceeded', danger: overdueCount > 0 },
          { title: 'High Priority', val: highPriorityCount, trend: '↑ 1.8%', pts: [5, 6, 5, 7, 8, 9], sub: 'critical roster', danger: highPriorityCount > 5 },
          { title: 'Active Officers', val: officersCount, trend: 'Steady', pts: [24, 24, 24, 24, 24, 24], sub: 'assigned duty' },
          { title: 'Intel Alerts', val: alertsCount, trend: '↑ 6.3%', pts: [14, 16, 15, 18, 17, 20], sub: 'cross matches', danger: alertsCount > 0 }
        ].map((k, i) => (
          <div key={i} className={`glass p-3 rounded-xl border border-border-soft flex flex-col justify-between min-h-[88px] ${
            k.danger ? 'border-danger/30 bg-danger/5' : k.highlight ? 'border-brand/30 bg-brand/5' : 'bg-surface'
          }`}>
            <div className="text-[9px] font-bold uppercase tracking-wider text-text-dim flex justify-between items-center">
              <span>{k.title}</span>
              <span className={`text-[9px] font-bold ${k.trend.includes('↓') ? 'text-success' : 'text-warning'}`}>{k.trend}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-display font-bold text-text">{k.val}</span>
              {renderSparkline(k.pts, k.danger ? 'var(--danger-bright)' : 'var(--brand)')}
            </div>
            <span className="text-[8px] text-text-faint font-mono mt-0.5 uppercase">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* ─── 4. ACTION REQUIRED PANEL ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-danger/30 bg-danger/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-danger-bright mb-3 flex items-center gap-1.5">
          <ShieldAlert size={14} /> ACTION REQUIRED
        </h3>
        <div className="grid md:grid-cols-5 gap-3 text-xs">
          <div 
            onClick={() => setActiveFilter('OVERDUE')}
            className="p-3 bg-surface/50 border border-danger/25 rounded-xl cursor-pointer hover:border-danger hover:bg-danger/10 transition-all flex flex-col justify-between min-h-[72px]"
          >
            <span className="font-bold text-danger-bright">{overdueCount} investigations</span>
            <span className="text-[10px] text-text-dim mt-1.5">are overdue</span>
          </div>

          <div 
            onClick={() => setActiveFilter('HIGH PRIORITY')}
            className="p-3 bg-surface/50 border border-danger/25 rounded-xl cursor-pointer hover:border-danger hover:bg-danger/10 transition-all flex flex-col justify-between min-h-[72px]"
          >
            <span className="font-bold text-danger-bright">{highPriorityCount - 4 > 0 ? highPriorityCount - 4 : 3} cases</span>
            <span className="text-[10px] text-text-dim mt-1.5">have no recent activity</span>
          </div>

          <div 
            onClick={() => navigate('/investigators')}
            className="p-3 bg-surface/50 border border-danger/25 rounded-xl cursor-pointer hover:border-danger hover:bg-danger/10 transition-all flex flex-col justify-between min-h-[72px]"
          >
            <span className="font-bold text-danger-bright">{overloadedCount > 0 ? overloadedCount : 2} officers</span>
            <span className="text-[10px] text-text-dim mt-1.5">have unusually high workloads</span>
          </div>

          <div 
            onClick={() => setActiveFilter('HIGH PRIORITY')}
            className="p-3 bg-surface/50 border border-danger/25 rounded-xl cursor-pointer hover:border-danger hover:bg-danger/10 transition-all flex flex-col justify-between min-h-[72px]"
          >
            <span className="font-bold text-danger-bright">4 cases</span>
            <span className="text-[10px] text-text-dim mt-1.5">have unresolved intelligence matches</span>
          </div>

          <div 
            onClick={() => navigate('/requests')}
            className="p-3 bg-surface/50 border border-danger/25 rounded-xl cursor-pointer hover:border-danger hover:bg-danger/10 transition-all flex flex-col justify-between min-h-[72px]"
          >
            <span className="font-bold text-danger-bright">
              {state.accessRequests.filter(r => r.targetStationId === myStationId && r.status === 'PENDING').length} request
            </span>
            <span className="text-[10px] text-text-dim mt-1.5">awaiting access review</span>
          </div>
        </div>
      </div>

      {/* ─── 5. ACTIVE INVESTIGATION COMMAND BOARD ─── */}
      <div className="glass rounded-2xl p-5 bg-surface border border-border-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-soft pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <Briefcase size={15} className="text-brand" /> ACTIVE INVESTIGATIONS
            </h3>
            <p className="text-[10px] text-text-dim mt-0.5">Live cases active inside {stationName}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {['ALL', 'ACTIVE', 'PENDING', 'OVERDUE', 'HIGH PRIORITY'].map(f => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setSelectedHotspot(null);
                  setSelectedOfficer(null);
                }}
                className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider border transition-colors ${
                  activeFilter === f 
                    ? 'bg-brand text-bg border-brand' 
                    : 'bg-surface-2 hover:bg-surface-hover text-text-dim border-border-soft'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Selected parameters indicators */}
        {(selectedOfficer || selectedHotspot) && (
          <div className="flex items-center gap-2 text-xs bg-brand/5 border border-brand/20 p-2.5 rounded-lg">
            <span className="font-bold text-brand uppercase text-[9px] tracking-wider">Filtered View:</span>
            {selectedOfficer && <span className="bg-surface border border-border px-2 py-0.5 rounded text-[10px]">Officer ID: {selectedOfficer}</span>}
            {selectedHotspot && <span className="bg-surface border border-border px-2 py-0.5 rounded text-[10px]">Hotspot: {selectedHotspot}</span>}
            <button 
              onClick={() => { setSelectedOfficer(null); setSelectedHotspot(null); }}
              className="text-[10px] text-brand hover:underline font-bold ml-auto"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-border-soft text-text-dim text-[9px] uppercase font-mono tracking-wider">
              <tr>
                <th className="py-2 px-1">Case ID</th>
                <th className="py-2 px-1">Crime Type</th>
                <th className="py-2 px-1">Investigating Officer</th>
                <th className="py-2 px-1">Priority</th>
                <th className="py-2 px-1">Days Active</th>
                <th className="py-2 px-1">Progress</th>
                <th className="py-2 px-1">Last Activity</th>
                <th className="py-2 px-1">Intelligence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft/40 font-mono">
              {filteredCases.map(c => {
                const assignedCop = state.users.find(u => u.id === c.investigatorId)?.name || 'Unassigned';
                const daysActive = c.id === 'OD-BBSR-2026-0001' ? 118 : c.id === 'OD-BBSR-2026-0042' ? 43 : 64;
                const progressPercent = c.status === 'SOLVED' ? 100 : c.id === 'OD-BBSR-2026-0001' ? 72 : 51;
                const isCrossLink = c.id === 'OD-BBSR-2026-0001';

                return (
                  <tr 
                    key={c.id} 
                    onClick={() => navigate(`/cases/${c.id}`)}
                    className="hover:bg-surface-hover/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-1 font-bold text-text group-hover:text-brand transition-colors">{c.firNumber}</td>
                    <td className="py-2.5 px-1 font-sans text-text-dim font-medium">{c.crimeType}</td>
                    <td className="py-2.5 px-1 font-sans text-text">{assignedCop}</td>
                    <td className="py-2.5 px-1">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                        c.priority === 'CRITICAL' ? 'text-danger-bright bg-danger/10 border-danger/30' :
                        c.priority === 'HIGH' ? 'text-warning bg-warning/10 border-warning/30' :
                        'text-text-dim bg-surface border-border-soft'
                      }`}>{c.priority}</span>
                    </td>
                    <td className="py-2.5 px-1">{daysActive} days</td>
                    <td className="py-2.5 px-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-surface-2 rounded-full overflow-hidden border border-border-soft/30">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-text">{progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-1 font-sans text-text-dim">
                      {c.id === 'OD-BBSR-2026-0001' ? '2 hours ago' : 'Yesterday'}
                    </td>
                    <td className="py-2.5 px-1 font-sans">
                      {isCrossLink ? (
                        <span className="text-[10px] text-danger-bright font-bold flex items-center gap-1">
                          <Lock size={10} /> Cross-station link
                        </span>
                      ) : (
                        <span className="text-[10px] text-text-faint font-semibold">Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-faint italic font-sans">No investigations found matching the selected filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. INVESTIGATION TEAM PERFORMANCE ─── */}
      <div className="glass rounded-2xl p-5 bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text">INVESTIGATION TEAM PERFORMANCE</h3>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-2 border-b border-border-soft text-text-dim text-[9px] uppercase font-mono tracking-wider">
              <tr>
                <th className="p-3">Officer</th>
                <th className="p-3">Rank</th>
                <th className="p-3 text-center">Active Cases</th>
                <th className="p-3 text-center">Closed Cases</th>
                <th className="p-3 text-center">Pending</th>
                <th className="p-3 text-center">Avg Time</th>
                <th className="p-3 text-center">Resolution Rate</th>
                <th className="p-3">Workload</th>
                <th className="p-3">Workload Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft/40 font-mono">
              {officerWorkloads.map(w => (
                <tr 
                  key={w.officer.id} 
                  onClick={() => setSelectedOfficer(w.officer.id === selectedOfficer ? null : w.officer.id)}
                  className={`hover:bg-surface-hover/20 cursor-pointer transition-colors ${selectedOfficer === w.officer.id ? 'bg-brand/5' : ''}`}
                >
                  <td className="p-3 font-bold text-text font-sans">{w.officer.name}</td>
                  <td className="p-3 font-sans text-text-dim">{w.officer.rank || 'Officer'}</td>
                  <td className="p-3 text-center text-accent-bright font-bold">{w.active}</td>
                  <td className="p-3 text-center text-success font-bold">{w.closed}</td>
                  <td className="p-3 text-center text-warning font-bold">{w.pending}</td>
                  <td className="p-3 text-center">{w.avgTime} days</td>
                  <td className="p-3 text-center font-bold text-text">{w.resRate}%</td>
                  <td className="p-3">{w.workloadPercent}%</td>
                  <td className="p-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider border ${
                      w.workloadStatus === 'OVERLOADED' ? 'bg-danger/10 text-danger-bright border-danger/30' :
                      w.workloadStatus === 'HIGH WORKLOAD' ? 'bg-warning/10 text-warning border-warning/30' :
                      'bg-success/10 text-success border-success/30'
                    }`}>
                      {w.workloadStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-text-faint font-mono italic">Click on any officer row to filter the Active Investigations table to their caseload.</p>
      </div>

      {/* ─── 7. CASE DISTRIBUTION BY INVESTIGATOR (BAR CHART) ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text">CASE DISTRIBUTION BY INVESTIGATOR</h3>
        </div>
        <div className="space-y-3">
          {officerWorkloads.map(w => {
            const pct = Math.max(8, Math.min(100, Math.round((w.active / 15) * 100)));
            return (
              <div 
                key={w.officer.id} 
                onClick={() => setSelectedOfficer(w.officer.id === selectedOfficer ? null : w.officer.id)}
                className="flex items-center gap-3 text-xs cursor-pointer group"
              >
                <span className="w-32 font-bold text-text truncate group-hover:text-brand transition-colors">{w.officer.name}</span>
                <div className="flex-1 h-4 bg-surface-2 rounded overflow-hidden border border-border-soft/40 relative">
                  <div className="h-full bg-brand group-hover:bg-brand-bright transition-colors" style={{ width: `${pct}%` }} />
                  <span className="absolute left-2.5 top-0 text-[10px] font-bold text-text font-mono leading-none py-1">{w.active} Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 9. STATION CRIME INTELLIGENCE ─── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Crime trend indicators & time frame */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
          <div className="border-b border-border-soft pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">STATION CRIME INTELLIGENCE</h3>
            <span className="text-[9px] font-mono text-text-faint uppercase font-bold">JURISDICTION ANALYTICS</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-danger-bright bg-danger/10 border border-danger/25 px-2 py-0.5 rounded">Increasing</span>
              {[
                { label: 'Vehicle Theft', val: '↑ 21%', color: 'text-danger-bright' },
                { label: 'Cyber Fraud', val: '↑ 16%', color: 'text-danger-bright' }
              ].map(t => (
                <div key={t.label} className="flex justify-between items-center text-xs bg-surface-2 border border-border-soft p-2.5 rounded-lg">
                  <span className="text-text-dim font-medium">{t.label}</span>
                  <span className={`font-bold font-mono ${t.color}`}>{t.val}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 border border-success/25 px-2 py-0.5 rounded">Decreasing</span>
              {[
                { label: 'Burglary', val: '↓ 8%', color: 'text-success' },
                { label: 'Robbery', val: '↓ 4%', color: 'text-success' }
              ].map(t => (
                <div key={t.label} className="flex justify-between items-center text-xs bg-surface-2 border border-border-soft p-2.5 rounded-lg">
                  <span className="text-text-dim font-medium">{t.label}</span>
                  <span className={`font-bold font-mono ${t.color}`}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Trend Chart */}
          <div className="pt-2">
            <div className="text-[10px] font-bold text-text-dim uppercase mb-2">FIR Volume Intake Timeline</div>
            <div className="h-32 w-full relative flex items-end">
              <svg className="w-full h-full" viewBox="0 0 400 120">
                <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border-soft)" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="var(--border-soft)" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="var(--border-soft)" strokeDasharray="3 3" strokeWidth="0.5" />
                <path d="M 20 100 Q 80 50 160 80 T 320 30 T 380 20" fill="none" stroke="var(--brand)" strokeWidth="2" />
                <circle cx="20" cy="100" r="3" fill="var(--brand)" />
                <circle cx="160" cy="80" r="3" fill="var(--brand)" />
                <circle cx="320" cy="30" r="3" fill="var(--brand)" />
                <circle cx="380" cy="20" r="3" fill="var(--brand)" />
              </svg>
            </div>
          </div>
        </div>

        {/* ─── 10. LOCAL HOTSPOT MAP ─── */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4 flex flex-col justify-between">
          <div className="border-b border-border-soft pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1">
              <MapPin size={14} className="text-brand" /> Khandagiri Station Hotspot Interface
            </h3>
          </div>

          <div className="flex gap-4 flex-1 items-center justify-between">
            {/* SVG Interactive jurisdiction Map */}
            <div className="relative bg-surface-2 border border-border-soft rounded-xl p-2 shrink-0 w-64 h-52 flex items-center justify-center">
              <svg viewBox="0 0 400 350" className="w-full h-full">
                {/* Hotspot circles */}
                {HOTSPOTS.map(h => (
                  <g 
                    key={h.name} 
                    onClick={() => setSelectedHotspot(h.name === selectedHotspot ? null : h.name)}
                    className="cursor-pointer group"
                  >
                    <circle 
                      cx={h.cx} 
                      cy={h.cy} 
                      r="28" 
                      className={`transition-colors duration-250 ${
                        selectedHotspot === h.name 
                          ? 'fill-brand/35 stroke-brand stroke-2' 
                          : 'fill-brand/10 hover:fill-brand/20 stroke-brand/40'
                      }`} 
                    />
                    <circle cx={h.cx} cy={h.cy} r="3.5" fill="var(--danger-bright)" className="animate-pulse" />
                    <text x={h.cx} y={h.cy + 13} fontSize="8" fontWeight="bold" fill="var(--text)" textAnchor="middle" className="uppercase font-mono tracking-wide">{h.name.split(' ')[0]}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Hotspot details sidebar */}
            <div className="flex-1 space-y-3">
              {selectedHotspot ? (
                <div className="p-3 bg-brand/5 border border-brand/25 rounded-xl text-xs space-y-2">
                  <div className="font-bold text-[9px] uppercase tracking-wider text-brand">{selectedHotspot}</div>
                  <div className="font-mono text-text"><strong>Total Cases:</strong> {HOTSPOTS.find(h => h.name === selectedHotspot)?.cases} files</div>
                  <div className="text-[10px] text-text-dim">
                    Vehicle Theft: {HOTSPOTS.find(h => h.name === selectedHotspot)?.vehicleTheft} · 
                    Theft: {HOTSPOTS.find(h => h.name === selectedHotspot)?.theft}
                  </div>
                  <div className="text-[9px] text-brand font-semibold flex justify-between border-t border-border-soft/50 pt-1.5">
                    <span>Hotspot trend:</span>
                    <span>{HOTSPOTS.find(h => h.name === selectedHotspot)?.trend}</span>
                  </div>
                  <button
                    onClick={() => setActiveFilter('HIGH PRIORITY')}
                    className="w-full bg-brand text-bg text-[10px] font-bold py-1.5 rounded hover:bg-brand-bright transition-colors uppercase tracking-wider text-center block"
                  >
                    View Related Cases
                  </button>
                </div>
              ) : (
                <div className="text-center text-text-faint py-8 italic text-[11px] leading-relaxed">
                  <MapPin className="mx-auto text-text-faint/40 mb-2" size={24} />
                  Click a map node to display neighborhood hotspot breakdown and coordinates.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 11. CROSS-STATION INTELLIGENCE ─── */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
          <div className="border-b border-border-soft pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1">
              <Network size={14} className="text-brand" /> CROSS-STATION RELATIONSHIPS
            </h3>
            <span className="text-[9px] font-mono text-text-faint uppercase font-bold">9 relations discovered</span>
          </div>

          <div className="space-y-3">
            {crossStationIntelList.map(m => (
              <div key={m.id} className="p-4 bg-surface-2 border border-border-soft rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[9px] uppercase tracking-wider text-danger-bright bg-danger/10 px-2 py-0.5 rounded border border-danger/20">NEW MATCH DETECTED</span>
                  <span className="text-text-faint font-mono">{m.similarity} Similarity</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-text-faint block">Current Station File</span>
                    <span className="font-mono font-bold text-text">{m.caseId}</span>
                  </div>
                  <div>
                    <span className="text-text-faint block">External Registry</span>
                    <span className="font-mono font-bold text-brand">{m.extCase}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-faint block">Matched Entity Signal</span>
                    <span className="font-bold text-text">{m.entity}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-faint block">Source Station</span>
                    <span className="font-bold text-text-dim">{m.station}</span>
                  </div>
                </div>

                <div className="italic text-text-faint border-t border-border-soft/40 pt-2 font-semibold">"Reason: {m.reason}"</div>

                <div className="flex items-center justify-between border-t border-border-soft/40 pt-2.5">
                  <span className="text-[9px] text-text-faint uppercase font-mono tracking-wider flex items-center gap-1">
                    Status: <strong className={m.status === 'APPROVED' ? 'text-success' : 'text-warning animate-pulse'}>{m.status}</strong>
                  </span>
                  {m.status === 'RESTRICTED' && (
                    <button
                      onClick={() => handleRequestAccess(m)}
                      className="bg-brand text-bg px-3.5 py-1.5 rounded font-bold text-[10px] hover:bg-brand-bright transition-all flex items-center gap-0.5"
                    >
                      <Lock size={10} /> Request Access
                    </button>
                  )}
                  {m.status === 'PENDING' && (
                    <span className="text-[10px] text-text-faint font-semibold italic">Access Request Pending Approval</span>
                  )}
                  {m.status === 'APPROVED' && (
                    <button
                      onClick={() => navigate(`/cases/${m.extCase === 'CR-CTC-2026-00981' ? 'OD-CTC-2026-00981' : 'OD-RKL-2026-0117'}`)}
                      className="bg-success text-bg px-3.5 py-1.5 rounded font-bold text-[10px] hover:bg-success-bright transition-all"
                    >
                      Inspect External Case
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 12. ACCESS REQUEST MANAGEMENT (INCOMING vs. OUTGOING) ─── */}
        <div className="glass p-5 rounded-2xl bg-surface border border-border-soft flex flex-col justify-between">
          <div>
            <div className="border-b border-border-soft pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
                <Lock size={14} className="text-brand" /> ACCESS GOVERNANCE SYSTEM
              </h3>
              
              <div className="flex gap-1 bg-surface-2 p-0.5 rounded-lg border border-border-soft/60">
                <button
                  onClick={() => setActiveRequestTab('incoming')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider transition-all ${
                    activeRequestTab === 'incoming' ? 'bg-surface text-text' : 'text-text-faint hover:text-text'
                  }`}
                >
                  Incoming
                </button>
                <button
                  onClick={() => setActiveRequestTab('outgoing')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider transition-all ${
                    activeRequestTab === 'outgoing' ? 'bg-surface text-text' : 'text-text-faint hover:text-text'
                  }`}
                >
                  Outgoing
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 mt-4 overflow-y-auto max-h-60">
              {activeRequestTab === 'incoming' ? (
                state.accessRequests.filter(r => r.targetStationId === myStationId).map(r => (
                  <div key={r.id} className="p-3 bg-surface-2 border border-border-soft/60 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-text font-mono font-bold">{r.targetCaseId}</span>
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded font-mono uppercase border ${
                        r.status === 'PENDING' ? 'text-warning bg-warning/5 border-warning/20' :
                        r.status === 'APPROVED' ? 'text-success bg-success/5 border-success/20' : 'text-danger bg-danger/5 border-danger/20'
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-[11px] text-text-dim">From: <strong className="text-text font-sans">Station {r.requestingStationId}</strong> · Reason: {r.reason}</p>
                    {r.status === 'PENDING' && (
                      <div className="flex gap-2 pt-1.5 border-t border-border-soft/40">
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_ACCESS_REQUEST_STATUS', payload: { id: r.id, status: 'APPROVED' } })}
                          className="flex-1 bg-success text-bg font-bold py-1 rounded text-[10px] hover:bg-success-bright transition-colors"
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_ACCESS_REQUEST_STATUS', payload: { id: r.id, status: 'REJECTED' } })}
                          className="flex-1 bg-surface border border-border text-text font-bold py-1 rounded text-[10px] hover:bg-surface-hover"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                state.accessRequests.filter(r => r.requestingStationId === myStationId).map(r => (
                  <div key={r.id} className="p-3 bg-surface-2 border border-border-soft/60 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-text font-mono font-bold">{r.targetCaseId}</span>
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded font-mono uppercase border ${
                        r.status === 'PENDING' ? 'text-warning bg-warning/5 border-warning/20' :
                        r.status === 'APPROVED' ? 'text-success bg-success/5 border-success/20' : 'text-danger bg-danger/5 border-danger/20'
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-[11px] text-text-dim">To: <strong className="text-text font-sans">Station {r.targetStationId}</strong> · Reason: {r.reason}</p>
                  </div>
                ))
              )}
              {activeRequestTab === 'incoming' && state.accessRequests.filter(r => r.targetStationId === myStationId).length === 0 && (
                <p className="text-center text-text-faint py-6 text-[11px] italic">No incoming requests registered.</p>
              )}
              {activeRequestTab === 'outgoing' && state.accessRequests.filter(r => r.requestingStationId === myStationId).length === 0 && (
                <p className="text-center text-text-faint py-6 text-[11px] italic">No outgoing requests registered.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 14. STATION INTELLIGENCE FEED ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-danger-bright flex items-center gap-1">
            <Activity size={14} /> STATION INTELLIGENCE FEED
          </h3>
          <span className="text-[9px] font-mono text-text-faint uppercase font-bold">OPERATIONAL AUDIT</span>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-xs">
          {[
            { time: '09:41', text: 'Cross-station relationship detected: CR-KHD-004821 ↔ CR-CTC-00981 (Suspect match)', route: '/network', type: 'network' },
            { time: '09:32', text: 'Evidence processed: Vehicle number extracted successfully inside EV-BBSR-001', route: '/evidence', type: 'evidence' },
            { time: '09:18', text: 'Investigation overdue warning flagged: CR-KHD-004799 requires prompt review', route: '/dashboard', type: 'overdue' },
            { time: '08:56', text: 'Access request received from Cuttack Sadar PS for Burglary Case files', route: '/requests', type: 'request' },
            { time: '08:42', text: 'New FIR registered: CR-KHD-004823 logged under Theft category', route: '/cases', type: 'cases' }
          ].map((e, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (e.type === 'overdue') {
                  setActiveFilter('OVERDUE');
                } else {
                  navigate(e.route);
                }
              }}
              className="p-2.5 bg-surface-2 hover:bg-surface-hover/30 border border-border-soft/60 rounded-lg flex items-start gap-3 cursor-pointer transition-colors"
            >
              <span className="font-mono text-brand font-bold text-[9px] mt-0.5">{e.time}</span>
              <p className="text-text-dim flex-1 leading-snug">{e.text}</p>
              <ChevronRight size={13} className="text-text-faint self-center" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── 16. STATION REPORTS DESK ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
        <div className="border-b border-border-soft pb-2 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text">STATION REPORTS REGISTRY</h3>
          <span className="text-[9px] font-mono text-text-faint uppercase font-bold">READY FOR EXPORT</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            'Daily FIR Report',
            'Weekly Investigation Report',
            'Monthly Crime Summary',
            'Officer Performance Report',
            'Pending Case Report',
            'Cross-Station Intelligence Report'
          ].map((rep, i) => (
            <div key={i} className="p-3 bg-surface-2 border border-border-soft rounded-xl flex flex-col justify-between h-28 hover:border-brand/40 transition-colors">
              <span className="text-[10px] font-bold text-text-dim leading-snug">{rep}</span>
              <div className="flex gap-1.5 pt-2 border-t border-border-soft/40">
                <button
                  onClick={() => setSelectedReportType(rep)}
                  className="flex-1 bg-surface border border-border text-[9px] font-bold py-1.5 rounded hover:bg-surface-hover transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => { alert('PDF Download Initiated.'); }}
                  className="flex-1 bg-brand text-bg text-[9px] font-bold py-1.5 rounded hover:bg-brand-bright transition-colors"
                >
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}// 3. INVESTIGATOR DASHBOARD (OFFICER)
// ─────────────────────────────────────────────────────────────────────────────
function CopDashboard() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  // ─── Investigator Identity Context ───
  const officerName = "Insp. Vikram";
  const officerId = "OD-KHD-INV-024";
  const stationName = "Khandagiri Police Station";
  const myStationId = state.currentUser?.stationId || 'OP-BBSR-CAP';

  // ─── Sparkline SVG helper ───
  const renderSparkline = (points: number[], color: string) => {
    const width = 50;
    const height = 16;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return x + ',' + y;
    }).join(' ');
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={coords} />
      </svg>
    );
  };

  // ─── Multilingual State ───
  const [selectedLang, setSelectedLang] = useState('EN');
  
  const translations = {
    EN: {
      title: "MY INVESTIGATION DESK",
      subtitle: "Insp. Vikram · Khandagiri Police Station",
      activeShift: "ON DUTY",
      activeCases: "MY ACTIVE CASES",
      nearingDeadline: "NEARING DEADLINE",
      highPriority: "HIGH PRIORITY",
      evidencePending: "EVIDENCE PENDING",
      intelAlerts: "INTELLIGENCE ALERTS",
      unresolvedLinks: "UNRESOLVED LINKS",
      attention: "WHAT NEEDS MY ATTENTION?",
      guidance: "INVESTIGATION GUIDANCE",
      evidenceQueue: "EVIDENCE WORK QUEUE",
      tasks: "INVESTIGATION TASKS",
      notes: "INVESTIGATION NOTES"
    },
    OD: {
      title: "ମୋର ତଦନ୍ତ ଡେସ୍କ",
      subtitle: "ଇନ୍ସପେକ୍ଟର ବିକ୍ରମ · ଖଣ୍ଡଗିରି ଥାନା",
      activeShift: "କାର୍ଯ୍ୟରତ",
      activeCases: "ସକ୍ରିୟ ମାମଲା",
      nearingDeadline: "ସୀମା ନିକଟତର",
      highPriority: "ଉଚ୍ଚ ପ୍ରାଥମିକତା",
      evidencePending: "ପ୍ରମାଣ ବାକି",
      intelAlerts: "ଗୁପ୍ତଚର ସୂଚନା",
      unresolvedLinks: "ଅସମାହିତ ସମ୍ପର୍କ",
      attention: "କେଉଁଠି ଦୃଷ୍ଟି ଦେବା ଆବଶ୍ୟକ?",
      guidance: "ତଦନ୍ତ ମାର୍ଗଦର୍ଶନ",
      evidenceQueue: "ପ୍ରମାଣ କାର୍ଯ୍ୟ ଧାଡି",
      tasks: "ତଦନ୍ତ କାର୍ଯ୍ୟସୂଚୀ",
      notes: "ତଦନ୍ତ ଟିପ୍ପଣୀ"
    },
    KN: {
      title: "ನನ್ನ ತನಿಖಾ ಡೆಸ್ಕ್",
      subtitle: "ಇನ್ಸ್ಪೆಕ್ಟರ್ ವಿಕ್ರಮ್ · ಖಂಡಗಿರಿ ಪೊಲೀಸ್ ಠಾಣೆ",
      activeShift: "ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ",
      activeCases: "ನನ್ನ ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
      nearingDeadline: "ಗಡುವು ಹತ್ತಿರದಲ್ಲಿದೆ",
      highPriority: "ಉನ್ನತ ಆದ್ಯತೆ",
      evidencePending: "ಸಾಕ್ಷ್ಯ ಬಾಕಿ ಇದೆ",
      intelAlerts: "ಬುದ್ಧಿಮತ್ತೆ ಎಚ್ಚರಿಕೆಗಳು",
      unresolvedLinks: "ಪರಿಹರಿಸದ ಲಿಂಕ್‌ಗಳು",
      attention: "ನನ್ನ ಗಮನಕ್ಕೆ ಏನು ಬೇಕು?",
      guidance: "ತನಿಖಾ ಮಾರ್ಗದರ್ಶನ",
      evidenceQueue: "ಸಾಕ್ಷ್ಯ ಕೆಲಸದ ಸರತಿ ಸಾಲು",
      tasks: "ತನಿಖಾ ಕಾರ್ಯಗಳು",
      notes: "ತನಿಖಾ ಟಿಪ್ಪಣಿಗಳು"
    },
    HI: {
      title: "मेरा जांच डेस्क",
      subtitle: "इन्स्पेक्टर विक्रम · खंडगिरि पुलिस स्टेशन",
      activeShift: "ड्यूटी पर",
      activeCases: "मेरे सक्रिय मामले",
      nearingDeadline: "समय सीमा के करीब",
      highPriority: "उच्च प्राथमिकता",
      evidencePending: "लंबित साक्ष्य",
      intelAlerts: "खुफिया अलर्ट",
      unresolvedLinks: "अनसुलझे लिंक",
      attention: "क्या मेरे ध्यान की आवश्यकता है?",
      guidance: "जांच मार्गदर्शन",
      evidenceQueue: "साक्ष्य कार्य कतार",
      tasks: "जांच कार्य",
      notes: "जांच टिप्पणियां"
    }
  };

  const text = translations[selectedLang] || translations.EN;

  // ─── Voice Assistant Simulated State ───
  const [voiceStatus, setVoiceStatus] = useState(null); // 'LISTENING', 'PROCESSING', 'NAVIGATING'
  const [simulatedVoiceCommand, setSimulatedVoiceCommand] = useState("");

  const handleSimulateVoice = (command, route, actionType = null) => {
    setSimulatedVoiceCommand(command);
    setVoiceStatus('LISTENING');
    
    setTimeout(() => {
      setVoiceStatus('PROCESSING');
      setTimeout(() => {
        setVoiceStatus('NAVIGATING');
        setTimeout(() => {
          setVoiceStatus(null);
          setSimulatedVoiceCommand("");
          if (route) navigate(route);
          if (actionType === 'overdue') {
            setSelectedCaseTab('OVERDUE');
          } else if (actionType === 'high') {
            setSelectedCaseTab('HIGH PRIORITY');
          }
        }, 1000);
      }, 1000);
    }, 1200);
  };

  // ─── Dynamic Case / Alert / Evidence States ───
  const myCases = useMemo(() => {
    return state.cases.filter(c => c.investigatorId === 'INV-BBSR-001' || c.investigatorId === 'INV-KHD-024');
  }, [state.cases]);

  const activeCasesCount = myCases.filter(c => c.status === 'INVESTIGATING').length + 9; // ~12
  const nearingDeadlineCount = 3;
  const highPriorityCount = myCases.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length + 2; // ~4
  const evidencePendingCount = state.evidence.filter(e => myCases.some(c => c.id === e.caseId)).length + 4; // ~7
  const intelAlertsCount = state.alerts.filter(a => myCases.some(c => c.id === a.relatedCaseId)).length + 3; // ~6
  const unresolvedLinksCount = 3;

  // ─── Selected active case focus ───
  const [selectedFocusCaseId, setSelectedFocusCaseId] = useState('OD-BBSR-2026-0001');
  const focusedCase = useMemo(() => {
    return state.cases.find(c => c.id === selectedFocusCaseId) || myCases[0] || state.cases[0];
  }, [state.cases, selectedFocusCaseId, myCases]);

  // Case Tasks List
  const [tasksList, setTasksList] = useState([
    { id: 'T1', caseId: 'OD-BBSR-2026-0001', label: 'Verify vehicle ownership of OD-02-AB-1234', completed: true },
    { id: 'T2', caseId: 'OD-BBSR-2026-0001', label: 'Request CDR analysis from telecom cell', completed: false },
    { id: 'T3', caseId: 'OD-BBSR-2026-0001', label: 'Review CCTV footage of Patrapada Junction', completed: true },
    { id: 'T4', caseId: 'OD-BBSR-2026-0001', label: 'Interview night shift witness Patel', completed: false },
    { id: 'T5', caseId: 'OD-BBSR-2026-0001', label: 'Compare similar burglary case CR-KHD-2025-00812', completed: false },
    { id: 'T6', caseId: 'OD-BBSR-2026-0001', label: 'Review relevant BNS provisions (Sec 305)', completed: true }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  const completedTasksCount = tasksList.filter(t => t.caseId === selectedFocusCaseId && t.completed).length;
  const totalTasksCount = tasksList.filter(t => t.caseId === selectedFocusCaseId).length || 1;
  const dynamicProgressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: 'T-' + Date.now(),
      caseId: selectedFocusCaseId,
      label: newTaskInput,
      completed: false
    };
    setTasksList(prev => [...prev, newTask]);
    setNewTaskInput('');
  };

  const handleToggleTask = (id) => {
    setTasksList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id) => {
    setTasksList(prev => prev.filter(t => t.id !== id));
  };

  // Case Notes List
  const [notesList, setNotesList] = useState([
    { id: 'N1', caseId: 'OD-BBSR-2026-0001', text: 'Vehicle observed near Patrapada Junction at approximately 21:40 during MO replication.', createdAt: 'Today, 09:18 AM' }
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    const newNote = {
      id: 'N-' + Date.now(),
      caseId: selectedFocusCaseId,
      text: newNoteInput,
      createdAt: 'Just now'
    };
    setNotesList(prev => [...prev, newNote]);
    setNewNoteInput('');
  };

  // Case Table Active tab
  const [selectedCaseTab, setSelectedCaseTab] = useState('ALL');

  // Simulated AI Chatbot on Dashboard
  const [aiAssistantQuery, setAiAssistantQuery] = useState('');
  const [aiAssistantReplies, setAiAssistantReplies] = useState([
    {
      query: "What should I investigate next?",
      reply: "Two vehicles are linked to this investigation. I recommend coordinating with Cuttack Sadar PS concerning CR-CTC-2026-00981.",
      buttons: [
        { label: 'View Vehicles', route: '/evidence' },
        { label: 'Open Network', route: '/network' }
      ]
    }
  ]);

  const handleSendAiQuery = (queryText) => {
    const q = queryText || aiAssistantQuery;
    if (!q.trim()) return;

    let responseText = "No direct entity overlapping found. I suggest uploading further phone log registries.";
    let responseButtons = [];

    const lower = q.toLowerCase();
    if (lower.includes('investigate') || lower.includes('next')) {
      responseText = "CrimeLens recommends: Investigate the vehicle registration associated with the mobile number identified in Evidence #04.";
      responseButtons = [
        { label: 'View Entity', route: '/network' },
        { label: 'Open Network', route: '/network' }
      ];
    } else if (lower.includes('similar')) {
      responseText = "Identified 87% similar case CR-KHD-2025-00812 (Burglary) at Khandagiri jurisdiction.";
      responseButtons = [
        { label: 'Compare Case', route: '/legal' }
      ];
    } else if (lower.includes('bns') || lower.includes('provisions')) {
      responseText = "Applicable BNS provisions: Section 305 (Theft in dwelling house / transportation). Match confidence is 89%.";
      responseButtons = [
        { label: 'Open Legal Intelligence', route: '/legal' }
      ];
    }

    setAiAssistantReplies(prev => [...prev, {
      query: q,
      reply: responseText,
      buttons: responseButtons
    }]);

    setAiAssistantQuery('');
  };

  // Active cases filtered list
  const filteredCases = useMemo(() => {
    return myCases.filter(c => {
      if (selectedCaseTab === 'ACTIVE' && c.status !== 'INVESTIGATING') return false;
      if (selectedCaseTab === 'PENDING' && c.status !== 'PENDING') return false;
      if (selectedCaseTab === 'OVERDUE' && c.priority !== 'CRITICAL') return false;
      if (selectedCaseTab === 'HIGH PRIORITY' && c.priority !== 'HIGH' && c.priority !== 'CRITICAL') return false;
      return true;
    });
  }, [myCases, selectedCaseTab]);

  // Evidence list in cop queue
  const myEvidence = useMemo(() => {
    return state.evidence.filter(e => myCases.some(c => c.id === e.caseId));
  }, [state.evidence, myCases]);

  // Request Access Dispatch
  const handleRequestAccess = (caseId) => {
    const newReq = {
      id: 'REQ-' + String(state.accessRequests.length + 1).padStart(3, '0'),
      requestingStationId: myStationId,
      requestingOfficerId: 'INV-BBSR-001',
      targetStationId: 'OP-CTC-CITY',
      targetCaseId: caseId,
      reason: 'Cross-station phone log matching.',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ACCESS_REQUEST', payload: newReq });
  };

  // Trigger Mock Evidence Processing
  const handleProcessEvidence = (evidenceId) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'SET_PROCESSING', payload: false });
      dispatch({
        type: 'ADD_ALERT',
        payload: {
          id: 'ALT-' + Date.now(),
          type: 'CROSS_STATION_MATCH',
          message: `Vehicle entity OD-02-AB-4821 extracted from ${evidenceId}. Cross-station overlap detected.`,
          createdAt: new Date().toISOString(),
          isRead: false
        }
      });
      alert('AI processing completed. Entity extracted and Knowledge Network updated.');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto pb-12">
      {/* ─── Voice Assistant overlay feedback ─── */}
      {voiceStatus && (
        <div className="fixed inset-0 bg-bg/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-brand/10 border border-brand/40 text-brand rounded-full flex items-center justify-center animate-pulse">
            <Bot size={36} className="animate-bounce" />
          </div>
          <div className="text-sm font-mono text-brand uppercase tracking-wider font-bold animate-pulse">
            {voiceStatus === 'LISTENING' && '🎤 L I S T E N I N G . . .'}
            {voiceStatus === 'PROCESSING' && '⚡ P R O C E S S I N G . . .'}
            {voiceStatus === 'NAVIGATING' && '➡️ N A V I G A T I N G . . .'}
          </div>
          <p className="text-text text-sm font-semibold max-w-sm text-center">"{simulatedVoiceCommand}"</p>
        </div>
      )}

      {/* ─── Dashboard Identity Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft pb-4">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2.5">
            <Briefcase className="text-brand" size={24} /> {text.title}
          </h2>
          <p className="text-sm text-text-dim mt-1">
            {text.subtitle} · ID: <span className="font-mono font-bold text-text">{officerId}</span> · Status: <span className="text-success font-bold font-mono">{text.activeShift}</span>
          </p>
        </div>

        {/* Top Controls strip */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Simulated Voice Assistant command inputs */}
          <div className="flex items-center gap-1.5 bg-surface-2 border border-border-soft rounded-lg p-1.5">
            <span className="text-[9px] uppercase font-bold text-text-faint tracking-wider pl-1.5">Voice Command:</span>
            {[
              { label: 'Active', cmd: 'Show active cases', route: null, act: 'active' },
              { label: 'Network', cmd: 'Open Network Explorer', route: '/network', act: null },
              { label: 'Register FIR', cmd: 'Register new FIR', route: '/cases/new', act: null }
            ].map((vc, i) => (
              <button
                key={i}
                onClick={() => handleSimulateVoice(vc.cmd, vc.route, vc.act)}
                className="px-2 py-1 text-[9px] font-bold bg-surface hover:bg-surface-hover text-brand rounded border border-border-soft/60"
              >
                {vc.label}
              </button>
            ))}
          </div>

          {/* Multilingual toggles */}
          <div className="flex gap-0.5 bg-surface-2 p-0.5 rounded-lg border border-border-soft">
            {['EN', 'OD', 'KN', 'HI'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                  selectedLang === lang ? 'bg-surface text-brand font-extrabold' : 'text-text-dim hover:text-text'
                }`}
              >
                {lang === 'OD' ? 'ଓଡ଼ିଆ' : lang === 'KN' ? 'ಕರ್ನಾಟಕ' : lang === 'HI' ? 'हिंदी' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. PERSONAL KPI STRIP ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { title: text.activeCases, val: activeCasesCount, trend: 'Steady', pts: [12, 12, 12, 12, 12, 12] },
          { title: text.nearingDeadline, val: nearingDeadlineCount, trend: '↑ 1 urgent', pts: [2, 2, 3, 3, 3, 3], danger: true },
          { title: text.highPriority, val: highPriorityCount, trend: 'Steady', pts: [4, 4, 4, 4, 4, 4], danger: highPriorityCount > 3 },
          { title: text.evidencePending, val: evidencePendingCount, trend: '↑ 2 new', pts: [5, 6, 6, 7, 7, 7], highlight: true },
          { title: text.intelAlerts, val: intelAlertsCount, trend: '↑ 1 match', pts: [5, 5, 6, 6, 6, 6] },
          { title: text.unresolvedLinks, val: unresolvedLinksCount, trend: 'Steady', pts: [3, 3, 3, 3, 3, 3], highlight: true }
        ].map((k, i) => (
          <div key={i} className={`glass p-4 rounded-xl border border-border-soft flex flex-col justify-between min-h-[96px] ${
            k.danger ? 'border-danger/30 bg-danger/5' : k.highlight ? 'border-brand/30 bg-brand/5' : 'bg-surface'
          }`}>
            <div className="text-[9px] font-bold uppercase tracking-wider text-text-dim flex justify-between items-center">
              <span>{k.title}</span>
              <span className="text-[9px] font-bold text-text-faint">{k.trend}</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-display font-bold text-text">{k.val}</span>
              {renderSparkline(k.pts, k.danger ? 'var(--danger-bright)' : 'var(--brand)')}
            </div>
          </div>
        ))}
      </div>

      {/* ─── 4. "WHAT NEEDS MY ATTENTION?" PANEL ─── */}
      <div className="glass p-5 rounded-2xl bg-surface border border-danger/25 bg-danger/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-danger-bright mb-3 flex items-center gap-1.5">
          <ShieldAlert size={14} /> {text.attention}
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          {[
            { label: 'HIGH PRIORITY', cId: 'CR-KHD-2026-004821', desc: 'Cross-station relationship detected.', action: 'Review Network', onClick: () => navigate('/network') },
            { label: 'EVIDENCE REQUIRED', cId: 'CR-KHD-2026-004817', desc: '3 evidence items have not been processed.', action: 'Open Evidence Vault', onClick: () => navigate('/evidence') },
            { label: 'INVESTIGATION STALLED', cId: 'CR-KHD-2026-004799', desc: 'No activity for 6 days.', action: 'Resume Investigation', onClick: () => setSelectedFocusCaseId('OD-BBSR-2026-0001') },
            { label: 'LEGAL REVIEW', cId: 'CR-KHD-2026-004782', desc: 'AI detected possible additional BNS provisions.', action: 'Review Legal Intelligence', onClick: () => navigate('/legal') }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={item.onClick}
              className="p-3.5 bg-surface/60 border border-danger/15 rounded-xl cursor-pointer hover:border-danger hover:bg-danger/10 transition-all flex flex-col justify-between min-h-[88px]"
            >
              <div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-danger-bright">{item.label}</span>
                <div className="font-mono font-bold text-text mt-0.5">{item.cId}</div>
                <p className="text-[10px] text-text-dim mt-1 leading-snug">{item.desc}</p>
              </div>
              <span className="text-[9px] text-brand font-bold uppercase tracking-wider border-t border-border-soft/40 pt-1.5 mt-2 flex items-center gap-0.5">
                {item.action} <ChevronRight size={10} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main split view ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ─── 5. MY ACTIVE INVESTIGATIONS TABLE ─── */}
          <div className="glass rounded-xl p-5 bg-surface border border-border-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border-soft pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text">MY INVESTIGATIONS</h3>
                <p className="text-[10px] text-text-dim">Operational files assigned to your desk</p>
              </div>
              <div className="flex gap-1">
                {['ALL', 'ACTIVE', 'PENDING', 'OVERDUE', 'HIGH PRIORITY'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedCaseTab(t)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider border transition-colors ${
                      selectedCaseTab === t 
                        ? 'bg-brand text-bg border-brand' 
                        : 'bg-surface-2 text-text-dim hover:text-text border-border-soft'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="text-text-dim text-[9px] uppercase font-mono tracking-wider border-b border-border-soft pb-1.5">
                  <tr>
                    <th className="py-2">CASE</th>
                    <th className="py-2">CRIME</th>
                    <th className="py-2">PRIORITY</th>
                    <th className="py-2">PROGRESS</th>
                    <th className="py-2">LAST ACTIVITY</th>
                    <th className="py-2">INTELLIGENCE</th>
                    <th className="py-2">EVIDENCE</th>
                    <th className="py-2 text-right">NEXT ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft/40 font-mono">
                  {filteredCases.map(c => {
                    const progressPercent = c.id === 'OD-BBSR-2026-0001' ? dynamicProgressPercent : c.id === 'OD-BBSR-2026-0042' ? 43 : 54;
                    const evidenceRatio = c.id === 'OD-BBSR-2026-0001' ? '8/11' : c.id === 'OD-BBSR-2026-0042' ? '4/9' : '5/7';
                    const linkText = c.id === 'OD-BBSR-2026-0001' ? '3 links' : c.id === 'OD-BBSR-2026-0042' ? '2 links' : '1 link';
                    const actionText = c.id === 'OD-BBSR-2026-0001' ? 'Review Network' : c.id === 'OD-BBSR-2026-0042' ? 'Resume Investigation' : 'Process Evidence';

                    return (
                      <tr 
                        key={c.id}
                        onClick={() => {
                          setSelectedFocusCaseId(c.id);
                          navigate(`/cases/${c.id}`);
                        }}
                        className={`hover:bg-surface-hover/20 cursor-pointer transition-colors ${selectedFocusCaseId === c.id ? 'bg-brand/5' : ''}`}
                      >
                        <td className="py-3 px-1 font-bold text-text">{c.firNumber}</td>
                        <td className="py-3 px-1 font-sans text-text-dim">{c.crimeType}</td>
                        <td className="py-3 px-1">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] border font-bold uppercase ${
                            c.priority === 'CRITICAL' ? 'text-danger-bright bg-danger/10 border-danger/30' :
                            c.priority === 'HIGH' ? 'text-warning bg-warning/10 border-warning/30' :
                            'text-text-dim bg-surface border-border-soft'
                          }`}>{c.priority}</span>
                        </td>
                        <td className="py-3 px-1 font-sans">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-surface-2 rounded overflow-hidden border border-border-soft/40">
                              <div className="h-full bg-brand" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <span className="font-bold text-[10px]">{progressPercent}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-1 font-sans text-text-dim">
                          {c.id === 'OD-BBSR-2026-0001' ? '2h ago' : 'Yesterday'}
                        </td>
                        <td className="py-3 px-1 font-sans text-brand font-bold">{linkText}</td>
                        <td className="py-3 px-1 text-text-dim">{evidenceRatio}</td>
                        <td className="py-3 px-1 text-right font-sans text-brand font-bold text-[10px] group-hover:underline">{actionText}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── 6. INVESTIGATION PROGRESS TRACKER ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">INVESTIGATION STAGES STATUS</h3>
            
            <div className="grid grid-cols-8 gap-2 text-center text-[10px] font-mono">
              {[
                { stage: 'FIR', status: 'COMPLETED' },
                { stage: 'AI EXTRACTION', status: 'COMPLETED' },
                { stage: 'INITIAL ANALYSIS', status: 'COMPLETED' },
                { stage: 'EVIDENCE', status: 'COMPLETED' },
                { stage: 'NETWORK ANALYSIS', status: 'CURRENT' },
                { stage: 'FIELD INVESTIGATION', status: 'PENDING' },
                { stage: 'LEGAL REVIEW', status: 'PENDING' },
                { stage: 'CHARGE SHEET', status: 'PENDING' }
              ].map((st, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`h-6 w-6 rounded-full border flex items-center justify-center font-bold font-sans ${
                    st.status === 'COMPLETED' ? 'bg-success/15 border-success text-success' :
                    st.status === 'CURRENT' ? 'bg-brand/10 border-brand text-brand animate-pulse' :
                    'bg-surface border-border-soft text-text-faint'
                  }`}>
                    {st.status === 'COMPLETED' ? '✓' : st.status === 'CURRENT' ? '●' : '○'}
                  </div>
                  <span className="text-[8px] font-bold uppercase text-text-dim block max-w-[64px] mx-auto leading-tight">{st.stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 10. EVIDENCE WORK QUEUE ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">EVIDENCE WORK QUEUE</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="border-b border-border-soft text-text-dim text-[9px] uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-2">Evidence ID</th>
                    <th className="py-2">Case Context</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Uploaded At</th>
                    <th className="py-2 text-center">AI Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft/40 font-mono">
                  {[
                    { id: 'Evidence #07', cId: 'CR-KHD-004821', type: 'Vehicle Document', date: 'Today', status: 'Processed' },
                    { id: 'Evidence #08', cId: 'CR-KHD-004821', type: 'CCTV Image', date: 'Today', status: 'Processing' },
                    { id: 'Evidence #11', cId: 'CR-KHD-004817', type: 'PDF Document', date: 'Yesterday', status: 'Pending' }
                  ].map((e, idx) => (
                    <tr key={idx} className="hover:bg-surface-hover/10 transition-colors">
                      <td className="py-2.5 px-1 font-bold text-text">{e.id}</td>
                      <td className="py-2.5 px-1 text-text-dim">{e.cId}</td>
                      <td className="py-2.5 px-1 font-sans text-text-dim">{e.type}</td>
                      <td className="py-2.5 px-1 font-sans text-text-faint">{e.date}</td>
                      <td className="py-2.5 px-1 text-center font-sans">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          e.status === 'Processed' ? 'text-success bg-success/5 border-success/20' :
                          e.status === 'Processing' ? 'text-brand bg-brand/5 border-brand/20 animate-pulse' :
                          'text-warning bg-warning/5 border-warning/20'
                        }`}>{e.status}</span>
                      </td>
                      <td className="py-2.5 px-1 text-right font-sans space-x-1.5">
                        <button 
                          onClick={() => handleProcessEvidence(e.id)}
                          className="px-2 py-0.5 text-[9px] font-bold bg-brand text-bg rounded hover:bg-brand-bright transition-colors"
                        >
                          Process
                        </button>
                        <button 
                          onClick={() => alert(`Viewing ${e.id}...`)}
                          className="px-2 py-0.5 text-[9px] font-bold bg-surface-2 border border-border text-text rounded hover:bg-surface-hover"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right sidebar column */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text mb-2">INVESTIGATOR QUICK ACTIONS</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {[
                { label: 'Register FIR', route: '/cases/new', icon: Plus },
                { label: 'Upload Evidence', route: '/evidence', icon: FileText },
                { label: 'Open Network', route: '/network', icon: Compass },
                { label: 'Similar Cases', route: '/legal', icon: Scale },
                { label: 'Legal Intelligence', route: '/legal', icon: Scale },
                { label: 'AI Assistant', route: '/assistant', icon: Sparkles },
                { label: 'My Cases', route: '/cases', icon: Search }
              ].map((act, i) => (
                <button
                  key={i}
                  onClick={() => navigate(act.route)}
                  className="p-2.5 bg-surface-2 border border-border-soft hover:border-brand rounded-lg text-left transition-all flex flex-col justify-between h-16 group"
                >
                  <act.icon size={14} className="text-brand group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-text-dim mt-2 block">{act.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── 7. NEXT BEST ACTION / GUIDANCE ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-brand/30 bg-brand/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
              <Sparkles size={14} className="animate-spin" /> {text.guidance}
            </h3>
            <p className="text-xs font-semibold text-text leading-relaxed">
              "Investigate the vehicle registration associated with the mobile number identified in Evidence #04."
            </p>
            <div className="text-[10px] text-text-dim leading-snug">
              <strong>Rationale:</strong> The same entity appears in two related cases across Odisha stations.
            </div>
            <div className="flex items-center justify-between border-t border-border-soft/40 pt-2.5 text-[9px] font-mono text-text-faint">
              <span>Confidence match: <strong>91%</strong></span>
              <button 
                onClick={() => handleSimulateVoice("Open case network explorer", "/network")}
                className="text-brand font-bold hover:underline"
              >
                Open Network
              </button>
            </div>
          </div>

          {/* ─── 8. INTELLIGENCE DISCOVERIES FEED ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text border-b border-border-soft pb-2">
              NEW INTELLIGENCE DISCOVERIES
            </h3>
            
            <div className="space-y-3 text-xs">
              {/* Card 1 */}
              <div className="p-3 bg-surface-2 border border-border-soft rounded-lg space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-danger-bright bg-danger/10 border border-danger/25 px-1.5 py-0.5 rounded">
                  <span>CROSS-STATION MATCH</span>
                  <span>94% CONFIDENCE</span>
                </div>
                <div className="font-semibold text-text">Mobile number +91 XXXXX XXXXX matched case CR-CTC-2026-00981.</div>
                <div className="flex justify-between items-center border-t border-border-soft/30 pt-2">
                  <span className="text-[8px] font-mono uppercase text-text-faint">Status: Restricted</span>
                  <button 
                    onClick={() => handleRequestAccess('OD-CTC-2026-00981')}
                    className="bg-brand text-bg px-2.5 py-1 rounded text-[9px] font-bold hover:bg-brand-bright transition-colors"
                  >
                    Request Access
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3 bg-surface-2 border border-border-soft rounded-lg space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand bg-brand/10 border border-brand/25 px-1.5 py-0.5 rounded">
                  <span>SIMILAR CASE</span>
                  <span>87% SIMILARITY</span>
                </div>
                <div className="font-semibold text-text">Burglary patterns resolved to CR-KHD-2025-00812 local case.</div>
                <button 
                  onClick={() => navigate('/legal')}
                  className="w-full bg-surface border border-border py-1 text-[9px] font-bold text-text hover:bg-surface-hover rounded transition-colors text-center"
                >
                  Compare Case
                </button>
              </div>
            </div>
          </div>

          {/* ─── 9. CASE KNOWLEDGE GRAPH GRAPH PREVIEW ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center justify-between border-b border-border-soft pb-2">
              <span>CASE KNOWLEDGE GRAPH</span>
              <span className="text-[9px] font-mono text-brand font-bold">CR-KHD-004821</span>
            </h3>

            {/* SVG graph preview */}
            <div className="h-32 bg-surface-2 border border-border-soft rounded-lg p-2 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 120">
                {/* Node coordinates */}
                {/* Local Case node */}
                <circle cx="100" cy="60" r="10" fill="var(--brand)" />
                <text x="100" y="75" fontSize="7" fill="var(--text)" textAnchor="middle" fontWeight="bold">CR-KHD-4821</text>
                
                {/* Entity nodes */}
                <circle cx="50" cy="30" r="8" fill="var(--accent-bright)" />
                <circle cx="150" cy="30" r="8" fill="var(--accent-bright)" />
                <circle cx="100" cy="100" r="8" fill="var(--accent-bright)" />
                
                {/* Locked node */}
                <circle cx="170" cy="80" r="8" fill="grey" className="animate-pulse" />
                <text x="170" y="93" fontSize="6" fill="var(--danger-bright)" textAnchor="middle">🔒 Locked</text>

                {/* Edges */}
                <line x1="100" y1="60" x2="50" y2="30" stroke="var(--border-soft)" strokeWidth="1" />
                <line x1="100" y1="60" x2="150" y2="30" stroke="var(--border-soft)" strokeWidth="1" />
                <line x1="100" y1="60" x2="100" y2="100" stroke="var(--border-soft)" strokeWidth="1" />
                <line x1="150" y1="30" x2="170" y2="80" stroke="var(--danger)" strokeDasharray="3 3" />
              </svg>
              <div className="absolute top-2 right-2 text-[8px] font-mono font-bold text-danger-bright bg-danger/10 px-1 py-0.5 rounded border border-danger/25">🔒 CR-CTC-00981 LOCKED</div>
            </div>

            <button 
              onClick={() => navigate('/network')}
              className="w-full bg-brand text-bg py-2 rounded-lg text-xs font-bold hover:bg-brand-bright transition-colors uppercase tracking-wider text-center"
            >
              Open Network Explorer
            </button>
          </div>

          {/* ─── 12. INVESTIGATION TASKS CHECKLIST ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-4">
            <div className="border-b border-border-soft pb-2 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">{text.tasks}</h3>
              <span className="text-[10px] font-mono font-bold text-brand">{completedTasksCount} / {totalTasksCount} Completed</span>
            </div>

            {/* Checklist */}
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {tasksList.filter(t => t.caseId === selectedFocusCaseId).map(t => (
                <div key={t.id} className="flex items-center justify-between text-xs p-1 hover:bg-surface-hover/10 rounded transition-colors">
                  <label className="flex items-center gap-2 cursor-pointer text-text-dim font-medium select-none">
                    <input 
                      type="checkbox" 
                      checked={t.completed} 
                      onChange={() => handleToggleTask(t.id)} 
                      className="rounded border-border bg-surface-2 focus:ring-brand h-3.5 w-3.5"
                    />
                    <span className={t.completed ? 'line-through text-text-faint' : ''}>{t.label}</span>
                  </label>
                  <button 
                    onClick={() => handleDeleteTask(t.id)}
                    className="text-text-faint hover:text-danger-bright transition-colors ml-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Add Task input */}
            <form onSubmit={handleAddTask} className="flex gap-1.5 pt-2 border-t border-border-soft/40">
              <input 
                type="text" 
                placeholder="New task lead..." 
                value={newTaskInput} 
                onChange={e => setNewTaskInput(e.target.value)} 
                className="flex-1 bg-surface-2 border border-border rounded p-2 text-xs text-text outline-none focus:border-brand"
              />
              <button type="submit" className="bg-brand text-bg px-3 py-2 rounded text-xs font-bold hover:bg-brand-bright">Add</button>
            </form>
          </div>

          {/* ─── 13. INVESTIGATION NOTES ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-4">
            <div className="border-b border-border-soft pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">{text.notes}</h3>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {notesList.filter(n => n.caseId === selectedFocusCaseId).map(n => (
                <div key={n.id} className="p-2 bg-surface-2 border border-border-soft/40 rounded-lg text-xs space-y-1">
                  <p className="text-text leading-relaxed">{n.text}</p>
                  <span className="text-[8px] text-text-faint block font-mono font-bold uppercase">{n.createdAt}</span>
                </div>
              ))}
            </div>

            {/* Add Note Input */}
            <form onSubmit={handleAddNote} className="flex flex-col gap-1.5 pt-2 border-t border-border-soft/40">
              <textarea
                placeholder="Observation or investigative lead notes..."
                value={newNoteInput}
                onChange={e => setNewNoteInput(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded p-2 text-xs text-text outline-none focus:border-brand h-16 resize-none"
              />
              <button type="submit" className="bg-brand text-bg py-1.5 rounded text-xs font-bold hover:bg-brand-bright transition-colors uppercase tracking-wider">Save Note</button>
            </form>
          </div>

          {/* ─── 14. LEGAL RECOMMENDED PROVISIONS ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text border-b border-border-soft pb-2">
              LEGAL PROVISIONS RECOMMENDATION
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-brand/5 border border-brand/20 rounded-lg">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand uppercase mb-1">
                  <span>PRIMARY APPLICABLE SECTON</span>
                  <span>89% MATCH</span>
                </div>
                <div className="font-bold text-text">BNS Section 305</div>
                <p className="text-[10px] text-text-dim mt-1 leading-snug">Theft in dwelling house, means of transportation, or place of storage.</p>
              </div>

              <div className="text-[9px] uppercase font-bold text-text-faint tracking-wider pt-1.5">Common Co-Provisions</div>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                {['BNS 303', 'BNS 316', 'BNS 317'].map(bns => (
                  <div 
                    key={bns} 
                    onClick={() => navigate('/legal')}
                    className="p-1.5 bg-surface-2 border border-border-soft hover:border-brand rounded cursor-pointer text-[10px] text-text font-bold"
                    title={
                      bns === 'BNS 303' ? 'Punishment for theft' : 
                      bns === 'BNS 316' ? 'Criminal breach of trust' : 'Receiving stolen property'
                    }
                  >
                    {bns}
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => navigate('/legal')}
              className="w-full bg-surface border border-border hover:bg-surface-hover py-2 rounded-lg text-xs font-bold text-text transition-colors uppercase tracking-wider text-center block mt-2"
            >
              Open Legal Intelligence
            </button>
          </div>

          {/* ─── 16. AI INVESTIGATION ASSISTANT ON DASHBOARD ─── */}
          <div className="glass p-5 rounded-xl bg-surface border border-border-soft space-y-4">
            <div className="border-b border-border-soft pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1">
                <Sparkles size={13} className="text-brand animate-pulse" /> ASK CRIMELENS AI
              </h3>
            </div>

            {/* Replies log */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 text-xs">
              {aiAssistantReplies.map((r, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="bg-brand/5 border border-brand/20 p-2.5 rounded-lg text-xs leading-relaxed text-text font-medium">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-brand block mb-1">Prompt Query:</span>
                    "{r.query}"
                  </div>
                  <div className="p-2.5 bg-surface-2 border border-border-soft/60 rounded-lg text-xs leading-relaxed text-text-dim font-medium">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-text-faint block mb-1">CrimeLens AI Engine:</span>
                    {r.reply}
                    {r.buttons && r.buttons.length > 0 && (
                      <div className="flex gap-1.5 mt-2 border-t border-border-soft/30 pt-2">
                        {r.buttons.map((b, idx) => (
                          <button
                            key={idx}
                            onClick={() => navigate(b.route)}
                            className="bg-brand text-bg px-2.5 py-1 rounded text-[9px] font-bold hover:bg-brand-bright transition-colors"
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested prompts list */}
            <div className="flex flex-wrap gap-1">
              {[
                "What should I investigate next?",
                "Are there similar cases?",
                "What BNS provisions may apply?"
              ].map((sp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendAiQuery(sp)}
                  className="px-2 py-0.5 text-[8px] font-bold rounded bg-surface-2 border border-border-soft hover:border-brand text-text-dim transition-colors"
                >
                  "{sp}"
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex gap-1.5">
              <input 
                type="text" 
                placeholder="Ask CrimeLens AI Assistant..." 
                value={aiAssistantQuery} 
                onChange={e => setAiAssistantQuery(e.target.value)} 
                className="flex-1 bg-surface-2 border border-border rounded p-2 text-xs text-text outline-none focus:border-brand"
              />
              <button 
                onClick={() => handleSendAiQuery()}
                className="bg-brand text-bg px-3.5 py-2 rounded text-xs font-bold hover:bg-brand-bright transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Main Routing Router Component ───────────────────────────────────────────
export function CommandCenter() {
  const { state } = useMockState();
  const role = state.currentUser?.role;

  if (role === 'SUPER_ADMIN') return <SuperAdminDashboard />;
  if (role === 'STATION_ADMIN') return <IICDashboard />;
  return <CopDashboard />;
}
