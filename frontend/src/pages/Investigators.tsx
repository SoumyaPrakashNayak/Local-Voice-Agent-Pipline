import React, { useState } from 'react';
import { Users, Plus, Search, Shield, Briefcase } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { User } from '../mockServices/types';

export function Investigators() {
  const { state, dispatch } = useMockState();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    id: '',
    role: 'OFFICER',
    status: 'ACTIVE',
    rank: 'Sub-Inspector'
  });

  const myStationId = state.currentUser?.stationId;

  if (state.currentUser?.role !== 'STATION_ADMIN') {
    return <div className="p-8 text-danger-bright font-bold">UNAUTHORIZED ACCESS</div>;
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.id) return;

    dispatch({ 
      type: 'ADD_USER', 
      payload: { ...newUser, stationId: myStationId } as User 
    });
    
    setShowModal(false);
    setNewUser({ name: '', id: '', role: 'OFFICER', status: 'ACTIVE', rank: 'Sub-Inspector' });
  };

  const stationOfficers = state.users.filter(u => u.stationId === myStationId && (u.role === 'OFFICER' || u.role === 'STATION_ADMIN'));
  
  const filteredOfficers = stationOfficers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
            <Users className="text-brand" /> Station Personnel
          </h2>
          <p className="text-sm text-text-dim mt-1">Manage investigators and officers for Station {myStationId}.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
            <input 
              type="text" 
              placeholder="Search personnel..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-surface border border-border-soft rounded-lg pl-9 pr-4 py-2 text-sm text-text focus:border-brand outline-none w-64"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-brand text-bg px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-bright transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Investigator
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 border-b border-border-soft text-text-dim text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Officer Name</th>
                <th className="p-4 font-semibold">Officer ID</th>
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Active Workload</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {filteredOfficers.map(officer => {
                const activeWorkload = state.cases.filter(c => c.investigatorId === officer.id && c.status === 'INVESTIGATING').length;
                
                return (
                  <tr key={officer.id} className="hover:bg-surface-hover transition-colors group">
                    <td className="p-4 font-bold text-text flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-brand/20 text-brand flex items-center justify-center text-xs">
                        {officer.name.charAt(0)}
                      </div>
                      {officer.name}
                    </td>
                    <td className="p-4 font-mono text-text-dim text-xs">{officer.id}</td>
                    <td className="p-4 text-text"><Shield size={14} className="inline mr-1 text-text-faint" />{officer.rank}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ${officer.role === 'STATION_ADMIN' ? 'bg-accent/20 text-accent-bright border border-accent/30' : 'bg-surface-2 text-text-dim border border-border'}`}>
                        {officer.role}
                      </span>
                    </td>
                    <td className="p-4 text-text flex items-center gap-1">
                      <Briefcase size={14} className="text-brand mr-1" />
                      {activeWorkload} Cases
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${officer.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger-bright'}`}>
                        {officer.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface border border-border-soft rounded-2xl w-full max-w-lg shadow-glass overflow-hidden">
            <div className="p-6 border-b border-border-soft flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-text flex items-center gap-2">
                <Users className="text-brand" size={20} /> Add Station Personnel
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-dim hover:text-text">&times;</button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-dim uppercase mb-1">Officer Full Name</label>
                  <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-surface-2 border border-border rounded p-2 text-sm text-text outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-dim uppercase mb-1">Officer ID / Login ID</label>
                  <input required type="text" value={newUser.id} onChange={e => setNewUser({...newUser, id: e.target.value})} className="w-full bg-surface-2 border border-border rounded p-2 text-sm text-text outline-none font-mono focus:border-brand" placeholder="e.g. INV-019" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-dim uppercase mb-1">Rank</label>
                  <select value={newUser.rank} onChange={e => setNewUser({...newUser, rank: e.target.value})} className="w-full bg-surface-2 border border-border rounded p-2 text-sm text-text outline-none focus:border-brand">
                    <option value="Inspector">Inspector</option>
                    <option value="Sub-Inspector">Sub-Inspector</option>
                    <option value="Asst. Sub-Inspector">Asst. Sub-Inspector</option>
                    <option value="Constable">Constable</option>
                  </select>
                </div>
                <div className="col-span-2 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                  <p className="text-xs text-danger-bright font-mono">TEMPORARY PASSWORD WILL BE GENERATED AS: Demo@123</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-text-dim hover:text-text">Cancel</button>
                <button type="submit" className="bg-brand text-bg px-6 py-2 rounded-lg font-bold text-sm hover:bg-brand-bright">Add Investigator</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
