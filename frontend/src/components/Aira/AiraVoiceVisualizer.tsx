import { useEffect, useRef } from 'react';
import { AiraListeningState } from './AiraProvider';

interface AiraVoiceVisualizerProps {
  state: AiraListeningState;
  audioLevel?: number; // 0 to 1 real microphone energy
  isCompact?: boolean;
}

export function AiraVoiceVisualizer({ state, audioLevel = 0, isCompact = false }: AiraVoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isListening = state === 'LISTENING';
      const isSpeaking = state === 'AIRA_SPEAKING';
      const isProcessing = state === 'PROCESSING';
      const isConnecting = state === 'CONNECTING' || state === 'REQUESTING_MIC';

      const numBars = isCompact ? 16 : 28;
      const barWidth = Math.max(2, (width / numBars) - 2);
      const centerY = height / 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2) + 2;
        let amplitude = 0.05; // flat idle line

        // Center-weighted bell curve factor
        const centerWeight = Math.sin((i / (numBars - 1)) * Math.PI);

        if (isListening) {
          // Pure real microphone audio energy
          if (audioLevel > 0.01) {
            amplitude = Math.min(1.0, audioLevel * (0.8 + 1.2 * centerWeight));
          } else {
            amplitude = 0.04; // truly idle when quiet
          }
        } else if (isSpeaking) {
          // Agent speaking pulse
          const wave = (Math.sin(phase * 1.5 + i * 0.4) + 1) / 2;
          amplitude = 0.2 + wave * 0.5 * centerWeight;
        } else if (isProcessing) {
          // Processing shimmer
          const wave = (Math.sin(phase * 2 + i * 0.6) + 1) / 2;
          amplitude = 0.15 + wave * 0.35 * centerWeight;
        } else if (isConnecting) {
          // Subtle connect scan
          const wave = (Math.sin(phase + i * 0.3) + 1) / 2;
          amplitude = 0.08 + wave * 0.15;
        }

        const barHeight = Math.max(2, amplitude * (height * 0.9));
        const y = centerY - barHeight / 2;

        let color = '#0284c7'; // muted cyan
        if (isListening) {
          color = audioLevel > 0.08 ? '#22d3ee' : '#38bdf8';
        } else if (isSpeaking) {
          color = '#f59e0b'; // amber
        } else if (isProcessing) {
          color = '#c084fc'; // purple
        } else if (state === 'ERROR') {
          color = '#ef4444'; // red
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, 2);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      phase += 0.06;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, audioLevel, isCompact]);

  return (
    <div className={`w-full flex items-center justify-center ${isCompact ? 'h-8' : 'h-16'}`}>
      <canvas
        ref={canvasRef}
        width={isCompact ? 160 : 320}
        height={isCompact ? 32 : 64}
        className="w-full h-full max-w-[340px]"
      />
    </div>
  );
}
