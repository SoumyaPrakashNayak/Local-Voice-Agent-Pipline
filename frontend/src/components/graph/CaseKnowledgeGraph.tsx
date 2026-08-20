import React from 'react';
import { Lock, FileText, Smartphone, Car, MapPin, User, ShieldAlert } from 'lucide-react';
import { useMockState } from '../../mockServices/MockStateContext';
import { Entity } from '../../mockServices/types';
import { useNavigate } from 'react-router-dom';

export function CaseKnowledgeGraph({ caseId }: { caseId: string }) {
  const { state, dispatch } = useMockState();
  const navigate = useNavigate();

  const currentCase = state.cases.find(c => c.id === caseId);
  if (!currentCase) return null;

  // Let's find related cases through shared entities
  const relatedCases = state.cases.filter(c => 
    c.id !== caseId && 
    c.entities.some(e1 => currentCase.entities.some(e2 => e1.value === e2.value))
  );

  const getEntityIcon = (type: string) => {
    switch(type) {
      case 'PHONE': return Smartphone;
      case 'VEHICLE': return Car;
      case 'LOCATION': return MapPin;
      case 'PERSON': return User;
      default: return FileText;
    }
  };

  const handleRequestAccess = (targetCaseId: string, targetStationId: string) => {
    dispatch({
      type: 'ADD_ACCESS_REQUEST',
      payload: {
        id: `REQ-${Date.now()}`,
        requestingStationId: state.currentUser?.stationId || '',
        requestingOfficerId: state.currentUser?.id || '',
        targetStationId,
        targetCaseId,
        reason: 'Cross-station entity overlap discovered in graph.',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    });
    navigate('/requests');
  };

  return (
    <div className="relative w-full h-[500px] bg-bg-elev border border-border-soft rounded-xl overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
        
        {/* Central Case Node */}
        <div className="z-10 flex flex-col items-center mb-16">
          <div className="h-16 w-16 bg-accent text-bg rounded-full flex items-center justify-center shadow-glow border-4 border-bg mb-2">
            <FileText size={24} />
          </div>
          <div className="text-sm font-bold text-text bg-surface px-3 py-1 rounded-md border border-border">
            {currentCase.id}
          </div>
        </div>

        {/* Entities Level */}
        <div className="flex gap-16 z-10">
          {currentCase.entities.map(ent => {
            const Icon = getEntityIcon(ent.type);
            
            // Check if this entity links to another case
            const linkedCase = relatedCases.find(rc => rc.entities.some(re => re.value === ent.value));
            
            return (
              <div key={ent.id} className="relative flex flex-col items-center group">
                {/* Connecting Line up to main case */}
                <div className="absolute -top-16 left-1/2 w-0.5 h-16 bg-border-soft -z-10" />
                
                <div className="h-12 w-12 bg-surface text-text-dim rounded-full flex items-center justify-center border border-border mb-2 group-hover:border-brand transition-colors">
                  <Icon size={18} />
                </div>
                <div className="text-[10px] font-mono text-text-dim text-center">
                  {ent.type}<br/>
                  <span className="text-text font-bold">{ent.value}</span>
                </div>

                {/* Linked Case Visualization */}
                {linkedCase && (
                  <>
                    <div className="absolute top-full left-1/2 w-0.5 h-16 bg-border-soft -z-10" />
                    <div className="absolute top-[calc(100%+4rem)] left-1/2 -translate-x-1/2 w-48">
                      <LinkedCaseNode 
                        targetCase={linkedCase} 
                        currentStationId={state.currentUser?.stationId || ''} 
                        onRequestAccess={() => handleRequestAccess(linkedCase.id, linkedCase.stationId)}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur px-3 py-2 border border-border rounded text-[10px] font-mono text-text-dim">
        Graph Engine Active
      </div>
    </div>
  );
}

function LinkedCaseNode({ targetCase, currentStationId, onRequestAccess }: { targetCase: any, currentStationId: string, onRequestAccess: () => void }) {
  const { state } = useMockState();
  const isSameStation = targetCase.stationId === currentStationId;
  const isSuperAdmin = state.currentUser?.role === 'SUPER_ADMIN';
  
  const existingRequest = state.accessRequests.find(r => r.targetCaseId === targetCase.id && r.requestingStationId === currentStationId);
  const isApproved = existingRequest?.status === 'APPROVED';
  
  const hasAccess = isSameStation || isSuperAdmin || isApproved;

  if (hasAccess) {
    return (
      <div className="glass p-3 rounded-xl border-accent-bright/50 bg-surface text-center">
        <div className="text-xs font-bold text-accent-bright mb-1 flex items-center justify-center gap-1">
          <FileText size={14} /> {targetCase.id}
        </div>
        <div className="text-[10px] text-text-dim truncate">{targetCase.title}</div>
        <div className="text-[9px] mt-1 bg-accent/20 text-accent-bright rounded px-1 inline-block">Authorized</div>
      </div>
    );
  }

  // Restricted State
  return (
    <div className="glass p-3 rounded-xl border-danger-bright/30 bg-surface/50 text-center backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 bg-bg/50 z-0" />
      <div className="relative z-10 flex flex-col items-center">
        <Lock size={16} className="text-danger-bright mb-1" />
        <div className="text-[10px] font-bold text-danger-bright mb-1 uppercase">Restricted Case</div>
        <div className="text-[9px] text-text-faint mb-2">Station {targetCase.stationId}</div>
        
        {existingRequest?.status === 'PENDING' ? (
          <div className="text-[9px] bg-warning/20 text-warning px-2 py-1 rounded w-full border border-warning/30">
            Request Pending
          </div>
        ) : existingRequest?.status === 'REJECTED' ? (
          <div className="text-[9px] bg-danger/20 text-danger-bright px-2 py-1 rounded w-full border border-danger/30">
            Request Denied
          </div>
        ) : (
          <button 
            onClick={onRequestAccess}
            className="text-[9px] bg-brand text-bg font-bold px-2 py-1 rounded hover:bg-brand-bright transition-colors w-full"
          >
            Request Access
          </button>
        )}
      </div>
    </div>
  );
}
