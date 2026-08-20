import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, FileText, Search, Activity, Lock, Users, MapPin, Building, Briefcase } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';

export function CommandCenter() {
  const { state } = useMockState();
  const role = state.currentUser?.role;

  if (role === 'SUPER_ADMIN') return <SuperAdminDashboard />;
  if (role === 'STATION_ADMIN') return <IICDashboard />;
  return <CopDashboard />;
}

function SuperAdminDashboard() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();
  
  const totalCases = state.cases.length;
  const activeCases = state.cases.filter(c => c.status === 'INVESTIGATING').length;
  const activeAlerts = state.alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-text font-display">State Command Center</h2>
        <p className="text-sm text-text-dim mt-1">Statewide Police Headquarters Overview</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Police Stations" value={state.stations.length} icon={Building} />
        <StatCard title="Statewide Active Cases" value={activeCases} icon={Briefcase} />
        <StatCard title="Intelligence Alerts" value={activeAlerts} icon={ShieldAlert} danger />
        <StatCard title="State Network Engine" value="ONLINE" icon={Activity} highlight />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass p-6 rounded-xl flex flex-col items-center justify-center min-h-[300px] border border-border-soft bg-surface/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--brand) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <MapPin size={48} className="text-brand/30 mb-4" />
          <h3 className="text-lg font-bold text-text-dim uppercase tracking-wider">Statewide Jurisdiction Map</h3>
          <p className="text-sm text-text-faint mt-2 max-w-sm text-center">Visual map representation of active hotspots and cross-station linkages across Karnataka.</p>
        </div>

        <div className="glass rounded-xl flex flex-col border border-border-soft">
          <div className="p-4 border-b border-border-soft font-bold text-sm uppercase tracking-wider text-text-dim">
            High-Risk Stations
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {state.stations.slice(0, 4).map(s => {
               const stCases = state.cases.filter(c => c.stationId === s.id && c.status === 'INVESTIGATING').length;
               return (
                <div key={s.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-border-soft">
                  <div>
                    <div className="font-bold text-sm text-text">{s.name}</div>
                    <div className="text-xs text-text-dim font-mono">{s.id}</div>
                  </div>
                  <div className="text-danger-bright font-bold">{stCases} Cases</div>
                </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function IICDashboard() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();
  const myStationId = state.currentUser?.stationId;

  const stationCases = state.cases.filter(c => c.stationId === myStationId);
  const activeCases = stationCases.filter(c => c.status === 'INVESTIGATING').length;
  const pendingRequests = state.accessRequests.filter(r => r.targetStationId === myStationId && r.status === 'PENDING').length;
  const unreadAlerts = state.alerts.filter(a => !a.isRead && stationCases.some(c => c.id === a.relatedCaseId)).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text font-display">Station Command Center</h2>
          <p className="text-sm text-text-dim mt-1">{state.stations.find(s=>s.id===myStationId)?.name} [{myStationId}]</p>
        </div>
        <button onClick={() => navigate('/cases/new')} className="bg-brand text-bg px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <FileText size={16} /> Register FIR
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Station Active Cases" value={activeCases} icon={Briefcase} />
        <StatCard title="Cases Solved" value={stationCases.filter(c=>c.status==='SOLVED').length} icon={ShieldAlert} />
        <StatCard title="Pending Requests" value={pendingRequests} icon={Lock} highlight={pendingRequests > 0} />
        <StatCard title="Station Alerts" value={unreadAlerts} icon={Activity} danger={unreadAlerts > 0} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl flex flex-col">
          <div className="p-4 border-b border-border-soft font-bold text-sm uppercase text-text-dim">Recent Station FIRs</div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {stationCases.slice(0, 5).map(c => (
              <div key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="p-3 border border-border-soft rounded-lg cursor-pointer hover:border-brand">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm text-text">{c.firNumber}</div>
                  <div className="text-[10px] bg-accent/20 text-accent-bright px-2 py-0.5 rounded font-mono">{c.status}</div>
                </div>
                <div className="text-xs text-text-dim">{c.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl flex flex-col border-accent/30">
          <div className="p-4 border-b border-border-soft font-bold text-sm uppercase text-accent-bright">Officer Workload</div>
          <div className="p-4 flex-1 space-y-3">
            {state.users.filter(u => u.stationId === myStationId && u.role === 'OFFICER').map(u => {
              const count = stationCases.filter(c => c.investigatorId === u.id && c.status === 'INVESTIGATING').length;
              return (
                <div key={u.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">{u.name[0]}</div>
                    <div>
                      <div className="font-bold text-sm text-text">{u.name}</div>
                      <div className="text-[10px] text-text-dim font-mono">{u.id}</div>
                    </div>
                  </div>
                  <div className="font-bold text-accent-bright">{count} Cases</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CopDashboard() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();
  
  const myCases = state.cases.filter(c => c.investigatorId === state.currentUser?.id);
  const activeCases = myCases.filter(c => c.status === 'INVESTIGATING').length;
  const unreadAlerts = state.alerts.filter(a => !a.isRead && myCases.some(c => c.id === a.relatedCaseId)).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text font-display">Investigation Command Center</h2>
          <p className="text-sm text-text-dim mt-1">Officer {state.currentUser?.name} • Station {state.currentUser?.stationId}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="My Active Investigations" value={activeCases} icon={Briefcase} />
        <StatCard title="Cases Solved" value={myCases.filter(c=>c.status==='SOLVED').length} icon={ShieldAlert} />
        <StatCard title="New Intelligence Discoveries" value={unreadAlerts} icon={Activity} danger={unreadAlerts > 0} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl flex flex-col">
          <div className="p-4 border-b border-border-soft font-bold text-sm uppercase text-text-dim">My Active Cases</div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[300px]">
            {myCases.map(c => (
              <div key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="p-4 border border-border-soft rounded-lg cursor-pointer hover:border-accent-bright bg-surface">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm text-text">{c.firNumber}</div>
                  <div className="text-[10px] bg-accent/20 text-accent-bright px-2 py-0.5 rounded font-mono">{c.status}</div>
                </div>
                <div className="text-sm text-text-dim mb-3 line-clamp-1">{c.title}</div>
                <div className="flex items-center gap-4 text-xs font-bold text-text-faint">
                  <span className="flex items-center gap-1"><Search size={14}/> {c.entities.length} Entities</span>
                </div>
              </div>
            ))}
            {myCases.length === 0 && <div className="text-center text-text-dim p-8">No assigned cases.</div>}
          </div>
        </div>

        <div className="glass rounded-xl border-danger/30 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl pointer-events-none" />
          <div className="p-4 border-b border-border-soft flex items-center justify-between">
            <div className="font-bold text-sm uppercase tracking-wider text-danger-bright">Action Required (Intelligence)</div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[300px]">
            {state.alerts.filter(a => myCases.some(c=>c.id===a.relatedCaseId)).map(a => (
              <div key={a.id} className="p-4 border border-danger/40 bg-danger/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm text-danger-bright flex items-center gap-2">
                    <ShieldAlert size={16} /> {a.type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[10px] text-text-dim">{new Date(a.createdAt).toLocaleTimeString()}</div>
                </div>
                <p className="text-xs text-text mb-4">{a.message}</p>
                <div className="flex gap-2">
                  <button onClick={() => { dispatch({type: 'MARK_ALERT_READ', payload: a.id}); navigate(`/cases/${a.relatedCaseId}`); }} className="text-[10px] bg-surface-2 px-3 py-1.5 rounded hover:bg-surface-hover text-text border border-border">View Source Case</button>
                  {a.targetStationId !== state.currentUser?.stationId && (
                    <button onClick={() => { dispatch({type: 'MARK_ALERT_READ', payload: a.id}); navigate('/requests'); }} className="text-[10px] bg-brand text-bg px-3 py-1.5 rounded font-bold hover:bg-brand-bright flex items-center gap-1"><Lock size={12}/> Request Access</button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, danger, highlight }: any) {
  return (
    <div className={`glass p-5 rounded-xl ${danger ? 'border-danger/40 bg-danger/5' : highlight ? 'border-accent/40 bg-accent/5' : ''}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${danger ? 'text-danger-bright' : highlight ? 'text-accent-bright' : 'text-text-dim'}`}>
        <Icon size={14} /> {title}
      </div>
      <div className={`text-3xl font-display font-bold ${danger ? 'text-danger-bright' : highlight ? 'text-accent-bright' : 'text-text'}`}>{value}</div>
    </div>
  );
}
