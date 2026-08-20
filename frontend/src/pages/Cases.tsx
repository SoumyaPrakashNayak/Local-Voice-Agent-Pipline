import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { CaseRecord } from '../mockServices/types';

export function Cases() {
  const { state } = useMockState();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  const role = state.currentUser?.role;
  const stationId = state.currentUser?.stationId;

  // Determine what cases to show based on role
  let visibleCases = state.cases;
  if (role === 'OFFICER') {
    visibleCases = state.cases.filter(c => c.stationId === stationId);
  } else if (role === 'STATION_ADMIN') {
    visibleCases = state.cases.filter(c => c.stationId === stationId);
  } // SUPER_ADMIN sees all

  const filteredCases = visibleCases.filter(c => {
    const matchesSearch = c.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) || c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
            <FileText className="text-brand" /> 
            {role === 'SUPER_ADMIN' ? 'Statewide Case Directory' : `Station Cases: ${stationId}`}
          </h2>
          <p className="text-sm text-text-dim mt-1">Browse, search, and filter investigation records.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
            <input 
              type="text" 
              placeholder="Search FIR or Title..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-surface border border-border-soft rounded-lg pl-9 pr-4 py-2 text-sm text-text focus:border-brand outline-none w-64"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-surface border border-border-soft rounded-lg px-4 py-2 text-sm text-text outline-none focus:border-brand appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="SOLVED">Solved</option>
            <option value="CLOSED">Closed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredCases.map(c => (
          <div 
            key={c.id} 
            onClick={() => navigate(`/cases/${c.id}`)}
            className="glass p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-brand transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm font-bold text-accent-bright bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  {c.firNumber}
                </span>
                {c.priority === 'CRITICAL' && (
                  <span className="flex items-center gap-1 text-[10px] text-danger-bright bg-danger/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    <AlertTriangle size={12} /> High Risk
                  </span>
                )}
                {c.status === 'SOLVED' && (
                  <span className="flex items-center gap-1 text-[10px] text-success bg-success/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    <ShieldCheck size={12} /> Solved
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-text group-hover:text-brand transition-colors">{c.title}</h3>
              <p className="text-sm text-text-dim mt-1 line-clamp-1">{c.description}</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-text-dim">
              <div className="hidden md:block">
                <div className="text-[10px] uppercase tracking-wider font-bold mb-1">Crime Type</div>
                <div className="text-text">{c.crimeType}</div>
              </div>
              {role === 'SUPER_ADMIN' && (
                <div className="hidden md:block">
                  <div className="text-[10px] uppercase tracking-wider font-bold mb-1">Station</div>
                  <div className="text-text font-mono text-xs">{c.stationId}</div>
                </div>
              )}
              <div className="hidden md:block text-right">
                <div className="text-[10px] uppercase tracking-wider font-bold mb-1">Status</div>
                <div className="text-text font-mono text-xs">{c.status}</div>
              </div>
              <ChevronRight className="text-border-soft group-hover:text-brand transition-colors" />
            </div>
          </div>
        ))}
        {filteredCases.length === 0 && (
          <div className="glass p-12 rounded-xl text-center text-text-dim flex flex-col items-center justify-center border-dashed">
            <Search size={32} className="mb-4 text-border" />
            <p className="text-lg font-bold">No cases found.</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
