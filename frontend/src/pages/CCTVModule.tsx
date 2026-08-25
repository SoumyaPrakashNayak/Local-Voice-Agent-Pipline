import React, { useState, useEffect } from 'react';
import { 
  Video, Camera, Play, Pause, RotateCcw, Shield, ZoomIn, Info, 
  Search, List, Activity, Eye, EyeOff, Radio, RefreshCw, Crosshair, 
  Sliders, AlertTriangle
} from 'lucide-react';

interface CCTVFeed {
  id: string;
  name: string;
  location: string;
  status: 'ACTIVE' | 'OFFLINE';
  detectedObject?: string;
  licensePlate?: string;
  confidence?: number;
  speed?: string;
  heading?: string;
}

export function CCTVModule() {
  const [selectedFeed, setSelectedFeed] = useState<string>('CAM-01');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [systemTime, setSystemTime] = useState<string>('22:30:15');
  const [visionMode, setVisionMode] = useState<'standard' | 'night' | 'thermal'>('standard');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [activeDetections, setActiveDetections] = useState<string[]>([
    'Target Vehicle Matched [OD-02-AB-1234]',
    'MO Signature Correlation: 94%',
    'Direction: Eastbound via Khandagiri NH-16'
  ]);

  const feeds: CCTVFeed[] = [
    { 
      id: 'CAM-01', 
      name: 'Patrapada Junction - Cam 01', 
      location: 'Patrapada Junction East (NH-16)', 
      status: 'ACTIVE', 
      detectedObject: 'White Commercial Van', 
      licensePlate: 'OD-02-AB-1234', 
      confidence: 94,
      speed: '42 km/h',
      heading: 'Eastbound'
    },
    { 
      id: 'CAM-02', 
      name: 'Patrapada Junction - Cam 02', 
      location: 'Patrapada Junction West Corridor', 
      status: 'ACTIVE', 
      detectedObject: 'Motorcycle', 
      licensePlate: 'OD-33-C-9871', 
      confidence: 88,
      speed: '36 km/h',
      heading: 'Northbound'
    },
    { 
      id: 'CAM-03', 
      name: 'Khandagiri Bypass Overbridge', 
      location: 'Khandagiri Chowk Flyover Approach', 
      status: 'ACTIVE', 
      detectedObject: 'Sedan', 
      licensePlate: 'OD-02-XY-9999', 
      confidence: 92,
      speed: '55 km/h',
      heading: 'Southbound'
    },
    { 
      id: 'CAM-04', 
      name: 'Unit IV Warehouse Area', 
      location: 'Unit IV Commercial Perimeter Gate', 
      status: 'ACTIVE' 
    },
    { 
      id: 'CAM-05', 
      name: 'Cuttack Sadar Highway Checkpoint', 
      location: 'Cuttack Sadar High Way Toll 02', 
      status: 'OFFLINE' 
    },
  ];

  // Live timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSystemTime(prev => {
          const parts = prev.split(':').map(Number);
          let seconds = parts[2] + Math.round(playbackSpeed);
          let minutes = parts[1];
          let hours = parts[0];

          if (seconds >= 60) {
            minutes += Math.floor(seconds / 60);
            seconds = seconds % 60;
          }
          if (minutes >= 60) {
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
          }
          if (hours >= 24) {
            hours = 0;
          }

          const hStr = hours.toString().padStart(2, '0');
          const mStr = minutes.toString().padStart(2, '0');
          const sStr = seconds.toString().padStart(2, '0');
          return `${hStr}:${mStr}:${sStr}`;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const activeCam = feeds.find(f => f.id === selectedFeed) || feeds[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12 text-text">
      {/* Header */}
      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-border-soft">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono bg-bg-elev border border-border px-2 py-0.5 rounded text-brand">
              SURVEILLANCE INTELLIGENCE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-success/20 text-success px-2 py-0.5 rounded border border-success/30 flex items-center gap-1">
              <Activity size={10} className="animate-pulse" /> ANPR AI ENGINE ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Video className="text-brand" /> CCTV Surveillance Intelligence
          </h1>
          <p className="text-sm text-text-dim mt-1">
            Odisha Police optical surveillance matrix · Automated Number Plate Recognition (ANPR) & vehicle telemetry
          </p>
        </div>

        {/* Vision Filter Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-2 p-1 rounded-xl border border-border-soft text-xs">
            <button
              onClick={() => setVisionMode('standard')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${visionMode === 'standard' ? 'bg-surface text-brand shadow-sm' : 'text-text-dim hover:text-text'}`}
            >
              Standard Optical
            </button>
            <button
              onClick={() => setVisionMode('night')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${visionMode === 'night' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40 shadow-sm' : 'text-text-dim hover:text-text'}`}
            >
              Night IR
            </button>
            <button
              onClick={() => setVisionMode('thermal')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${visionMode === 'thermal' ? 'bg-orange-950 text-orange-400 border border-orange-800/40 shadow-sm' : 'text-text-dim hover:text-text'}`}
            >
              Thermal Mode
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left feed list */}
        <div className="lg:col-span-1 glass bg-surface rounded-2xl border border-border-soft p-4 flex flex-col h-[520px]">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-text-dim flex items-center gap-2">
            <List size={14} /> Camera Feed Indexes
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {feeds.map(f => (
              <button
                key={f.id}
                onClick={() => f.status === 'ACTIVE' && setSelectedFeed(f.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  f.status === 'OFFLINE'
                    ? 'border-transparent bg-bg-elev/45 opacity-55 cursor-not-allowed'
                    : selectedFeed === f.id
                    ? 'border-brand bg-brand/10 text-brand font-bold'
                    : 'border-border-soft bg-surface hover:bg-surface-hover hover:border-border'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[10px]">{f.id}</span>
                    <span className="truncate font-semibold">{f.name.split('-')[0]}</span>
                  </div>
                  <div className="text-[10px] text-text-dim mt-0.5 truncate">{f.location}</div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ml-2 ${
                  f.status === 'ACTIVE' ? 'bg-success animate-pulse' : 'bg-text-faint'
                }`} />
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border-soft text-[10px] font-mono text-text-faint uppercase text-center flex items-center justify-between">
            <span>NETWORK: 4/5 CONNECTED</span>
            <span className="text-success font-bold">1080P · 30 FPS</span>
          </div>
        </div>

        {/* Video feed window and analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Surveillance Screen */}
          <div className="glass bg-[#080c14] border border-border-soft rounded-2xl overflow-hidden relative h-[420px] flex flex-col justify-between shadow-2xl">
            {/* Top CCTV HUD overlay */}
            <div className="p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex justify-between items-start z-20">
              <div className="font-mono text-xs text-white/90 space-y-0.5 bg-black/60 p-2.5 rounded-lg backdrop-blur-md border border-white/10">
                <div className="text-brand font-bold flex items-center gap-2">
                  <Radio size={12} className="animate-pulse text-danger-bright" />
                  {activeCam.id} · {activeCam.name.toUpperCase()}
                </div>
                <div className="text-[10px] text-white/70">LOC: {activeCam.location}</div>
                <div className="text-[10px] text-white/60">GPS: 20.2961° N, 85.8245° E · ELEV: 45m</div>
              </div>

              <div className="font-mono text-xs text-white/90 text-right bg-black/60 p-2.5 rounded-lg backdrop-blur-md border border-white/10">
                <div className="text-danger-bright font-bold flex items-center gap-1.5 justify-end">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger-bright animate-ping" /> REC ● LIVE FEED
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">2026-08-21 {systemTime}</div>
                <div className="text-[10px] text-white/60">BITRATE: 4.8 MBPS · CODEC: H.265</div>
              </div>
            </div>

            {/* Realistic Street / Road Surveillance Scene (SVG & Canvas Graphics) */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center select-none pointer-events-none">
              <svg 
                className={`w-full h-full object-cover transition-all duration-300 ${
                  visionMode === 'night' ? 'filter hue-rotate-90 contrast-125 brightness-90 saturate-200' :
                  visionMode === 'thermal' ? 'filter invert hue-rotate-180 contrast-150 saturate-200' : ''
                }`}
                viewBox="0 0 800 450" 
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Sky & Horizon Gradient */}
                <defs>
                  <linearGradient id="cctvSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0a101d" />
                    <stop offset="60%" stopColor="#121b2d" />
                    <stop offset="100%" stopColor="#1e2a3f" />
                  </linearGradient>
                  <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#111622" />
                    <stop offset="100%" stopColor="#080b12" />
                  </linearGradient>
                  <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,245,200,0.6)" />
                    <stop offset="100%" stopColor="rgba(255,245,200,0)" />
                  </linearGradient>
                  <filter id="cctvNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" />
                    <feComposite in2="SourceGraphic" in="gl" operator="in" />
                  </filter>
                </defs>

                {/* Horizon & Sky */}
                <rect width="800" height="220" fill="url(#cctvSky)" />

                {/* Distant Urban Skyline & Buildings */}
                <polygon points="40,220 40,160 90,160 90,220" fill="#141c2c" opacity="0.8" />
                <polygon points="100,220 100,140 160,140 160,220" fill="#182236" opacity="0.9" />
                <polygon points="180,220 180,170 240,170 240,220" fill="#131b2a" opacity="0.7" />
                <polygon points="560,220 560,150 630,150 630,220" fill="#151e30" opacity="0.8" />
                <polygon points="650,220 650,130 740,130 740,220" fill="#192438" opacity="0.9" />

                {/* Highway / Roadway Perspective Surface */}
                <polygon points="0,450 800,450 480,220 320,220" fill="url(#roadGrad)" />

                {/* Road Lane Markings */}
                {/* Center Dashed Lines */}
                <line x1="400" y1="220" x2="400" y2="450" stroke="#f59e0b" strokeWidth="4" strokeDasharray="18 14" opacity="0.7" />
                {/* Left Lane Boundary */}
                <line x1="360" y1="220" x2="200" y2="450" stroke="#ffffff" strokeWidth="2.5" opacity="0.5" />
                {/* Right Lane Boundary */}
                <line x1="440" y1="220" x2="600" y2="450" stroke="#ffffff" strokeWidth="2.5" opacity="0.5" />

                {/* Crosswalk Zebra Stripes */}
                <polygon points="260,370 280,370 250,390 230,390" fill="#ffffff" opacity="0.35" />
                <polygon points="310,370 330,370 300,390 280,390" fill="#ffffff" opacity="0.35" />
                <polygon points="360,370 380,370 350,390 330,390" fill="#ffffff" opacity="0.35" />
                <polygon points="410,370 430,370 400,390 380,390" fill="#ffffff" opacity="0.35" />
                <polygon points="460,370 480,370 450,390 430,390" fill="#ffffff" opacity="0.35" />
                <polygon points="510,370 530,370 500,390 480,390" fill="#ffffff" opacity="0.35" />

                {/* Street Light Posts */}
                <path d="M120,410 L120,200 Q120,180 150,180" fill="none" stroke="#475569" strokeWidth="3" />
                <circle cx="150" cy="180" r="4" fill="#fbbf24" />
                <path d="M680,410 L680,200 Q680,180 650,180" fill="none" stroke="#475569" strokeWidth="3" />
                <circle cx="650" cy="180" r="4" fill="#fbbf24" />

                {/* Realistic Target Vehicle (White Commercial Van) in Lane */}
                <g transform="translate(340, 255) scale(0.95)">
                  {/* Headlight beams */}
                  <polygon points="20,70 -80,160 40,160" fill="url(#headlightBeam)" />
                  <polygon points="90,70 60,160 180,160" fill="url(#headlightBeam)" />

                  {/* Van Shadow */}
                  <ellipse cx="60" cy="88" rx="65" ry="14" fill="#000000" opacity="0.75" />

                  {/* Van Body */}
                  <path d="M10,40 Q15,20 40,20 L85,20 Q105,20 110,40 L115,75 Q115,82 105,82 L15,82 Q5,82 5,75 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                  
                  {/* Van Windshield */}
                  <polygon points="20,40 38,25 82,25 95,40" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                  
                  {/* Side Windows & Cargo Trim */}
                  <rect x="25" y="44" width="28" height="14" rx="2" fill="#1e293b" />
                  <rect x="58" y="44" width="38" height="14" rx="2" fill="#1e293b" />

                  {/* Headlights & Tail Lights */}
                  <circle cx="15" cy="65" r="4" fill="#fef08a" />
                  <circle cx="105" cy="65" r="4" fill="#fef08a" />
                  <rect x="18" y="70" width="8" height="3" fill="#ef4444" />
                  <rect x="94" y="70" width="8" height="3" fill="#ef4444" />

                  {/* Number Plate Graphic on Van */}
                  <rect x="42" y="68" width="36" height="10" rx="1.5" fill="#fef08a" stroke="#000000" strokeWidth="0.8" />
                  <text x="60" y="75.5" fontSize="5.5" fontWeight="bold" fontFamily="monospace" fill="#000000" textAnchor="middle">OD-02-AB-1234</text>

                  {/* Wheels */}
                  <circle cx="28" cy="82" r="9" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <circle cx="28" cy="82" r="4" fill="#94a3b8" />
                  <circle cx="92" cy="82" r="9" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <circle cx="92" cy="82" r="4" fill="#94a3b8" />
                </g>

                {/* Distant Traffic Vehicle in Opposite Lane */}
                <g transform="translate(460, 230) scale(0.45)">
                  <ellipse cx="40" cy="50" rx="35" ry="8" fill="#000000" opacity="0.6" />
                  <rect x="10" y="20" width="60" height="28" rx="5" fill="#334155" />
                  <circle cx="20" cy="38" r="3" fill="#ef4444" />
                  <circle cx="60" cy="38" r="3" fill="#ef4444" />
                </g>
              </svg>

              {/* Optical Scanline Grid & Noise Filter */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 3px, rgba(0,0,0,0.8) 4px)'
                }}
              />
            </div>

            {/* AI Bounding Box & Target Tracker Overlay */}
            {activeCam.detectedObject && isPlaying && showBoundingBoxes && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div 
                  className="relative border-2 border-danger-bright w-72 h-44 rounded flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  style={{ transform: 'translate(45px, 35px)' }}
                >
                  {/* Corner Reticle Brackets */}
                  <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-danger-bright" />
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-danger-bright" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-danger-bright" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-danger-bright" />

                  {/* Top Target Badge */}
                  <div className="absolute -top-7 -left-0.5 bg-danger-bright text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow flex items-center gap-1.5">
                    <Crosshair size={11} className="animate-spin" />
                    AI TARGET: {activeCam.detectedObject.toUpperCase()} [{activeCam.confidence}% MATCH]
                  </div>

                  {/* Bottom Plate Badge */}
                  <div className="absolute -bottom-7 -left-0.5 bg-brand text-bg text-[10px] font-mono font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1.5">
                    ANPR: {activeCam.licensePlate} · SPD: {activeCam.speed}
                  </div>

                  {/* Top Right Status */}
                  <div className="absolute top-1.5 right-1.5 font-mono text-[9px] text-danger-bright bg-black/80 px-1.5 py-0.5 rounded border border-danger-bright/40">
                    FLAGGED IN CASE #4821
                  </div>

                  {/* Center Crosshair Marker */}
                  <div className="border border-dashed border-danger-bright/40 w-full h-full flex items-center justify-center">
                    <Crosshair size={24} className="text-danger-bright opacity-60" />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Playback Controls panel */}
            <div className="p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/70 backdrop-blur-md border border-white/15 rounded-xl p-3">
                {/* Play controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-8 w-8 rounded-full bg-brand text-bg flex items-center justify-center hover:bg-brand-bright transition-colors"
                    title={isPlaying ? "Pause Feed" : "Play Feed"}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button
                    onClick={() => setSystemTime('22:30:00')}
                    className="p-1.5 text-white/80 hover:text-white transition-colors"
                    title="Rewind to incident start"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <div className="flex items-center gap-1 bg-white/10 rounded px-2 py-1 text-xs">
                    <span className="text-white/60 text-[10px]">Speed:</span>
                    <button onClick={() => setPlaybackSpeed(1)} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${playbackSpeed === 1 ? 'bg-brand text-bg font-bold' : 'text-white/80 hover:bg-white/10'}`}>1x</button>
                    <button onClick={() => setPlaybackSpeed(2)} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${playbackSpeed === 2 ? 'bg-brand text-bg font-bold' : 'text-white/80 hover:bg-white/10'}`}>2x</button>
                    <button onClick={() => setPlaybackSpeed(4)} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${playbackSpeed === 4 ? 'bg-brand text-bg font-bold' : 'text-white/80 hover:bg-white/10'}`}>4x</button>
                  </div>
                </div>

                {/* Bounding Box Toggle & Status */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <button
                    onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                      showBoundingBoxes ? 'bg-brand/20 border-brand text-brand' : 'bg-white/10 border-white/20 text-white/60'
                    }`}
                  >
                    {showBoundingBoxes ? <Eye size={12} /> : <EyeOff size={12} />}
                    ANPR OVERLAYS {showBoundingBoxes ? 'ON' : 'OFF'}
                  </button>

                  <div className="text-white/80 text-[11px] hidden sm:block">
                    STATUS: <span className="text-success font-bold">LOCKED & TRACKING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Logs and Intelligence metadata */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border-soft pb-2 text-brand flex items-center gap-2">
                <Shield size={16} /> Automated Plate Recognition (ANPR)
              </h3>
              {activeCam.detectedObject ? (
                <div className="space-y-3">
                  <div className="p-3 bg-surface-2 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-text-dim uppercase font-mono tracking-wider">Identified Number Plate</div>
                      <div className="text-xl font-bold text-text font-mono mt-0.5">{activeCam.licensePlate}</div>
                    </div>
                    <span className="bg-danger/20 text-danger-bright text-xs px-2.5 py-1 rounded font-bold border border-danger/30">
                      FLAGGED VEHICLE
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-text-dim">
                    <div className="flex justify-between">
                      <span>Vehicle Classification:</span>
                      <span className="font-bold text-text">{activeCam.detectedObject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Associated Case File:</span>
                      <span className="font-bold text-brand font-mono">CR-KHD-2026-004821</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Telemetry / Velocity:</span>
                      <span className="font-bold text-text font-mono">{activeCam.speed} · {activeCam.heading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Score:</span>
                      <span className="font-bold text-success font-mono">{activeCam.confidence}% Neural Match</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-text-faint italic py-4">
                  No automated detections active on this camera index.
                </div>
              )}
            </div>

            <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border-soft pb-2 text-accent-bright flex items-center gap-2">
                <Activity size={16} /> Real-Time Intelligence Feed
              </h3>
              <div className="space-y-2">
                {activeDetections.map((det, i) => (
                  <div key={i} className="p-2.5 bg-surface-2 border border-border-soft rounded-lg text-xs font-mono flex items-center justify-between">
                    <span className="text-text-dim leading-snug">{det}</span>
                    <span className="text-[9px] text-brand font-bold bg-brand/10 px-2 py-0.5 rounded shrink-0 ml-2">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
