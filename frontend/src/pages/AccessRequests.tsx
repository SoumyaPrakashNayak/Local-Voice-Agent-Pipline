import React from 'react';
import { CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { AccessRequest } from '../mockServices/types';

export function AccessRequests() {
  const { state, dispatch } = useMockState();

  const myStationId = state.currentUser?.stationId;
  const isSuperAdmin = state.currentUser?.role === 'SUPER_ADMIN';

  // Requests sent BY my station
  const outgoingRequests = state.accessRequests.filter(r => r.requestingStationId === myStationId || isSuperAdmin);
  
  // Requests received BY my station (Needs approval)
  const incomingRequests = state.accessRequests.filter(r => r.targetStationId === myStationId || isSuperAdmin);

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    dispatch({ type: 'UPDATE_ACCESS_REQUEST_STATUS', payload: { id, status } });
  };

  const RequestCard = ({ req, type }: { req: AccessRequest, type: 'INCOMING' | 'OUTGOING' }) => {
    return (
      <div className="glass p-5 rounded-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono bg-surface border border-border px-2 py-0.5 rounded text-text-dim">
              {req.id}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
              ${req.status === 'PENDING' ? 'bg-warning/20 text-warning' : 
                req.status === 'APPROVED' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger-bright'}
            `}>
              {req.status}
            </span>
          </div>
          <p className="text-sm text-text font-semibold">
            {type === 'INCOMING' ? 
              `Request from Station ${req.requestingStationId} for Case ${req.targetCaseId}` : 
              `Request to Station ${req.targetStationId} for Case ${req.targetCaseId}`
            }
          </p>
          <p className="text-xs text-text-dim mt-1">Reason: {req.reason}</p>
        </div>

        {type === 'INCOMING' && req.status === 'PENDING' && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleAction(req.id, 'APPROVED')}
              className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
              title="Approve"
            >
              <CheckCircle size={20} />
            </button>
            <button 
              onClick={() => handleAction(req.id, 'REJECTED')}
              className="p-2 bg-danger/10 text-danger-bright rounded-lg hover:bg-danger/20 transition-colors"
              title="Reject"
            >
              <XCircle size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
          <ShieldAlert className="text-brand" /> Access Requests
        </h2>
        <p className="text-sm text-text-dim mt-1">Manage cross-station intelligence access governance</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Incoming Requests */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider border-b border-border-soft pb-2 flex items-center gap-2">
            <Clock size={16} className="text-warning" /> Incoming Requests
          </h3>
          <div className="space-y-3">
            {incomingRequests.map(r => <RequestCard key={r.id} req={r} type="INCOMING" />)}
            {incomingRequests.length === 0 && <p className="text-sm text-text-faint italic">No incoming requests.</p>}
          </div>
        </div>

        {/* Outgoing Requests */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider border-b border-border-soft pb-2">
            My Requests (Outgoing)
          </h3>
          <div className="space-y-3">
            {outgoingRequests.map(r => <RequestCard key={r.id} req={r} type="OUTGOING" />)}
            {outgoingRequests.length === 0 && <p className="text-sm text-text-faint italic">No outgoing requests.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
