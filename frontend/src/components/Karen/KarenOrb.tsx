import React, { useRef, useState, useEffect } from 'react';
import { useKaren } from './KarenProvider';
import { useMockState } from '../../mockServices/MockStateContext';
import { useLocation } from 'react-router-dom';

export function KarenOrb() {
  const { isOpen, setIsOpen, position, setPosition, listeningState } = useKaren();
  const { state } = useMockState();
  const location = useLocation();
  const orbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mouseHasMoved = useRef(false);

  // Dragging only allowed when KAREN is collapsed (not open)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return; // Disable drag when open
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    mouseHasMoved.current = false;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    mouseHasMoved.current = true;
    
    // Calculate new position
    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;

    // Bounds checking (clamp inside viewport)
    const orbWidth = 90;
    const orbHeight = 90;
    newX = Math.max(10, Math.min(newX, window.innerWidth - orbWidth - 10));
    newY = Math.max(10, Math.min(newY, window.innerHeight - orbHeight - 10));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If it was just a simple click (mouse did not move much)
    if (!mouseHasMoved.current) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  // Adjust coordinates if window size changes
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) return; // Don't snap when open
      setPosition({
        x: Math.min(position.x, window.innerWidth - 120),
        y: Math.min(position.y, window.innerHeight - 120)
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, setPosition, isOpen]);

  // If user is not logged in, do not render Karen
  if (!state.currentUser) {
    return null;
  }
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  // Determine inline styles for transition between corner (idle) and center (activated)
  const style = isOpen
    ? {
        position: 'fixed' as const,
        left: '50%',
        top: '30%',
        transform: 'translate(-50%, -50%) scale(2.2)',
        cursor: 'default',
        zIndex: 9999,
        transition: 'all 0.8s cubic-bezier(0.25, 1, 0.25, 1)'
      }
    : {
        position: 'fixed' as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9990,
        transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 1, 0.25, 1)'
      };

  return (
    <div
      ref={orbRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={style}
      className="select-none"
    >
      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes radar-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(0, 243, 255, 0.45)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(0, 243, 255, 0.75)); }
        }
        @keyframes cap-float {
          0%, 100% { transform: translateY(0) rotate(15deg); }
          50% { transform: translateY(-2px) rotate(16deg); }
        }
        .radar-sweep-effect {
          transform-origin: 50px 50px;
          animation: radar-sweep 4s linear infinite;
        }
        .radar-sweep-effect-fast {
          transform-origin: 50px 50px;
          animation: radar-sweep 1.5s linear infinite;
        }
        .karen-orb-container {
          animation: radar-pulse 4s ease-in-out infinite;
        }
        .karen-police-cap {
          animation: cap-float 4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative flex flex-col items-center gap-1.5 p-2 karen-orb-container">
        {/* Glow effect surrounding orb */}
        <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
          listeningState === 'LISTENING'
            ? 'bg-danger-bright opacity-50 scale-125'
            : listeningState === 'PROCESSING'
            ? 'bg-accent-bright opacity-50 scale-110'
            : 'bg-brand opacity-30 group-hover:opacity-50 scale-100'
        }`} />

        {/* Police Cap Overlay (from reference image) */}
        <div className="absolute -top-6 -right-5 w-14 h-14 z-[9992] karen-police-cap pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Back Crown shadow */}
            <path d="M12,45 C2,25 35,10 50,10 C65,10 98,25 88,45 Z" fill="#0c1328" />
            {/* Navy Crown Top */}
            <path d="M15,42 C8,22 35,12 50,12 C65,12 92,22 85,42 C70,48 30,48 15,42 Z" fill="#1b2a4a" stroke="#00F3FF" strokeWidth="1" />
            {/* Cap Front Panel */}
            <path d="M22,40 C22,25 50,16 50,16 C50,16 78,25 78,40 C65,45 35,45 22,40 Z" fill="#141f36" />
            {/* Shiny black peak/visor */}
            <path d="M14,48 C30,62 70,62 86,48 C72,54 28,54 14,48 Z" fill="#080c14" />
            <path d="M20,49 C35,59 65,59 80,49 C68,52 32,52 20,49 Z" fill="#1c202c" opacity="0.8" />
            {/* Gold/Cyan Cap Strap */}
            <path d="M22,43 C38,48 62,48 78,43 C65,45 35,45 22,43 Z" fill="#00F3FF" opacity="0.7" />
            {/* Star badge */}
            <path d="M50,22 L53,28 L60,29 L55,34 L56,40 L50,37 L44,40 L45,34 L40,29 L47,28 Z" fill="#E3C077" stroke="#00F3FF" strokeWidth="0.5" />
            <circle cx="50" cy="31" r="3" fill="#111" />
            {/* Small letter K on badge */}
            <text x="48.5" y="33" fill="#00F3FF" fontSize="5" fontWeight="bold" fontFamily="monospace">k</text>
          </svg>
        </div>

        {/* Circular Radar/Sonar AI Core */}
        <div className={`relative w-20 h-20 flex items-center justify-center transition-all duration-500 rounded-full`}>
          <svg className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]" viewBox="0 0 100 100" fill="none">
            {/* Ambient Background Radial Glow */}
            <circle cx="50" cy="50" r="46" fill="url(#radar-glow)" />

            {/* Radar outer bounds and tick marks */}
            <circle cx="50" cy="50" r="45" stroke="#00F3FF" strokeWidth="1.5" strokeDasharray="3 4" className="opacity-60" />
            <circle cx="50" cy="50" r="41" stroke="#00F3FF" strokeWidth="1" strokeDasharray="1 6" className="opacity-40" />

            {/* Sonar sweep line - speeds up in PROCESSING state */}
            <path
              d="M50,50 L50,5 A45,45 0 0,1 95,50 Z"
              fill="url(#radar-sweep-gradient)"
              className={listeningState === 'PROCESSING' ? 'radar-sweep-effect-fast' : 'radar-sweep-effect'}
            />

            {/* Concentric inner grid circles */}
            <circle cx="50" cy="50" r="32" stroke="#00F3FF" strokeWidth="0.75" className="opacity-30" />
            <circle cx="50" cy="50" r="22" stroke="#7000FF" strokeWidth="0.75" className="opacity-40" />
            <circle cx="50" cy="50" r="14" stroke="#00F3FF" strokeWidth="0.5" className="opacity-20" />

            {/* Radial coordinate lines */}
            <line x1="50" y1="5" x2="50" y2="95" stroke="#00F3FF" strokeWidth="0.5" className="opacity-20" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#00F3FF" strokeWidth="0.5" className="opacity-20" />

            {/* Center core: Glowing intelligence engine */}
            <circle cx="50" cy="50" r="12" fill="#0d1124" stroke="#00F3FF" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="10" fill="#00F3FF" className="animate-pulse opacity-40" />
            <circle cx="50" cy="50" r="7" fill="#ffffff" />

            {/* Letter K stylized overlay inside the center core */}
            <text x="45.5" y="55.5" fill="#150035" fontSize="13" fontWeight="bold" fontFamily="sans-serif" className="select-none pointer-events-none">
              K
            </text>

            {/* Ambient gradients */}
            <defs>
              <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00F3FF" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#7000FF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0d1124" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="radar-sweep-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F3FF" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#00F3FF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00F3FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Active AI nodes particles */}
          <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-brand-bright animate-ping opacity-60 pointer-events-none" />
          <div className="absolute bottom-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-brand-bright animate-ping opacity-60 pointer-events-none" style={{ animationDelay: '1s' }} />
        </div>

        {/* Label (only show when not open/centered) */}
        {!isOpen && (
          <div className="bg-surface/90 border border-border-soft backdrop-blur-sm rounded-md px-2 py-0.5 shadow-sm text-center">
            <span className="text-[9px] font-mono font-bold tracking-widest text-text uppercase">
              ◇ KAREN
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
