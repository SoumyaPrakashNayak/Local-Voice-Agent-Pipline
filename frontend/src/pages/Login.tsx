import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, User } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { UserRole } from '../mockServices/types';
import { CinematicEarthBackground } from '../components/ui/CinematicEarthBackground';

export function Login() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [stationCode, setStationCode] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState('');

  // Manage theme state matching S.I.R.I.S documentElement class
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const root = window.document.documentElement;
    if (root.classList.contains('theme-light')) return 'light';
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('theme-dark', 'dark');
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('theme-dark', 'dark');
    }
  }, [theme]);

  // Prefill logic with credentials matching the selected role
  useEffect(() => {
    if (selectedRole === 'SUPER_ADMIN') {
      setUserId('OP-HQ-001');
      setStationCode('');
    } else if (selectedRole === 'STATION_ADMIN') {
      setUserId('IIC-BBSR-01');
      setStationCode('OP-BBSR-CAP');
    } else if (selectedRole === 'OFFICER') {
      setUserId('INV-BBSR-001');
      setStationCode('OP-BBSR-CAP');
    }
  }, [selectedRole]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let user;
    if (selectedRole === 'SUPER_ADMIN') {
      user = state.users.find(u => u.role === 'SUPER_ADMIN' && u.id === userId);
    } else {
      user = state.users.find(u => u.role === selectedRole && u.id === userId && u.stationId === stationCode);
    }

    if (user && password === 'Demo@123') {
      dispatch({ type: 'SET_USER', payload: user });
      navigate('/dashboard');
    } else {
      setError('AUTHENTICATION FAILED: Invalid credentials or station context.');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Environmental backdrop overlays
  const backgroundOverlay = theme === 'light'
    ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.92) 100%)'
    : 'radial-gradient(circle at center, rgba(10, 15, 30, 0.4) 0%, rgba(7, 10, 19, 0.95) 100%)';

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden font-sans select-none bg-slate-100 dark:bg-[#070A13] text-slate-800 dark:text-[#E8EAF1] transition-colors duration-300">
      
      {/* Photorealistic Cinematic Satellite Earth Backdrop */}
      <CinematicEarthBackground theme={theme} />

      {/* Top Header Section */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/siris.png" alt="S.I.R.I.S" className="w-8 h-8 object-contain" />
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-sm text-slate-900 dark:text-white">S.I.R.I.S</span>
          </div>
        </div>
        
      </header>

      {/* Main Landing / Login Panels */}
      {!selectedRole ? (
        <main className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center justify-center flex-grow text-center space-y-12 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-2.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-2">
              <img src="/siris.png" alt="S.I.R.I.S" className="w-14 h-14 object-contain" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-heading leading-heading text-slate-950 dark:text-white">
              S.I.R.I.S
            </h1>
            <h2 className="text-xs font-mono tracking-widest text-[#FFB800] uppercase font-semibold">
              Odisha Police Intelligence Network
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-body text-slate-500 dark:text-[#A8B5C0] font-normal">
              State Crime Intelligence Network Demonstration Prototype.
            </p>
          </div>

          {/* SYSTEM ACCESS portal selection */}
          <div className="w-full max-w-lg space-y-3.5 text-left">
            <h3 className="text-xs sm:text-sm font-medium leading-label text-slate-400 dark:text-[#A8B5C0] tracking-normal pl-1">
              Authorized System Access
            </h3>
            
            <AccessModule
              icon={Shield}
              title="COMMAND"
              description="State-level intelligence and command operations"
              onClick={() => setSelectedRole('SUPER_ADMIN')}
            />
            <AccessModule
              icon={Building}
              title="STATION"
              description="Station-level case and operational management"
              onClick={() => setSelectedRole('STATION_ADMIN')}
            />
            <AccessModule
              icon={User}
              title="INVESTIGATION"
              description="Investigator workspace and active case intelligence"
              onClick={() => setSelectedRole('OFFICER')}
            />
          </div>
        </main>
      ) : (
        <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 flex-grow">
          {/* Left Side: Institutional branding and access welcome info */}
          <div className="w-full lg:w-1/2 text-left space-y-6 animate-slide-left">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-heading leading-heading text-slate-900 dark:text-white">
                WELCOME TO S.I.R.I.S.
              </h1>
              <h2 className="text-xs font-mono tracking-widest text-[#FFB800] uppercase font-semibold">
                ODISHA POLICE INTELLIGENCE NETWORK
              </h2>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-semibold leading-section text-slate-800 dark:text-[#E8ECEF]">
                Smart Intelligence For Real Time Investigation Support
              </h3>
              <p className="text-xs sm:text-sm leading-body text-slate-500 dark:text-[#A8B5C0] font-normal">
                Secure intelligence infrastructure for real-time crime investigation, intelligence analysis and operational decision support.
              </p>
            </div>

            <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-5 space-y-3">
              <h4 className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-[#A8B5C0] uppercase font-bold">
                STATE INTELLIGENCE NETWORK
              </h4>
              <div className="space-y-1.5 text-[10px] font-mono text-slate-500 dark:text-[#A8B5C0]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>SECURE CONNECTION</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFB800] inline-block"></span>
                  <span>AUTHORIZED PERSONNEL ONLY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Existing credentials panel */}
          <div className="w-full lg:w-[420px] bg-white/60 dark:bg-[#111827]/60 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl overflow-hidden relative animate-slide-up">
            {/* Top gold bar accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFB800] to-transparent" />
            
            <div className="p-8 sm:p-9">
              <button 
                onClick={() => { setSelectedRole(null); setError(''); }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#FFB800] dark:hover:text-[#FFB800] font-medium mb-6 flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                &larr; Back to System Access
              </button>

              {/* Badged logo */}
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5">
                <img src="/siris.png" alt="S.I.R.I.S" className="w-full h-full object-contain" />
              </div>
              
              <h2 className="text-lg font-semibold text-center tracking-heading leading-section text-slate-950 dark:text-white">
                S.I.R.I.S
              </h2>
              <div className="text-xs font-mono text-[#FFB800] text-center tracking-widest uppercase mt-1 mb-7 font-semibold">
                {selectedRole === 'SUPER_ADMIN' ? 'Command Access' : selectedRole === 'STATION_ADMIN' ? 'Station Access' : 'Investigation Access'}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {selectedRole !== 'SUPER_ADMIN' && (
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-[#A8B5C0] font-medium leading-label mb-1.5">Station Code</label>
                    <input 
                      type="text" 
                      value={stationCode} 
                      onChange={e => setStationCode(e.target.value)}
                      className="w-full p-2.5 bg-white/80 dark:bg-[#0A0E17]/80 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono text-slate-900 dark:text-[#E8ECEF] focus:outline-none focus:border-[#FFB800] transition-colors"
                      required
                      placeholder="Enter Station Code"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-xs text-slate-500 dark:text-[#A8B5C0] font-medium leading-label mb-1.5">
                    {selectedRole === 'SUPER_ADMIN' ? 'State Police ID' : selectedRole === 'STATION_ADMIN' ? 'IIC / Admin ID' : 'Officer ID'}
                  </label>
                  <input 
                    type="text" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)}
                    className="w-full p-2.5 bg-white/80 dark:bg-[#0A0E17]/80 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono text-slate-900 dark:text-[#E8ECEF] focus:outline-none focus:border-[#FFB800] transition-colors"
                    required
                    placeholder={selectedRole === 'SUPER_ADMIN' ? 'e.g. OP-HQ-001' : selectedRole === 'STATION_ADMIN' ? 'e.g. IIC-BBSR-01' : 'e.g. INV-BBSR-001'}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-[#A8B5C0] font-medium leading-label mb-1.5">Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-white/80 dark:bg-[#0A0E17]/80 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono text-slate-900 dark:text-[#E8ECEF] focus:outline-none focus:border-[#FFB800] transition-colors"
                    required
                  />
                </div>

                {error && (
                  <div className="text-xs text-red-600 dark:text-red-400 text-center mt-2 font-mono">{error}</div>
                )}

                <button 
                  type="submit" 
                  className="w-full mt-4 bg-[#FFB800] text-[#0A0E17] hover:bg-[#FFE066] py-2.5 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none active:scale-[0.99]"
                >
                  <Shield size={14} /> Secure Sign In
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono tracking-wider">
                <span>SECURE CONNECTION</span>
                <span>AUTHORIZED USE ONLY</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* System Metadata Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
  
      </footer>
    </div>
  );
}

function AccessModule({ icon: Icon, title, description, onClick }: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/45 dark:bg-slate-900/45 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-[#B88922]/50 dark:hover:border-[#B88922]/50 transition-all duration-200 backdrop-blur-md flex items-center justify-between group shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#B88922]/10 group-hover:text-[#B88922] group-hover:border-[#B88922]/30 transition-colors">
          <Icon size={18} />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-semibold text-sm leading-section text-slate-800 dark:text-[#E8ECEF] group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{title}</h4>
          <p className="text-xs leading-body text-slate-500 dark:text-[#A8B5C0] font-normal">{description}</p>
        </div>
      </div>
      <div className="text-slate-400 dark:text-slate-500 group-hover:text-[#B88922] group-hover:translate-x-1 transition-all text-sm font-bold">
        &rarr;
      </div>
    </button>
  );
}
