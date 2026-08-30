import React, { useEffect, useRef } from 'react';

interface CinematicEarthProps {
  theme: 'light' | 'dark';
}

export function CinematicEarthBackground({ theme }: CinematicEarthProps) {
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance canvas for twinkling space stars
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const stars = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.48),
      size: Math.random() * 1.5 + 0.6,
      speed: 0.012 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = theme === 'light';

      stars.forEach((star) => {
        star.phase += star.speed;
        const opacity = (Math.sin(star.phase) + 1) / 2;
        ctx.fillStyle = isLight
          ? `rgba(15, 23, 42, ${opacity * 0.15})`
          : `rgba(255, 255, 255, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none bg-[#050811]">
      <style>{`
        /* Slow, cinematic planetary low-orbit rotation across the horizon */
        @keyframes orbitalEarthPan {
          0% {
            transform: scale(1.12) translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: scale(1.15) translate(-25px, -10px) rotate(0.4deg);
          }
          50% {
            transform: scale(1.18) translate(-50px, 0px) rotate(0.8deg);
          }
          75% {
            transform: scale(1.15) translate(-25px, 10px) rotate(0.4deg);
          }
          100% {
            transform: scale(1.12) translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes atmosphericPulse {
          0%, 100% { opacity: 0.65; transform: scaleY(1); }
          50% { opacity: 0.95; transform: scaleY(1.04); }
        }

        @keyframes cityLightShimmer {
          0%, 100% { filter: brightness(1) contrast(1.1); }
          50% { filter: brightness(1.12) contrast(1.18); }
        }
      `}</style>

      {/* ─── 1. Ultra-HD NASA Satellite Earth at Night (India & Asia centered) ─── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/earthBg.jpg')",
          backgroundPosition: 'center 42%',
          animation: 'orbitalEarthPan 80s ease-in-out infinite, cityLightShimmer 12s ease-in-out infinite alternate',
          willChange: 'transform, filter',
          filter: isLight
            ? 'brightness(1.05) contrast(0.95) saturate(0.85)'
            : 'brightness(0.95) contrast(1.15) saturate(1.15)',
        }}
      />

      {/* ─── 2. Atmospheric Blue Limb Curve Glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse 95% 60% at 50% 16%, rgba(56, 189, 248, 0.22) 0%, rgba(30, 64, 175, 0.08) 50%, transparent 80%)'
            : 'radial-gradient(ellipse 95% 60% at 50% 16%, rgba(56, 189, 248, 0.35) 0%, rgba(14, 116, 144, 0.16) 50%, transparent 80%)',
          animation: 'atmosphericPulse 10s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* ─── 3. Vignette Overlay for Crisp UI Legibility ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.30) 0%, rgba(248, 250, 252, 0.82) 75%, #F8FAFC 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(10, 15, 30, 0.40) 0%, rgba(7, 10, 19, 0.85) 75%, #050811 100%)',
        }}
      />

      {/* ─── 4. Space Twinkling Stars ─── */}
      <canvas ref={starCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ─── 5. Tactical Telemetry Indicator ─── */}
      <div className="absolute top-20 right-8 font-mono text-[9px] text-sky-400/40 tracking-widest uppercase hidden lg:block pointer-events-none">
        <div>GEO: 20.2961° N, 85.8245° E</div>
        <div className="text-[8px] text-amber-500/40">ODISHA POLICE COMMAND · SATELLITE ORBITAL SYNC</div>
      </div>
    </div>
  );
}
