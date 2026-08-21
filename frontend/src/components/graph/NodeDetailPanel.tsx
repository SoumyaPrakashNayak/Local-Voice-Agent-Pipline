import React from 'react';
import { X, Lock, ExternalLink, Shield, TrendingUp, Eye, Radio } from 'lucide-react';
import { NetworkNode, getNodeEdges, getNode, NETWORK_NODES, NETWORK_EDGES } from '../../mockServices/networkGraphData';
import { useMockState } from '../../mockServices/MockStateContext';
import { useNavigate } from 'react-router-dom';

interface NodeDetailPanelProps {
  node: NetworkNode | null;
  onClose: () => void;
  onExpandNode?: (nodeId: string) => void;
}

// Type color badge
function TypeBadge({ type }: { type: NetworkNode['type'] }) {
  const styles: Record<string, string> = {
    CASE: 'bg-accent/15 text-accent-bright border-accent/30',
    PERSON: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    PHONE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    VEHICLE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    LOCATION: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    EVIDENCE: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    STATION: 'bg-brand/15 text-brand border-brand/30',
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${styles[type] || 'bg-surface-2 text-text-dim border-border'}`}>
      {type}
    </span>
  );
}

export function NodeDetailPanel({ node, onClose, onExpandNode }: NodeDetailPanelProps) {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  if (!node) return null;

  const edges = getNodeEdges(node.id);
  const connectedIds = [...new Set(edges.flatMap(e => [e.source, e.target]).filter(id => id !== node.id))];
  const connectedNodes = connectedIds.map(id => getNode(id)).filter(Boolean) as NetworkNode[];

  const existingRequest = node.caseId
    ? state.accessRequests.find(r => r.targetCaseId === node.caseId && r.requestingStationId === state.currentUser?.stationId)
    : null;

  const isRestricted = node.accessStatus === 'RESTRICTED' && !existingRequest?.status.includes('APPROVED');
  const hasPendingRequest = existingRequest?.status === 'PENDING';
  const hasApprovedRequest = existingRequest?.status === 'APPROVED';

  const handleRequestAccess = () => {
    if (!node.caseId || !node.stationId) return;
    dispatch({
      type: 'ADD_ACCESS_REQUEST',
      payload: {
        id: `REQ-NET-${Date.now()}`,
        requestingStationId: state.currentUser?.stationId || '',
        requestingOfficerId: state.currentUser?.id || '',
        targetStationId: node.stationId,
        targetCaseId: node.caseId,
        reason: `Cross-station entity match detected via Network Explorer. Requesting intelligence sharing.`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    });
  };

  const handleOpenCase = () => {
    if (node.caseId) navigate(`/cases/${node.caseId}?from=network`);
  };

  // Cross-station confidence from the edges connecting this node
  const crossEdge = NETWORK_EDGES.find(e =>
    (e.source === node.id || e.target === node.id) && e.isCrossStation
  );
  const confidence = crossEdge?.confidence ?? (node.metadata?.confidence as number);

  return (
    <div className="w-80 bg-surface border-l border-border-soft flex flex-col h-full animate-slide-in overflow-hidden">
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideInLeft 0.2s ease-out; }
      `}</style>

      {/* Header */}
      <div className="px-4 py-4 border-b border-border-soft bg-surface">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={node.type} />
            {node.isCrossStation && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-warning bg-warning/10 border border-warning/30 px-1.5 py-0.5 rounded">Cross-Station</span>
            )}
            {node.isAiDiscovered && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded">AI Discovered</span>
            )}
            {isRestricted && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-danger-bright bg-danger/10 border border-danger/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Lock size={8} /> Restricted
              </span>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 p-1 rounded hover:bg-surface-hover text-text-dim hover:text-text transition-colors" aria-label="Close panel">
            <X size={16} />
          </button>
        </div>

        <h3 className="text-base font-bold text-text mt-2 font-display">{node.label}</h3>
        {node.sublabel && <p className="text-xs text-text-dim mt-0.5">{node.sublabel}</p>}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

        {/* Restricted notice */}
        {isRestricted && (
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-danger-bright" />
              <span className="text-xs font-bold text-danger-bright uppercase tracking-wide">Restricted Intelligence Record</span>
            </div>
            <p className="text-[11px] text-text-dim leading-relaxed">
              Related record detected by CrimeLens Intelligence Engine. Sensitive case details are restricted
              until access is authorized by the target station.
            </p>
            {confidence && (
              <div className="flex items-center gap-2 text-[11px]">
                <TrendingUp size={11} className="text-warning" />
                <span className="text-text-dim">Entity match confidence:</span>
                <span className="font-bold text-warning">{confidence}%</span>
              </div>
            )}
            {crossEdge && (
              <div className="text-[10px] text-text-faint font-mono border-t border-border-soft pt-2 mt-1">
                Relationship: {crossEdge.label}
              </div>
            )}
          </div>
        )}

        {/* Station info */}
        {node.stationId && (
          <div>
            <div className="text-[10px] uppercase font-bold text-text-faint tracking-wider mb-1.5">Station</div>
            <div className="text-xs font-semibold text-text bg-surface-2 border border-border rounded-lg px-3 py-2 font-mono">{node.stationId}</div>
          </div>
        )}

        {/* Metadata */}
        {node.metadata && Object.keys(node.metadata).length > 0 && !isRestricted && (
          <div>
            <div className="text-[10px] uppercase font-bold text-text-faint tracking-wider mb-2">Entity Intelligence</div>
            <div className="space-y-2">
              {Object.entries(node.metadata).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span className="text-text-dim capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold text-text font-mono">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relationship stats */}
        <div>
          <div className="text-[10px] uppercase font-bold text-text-faint tracking-wider mb-2">Relationships</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-2 border border-border rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-text">{edges.length}</div>
              <div className="text-[10px] text-text-faint">Links</div>
            </div>
            <div className="bg-surface-2 border border-border rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-text">{connectedNodes.filter(n => n.type === 'CASE').length}</div>
              <div className="text-[10px] text-text-faint">Cases</div>
            </div>
            <div className="bg-surface-2 border border-border rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-text">
                {new Set(connectedNodes.map(n => n.stationId).filter(Boolean)).size + (node.stationId ? 1 : 0)}
              </div>
              <div className="text-[10px] text-text-faint">Stations</div>
            </div>
          </div>
        </div>

        {/* Connected records */}
        {connectedNodes.length > 0 && (
          <div>
            <div className="text-[10px] uppercase font-bold text-text-faint tracking-wider mb-2 flex items-center gap-1.5">
              <Radio size={10} className="text-brand" /> Connected Records
            </div>
            <div className="space-y-1.5">
              {connectedNodes.slice(0, 6).map(cn => {
                const edge = edges.find(e => e.source === cn.id || e.target === cn.id);
                return (
                  <div key={cn.id} className="flex items-center justify-between text-xs bg-surface-2 border border-border rounded-lg px-3 py-2">
                    <div>
                      <div className="font-mono font-semibold text-text truncate max-w-[140px]">{cn.label}</div>
                      <div className="text-text-faint text-[10px]">{edge?.label}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      cn.accessStatus === 'RESTRICTED'
                        ? 'text-danger-bright bg-danger/10 border-danger/30'
                        : cn.accessStatus === 'PENDING'
                        ? 'text-warning bg-warning/10 border-warning/30'
                        : 'text-success bg-success/10 border-success/30'
                    }`}>
                      {cn.accessStatus === 'RESTRICTED' ? '🔒 Restricted' : '✓ Authorized'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Discovery info */}
        {crossEdge?.isAiDiscovered && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-3">
            <div className="text-[10px] font-bold text-accent-bright uppercase tracking-wider mb-1 flex items-center gap-1">
              <Shield size={10} /> AI-Discovered Link
            </div>
            <p className="text-[11px] text-text-dim leading-relaxed">
              Same entity identifier detected in independently registered cases across multiple stations. Confidence: {crossEdge.confidence}%.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-4 border-t border-border-soft space-y-2">
        {node.type === 'CASE' && !isRestricted && (
          <button
            onClick={handleOpenCase}
            className="w-full bg-brand text-bg text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-bright transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={13} /> Open Case Workspace
          </button>
        )}

        {node.type === 'CASE' && isRestricted && (
          <>
            {hasPendingRequest ? (
              <div className="w-full bg-warning/15 text-warning text-xs font-bold px-4 py-2.5 rounded-lg border border-warning/30 text-center">
                ⏳ Access Request Pending
              </div>
            ) : hasApprovedRequest ? (
              <button
                onClick={handleOpenCase}
                className="w-full bg-success/20 text-success text-xs font-bold px-4 py-2.5 rounded-lg border border-success/30 hover:bg-success/30 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={13} /> Access Granted — Open Case
              </button>
            ) : (
              <button
                onClick={handleRequestAccess}
                className="w-full bg-danger/20 text-danger-bright text-xs font-bold px-4 py-2.5 rounded-lg border border-danger/30 hover:bg-danger/30 transition-colors flex items-center justify-center gap-2"
              >
                <Lock size={13} /> Request Access
              </button>
            )}
          </>
        )}

        {onExpandNode && (
          <button
            onClick={() => onExpandNode(node.id)}
            className="w-full bg-surface-2 border border-border text-text text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-surface-hover transition-colors"
          >
            Expand Relationships
          </button>
        )}
      </div>
    </div>
  );
}
