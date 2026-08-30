import React, { useEffect, useRef, useState } from 'react';

interface RotatingGlobeProps {
  theme: 'light' | 'dark';
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
}

interface GlobeNode {
  lat: number; // latitude in radians
  lon: number; // longitude in radians
  label: string;
  color: string;
}

export function RotatingGlobe({ theme }: RotatingGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load the cyber map texture
  useEffect(() => {
    const img = new Image();
    img.src = '/cyber_world_map.png';
    img.onload = () => {
      mapImageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Twinkling background stars
    const stars: Star[] = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.3 + 0.6,
      speed: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    // Predefined coordinates for Odisha Police hubs
    const nodes: GlobeNode[] = [
      { lat: 0.35, lon: 1.38, label: 'Khandagiri PS', color: '#B88922' }, 
      { lat: 0.28, lon: 1.42, label: 'Cuttack HQ', color: '#38BDF8' },
      { lat: 0.85, lon: 0.15, label: 'Interpol HQ', color: '#10B981' }, 
      { lat: 0.65, lon: -1.25, label: 'Command West', color: '#EC4899' }, 
      { lat: -0.45, lon: 2.25, label: 'Command South', color: '#F59E0B' }, 
    ];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = theme === 'light';

      // 1. Render starfield
      stars.forEach((star) => {
        star.phase += star.speed;
        const opacity = (Math.sin(star.phase) + 1) / 2;
        ctx.fillStyle = isLight
          ? `rgba(15, 23, 42, ${opacity * 0.1})`
          : `rgba(255, 255, 255, ${opacity * 0.45})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Setup Sizing
      const R = Math.min(width * 0.26, height * 0.35, 220);
      const cx = width * 0.5;
      const cy = height * 0.5;

      const img = mapImageRef.current;
      const angle = (Date.now() * 0.0001) % (Math.PI * 2);

      // 3. Atmospheric Outer Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.3);
      if (isLight) {
        glowGrad.addColorStop(0, 'rgba(29, 78, 216, 0.1)');
        glowGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
        glowGrad.addColorStop(0.5, 'rgba(30, 64, 120, 0.06)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 4. Render Sphere Map
      if (imageLoaded && img) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = isLight ? '#F1F5F9' : '#0B0F19';
        ctx.fill();

        const textureW = R * 4;
        const xOffset = (angle / (Math.PI * 2)) * textureW;

        ctx.drawImage(img, cx - xOffset, cy - R, textureW, R * 2);
        ctx.drawImage(img, cx - xOffset + textureW, cy - R, textureW, R * 2);
        ctx.drawImage(img, cx - xOffset - textureW, cy - R, textureW, R * 2);

        // 3D Spherical Edge Shadow Overlay
        const sphereShading = ctx.createRadialGradient(cx - R * 0.15, cy - R * 0.15, R * 0.5, cx, cy, R);
        if (isLight) {
          sphereShading.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
          sphereShading.addColorStop(0.75, 'rgba(148, 163, 184, 0.2)');
          sphereShading.addColorStop(1, 'rgba(71, 85, 105, 0.6)');
        } else {
          sphereShading.addColorStop(0, 'rgba(255, 255, 255, 0)');
          sphereShading.addColorStop(0.7, 'rgba(10, 15, 30, 0.45)');
          sphereShading.addColorStop(1, 'rgba(5, 7, 12, 0.95)');
        }
        ctx.fillStyle = sphereShading;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        // 3D Specular Highlight Overlay
        const specShading = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.35, cy - R * 0.35, R * 0.6);
        specShading.addColorStop(0, isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(56, 189, 248, 0.15)');
        specShading.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specShading;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        ctx.strokeStyle = isLight ? 'rgba(148, 163, 184, 0.25)' : 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Rotating Network Nodes & Connections
      const projectedNodes: { x: number; y: number; node: GlobeNode; isVisible: boolean }[] = [];

      nodes.forEach((node) => {
        const currentLon = node.lon + angle;
        const x3d = Math.cos(node.lat) * Math.sin(currentLon);
        const y3d = Math.sin(node.lat);
        const z3d = Math.cos(node.lat) * Math.cos(currentLon);

        const nodeX = cx + x3d * R;
        const nodeY = cy - y3d * R;
        const isVisible = z3d > 0;

        projectedNodes.push({ x: nodeX, y: nodeY, node, isVisible });
      });

      // Draw Connection Links
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          if (n1.isVisible && n2.isVisible) {
            const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
            if (dist < R * 1.4) {
              const alpha = (1 - dist / (R * 1.4)) * (isLight ? 0.12 : 0.3);
              ctx.strokeStyle = isLight
                ? `rgba(71, 85, 105, ${alpha})`
                : `rgba(56, 189, 248, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Nodes
      projectedNodes.forEach(({ x, y, node, isVisible }) => {
        if (!isVisible) return;

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        const pulseR = 5 + (Math.sin(Date.now() * 0.004 + node.lat * 10) + 1) * 2.5;
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, pulseR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isLight ? '#475569' : '#CBD5E1';
        ctx.font = '7px monospace';
        ctx.fillText(node.label, x + 7, y + 2);
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [imageLoaded, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
