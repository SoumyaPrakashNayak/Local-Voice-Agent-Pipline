import React, { useRef, useState, useEffect } from 'react';
import { useKaren } from './KarenProvider';
import { useMockState } from '../../mockServices/MockStateContext';

export function KarenOrb() {
  const { isOpen, setIsOpen, position, setPosition, listeningState } = useKaren();
  const { state } = useMockState();

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
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(79, 168, 184, 0.45)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 0 24px rgba(79, 168, 184, 0.75)); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .karen-orb-container {
          animation: orb-breathe 4s ease-in-out infinite;
        }
        .karen-orb-outer-polygon {
          transform-origin: 50px 50px;
          animation: spin-slow 25s linear infinite;
        }
        .karen-orb-inner-polygon {
          transform-origin: 50px 50px;
          animation: spin-reverse 15s linear infinite;
        }
        .karen-orb-sphere {
          background: radial-gradient(circle at 35% 35%, #00F3FF 0%, #7000FF 60%, #150035 100%);
          box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.4), 0 0 15px rgba(0, 243, 255, 0.5);
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

        {/* Hexagonal AI Core */}
        <div className={`relative w-16 h-16 flex items-center justify-center transition-all duration-300 ${
          listeningState === 'LISTENING' ? 'animate-pulse' : ''
        }`}>
          <svg className="w-full h-full drop-shadow-glow" viewBox="0 0 100 100" fill="none">
            {/* Outer Rotating Hexagon Frame */}
            <polygon
              points="50,3 93,28 93,78 50,97 7,78 7,28"
              className="fill-bg-elev/80 stroke-brand karen-orb-outer-polygon"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inner detailed ring rotating in reverse */}
            <polygon
              points="50,15 80,32 80,68 50,85 20,68 20,32"
              className="fill-surface/20 stroke-accent/50 karen-orb-inner-polygon"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeDasharray="4 2"
            />
            {/* Center glowing core (similar to DRISHTI gradient sphere) */}
            <foreignObject x="36" y="36" width="28" height="28">
              <div className="w-full h-full rounded-full karen-orb-sphere animate-pulse" />
            </foreignObject>
            <circle cx="50" cy="50" r="5" className="fill-white" />
          </svg>
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
