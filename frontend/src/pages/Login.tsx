import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, User, Lock, Globe, KeyRound, Brain, Video, BarChart3, Car, Fingerprint, ScanFace, Network as NetworkIcon, Mic, FileText, TrendingUp, MapPin, Folder, Share2 } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { UserRole } from '../mockServices/types';

export function Login() {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [stationCode, setStationCode] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState('');

  // Prefill logic
  useEffect(() => {
    if (selectedRole === 'SUPER_ADMIN') {
      setUserId('KSP-HQ-001');
      setStationCode('');
    } else if (selectedRole === 'STATION_ADMIN') {
      setUserId('IIC-BLR-01');
      setStationCode('KSP-BLR-CEN');
    } else if (selectedRole === 'OFFICER') {
      setUserId('INV-BLR-001');
      setStationCode('KSP-BLR-CEN');
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

  if (!selectedRole) {
    return <RoleSelectionScreen onSelect={setSelectedRole} />;
  }

  // ARGUS / VERITAS ORIGINAL LOGIN UI
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative font-sans">
      <div className="w-[380px] bg-surface border border-border rounded-xl relative overflow-hidden shadow-card animate-fade-in">
        {/* Top gold bar from Argus */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent" />
        
        <div className="p-[38px_36px_32px]">
          <button 
            onClick={() => { setSelectedRole(null); setError(''); }}
            className="text-[10px] text-text-dim hover:text-text font-bold uppercase tracking-wider mb-8 flex items-center gap-1 transition-colors"
          >
            &larr; Back to Role Selection
          </button>

          {/* Argus Badge */}
          <svg className="w-[52px] h-[52px] mx-auto mb-[18px] block" viewBox="0 0 60 60" fill="none">
            <path d="M30 3 L54 14 V30 C54 44 44 53 30 57 C16 53 6 44 6 30 V14 Z" className="stroke-brand" strokeWidth="1.6"/>
            <circle cx="30" cy="27" r="8.5" className="stroke-brand" strokeWidth="1.4"/>
            <circle cx="30" cy="27" r="3" className="fill-brand"/>
            <path d="M18 27 Q30 15 42 27" className="stroke-brand" strokeWidth="1.2" opacity="0.55"/>
          </svg>
          
          <div className="font-display text-[22px] font-bold text-center tracking-[0.04em] text-text">CRIMELENS</div>
          <div className="font-mono text-[10.5px] text-text-faint text-center tracking-[0.12em] uppercase mt-[6px] mb-[30px]">
             {selectedRole === 'SUPER_ADMIN' ? 'State Command Login' : selectedRole === 'STATION_ADMIN' ? 'Station Command Login' : 'Investigator Login'}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {selectedRole !== 'SUPER_ADMIN' && (
              <div>
                <label className="block text-[11.5px] text-text-dim font-bold tracking-[0.02em] mb-[6px] uppercase">Station Code</label>
                <input 
                  type="text" 
                  value={stationCode} 
                  onChange={e => setStationCode(e.target.value)}
                  className="w-full p-[11px_12px] bg-bg-elev border border-border rounded text-[13px] font-mono text-text focus:outline-none focus:border-brand/70"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-[11.5px] text-text-dim font-bold tracking-[0.02em] mb-[6px] uppercase">
                {selectedRole === 'SUPER_ADMIN' ? 'State Police ID' : selectedRole === 'STATION_ADMIN' ? 'IIC / Admin ID' : 'Officer ID'}
              </label>
              <input 
                type="text" 
                value={userId} 
                onChange={e => setUserId(e.target.value)}
                className="w-full p-[11px_12px] bg-bg-elev border border-border rounded text-[13px] font-mono text-text focus:outline-none focus:border-brand/70"
                required
              />
            </div>

            <div>
              <label className="block text-[11.5px] text-text-dim font-bold tracking-[0.02em] mb-[6px] uppercase">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full p-[11px_12px] bg-bg-elev border border-border rounded text-[13px] font-mono text-text focus:outline-none focus:border-brand/70"
                required
              />
            </div>

            {error && (
              <div className="text-[11px] text-danger-bright text-center mt-2 font-bold">{error}</div>
            )}

            <button type="submit" className="w-full mt-2 bg-brand text-bg py-[11px] font-bold text-[13.5px] rounded hover:bg-brand-bright transition-colors flex items-center justify-center gap-2">
              <Shield size={16} /> Secure sign in
            </button>
          </form>

          <div className="mt-[22px] pt-[16px] border-t border-border-soft flex justify-between text-[11px] text-text-faint font-mono">
            <span>v2.4.0 • Authorized Use</span>
            <span>Need access?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleSelectionScreen({ onSelect }: { onSelect: (role: UserRole) => void }) {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angleOffsetRef = useRef(0);

  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 1.2,
      delay: `${Math.random() * 6}s`,
      duration: `${3 + Math.random() * 5}s`,
    }));
  }, []);

  const capabilities = [
    { icon: Brain, label: "AI INVESTIGATION" },
    { icon: Video, label: "CCTV ANALYSIS" },
    { icon: BarChart3, label: "CRIME ANALYTICS" },
    { icon: Car, label: "VEHICLE INTELLIGENCE" },
    { icon: Fingerprint, label: "DIGITAL FORENSICS" },
    { icon: ScanFace, label: "FACIAL RECOGNITION" },
    { icon: NetworkIcon, label: "KNOWLEDGE GRAPH" },
    { icon: Folder, label: "EVIDENCE PROCESSING" }
  ];

  useEffect(() => {
    let animId: number;
    const updatePositions = () => {
      angleOffsetRef.current += 0.0012;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cx = width / 2;
      const cy = height / 2 + 50;
      const rx = width * 0.44;
      const ry = height * 0.32;

      capabilities.forEach((_, idx) => {
        const el = nodeRefs.current[idx];
        if (!el) return;

        const baseAngle = (idx * 2 * Math.PI) / capabilities.length;
        const angle = baseAngle + angleOffsetRef.current;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.72 + depth * 0.32;
        const opacity = 0.25 + depth * 0.75;
        const zIndex = Math.round(depth * 20) + 1;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${zIndex}`;
      });
      animId = requestAnimationFrame(updatePositions);
    };
    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, [capabilities.length]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden text-text font-sans">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.95; transform: scale(1.35); }
        }
      `}</style>
      
      {/* Stars Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-black">
        {stars.map((star) => (
          <div key={star.id} className="absolute bg-white rounded-full opacity-[0.25]"
            style={{
              top: star.top, left: star.left, width: `${star.size}px`, height: `${star.size}px`,
              animation: `twinkle ${star.duration} infinite ease-in-out`, animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Earth Image Layer */}
      <div className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-80"
        style={{ backgroundImage: "radial-gradient(circle at center, rgba(10, 15, 30, 0.4) 0%, rgba(10, 14, 23, 0.95) 100%), url('/earthBg.jpg')" }}
      />

      {/* Orbiting HUD Nodes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute inset-0 w-full h-full">
          <ellipse cx="50%" cy="calc(50% + 50px)" rx="44vw" ry="32vh" fill="none" stroke="rgba(79, 168, 184, 0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div key={idx} ref={(el) => { nodeRefs.current[idx] = el; }} className="absolute p-2 rounded-xl border border-brand/20 bg-surface/80 backdrop-blur-md flex items-center gap-2 text-brand">
              <Icon size={16} />
              <div className="font-mono text-[10px] font-bold tracking-wider">{cap.label}</div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-12 animate-fade-in">
        <div>
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-surface/50 backdrop-blur-md border border-brand/30 mb-6 shadow-glow">
            <Globe size={40} className="text-brand animate-pulse" />
          </div>
          <h1 className="text-5xl font-display font-bold text-white tracking-tight mb-2 drop-shadow-lg">
            CRIMELENS
          </h1>
          <p className="text-brand font-mono text-sm tracking-[0.3em] uppercase drop-shadow-md">
            State Crime Intelligence Network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <RoleCard icon={Shield} title="STATE POLICE / HQ" desc="Super Admin Access" onClick={() => onSelect('SUPER_ADMIN')} />
          <RoleCard icon={Building} title="POLICE STATION" desc="IIC / Station Admin Access" onClick={() => onSelect('STATION_ADMIN')} />
          <RoleCard icon={User} title="INVESTIGATOR" desc="Officer Access" onClick={() => onSelect('OFFICER')} />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="glass bg-surface/40 hover:bg-surface/60 p-6 rounded-2xl border border-border-soft hover:border-brand hover:shadow-glow transition-all group flex flex-col items-center text-center backdrop-blur-md">
      <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center mb-4 group-hover:bg-brand/20 group-hover:text-brand text-text-dim transition-colors border border-transparent group-hover:border-brand/30">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-white tracking-wider">{title}</h3>
      <p className="text-sm text-text-dim mt-2 font-mono uppercase">{desc}</p>
    </button>
  );
}
