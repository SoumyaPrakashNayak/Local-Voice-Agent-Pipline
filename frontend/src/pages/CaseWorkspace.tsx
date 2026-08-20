import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockState } from '../mockServices/MockStateContext';
import { CaseKnowledgeGraph } from '../components/graph/CaseKnowledgeGraph';
import { Shield, FileText, Share2, AlertTriangle, FileBarChart } from 'lucide-react';

export function CaseWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { state } = useMockState();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'reports'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  const handleGenerateDraft = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDraftGenerated(true);
    }, 2000);
  };

  const currentCase = state.cases.find(c => c.id === id);

  if (!currentCase) {
    return <div className="p-8">Case not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono bg-surface border border-border px-2 py-0.5 rounded text-text-dim">
              {currentCase.firNumber}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent-bright px-2 py-0.5 rounded">
              {currentCase.status}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-danger/20 text-danger-bright px-2 py-0.5 rounded">
              PRIORITY: {currentCase.priority}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text font-display">{currentCase.title}</h1>
          <p className="text-sm text-text-dim mt-1">Station: {currentCase.stationId} | Created: {new Date(currentCase.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-surface border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-hover flex items-center gap-2">
            <Share2 size={16} /> Share
          </button>
          <button className="bg-brand text-bg px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-bright flex items-center gap-2">
            <AlertTriangle size={16} /> Mark Critical
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-soft">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'overview' ? 'border-accent-bright text-accent-bright' : 'border-transparent text-text-dim hover:text-text'}`}
        >
          Overview & Timeline
        </button>
        <button 
          onClick={() => setActiveTab('graph')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'graph' ? 'border-brand text-brand' : 'border-transparent text-text-dim hover:text-text'}`}
        >
          Knowledge Graph
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'reports' ? 'border-accent-bright text-accent-bright' : 'border-transparent text-text-dim hover:text-text'}`}
        >
          Reports & Drafts
        </button>
      </div>

      {/* Content */}
      <div className="py-4">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 border-b border-border-soft pb-2">Incident Narrative</h3>
                <p className="text-sm text-text-dim leading-relaxed">{currentCase.description}</p>
              </div>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 border-b border-border-soft pb-2 flex justify-between items-center">
                  Evidence Log
                  <button onClick={() => navigate('/evidence')} className="text-[10px] text-accent-bright hover:underline">Add Evidence</button>
                </h3>
                <div className="space-y-3">
                  {state.evidence.filter(e => e.caseId === currentCase.id).map(ev => (
                    <div key={ev.id} className="p-3 bg-surface border border-border-soft rounded-lg">
                      <div className="text-xs font-bold text-text">{ev.type}</div>
                      <div className="text-sm text-text-dim mt-1">{ev.description}</div>
                    </div>
                  ))}
                  {state.evidence.filter(e => e.caseId === currentCase.id).length === 0 && (
                    <div className="text-xs text-text-faint italic">No evidence logged yet.</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 border-b border-border-soft pb-2">Extracted Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {currentCase.entities.map(e => (
                    <div key={e.id} className="bg-surface border border-border px-3 py-1.5 rounded-lg text-xs font-mono">
                      <span className="text-text-dim">{e.type}:</span> <span className="font-bold text-text">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="animate-fade-in">
            <CaseKnowledgeGraph caseId={currentCase.id} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-fade-in grid md:grid-cols-2 gap-6">
             <div className="glass p-6 rounded-xl border-accent/30 text-center">
               <FileBarChart size={32} className="text-accent mx-auto mb-4" />
               <h3 className="text-lg font-bold text-text mb-2">Charge Sheet Draft</h3>
               <p className="text-sm text-text-dim mb-6">AI-assisted generation of the initial charge sheet based on FIR and evidence.</p>
               
               {isGenerating ? (
                 <div className="space-y-3">
                   <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                     <div className="h-full bg-accent animate-pulse w-full"></div>
                   </div>
                   <p className="text-xs text-accent-bright font-mono">GENERATING DRAFT...</p>
                 </div>
               ) : draftGenerated ? (
                 <div className="space-y-3">
                   <div className="bg-success/10 border border-success/20 text-success p-3 rounded-lg text-sm font-bold">
                     Draft Generated Successfully
                   </div>
                   <div className="flex gap-2 justify-center">
                     <button className="bg-surface border border-border px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-surface-hover">Preview</button>
                     <button className="bg-accent text-bg px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-accent-bright">Download PDF</button>
                   </div>
                 </div>
               ) : (
                 <button 
                   onClick={handleGenerateDraft}
                   className="bg-accent text-bg px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-accent-bright"
                 >
                   Generate Draft
                 </button>
               )}
               
               <p className="text-[9px] text-text-faint mt-4 uppercase">Requires authorized review and approval</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
