/**
 * IntelligenceGraph — CrimeLens Network Explorer Canvas
 * High-precision SVG graph with collision-free force-layout simulation,
 * police intelligence HUD aesthetic, and crisp label backgrounds.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  NetworkNode, NetworkEdge, NodeType,
  getConnectedNodes, getNodeEdges
} from '../../mockServices/networkGraphData';

// ─── Visual constants ─────────────────────────────────────────────────────────

const NODE_RADIUS: Record<NodeType, number> = {
  STATION: 32,
  CASE: 28,
  PERSON: 24,
  PHONE: 22,
  VEHICLE: 22,
  LOCATION: 22,
  EVIDENCE: 20,
};

const NODE_COLOR: Record<NodeType, string> = {
  STATION: '#f59e0b',
  CASE: '#38bdf8',
  PERSON: '#ec4899',
  PHONE: '#10b981',
  VEHICLE: '#8b5cf6',
  LOCATION: '#f97316',
  EVIDENCE: '#94a3b8',
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

// ─── Deterministic Cluster Layout ───────────────────────────────────────────

function buildInitialLayout(nodes: NetworkNode[], width: number, height: number): LayoutNode[] {
  const cx = width / 2;
  const cy = height / 2;

  const stationNodes = nodes.filter(n => n.type === 'STATION');
  const caseNodes = nodes.filter(n => n.type === 'CASE');
  const otherNodes = nodes.filter(n => n.type !== 'STATION' && n.type !== 'CASE');

  const layout: LayoutNode[] = [];

  // 1. Position Stations on left & right poles
  stationNodes.forEach((st, idx) => {
    const angle = idx === 0 ? Math.PI : 0; // Left (Khandagiri) vs Right (Cuttack)
    const dist = Math.min(width, height) * 0.32;
    layout.push({
      ...st,
      x: cx + Math.cos(angle) * dist,
      y: cy + (idx === 0 ? -20 : 20),
      vx: 0,
      vy: 0,
    });
  });

  // 2. Position Cases clustered near stations
  caseNodes.forEach((c, idx) => {
    const isLocal = c.isLocal;
    const baseAngle = isLocal ? Math.PI * 0.85 : Math.PI * 0.15;
    const offsetAngle = (idx % 3 - 1) * 0.45;
    const totalAngle = baseAngle + offsetAngle;
    const dist = Math.min(width, height) * 0.22;
    layout.push({
      ...c,
      x: cx + Math.cos(totalAngle) * dist,
      y: cy + Math.sin(totalAngle) * dist * 0.9,
      vx: 0,
      vy: 0,
    });
  });

  // 3. Position Entities distributed around periphery with cross-station in the bridge zone
  otherNodes.forEach((node, idx) => {
    let x = cx;
    let y = cy;

    if (node.isCrossStation) {
      // Bridge zone in vertical center column
      const span = (idx % 4 - 1.5) * 80;
      x = cx + (idx % 2 === 0 ? -30 : 30);
      y = cy + span;
    } else {
      const angle = (idx / Math.max(1, otherNodes.length)) * 2 * Math.PI;
      const radius = Math.min(width, height) * (0.34 + (idx % 3) * 0.04);
      x = cx + Math.cos(angle) * radius;
      y = cy + Math.sin(angle) * radius * 0.85;
    }

    layout.push({ ...node, x, y, vx: 0, vy: 0 });
  });

  return layout;
}

// ─── Force Step with Anti-Overlap Collision Resolution ─────────────────────

function runForceStep(nodes: LayoutNode[], edges: NetworkEdge[], width: number, height: number): LayoutNode[] {
  const alpha = 0.08;
  const repulsion = 4500;
  const attraction = 0.022;
  const centerForce = 0.005;

  const updated = nodes.map(n => ({ ...n }));

  // 1. Aggressive Pairwise Repulsion & Hard Collision Bounds
  for (let i = 0; i < updated.length; i++) {
    for (let j = i + 1; j < updated.length; j++) {
      const dx = updated[j].x - updated[i].x;
      const dy = updated[j].y - updated[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      const r_i = NODE_RADIUS[updated[i].type as NodeType] || 24;
      const r_j = NODE_RADIUS[updated[j].type as NodeType] || 24;
      const minDist = r_i + r_j + 65; // Safe label + node clearance

      if (dist < minDist) {
        // Direct overlap avoidance push
        const overlap = (minDist - dist) * 0.35;
        const pushX = (dx / dist) * overlap;
        const pushY = (dy / dist) * overlap;
        updated[i].vx -= pushX;
        updated[i].vy -= pushY;
        updated[j].vx += pushX;
        updated[j].vy += pushY;
      } else {
        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        updated[i].vx -= fx * alpha;
        updated[i].vy -= fy * alpha;
        updated[j].vx += fx * alpha;
        updated[j].vy += fy * alpha;
      }
    }
  }

  // 2. Spring Attraction along Edges
  edges.forEach(e => {
    const src = updated.find(n => n.id === e.source);
    const tgt = updated.find(n => n.id === e.target);
    if (!src || !tgt) return;

    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const idealDist = e.isCrossStation ? 220 : 150;
    const force = (dist - idealDist) * attraction;

    src.vx += (dx / dist) * force;
    src.vy += (dy / dist) * force;
    tgt.vx -= (dx / dist) * force;
    tgt.vy -= (dy / dist) * force;
  });

  // 3. Center Gravity
  const cx = width / 2;
  const cy = height / 2;
  updated.forEach(n => {
    n.vx += (cx - n.x) * centerForce;
    n.vy += (cy - n.y) * centerForce;
  });

  // 4. Dampen and Clamp within Canvas
  const margin = 70;
  updated.forEach(n => {
    n.vx *= 0.68;
    n.vy *= 0.68;
    n.x = Math.max(margin, Math.min(width - margin, n.x + n.vx));
    n.y = Math.max(margin, Math.min(height - margin, n.y + n.vy));
  });

  return updated;
}

// ─── Main Component ─────────────────────────────────────────────────────────

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

  // Initialize layout with iterative relaxation
  useEffect(() => {
    let current = buildInitialLayout(nodes, width, height);
    setLayoutNodes(current);

    let frames = 0;
    const maxFrames = 75;

    const tick = () => {
      if (frames++ < maxFrames) {
        current = runForceStep(current, edges, width, height);
        setLayoutNodes([...current]);
        simulationRef.current = requestAnimationFrame(tick);
      }
    };

    simulationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(simulationRef.current);
  }, [nodes.length, edges.length, width, height]);

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

  const handleMouseUp = () => {
    setDragging(null);
    setDragPan(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.4, Math.min(2.5, z - e.deltaY * 0.001)));
  };

  const fitGraph = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const isHighlighted = (id: string) => !highlightedNodeIds || highlightedNodeIds.size === 0 || highlightedNodeIds.has(id);

  return (
    <div className="relative w-full h-full overflow-hidden bg-bg rounded-2xl border border-border-soft">
      {/* Tactical HUD Header Bar */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border-soft shadow-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-dim">
          GRID: ODISHA-INTEL-NET // {nodes.length} NODES · {edges.length} RELATIONS
        </span>
      </div>

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
          {/* Tactical Grid */}
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="var(--border)" strokeWidth="0.6" opacity="0.35" />
            <circle cx="0" cy="0" r="1" fill="var(--border)" opacity="0.6" />
          </pattern>

          {/* Markers */}
          <marker id="arrow-default" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="var(--border-soft)" opacity="0.7" />
          </marker>
          <marker id="arrow-cross" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 z" fill="var(--danger-bright)" opacity="0.9" />
          </marker>
          <marker id="arrow-ai" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 z" fill="var(--accent-bright)" opacity="0.85" />
          </marker>

          {/* Glow Filters */}
          <filter id="glow-brand" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-sm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Background & HUD Crosshairs */}
        <rect width={width} height={height} fill="transparent" className="canvas-bg" />
        <rect width={width} height={height} fill="url(#grid)" className="canvas-bg" />

        {/* Tactical Corner HUD Accents */}
        <path d="M 12 28 L 12 12 L 28 12" fill="none" stroke="var(--border)" strokeWidth="1.5" opacity="0.5" />
        <path d={`M ${width - 28} 12 L ${width - 12} 12 L ${width - 12} 28`} fill="none" stroke="var(--border)" strokeWidth="1.5" opacity="0.5" />
        <path d={`M 12 ${height - 28} L 12 ${height - 12} L 28 ${height - 12}`} fill="none" stroke="var(--border)" strokeWidth="1.5" opacity="0.5" />
        <path d={`M ${width - 28} ${height - 12} L ${width - 12} ${height - 12} L ${width - 12} ${height - 28}`} fill="none" stroke="var(--border)" strokeWidth="1.5" opacity="0.5" />

        {/* Graph World Group (Pan & Zoom) */}
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

          {/* ── EDGES ── */}
          {edges.map(edge => {
            const src = getLayoutNode(edge.source);
            const tgt = getLayoutNode(edge.target);
            if (!src || !tgt) return null;

            const isCS = edge.isCrossStation;
            const isAI = edge.isAiDiscovered;
            const edgeColor = isCS ? 'var(--danger-bright)' : isAI ? 'var(--accent-bright)' : 'var(--border-soft)';
            const edgeOpacity = isHighlighted(edge.source) && isHighlighted(edge.target) ? 0.85 : 0.18;

            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const srcR = (NODE_RADIUS[src.type as NodeType] || 22) + 3;
            const tgtR = (NODE_RADIUS[tgt.type as NodeType] || 22) + 8;

            const sx = src.x + (dx / dist) * srcR;
            const sy = src.y + (dy / dist) * srcR;
            const tx = tgt.x - (dx / dist) * tgtR;
            const ty = tgt.y - (dy / dist) * tgtR;

            // Midpoint coordinates for relationship badge
            const mx = (sx + tx) / 2;
            const my = (sy + ty) / 2;

            return (
              <g key={edge.id} opacity={edgeOpacity}>
                {/* Edge line */}
                <line
                  x1={sx} y1={sy} x2={tx} y2={ty}
                  stroke={edgeColor}
                  strokeWidth={isCS ? 2.2 : isAI ? 1.8 : 1.4}
                  strokeDasharray={isCS ? '8 4' : isAI ? '5 3' : undefined}
                  markerEnd={isCS ? 'url(#arrow-cross)' : isAI ? 'url(#arrow-ai)' : 'url(#arrow-default)'}
                />

                {/* Tactical Edge Pill Badge */}
                {(isCS || isAI) && (
                  <g transform={`translate(${mx}, ${my})`}>
                    <rect
                      x="-44"
                      y="-9"
                      width="88"
                      height="18"
                      rx="9"
                      fill="var(--bg)"
                      stroke={edgeColor}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={edgeColor}
                      className="pointer-events-none"
                    >
                      {isCS ? '⚡ CROSS-PS' : '✦ AI LINK'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── NODES ── */}
          {layoutNodes.map(node => {
            const r = NODE_RADIUS[node.type as NodeType] || 22;
            const color = NODE_COLOR[node.type as NodeType] || '#888';
            const isSelected = node.id === selectedNodeId;
            const isRestricted = node.accessStatus === 'RESTRICTED';
            const dimmed = !isHighlighted(node.id);

            const labelText = node.label.length > 20 ? node.label.slice(0, 18) + '…' : node.label;
            const badgeWidth = Math.max(70, labelText.length * 7 + 16);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: 'pointer', opacity: dimmed ? 0.25 : 1 }}
                onMouseDown={e => handleNodeMouseDown(e, node.id)}
                onClick={() => onNodeClick(node)}
              >
                {/* Glowing Outer Selection Ring */}
                {isSelected && (
                  <circle
                    r={r + 9}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    opacity="0.8"
                    filter="url(#glow-brand)"
                    className="animate-pulse"
                  />
                )}

                {/* Cross-station Dashed Orbit */}
                {node.isCrossStation && !isRestricted && (
                  <circle
                    r={r + 6}
                    fill="none"
                    stroke="var(--accent-bright)"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    opacity="0.75"
                  />
                )}

                {/* Node Solid Circle */}
                <circle
                  r={r}
                  fill={isRestricted ? 'var(--bg-elev)' : color}
                  stroke={isRestricted ? 'var(--danger-bright)' : isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isSelected ? 2.5 : isRestricted ? 2 : 1}
                  opacity={isRestricted ? 0.6 : 0.95}
                  filter={isSelected ? 'url(#glow-sm)' : undefined}
                />

                {/* Node Icon */}
                {isRestricted ? (
                  <g transform={`translate(-8,-9)`}>
                    <path
                      d="M3 10H1V7a5 5 0 0110 0v3h-2V7a3 3 0 00-6 0v3zm9 0H2a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-6a1 1 0 00-1-1zm-5 4a1 1 0 11.001 2.001A1 1 0 016 14z"
                      fill="var(--danger-bright)"
                      transform="scale(0.85)"
                    />
                  </g>
                ) : (
                  <g transform={`translate(-9,-9)`} className="pointer-events-none">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.95"
                    >
                      <path d={ICON_PATHS[node.type as NodeType]} />
                    </svg>
                  </g>
                )}

                {/* Readable Label Pill Background */}
                <g transform={`translate(0, ${r + 6})`}>
                  <rect
                    x={-badgeWidth / 2}
                    y="0"
                    width={badgeWidth}
                    height={node.sublabel ? "28" : "18"}
                    rx="6"
                    fill="var(--bg-elev)"
                    stroke={isSelected ? color : "var(--border-soft)"}
                    strokeWidth={isSelected ? "1.5" : "1"}
                    opacity="0.95"
                    className="shadow-sm"
                  />
                  <text
                    y="12"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill={isRestricted ? 'var(--danger-bright)' : isSelected ? 'var(--accent-bright)' : 'var(--text)'}
                    className="pointer-events-none"
                  >
                    {labelText}
                  </text>
                  {node.sublabel && (
                    <text
                      y="23"
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="monospace"
                      fill={isRestricted ? 'var(--danger-bright)' : 'var(--text-dim)'}
                      className="pointer-events-none"
                    >
                      {node.sublabel.length > 22 ? node.sublabel.slice(0, 20) + '…' : node.sublabel}
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </g>

        {/* ── HUD Fit & Zoom Controls ── */}
        <g transform={`translate(${width - 48}, 16)`}>
          <rect width="36" height="108" rx="8" fill="var(--surface)" stroke="var(--border)" opacity="0.9" />
          {[
            { label: '+', dy: 0, action: () => setZoom(z => Math.min(2.5, z + 0.18)), title: 'Zoom In' },
            { label: '−', dy: 36, action: () => setZoom(z => Math.max(0.4, z - 0.18)), title: 'Zoom Out' },
            { label: '⌖', dy: 72, action: fitGraph, title: 'Reset View' },
          ].map(btn => (
            <g key={btn.dy} transform={`translate(0,${btn.dy})`} onClick={btn.action} style={{ cursor: 'pointer' }}>
              <rect width="36" height="36" rx="8" fill="transparent" className="hover:fill-surface-hover transition-colors" />
              <text x="18" y="23" textAnchor="middle" fontSize="16" fontFamily="monospace" fontWeight="bold" fill="var(--text-dim)">{btn.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
