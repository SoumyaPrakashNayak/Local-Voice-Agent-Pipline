import React from 'react';
import { Network, Search, Filter } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { CaseKnowledgeGraph } from '../components/graph/CaseKnowledgeGraph';

export function NetworkExplorer() {
  const { state } = useMockState();

  // Find a case that has entities to show in the explorer, preferably the hero case if it exists.
  const myCases = state.cases.filter(c => c.investigatorId === state.currentUser?.id);
  const heroCase = myCases[myCases.length - 1] || state.cases[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
            <Network className="text-brand" /> Network Explorer
          </h2>
          <p className="text-sm text-text-dim mt-1">Cross-case entity relationship graph.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5">
            <Search size={16} className="text-text-dim" />
            <input type="text" placeholder="Search entity..." className="bg-transparent border-none outline-none text-sm text-text" />
          </div>
          <button className="bg-surface border border-border p-2 rounded-lg text-text-dim hover:text-text transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-border-soft rounded-2xl p-4 min-h-[600px] flex flex-col">
        {heroCase ? (
           <CaseKnowledgeGraph caseId={heroCase.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-dim">
            No graph data available.
          </div>
        )}
      </div>
    </div>
  );
}
