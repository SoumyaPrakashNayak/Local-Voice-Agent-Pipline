import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, FileText, ChevronRight, AlertTriangle, ShieldCheck,
  Building, Calendar, User, Tag, Lock, CheckCircle2, SlidersHorizontal,
  Download, ArrowUpDown, LayoutGrid, List, Sparkles, RefreshCw
} from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { useLanguage } from '../context/LanguageContext';
import { CaseRecord } from '../mockServices/types';

export function CaseSearch() {
  const { state } = useMockState();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Search filter criteria
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState('ALL');
  const [selectedCrimeType, setSelectedCrimeType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'fir'>('date');

  const role = state.currentUser?.role;

  // Filter dynamic dataset
  const filteredCases = useMemo(() => {
    return state.cases.filter(c => {
      // Free text search across FIR, Title, Description, CrimeType, and Entity values
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesFIR = c.firNumber.toLowerCase().includes(query);
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        const matchesCrime = c.crimeType.toLowerCase().includes(query);
        const matchesEntities = c.entities?.some(e => e.value.toLowerCase().includes(query) || e.type.toLowerCase().includes(query));

        if (!matchesFIR && !matchesTitle && !matchesDesc && !matchesCrime && !matchesEntities) {
          return false;
        }
      }

      // Station filter
      if (selectedStation !== 'ALL' && c.stationId !== selectedStation) {
        return false;
      }

      // Crime category filter
      if (selectedCrimeType !== 'ALL' && !c.crimeType.toLowerCase().includes(selectedCrimeType.toLowerCase())) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && c.status !== selectedStatus) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [state.cases, searchTerm, selectedStation, selectedCrimeType, selectedStatus, selectedPriority]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStation('ALL');
    setSelectedCrimeType('ALL');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    setSelectedDateRange('ALL');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand/10 text-brand px-2 py-0.5 rounded border border-brand/30">
              STATE CASE REGISTRY
            </span>
            <span className="text-[10px] font-mono text-text-dim">
              {filteredCases.length} records matching
            </span>
          </div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
            <Search className="text-brand" size={24} /> {t('nav.caseSearch', 'Case Search & Intelligence Registry')}
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Multi-field investigation query across FIRs, extracted entities, suspects, and state police records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-surface-2 p-0.5 rounded-lg border border-border-soft">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-surface text-brand font-bold shadow-sm' : 'text-text-dim hover:text-text'}`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded text-xs transition-colors ${viewMode === 'grid' ? 'bg-surface text-brand font-bold shadow-sm' : 'text-text-dim hover:text-text'}`}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Criteria Search Panel */}
      <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4 shadow-sm">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" size={18} />
          <input
            type="text"
            placeholder="Search by FIR number, suspect name, vehicle plate, phone number, location, keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-border-soft rounded-xl pl-11 pr-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-brand outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text text-xs bg-surface px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Selects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Station Filter */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1">Police Station</label>
            <select
              value={selectedStation}
              onChange={e => setSelectedStation(e.target.value)}
              className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2.5 outline-none cursor-pointer focus:border-brand"
            >
              <option value="ALL">All Stations</option>
              {state.stations.map(st => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>

          {/* Crime Category */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1">Crime Classification</label>
            <select
              value={selectedCrimeType}
              onChange={e => setSelectedCrimeType(e.target.value)}
              className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2.5 outline-none cursor-pointer focus:border-brand"
            >
              <option value="ALL">All Categories</option>
              <option value="Theft">Theft & Snatching</option>
              <option value="Burglary">Burglary & House-Breaking</option>
              <option value="Robbery">Armed Robbery</option>
              <option value="Assault">Assault & Violent Crime</option>
              <option value="Cyber">Cybercrime & Fraud</option>
            </select>
          </div>

          {/* Case Status */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1">Investigation Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2.5 outline-none cursor-pointer focus:border-brand"
            >
              <option value="ALL">All Statuses</option>
              <option value="INVESTIGATING">Investigating (Active)</option>
              <option value="PENDING">Pending Intake</option>
              <option value="SOLVED">Solved / Charged</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-text-faint tracking-wider mb-1">Case Priority</label>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full bg-surface-2 border border-border text-xs text-text rounded-lg p-2.5 outline-none cursor-pointer focus:border-brand"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="NORMAL">Normal Priority</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full bg-surface-2 hover:bg-surface-hover border border-border-soft text-text-dim hover:text-text rounded-lg py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Summary & Views */}
      {viewMode === 'table' ? (
        <div className="glass rounded-xl bg-surface border border-border-soft overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-2 border-b border-border-soft text-text-dim text-[10px] uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-4">FIR Number</th>
                  <th className="py-3 px-4">Crime Classification</th>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Key Entities</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft/40 font-mono">
                {filteredCases.map(c => {
                  const station = state.stations.find(s => s.id === c.stationId)?.name || c.stationId;
                  const isLocal = c.stationId === state.currentUser?.stationId;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="hover:bg-surface-hover/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-bold text-accent-bright">
                        {c.firNumber}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-semibold text-text">{c.title}</div>
                        <div className="text-[10px] text-text-dim line-clamp-1">{c.crimeType}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-text-dim text-xs">
                        {station}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          c.priority === 'CRITICAL' ? 'text-danger-bright bg-danger/10 border-danger/30' :
                          c.priority === 'HIGH' ? 'text-warning bg-warning/10 border-warning/30' :
                          'text-text-dim bg-surface-2 border-border-soft'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          c.status === 'SOLVED' ? 'text-success bg-success/10 border-success/30' :
                          c.status === 'INVESTIGATING' ? 'text-brand bg-brand/10 border-brand/30' :
                          'text-text-dim bg-surface-2 border-border-soft'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {c.entities && c.entities.slice(0, 2).map((ent, i) => (
                            <span key={i} className="bg-surface-2 border border-border-soft px-1.5 py-0.5 rounded text-[9px] text-text-dim">
                              {ent.value}
                            </span>
                          ))}
                          {c.entities && c.entities.length > 2 && (
                            <span className="text-[9px] text-text-faint">+{c.entities.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-brand font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform font-sans">
                          Inspect <ChevronRight size={14} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map(c => {
            const station = state.stations.find(s => s.id === c.stationId)?.name || c.stationId;
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="glass p-5 rounded-2xl bg-surface border border-border-soft hover:border-brand transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-accent-bright bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                      {c.firNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      c.priority === 'CRITICAL' ? 'text-danger-bright bg-danger/10 border-danger/30' :
                      c.priority === 'HIGH' ? 'text-warning bg-warning/10 border-warning/30' :
                      'text-text-dim bg-surface-2 border-border-soft'
                    }`}>
                      {c.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-text text-base group-hover:text-brand transition-colors line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-text-dim mt-1.5 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-soft space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-dim">
                    <span>{station}</span>
                    <span className="text-brand font-bold">{c.status}</span>
                  </div>

                  {c.entities && c.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {c.entities.slice(0, 3).map((ent, i) => (
                        <span key={i} className="bg-surface-2 border border-border-soft px-1.5 py-0.5 rounded text-[9px] font-mono text-text-dim">
                          {ent.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredCases.length === 0 && (
        <div className="glass p-12 rounded-2xl text-center text-text-dim flex flex-col items-center justify-center border-dashed">
          <Search size={36} className="mb-4 text-brand/40 animate-pulse" />
          <p className="text-lg font-bold text-text">No matching case records found.</p>
          <p className="text-xs text-text-dim mt-1 max-w-sm">
            Try adjusting your keyword query or resetting station and classification filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-brand text-bg font-bold rounded-lg text-xs hover:bg-brand-bright transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
