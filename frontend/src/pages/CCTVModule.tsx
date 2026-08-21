import React, { useState, useEffect } from 'react';
import { Video, Camera, Play, Pause, RotateCcw, Shield, ZoomIn, Info, Search, List, Activity } from 'lucide-react';

interface CCTVFeed {
  id: string;
  name: string;
  location: string;
  status: 'ACTIVE' | 'OFFLINE';
  detectedObject?: string;
  licensePlate?: string;
  confidence?: number;
}

export function CCTVModule() {
  const [selectedFeed, setSelectedFeed] = useState<string>('CAM-01');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [systemTime, setSystemTime] = useState<string>('22:30:15');
  const [activeDetections, setActiveDetections] = useState<string[]>([]);

  const feeds: CCTVFeed[] = [
    { id: 'CAM-01', name: 'Patrapada Junction - Cam 01', location: 'Patrapada Junction East', status: 'ACTIVE', detectedObject: 'White Van (Target)', licensePlate: 'OD-02-AB-1234', confidence: 94 },
    { id: 'CAM-02', name: 'Patrapada Junction - Cam 02', location: 'Patrapada Junction West', status: 'ACTIVE', detectedObject: 'Motorcycle', licensePlate: 'OD-33-C-9871', confidence: 88 },
    { id: 'CAM-03', name: 'Khandagiri Bypass Road', location: 'Khandagiri Chowk', status: 'ACTIVE', detectedObject: 'Sedan', licensePlate: 'OD-02-XY-9999', confidence: 92 },
    { id: 'CAM-04', name: 'Warehouse Entry cam', location: 'Unit IV Warehouse Area', status: 'ACTIVE' },
    { id: 'CAM-05', name: 'Cuttack Sadar Road', location: 'Cuttack Sadar High Way', status: 'OFFLINE' },
  ];

  // Live timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
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

  // Bounding box simulation
  useEffect(() => {
    const list = ['Target Vehicle Matched', 'Analyzing license plate...', 'MO Signature correlation: 94%'];
    let idx = 0;
    const interval = setInterval(() => {
      setActiveDetections(prev => {
        const next = [...prev];
        if (next.includes(list[idx])) {
          next.splice(next.indexOf(list[idx]), 1);
        } else {
          next.push(list[idx]);
        }
        idx = (idx + 1) % list.length;
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const activeCam = feeds.find(f => f.id === selectedFeed) || feeds[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12 text-text">
      {/* Header */}
      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-border-soft">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono bg-bg-elev border border-border px-2 py-0.5 rounded text-brand">
              SURVEILLANCE CORE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-success/20 text-success px-2 py-0.5 rounded border border-success/30 flex items-center gap-1">
              <Activity size={10} className="animate-pulse" /> AI ENGINE RUNNING
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Video className="text-brand" /> CCTV Intelligence Module
          </h1>
          <p className="text-sm text-text-dim mt-1">
            Odisha Police feed analytics · Automatic vehicle and anomaly recognition
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left feed list */}
        <div className="lg:col-span-1 glass bg-surface rounded-2xl border border-border-soft p-4 flex flex-col h-[600px]">
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
                  <div className="truncate font-semibold">{f.name}</div>
                  <div className="text-[10px] text-text-dim mt-0.5">{f.location}</div>
                </div>
                <span className={`h-2 w-2 rounded-full shrink-0 ml-2 ${
                  f.status === 'ACTIVE' ? 'bg-success animate-pulse' : 'bg-text-faint'
                }`} />
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border-soft text-[10px] font-mono text-text-faint uppercase text-center">
            CONNECTED NODES: 4/5 ACTIVE
          </div>
        </div>

        {/* Video feed window and analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Surveillance Screen */}
          <div className="glass bg-black border border-border-soft rounded-2xl overflow-hidden relative h-[450px] flex flex-col justify-between">
            {/* Top HUD overlay */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
              <div className="font-mono text-xs text-white/90 space-y-1 bg-black/40 p-2 rounded backdrop-blur-sm border border-white/10">
                <div>FEED: {activeCam.name}</div>
                <div>LNK: SECURE VPN CONNECTION ACTIVE</div>
                <div>GRID: 20.2961° N, 85.8245° E</div>
              </div>
              <div className="font-mono text-xs text-white/90 text-right bg-black/40 p-2 rounded backdrop-blur-sm border border-white/10">
                <div className="text-success-bright flex items-center gap-1.5 justify-end">
                  <span className="h-2 w-2 rounded-full bg-success animate-ping" /> LIVE FEED
                </div>
                <div className="mt-1">TIME: 2026-08-21 {systemTime}</div>
              </div>
            </div>

            {/* AI Bounding box graphics */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {activeCam.detectedObject && isPlaying && (
                <div className="relative border-2 border-danger-bright w-64 h-36 animate-pulse flex flex-col justify-between p-2">
                  <div className="absolute -top-6 -left-0.5 bg-danger-bright text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    AI: {activeCam.detectedObject} [{activeCam.confidence}%]
                  </div>
                  <div className="absolute -bottom-6 -left-0.5 bg-brand text-bg text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    PLATE: {activeCam.licensePlate}
                  </div>
                  <div className="absolute top-0 right-0 p-1 font-mono text-[9px] text-danger-bright bg-black/60 rounded">
                    MATCH CONFIRMED
                  </div>
                  <div className="border border-dashed border-danger-bright/60 w-full h-full" />
                </div>
              )}

              {/* Background Mock Video Feed Visual */}
              <div className="absolute inset-0 z-0 bg-cover bg-center opacity-65 select-none" style={{
                backgroundImage: `radial-gradient(circle, transparent 20%, rgba(0,0,0,0.85) 100%), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop')`
              }} />
              
              {/* Scanlines / CCTV noise effect */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%)] opacity-40" />
            </div>

            {/* Bottom Controls panel */}
            <div className="p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3">
                {/* Play controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-9 w-9 rounded-full bg-brand text-bg flex items-center justify-center hover:bg-brand-bright transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => setSystemTime('22:30:00')}
                    className="p-1.5 text-white/80 hover:text-white transition-colors"
                    title="Rewind to incident start"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <div className="flex items-center gap-1 bg-white/10 rounded px-2 py-1 text-xs">
                    <span className="text-white/60">Speed:</span>
                    <button onClick={() => setPlaybackSpeed(1)} className={`px-1 rounded ${playbackSpeed === 1 ? 'bg-brand text-bg font-bold' : 'hover:bg-white/10'}`}>1x</button>
                    <button onClick={() => setPlaybackSpeed(2)} className={`px-1 rounded ${playbackSpeed === 2 ? 'bg-brand text-bg font-bold' : 'hover:bg-white/10'}`}>2x</button>
                    <button onClick={() => setPlaybackSpeed(4)} className={`px-1 rounded ${playbackSpeed === 4 ? 'bg-brand text-bg font-bold' : 'hover:bg-white/10'}`}>4x</button>
                  </div>
                </div>

                {/* Status Bar info */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-white/70">
                    STATUS: <span className="text-success-bright">CONNECTED</span>
                  </div>
                  <div className="text-white/70">
                    DETECTION: <span className="text-brand">VAN MATCHED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Logs and metadata */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-5 rounded-2xl bg-surface border border-border-soft space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border-soft pb-2 text-brand flex items-center gap-2">
                <Shield size={16} /> AI License Plate Recognition
              </h3>
              {activeCam.detectedObject ? (
                <div className="space-y-3">
                  <div className="p-3 bg-bg-elev border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-text-dim uppercase font-mono">Recognized Plate</div>
                      <div className="text-lg font-bold text-text font-mono mt-0.5">{activeCam.licensePlate}</div>
                    </div>
                    <span className="bg-danger/25 text-danger-bright text-xs px-2.5 py-1 rounded font-bold border border-danger/30">
                      FLAGGED VEHICLE
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-text-dim">
                    <div className="flex justify-between">
                      <span>Vehicle Category:</span>
                      <span className="font-bold text-text">Commercial Van</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Associated Case:</span>
                      <span className="font-bold text-brand font-mono">CR-KHD-2026-00541</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crime Description:</span>
                      <span className="font-bold text-text">Vehicle Theft</span>
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
                <Activity size={16} /> Intel Engine Alerts
              </h3>
              <div className="space-y-2">
                {activeDetections.map((det, i) => (
                  <div key={i} className="p-2.5 bg-bg-elev border border-border-soft rounded-lg text-xs font-mono flex items-center justify-between animate-fade-in">
                    <span className="text-text-dim">{det}</span>
                    <span className="text-[10px] text-brand">ACTIVE</span>
                  </div>
                ))}
                {activeDetections.length === 0 && (
                  <div className="text-xs text-text-faint italic py-4">
                    Scanning surveillance nodes...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
