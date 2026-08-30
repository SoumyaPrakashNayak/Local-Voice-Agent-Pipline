import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Info, ExternalLink, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface StationNetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  count: number;
  color: string;
  isHub?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface StationNetworkLink extends d3.SimulationLinkDatum<StationNetworkNode> {
  id: string;
  source: string | StationNetworkNode;
  target: string | StationNetworkNode;
  strength: 'HIGH' | 'MEDIUM' | 'LOW';
  similarity: number;
  matchedEntity: string;
  reason: string;
  matches: number;
}

const INITIAL_NODES: StationNetworkNode[] = [
  { id: 'hub', name: 'Khandagiri PS', count: 12, color: '#6366F1', isHub: true },
  { id: 'ctc', name: 'Cuttack Sadar PS', count: 8, color: '#3B82F6' },
  { id: 'bbsr', name: 'Bhubaneswar City PS', count: 15, color: '#10B981' },
  { id: 'puri', name: 'Puri PS', count: 5, color: '#F59E0B' },
  { id: 'rkl', name: 'Rourkela PS', count: 7, color: '#06B6D4' },
];

const INITIAL_LINKS: StationNetworkLink[] = [
  {
    id: 'l1',
    source: 'hub',
    target: 'ctc',
    strength: 'HIGH',
    similarity: 94,
    matchedEntity: 'Mobile Contact (+91 98612-XXXXX)',
    reason: 'Matched contact number in night call logs linked to vehicle theft ring.',
    matches: 5,
  },
  {
    id: 'l2',
    source: 'hub',
    target: 'bbsr',
    strength: 'HIGH',
    similarity: 88,
    matchedEntity: 'Vehicle Reg (OD-02-AK-9812)',
    reason: 'Shared getaway vehicle captured on CCTV across Khandagiri and Janpath.',
    matches: 4,
  },
  {
    id: 'l3',
    source: 'hub',
    target: 'puri',
    strength: 'MEDIUM',
    similarity: 76,
    matchedEntity: 'Modus Operandi & Stolen Jewelry',
    reason: 'Identical lock-breaking technique and pawn shop fencing record.',
    matches: 2,
  },
  {
    id: 'l4',
    source: 'hub',
    target: 'rkl',
    strength: 'LOW',
    similarity: 62,
    matchedEntity: 'Bank Account Flow',
    reason: 'Cross-district money mule account transactions.',
    matches: 1,
  },
];

