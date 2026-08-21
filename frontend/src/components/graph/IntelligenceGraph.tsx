/**
 * IntelligenceGraph — CrimeLens Network Explorer Canvas
 * Pure React + SVG graph with simple force-layout simulation.
 * No external graph libraries needed.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  NetworkNode, NetworkEdge, NodeType, RelationshipType,
  getConnectedNodes, getNodeEdges
} from '../../mockServices/networkGraphData';

// ─── Visual constants ─────────────────────────────────────────────────────────

const NODE_RADIUS: Record<NodeType, number> = {
  STATION: 30,
  CASE: 26,
  PERSON: 22,
  PHONE: 20,
  VEHICLE: 20,
  LOCATION: 20,
  EVIDENCE: 18,
};

const NODE_COLOR: Record<NodeType, string> = {
  STATION: 'var(--brand)',
  CASE: 'var(--accent-bright)',
  PERSON: '#f59e0b',
  PHONE: '#10b981',
  VEHICLE: '#8b5cf6',
  LOCATION: '#f97316',
  EVIDENCE: '#64748b',
};

const EDGE_COLOR: Record<string, string> = {
  CROSS_STATION: 'var(--danger-bright)',
  AI_DISCOVERED: 'var(--accent-bright)',
  DEFAULT: 'var(--border)',
};

const ICON_PATHS: Record<NodeType, string> = {
  STATION: 'M3 21h18M6 21V7l6-4 6 4v14M9 21V11h6v10',
  CASE: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  PERSON: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8',
  PHONE: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  VEHICLE: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3M16 17a2 2 0 11-4 0 2 2 0 014 0M9 17a2 2 0 11-4 0 2 2 0 014 0',
  LOCATION: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  EVIDENCE: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface LayoutNode extends NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface IntelligenceGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  selectedNodeId: string | null;
  highlightedNodeIds?: Set<string>;
  onNodeClick: (node: NetworkNode) => void;
  width?: number;
  height?: number;
}

// ─── Force simulation helper ──────────────────────────────────────────────────

function buildInitialLayout(nodes: NetworkNode[], width: number, height: number): LayoutNode[] {
  // Arrange nodes in a semantic layout
  const cx = width / 2;
  const cy = height / 2;

  return nodes.map((n, i) => {
    let x = cx, y = cy;

    // Station ring
    if (n.type === 'STATION') {
      const idx = nodes.filter(nn => nn.type === 'STATION').indexOf(n as any);
      const total = nodes.filter(nn => nn.type === 'STATION').length;
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
      x = cx + Math.cos(angle) * Math.min(width, height) * 0.38;
      y = cy + Math.sin(angle) * Math.min(width, height) * 0.38;
    }
    // Cases — around centre
    else if (n.type === 'CASE') {
      const idx = nodes.filter(nn => nn.type === 'CASE').indexOf(n as any);
      const total = nodes.filter(nn => nn.type === 'CASE').length;
      const angle = (idx / total) * 2 * Math.PI;
      const r = n.isLocal ? Math.min(width, height) * 0.18 : Math.min(width, height) * 0.28;
      x = cx + Math.cos(angle) * r;
      y = cy + Math.sin(angle) * r;
    }
    // Entities — scatter
    else {
      const angle = (i / nodes.length) * 2 * Math.PI + Math.random() * 0.3;
      const r = Math.min(width, height) * (0.10 + Math.random() * 0.20);
      x = cx + Math.cos(angle) * r;
      y = cy + Math.sin(angle) * r;
    }

    // Clamp
    x = Math.max(60, Math.min(width - 60, x));
    y = Math.max(60, Math.min(height - 60, y));

    return { ...n, x, y, vx: 0, vy: 0 };
  });
}

function runForceStep(nodes: LayoutNode[], edges: NetworkEdge[], width: number, height: number): LayoutNode[] {
  const alpha = 0.06;
  const repulsion = 2800;
  const attraction = 0.018;
  const centerForce = 0.008;

  const updated = nodes.map(n => ({ ...n }));

  // Repulsion
  for (let i = 0; i < updated.length; i++) {
    for (let j = i + 1; j < updated.length; j++) {
      const dx = updated[j].x - updated[i].x;
      const dy = updated[j].y - updated[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = repulsion / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      updated[i].vx -= fx * alpha;
      updated[i].vy -= fy * alpha;
      updated[j].vx += fx * alpha;
      updated[j].vy += fy * alpha;
    }
  }

  // Attraction along edges
  edges.forEach(e => {
    const src = updated.find(n => n.id === e.source);
    const tgt = updated.find(n => n.id === e.target);
    if (!src || !tgt) return;
    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const targetDist = e.isCrossStation ? 200 : 130;
    const force = (dist - targetDist) * attraction;
    src.vx += dx / dist * force;
    src.vy += dy / dist * force;
    tgt.vx -= dx / dist * force;
    tgt.vy -= dy / dist * force;
  });

  // Center pull
  const cx = width / 2, cy = height / 2;
  updated.forEach(n => {
    n.vx += (cx - n.x) * centerForce;
    n.vy += (cy - n.y) * centerForce;
  });

  // Apply velocity + dampen + clamp
  const margin = 60;
  updated.forEach(n => {
    n.vx *= 0.7;
    n.vy *= 0.7;
    n.x = Math.max(margin, Math.min(width - margin, n.x + n.vx));
    n.y = Math.max(margin, Math.min(height - margin, n.y + n.vy));
  });

  return updated;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function IntelligenceGraph({
  nodes, edges, selectedNodeId, highlightedNodeIds,
  onNodeClick, width = 900, height = 560,
}: IntelligenceGraphProps) {
  const [layoutNodes, setLayoutNodes] = useState<LayoutNode[]>([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPan, setDragPan] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const simulationRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize layout
  useEffect(() => {
    const initial = buildInitialLayout(nodes, width, height);
    setLayoutNodes(initial);

    // Run force simulation for 60 frames on mount
    let frames = 0;
    let current = initial;
    const tick = () => {
      if (frames++ < 60) {
        current = runForceStep(current, edges, width, height);
        setLayoutNodes([...current]);
        simulationRef.current = requestAnimationFrame(tick);
      }
    };
    simulationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(simulationRef.current);
  }, [nodes.length, edges.length]);

  const getLayoutNode = (id: string) => layoutNodes.find(n => n.id === id);

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDragging(id);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).classList.contains('canvas-bg')) {
      setDragPan(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;

    if (dragging) {
      setLayoutNodes(prev => prev.map(n =>
        n.id === dragging ? { ...n, x: n.x + dx / zoom, y: n.y + dy / zoom, vx: 0, vy: 0 } : n
      ));
    } else if (dragPan) {
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    }
    setLastMouse({ x: e.clientX, y: e.clientY });
  }, [dragging, dragPan, lastMouse, zoom]);

  const handleMouseUp = () => { setDragging(null); setDragPan(false); };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.5, z - e.deltaY * 0.001)));
  };

  const fitGraph = () => { setPan({ x: 0, y: 0 }); setZoom(1); };

  // ── Render ────────────────────────────────────────────────────────────────

  const isHighlighted = (id: string) => !highlightedNodeIds || highlightedNodeIds.size === 0 || highlightedNodeIds.has(id);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="w-full h-full cursor-grab select-none"
      style={{ cursor: dragPan ? 'grabbing' : dragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleSvgMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <defs>
        {/* Grid pattern */}
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
        </pattern>

        {/* Arrow markers */}
        <marker id="arrow-default" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--border)" opacity="0.6" />
        </marker>
        <marker id="arrow-cross" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--danger-bright)" opacity="0.8" />
        </marker>
        <marker id="arrow-ai" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-bright)" opacity="0.7" />
        </marker>

        {/* Glow filter */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill="transparent" className="canvas-bg" />
      <rect width={width} height={height} fill="url(#grid)" className="canvas-bg" />

      {/* Graph group (pan + zoom) */}
      <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

        {/* ── Edges ── */}
        {edges.map(edge => {
          const src = getLayoutNode(edge.source);
          const tgt = getLayoutNode(edge.target);
          if (!src || !tgt) return null;

          const isCS = edge.isCrossStation;
          const isAI = edge.isAiDiscovered;
          const edgeColor = isCS ? 'var(--danger-bright)' : isAI ? 'var(--accent-bright)' : 'var(--border-soft)';
          const edgeOpacity = isHighlighted(edge.source) && isHighlighted(edge.target) ? 0.85 : 0.2;

          // Midpoint for label
          const mx = (src.x + tgt.x) / 2;
          const my = (src.y + tgt.y) / 2;

          // Adjust endpoints to node radius
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const srcR = NODE_RADIUS[src.type as NodeType] + 2;
          const tgtR = NODE_RADIUS[tgt.type as NodeType] + 6;
          const sx = src.x + (dx / dist) * srcR;
          const sy = src.y + (dy / dist) * srcR;
          const tx = tgt.x - (dx / dist) * tgtR;
          const ty = tgt.y - (dy / dist) * tgtR;

          return (
            <g key={edge.id} opacity={edgeOpacity}>
              <line
                x1={sx} y1={sy} x2={tx} y2={ty}
                stroke={edgeColor}
                strokeWidth={isCS ? 2 : 1.5}
                strokeDasharray={isAI ? '5 3' : isCS ? '8 4' : undefined}
                markerEnd={isCS ? 'url(#arrow-cross)' : isAI ? 'url(#arrow-ai)' : 'url(#arrow-default)'}
              />
              {/* Edge label */}
              {(isCS || isAI) && (
                <text
                  x={mx} y={my - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill={edgeColor}
                  className="pointer-events-none"
                >
                  {isCS ? 'CROSS-STATION' : 'AI DISCOVERED'}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {layoutNodes.map(node => {
          const r = NODE_RADIUS[node.type as NodeType];
          const color = NODE_COLOR[node.type as NodeType] || '#888';
          const isSelected = node.id === selectedNodeId;
          const isRestricted = node.accessStatus === 'RESTRICTED';
          const dimmed = !isHighlighted(node.id);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              style={{ cursor: 'pointer', opacity: dimmed ? 0.3 : 1 }}
              onMouseDown={e => handleNodeMouseDown(e, node.id)}
              onClick={() => onNodeClick(node)}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle r={r + 8} fill="none" stroke={color} strokeWidth="2" opacity="0.5"
                  className="animate-pulse" filter="url(#glow-sm)" />
              )}

              {/* Cross-station ring */}
              {node.isCrossStation && !isRestricted && (
                <circle r={r + 5} fill="none" stroke="var(--accent-bright)" strokeWidth="1.5"
                  strokeDasharray="4 3" opacity="0.6" />
              )}

              {/* Node background */}
              <circle
                r={r}
                fill={isRestricted ? 'var(--bg-elev)' : color}
                stroke={isRestricted ? 'var(--danger-bright)' : isSelected ? color : 'transparent'}
                strokeWidth={isSelected ? 3 : isRestricted ? 2 : 0}
                opacity={isRestricted ? 0.5 : 0.9}
                filter={isSelected ? 'url(#glow-sm)' : undefined}
              />

              {/* Icon */}
              {isRestricted ? (
                // Lock icon for restricted
                <g transform={`translate(-8,-9)`}>
                  <path
                    d="M3 10H1V7a5 5 0 0110 0v3h-2V7a3 3 0 00-6 0v3zm9 0H2a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-6a1 1 0 00-1-1zm-5 4a1 1 0 11.001 2.001A1 1 0 016 14z"
                    fill="var(--danger-bright)"
                    transform="scale(0.85)"
                  />
                </g>
              ) : (
                <g transform={`translate(-9,-9)`} className="pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                    <path d={ICON_PATHS[node.type as NodeType]} />
                  </svg>
                </g>
              )}

              {/* Label */}
              <text
                y={r + 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                fill={isRestricted ? 'var(--danger-bright)' : 'var(--text)'}
                className="pointer-events-none"
              >
                {node.label.length > 18 ? node.label.slice(0, 16) + '…' : node.label}
              </text>
              {node.sublabel && (
                <text
                  y={r + 25}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fill={isRestricted ? 'var(--danger-bright)' : 'var(--text-dim)'}
                  className="pointer-events-none"
                >
                  {node.sublabel.length > 20 ? node.sublabel.slice(0, 18) + '…' : node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* ── Fit / Zoom controls ── */}
      <g transform={`translate(${width - 48},16)`}>
        <rect width="34" height="104" rx="6" fill="var(--surface)" stroke="var(--border)" />
        {[
          { label: '+', dy: 0, action: () => setZoom(z => Math.min(2.5, z + 0.15)) },
          { label: '−', dy: 34, action: () => setZoom(z => Math.max(0.3, z - 0.15)) },
          { label: '⌖', dy: 68, action: fitGraph },
        ].map(btn => (
          <g key={btn.dy} transform={`translate(0,${btn.dy})`} onClick={btn.action} style={{ cursor: 'pointer' }}>
            <rect width="34" height="34" rx="6" fill="transparent" className="hover:fill-surface-hover" />
            <text x="17" y="21" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="var(--text-dim)">{btn.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
