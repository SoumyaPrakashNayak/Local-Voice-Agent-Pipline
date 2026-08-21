import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Shield, FilePlus, Search, ShieldAlert,
  Network, Sparkles, Scale, FileText, FileBarChart,
  Bell, LogOut, Moon, Sun, Lock, Building, Users, Mic
} from 'lucide-react';
import { useMockState } from '../../mockServices/MockStateContext';

export function SIHLayout() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-light', 'dark');
    if (theme === 'light') {
      root.classList.add('theme-light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  if (!state.currentUser) {
    return <div className="p-8 text-white">Redirecting to login...</div>;
  }

  const role = state.currentUser.role;
  const isSuperAdmin = role === 'SUPER_ADMIN';
  
  const unreadAlerts = isSuperAdmin 
    ? state.alerts.filter(a => !a.isRead).length
    : state.alerts.filter(a => !a.isRead && state.cases.find(c => c.id === a.relatedCaseId)?.stationId === state.currentUser?.stationId).length;

  const pendingRequests = state.accessRequests.filter(r => 
    r.targetStationId === state.currentUser?.stationId && r.status === 'PENDING'
  ).length;

  const outgoingRequestsCount = state.accessRequests.filter(r => 
    r.requestingOfficerId === state.currentUser?.id
  ).length;

  return (
    <div className="flex h-screen bg-bg text-text font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex flex-col bg-bg-elev border-r border-border-soft">
        <div className="p-5 border-b border-border-soft">
          <h1 className="text-xl font-display font-bold text-gradient tracking-tight">CRIMELENS</h1>
          <p className="text-[10px] text-text-dim uppercase tracking-wider font-mono mt-1">Odisha Police Intelligence</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {isSuperAdmin && (
            <>
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">STATE COMMAND</div>
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Command Center" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">POLICE ADMINISTRATION</div>
              <NavItem to="/stations" icon={Building} label="Police Stations" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">CASE INTELLIGENCE</div>
              <NavItem to="/cases" icon={Search} label="State Case Registry" />
              <NavItem to="/intelligence/alerts" icon={ShieldAlert} label="State Alerts" badge={unreadAlerts} />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">NETWORK INTELLIGENCE</div>
              <NavItem to="/network" icon={Network} label="State Network Explorer" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">REPORTS</div>
              <NavItem to="/reports" icon={FileBarChart} label="Monthly Crime Reports" />
            </>
          )}

          {role === 'STATION_ADMIN' && (
            <>
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">COMMAND</div>
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">INVESTIGATIONS</div>
              <NavItem to="/cases" icon={Search} label="All Cases" />
              <NavItem to="/cases?status=INVESTIGATING" icon={Building} label="Active Investigations" />
              <NavItem to="/cases/new" icon={FilePlus} label="Register FIR" />
              <NavItem to="/evidence" icon={FileText} label="Evidence Vault" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">INTELLIGENCE</div>
              <NavItem to="/reports" icon={FileBarChart} label="Station Intelligence" />
              <NavItem to="/network" icon={Network} label="Network Explorer" />
              <NavItem to="/legal" icon={Scale} label="Similar Cases" />
              <NavItem to="/assistant" icon={Sparkles} label="AI Assistant" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">OPERATIONS</div>
              <NavItem to="/investigators" icon={Users} label="Officers" />
              <NavItem to="/dashboard?action=assign" icon={FilePlus} label="Case Assignment" />
              <NavItem to="/requests" icon={Lock} label="Access Requests" badge={pendingRequests} />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">REPORTS</div>
              <NavItem to="/reports?type=station" icon={FileBarChart} label="Station Reports" />
              <NavItem to="/reports?type=investigation" icon={FileBarChart} label="Investigation Reports" />

              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">SYSTEM</div>
              <NavItem to="/dashboard" icon={Bell} label="Notifications" badge={unreadAlerts} />
              <NavItem to="/dashboard" icon={Users} label="Profile" />
            </>
          )}

          {role === 'OFFICER' && (
            <>
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">MY DESK</div>
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/cases" icon={Search} label="My Investigations" />
              <NavItem to="/requests" icon={Lock} label="Access Requests" badge={outgoingRequestsCount} />
              <NavItem to="/dashboard" icon={FileText} label="My Tasks" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">INVESTIGATE</div>
              <NavItem to="/cases/new" icon={FilePlus} label="Register FIR" />
              <NavItem to="/evidence" icon={FileText} label="Evidence Vault" />
              <NavItem to="/cases" icon={Search} label="Case Search" />
              <NavItem to="/legal" icon={Scale} label="Similar Cases" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">INTELLIGENCE</div>
              <NavItem to="/network" icon={Network} label="Knowledge Graph" />
              <NavItem to="/network" icon={Network} label="Network Explorer" />
              <NavItem to="/reports" icon={FileBarChart} label="Crime Intelligence" />
              <NavItem to="/legal" icon={Scale} label="Legal Intelligence" />
              
              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">ASSISTANCE</div>
              <NavItem to="/assistant" icon={Sparkles} label="AI Assistant" />
              <NavItem to="/dashboard" icon={Mic} label="Voice Assistant" />

              <div className="text-[10px] uppercase font-bold text-text-faint px-3 mt-4 mb-2 tracking-wider">REPORTS</div>
              <NavItem to="/reports" icon={FileBarChart} label="Case Reports" />
              <NavItem to="/reports" icon={FileBarChart} label="Charge Sheet Drafts" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold border border-brand/30">
              {state.currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text truncate">{state.currentUser.name}</p>
              <p className="text-[10px] font-mono text-brand truncate">{state.currentUser.rank}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button onClick={toggleTheme} className="p-2 text-text-dim hover:text-text transition-colors" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => { dispatch({ type: 'SET_USER', payload: null as any }); navigate('/'); }}
              className="p-2 text-text-dim hover:text-danger-bright transition-colors" title="Secure Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-14 bg-surface border-b border-border-soft flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            {state.currentUser.stationId ? (
              <div className="flex items-center gap-2 text-xs font-mono bg-bg-elev px-3 py-1.5 rounded-md border border-border">
                <span className="text-text-dim">STATION:</span>
                <span className="font-bold text-accent-bright">
                  {state.stations.find(s => s.id === state.currentUser?.stationId)?.name} [{state.currentUser.stationId}]
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono bg-brand/10 text-brand px-3 py-1.5 rounded-md border border-brand/30">
                <Shield size={14} /> ODISHA POLICE · STATE COMMAND
              </div>
            )}
            
            {state.isProcessingIntelligence && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand animate-pulse uppercase tracking-wider">
                <Sparkles size={14} /> Intelligence Engine Running...
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/intelligence/alerts')} className="relative p-2 text-text-dim hover:text-text transition-colors">
              <Bell size={20} />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-bright rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Global Alert Banner */}
        {unreadAlerts > 0 && (
          <div className="bg-danger/10 border-b border-danger/20 px-6 py-2 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-2 text-sm text-danger-bright">
              <ShieldAlert size={16} />
              <span className="font-bold uppercase tracking-wider text-[10px]">NEW INTELLIGENCE DISCOVERED:</span>
              <span className="text-sm">{state.alerts.find(a => !a.isRead)?.message}</span>
            </div>
            <button 
              onClick={() => navigate('/intelligence/alerts')}
              className="text-xs font-bold text-text hover:underline uppercase tracking-wider"
            >
              VIEW DETAILS
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: number }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all
        ${isActive 
          ? 'bg-surface-hover text-accent-bright font-semibold border border-border shadow-sm' 
          : 'text-text-dim hover:bg-surface-hover hover:text-text border border-transparent'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon size={18} className={badge ? 'text-danger-bright' : isActive ? 'text-accent-bright' : ''} />
            <span>{label}</span>
          </div>
          {(badge !== undefined && badge > 0) && (
            <span className="bg-danger text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