export function CrossStationD3Network() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<StationNetworkNode, StationNetworkLink> | null>(null);

  const [selectedLink, setSelectedLink] = useState<StationNetworkLink | null>(INITIAL_LINKS[0]);
  const [hoveredNode, setHoveredNode] = useState<StationNetworkNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<StationNetworkLink | null>(null);
  const [dimensions, setDimensions] = useState({ width: 340, height: 210 });

  // Observe container size
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height: Math.max(200, height) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Run D3 Force simulation
  useEffect(() => {
    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;

    const nodes: StationNetworkNode[] = INITIAL_NODES.map((n) => {
      if (n.isHub) return { ...n, x: cx, y: cy };
      if (n.id === 'ctc') return { ...n, x: cx - 85, y: cy - 40 };
      if (n.id === 'bbsr') return { ...n, x: cx + 85, y: cy - 45 };
      if (n.id === 'puri') return { ...n, x: cx + 75, y: cy + 50 };
      return { ...n, x: cx - 90, y: cy + 45 };
    });

    const links: StationNetworkLink[] = INITIAL_LINKS.map((l) => ({ ...l }));

    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const simulation = d3
      .forceSimulation<StationNetworkNode, StationNetworkLink>(nodes)
      .force(
        'link',
        d3
          .forceLink<StationNetworkNode, StationNetworkLink>(links)
          .id((d) => d.id)
          .distance((d) => (d.strength === 'HIGH' ? 80 : d.strength === 'MEDIUM' ? 95 : 110))
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(cx, cy))
      .force('collide', d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Links
    const linkGroup = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d) =>
        d.strength === 'HIGH' ? '#EF4444' : d.strength === 'MEDIUM' ? '#F97316' : '#3B82F6'
      )
      .attr('stroke-width', (d) => (d.strength === 'HIGH' ? 2.5 : 1.75))
      .attr('stroke-dasharray', (d) => (d.strength === 'HIGH' ? null : d.strength === 'MEDIUM' ? '4 3' : '3 3'))
      .attr('opacity', 0.85)
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredLink(d);
        linkGroup.transition().duration(150)
          .style('opacity', (l: any) => (l.id === d.id ? 1 : 0.15));
        nodeGroup.transition().duration(150)
          .style('opacity', (n: any) => (n.id === d.source.id || n.id === d.target.id ? 1 : 0.25));
      })
      .on('mouseleave', () => {
        setHoveredLink(null);
        nodeGroup.transition().duration(200).style('opacity', 1);
        linkGroup.transition().duration(200).style('opacity', 0.85);
      })
      .on('click', (_, d) => setSelectedLink(d));

    // Nodes
    const nodeGroup = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .call(
        d3
          .drag<SVGGElement, StationNetworkNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        nodeGroup.transition().duration(150)
          .style('opacity', (n: any) => {
            const isConnected = n.id === d.id || links.some(l => 
              (l.source.id === d.id && l.target.id === n.id) || 
              (l.target.id === d.id && l.source.id === n.id)
            );
            return isConnected ? 1 : 0.25;
          });
        linkGroup.transition().duration(150)
          .style('opacity', (l: any) => 
            (l.source.id === d.id || l.target.id === d.id ? 1 : 0.15)
          );
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        nodeGroup.transition().duration(200).style('opacity', 1);
        linkGroup.transition().duration(200).style('opacity', 0.85);
      })
      .on('click', (_, d) => {
        const link = links.find((l: any) => l.source.id === d.id || l.target.id === d.id);
        if (link) setSelectedLink(link);
      });

    // Hub Outer Ring
    nodeGroup
      .filter((d) => Boolean(d.isHub))
      .append('circle')
      .attr('r', 22)
      .attr('fill', 'none')
      .attr('stroke', '#6366F1')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 2')
      .attr('opacity', 0.6);

    // Node Circle
    nodeGroup
      .append('circle')
      .attr('r', (d) => (d.isHub ? 17 : 13))
      .attr('fill', (d) => d.color)
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    // Node Count
    nodeGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', (d) => (d.isHub ? 10.5 : 9))
      .attr('font-weight', 'bold')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('fill', '#FFFFFF')
      .text((d) => d.count);

    // Node Label
    nodeGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.isHub ? 30 : 22))
      .attr('font-size', 8.5)
      .attr('font-weight', 'bold')
      .attr('font-family', 'Inter, sans-serif')
      .attr('class', 'fill-text dark:fill-[#E2E8F0]')
      .text((d) => d.name);

    simulation.on('tick', () => {
      linkGroup
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions]);

  const activeLink = hoveredLink || selectedLink;

  return (
    <div className="bg-surface dark:bg-[#0F1726] border border-border dark:border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-xs h-full relative interactive-panel">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1 z-10">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-bold font-sans text-text dark:text-[#F8FAFC] tracking-wide">
            {t('dashboard.crossStation', 'Cross-Station Links')}
          </h3>
          <Info size={13} className="text-text-faint dark:text-[#64748B] cursor-help" />
        </div>

        <button
          onClick={() => navigate('/network')}
          className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full hover:bg-amber-500/20 transition-colors flex items-center gap-1"
        >
          <span>12 Cross-Station Links</span>
          <ExternalLink size={10} />
        </button>
      </div>

      {/* D3 Interactive Canvas */}
      <div ref={containerRef} className="relative w-full aspect-[2.1/1] min-h-[150px] select-none my-auto">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full overflow-visible" />
      </div>

      {/* Explainable Relationship Detail Card (Section 12 requirement) */}
      {activeLink && (
        <div className="mt-2 bg-surface-2 dark:bg-[#151E31] border border-border dark:border-[#26334A] rounded-xl p-2.5 text-xs font-sans animate-fade-in shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <ShieldCheck size={13} className="text-rose-500 shrink-0" />
              <span className="font-bold text-[10px] font-mono text-text dark:text-[#F8FAFC] truncate">
                RELATIONSHIP DETECTED ({activeLink.similarity}% SIMILARITY)
              </span>
            </div>
            <span
              className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase shrink-0 ${
                activeLink.strength === 'HIGH'
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25'
                  : activeLink.strength === 'MEDIUM'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25'
                  : 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/25'
              }`}
            >
              {activeLink.strength} STRENGTH
            </span>
          </div>

          <div className="text-[10px] text-text-dim dark:text-[#94A3B8] leading-tight mb-1.5">
            <strong className="text-text dark:text-[#E2E8F0]">Matched: </strong>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">
              {activeLink.matchedEntity}
            </span>
            <div className="mt-0.5">{activeLink.reason}</div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-soft dark:border-[#1E293B]">
            <span className="text-[9px] font-mono text-text-faint dark:text-[#64748B]">
              {activeLink.matches} Shared Forensic Records
            </span>
            <button
              onClick={() => navigate('/network')}
              className="text-[9.5px] font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
            >
              <span>Inspect Cases</span>
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Strength Legend */}
      <div className="flex items-center justify-center gap-4 pt-2 mt-1 border-t border-border-soft dark:border-[#1E293B] text-[10px] font-mono text-text-dim dark:text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 bg-rose-500 rounded-full inline-block" />
          <span>{t('dashboard.highStrength', 'High Strength')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 border-t-2 border-dashed border-orange-500 inline-block" />
          <span>{t('dashboard.mediumStrength', 'Medium')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 border-t-2 border-dashed border-sky-500 inline-block" />
          <span>{t('dashboard.lowStrength', 'Low')}</span>
        </div>
      </div>
    </div>
  );
}
