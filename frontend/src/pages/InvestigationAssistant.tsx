import React, { useState } from 'react';
import { Bot, User, Sparkles, Scale, Search, FileText } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { useNavigate } from 'react-router-dom';
import { LegalProvision, FIR_ANALYSIS_PROVISIONS } from '../mockServices/legalProvisionMockData';
import { ProvisionCard } from '../components/legal/ProvisionCard';
import { ProvisionDetailsDrawer } from '../components/legal/ProvisionDetailsDrawer';

export function InvestigationAssistant() {
  const { state } = useMockState();
  const navigate = useNavigate();

  const myStation = state.stations.find(s => s.id === state.currentUser?.stationId);
  const stationName = myStation?.name ?? 'Khandagiri Police Station';

  const [messages, setMessages] = useState<{role: 'USER'|'AI', text: string, actions?: any[], provisions?: LegalProvision[]}[]>([
    {
      role: 'AI',
      text: `I am your Legal & Investigation Intelligence Assistant, connected to the Odisha Police state intelligence database. I am context-aware of your station (${stationName}) and your active cases. How can I assist you today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [drawerProvision, setDrawerProvision] = useState<LegalProvision | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'USER', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "Based on evidence patterns in the Odisha Police database, this incident shows characteristics consistent with organized vehicle theft networks. I recommend coordinating with neighboring stations.";
      let responseActions: any[] = [];
      
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('vehicle') || lower.includes('car') || lower.includes('plate') || lower.includes('od-')) {
        responseText = `2 vehicle relationships identified across Odisha Police station records.

1. **OD-02-AB-1234**
Source: Evidence EV-BBSR-001 (Khandagiri Police Station)
Linked Case: OD-BBSR-2026-0001

2. **OD-05-XY-7777**
Source: Cross-Station Match — Cuttack City PS
Linked Case: OD-CTC-2026-00981

⚠ Cross-station relationship active. Access request recommended.`;

        responseActions = [
          { label: 'View Knowledge Graph', onClick: () => navigate('/network') },
          { label: 'Open Evidence', onClick: () => navigate('/evidence') },
          { label: 'Request Access', onClick: () => navigate('/requests'), primary: true }
        ];
      } 
      else if (lower.includes('bns') || lower.includes('legal') || lower.includes('charge') || lower.includes('section') || lower.includes('provision')) {
        responseText = `Based on the current case facts, CrimeLens identified the following potentially applicable BNS provisions. Click any card to inspect the full legal basis.`;
        
        responseActions = [
          { label: 'View Legal Intelligence', onClick: () => navigate('/legal'), primary: true },
          { label: 'Generate Draft', onClick: () => navigate('/reports') }
        ];
        
        setMessages(prev => [...prev, {
          role: 'AI',
          text: responseText,
          actions: responseActions,
          provisions: FIR_ANALYSIS_PROVISIONS
        }]);
        setIsTyping(false);
        return;
      }
      else if (lower.includes('phone') || lower.includes('call') || lower.includes('number') || lower.includes('9876')) {
        responseText = `1 phone number relationship identified across Odisha Police records.

1. **+91-9876543210**
Source: Cross-Station Match — Khandagiri Police Station → Cuttack City PS
Cases: OD-BBSR-2026-0001 / OD-CTC-2026-00981
Match Confidence: 96%

⚠ This phone number appears in two active investigations across different Odisha stations.`;

        responseActions = [
          { label: 'View Knowledge Graph', onClick: () => navigate('/network') },
          { label: 'Request Access', onClick: () => navigate('/requests'), primary: true }
        ];
      }
      else if (lower.includes('case') || lower.includes('fir') || lower.includes('investigation')) {
        const myCases = state.cases.filter(c => c.investigatorId === state.currentUser?.id);
        responseText = `${myCases.length} case(s) assigned to your profile at ${stationName}.

${myCases.slice(0,3).map((c, i) => `${i+1}. **${c.id}**\n   FIR: ${c.firNumber} · Status: ${c.status} · Priority: ${c.priority}`).join('\n\n')}

${myCases.length > 3 ? `... and ${myCases.length - 3} more cases.` : ''}`;

        responseActions = [
          { label: 'View My Cases', onClick: () => navigate('/cases'), primary: true },
        ];
      }
      else {
         responseText = "I have scanned the Odisha Police intelligence database. No immediate high-confidence patterns match your query. Try asking about:\n\n• Vehicle or phone entities\n• BNS/BNSS legal provisions\n• Active case status\n• Cross-station relationships";
      }

      setMessages(prev => [...prev, { role: 'AI', text: responseText, actions: responseActions }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      {/* Legal Provision Details Drawer */}
      <ProvisionDetailsDrawer provision={drawerProvision} onClose={() => setDrawerProvision(null)} />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
          <Sparkles className="text-brand" /> AI Investigation Assistant
        </h2>
        <p className="text-sm text-text-dim mt-1">Odisha Police · Context-aware investigative and legal reasoning. <span className="text-text-faint">Demonstration data only.</span></p>
      </div>

      <div className="flex-1 bg-surface border border-border-soft rounded-2xl flex flex-col overflow-hidden shadow-card">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'USER' ? 'bg-brand/20 text-brand' : 'bg-accent/20 text-accent-bright'
              }`}>
                {msg.role === 'USER' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`rounded-2xl p-4 text-sm ${
                msg.role === 'USER'
                  ? 'bg-brand text-bg rounded-tr-none max-w-[80%]'
                  : 'glass rounded-tl-none text-text leading-relaxed w-full max-w-[90%]'
              }`}>
                {msg.text.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line.includes('**') ? (
                       <span dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                    ) : (
                      line
                    )}
                    {idx < msg.text.split('\n').length - 1 && <br/>}
                  </React.Fragment>
                ))}

                {/* Interactive Provision Cards */}
                {msg.provisions && msg.provisions.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-border-soft pt-4">
                    <div className="text-[10px] uppercase font-bold text-text-faint tracking-wider mb-2 flex items-center gap-1">
                      <Scale size={10} /> Applicable BNS Provisions — Click to inspect
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.provisions.map((provision) => (
                        <ProvisionCard
                          key={provision.section}
                          provision={provision}
                          onViewDetails={setDrawerProvision}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border-soft">
                    {msg.actions.map((act, actIdx) => (
                      <button 
                        key={actIdx}
                        onClick={act.onClick} 
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                          act.primary 
                            ? 'bg-brand text-bg hover:bg-brand-bright' 
                            : 'bg-bg-elev border border-border hover:bg-surface-hover text-text'
                        }`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
               <div className="h-8 w-8 rounded-full bg-accent/20 text-accent-bright flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="glass rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                <div className="w-2 h-2 bg-text-dim rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-text-dim rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-text-dim rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border-soft bg-bg-elev">
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-dim hover:text-brand transition-colors" title="Query BNS/BNSS">
              <Scale size={20} />
            </button>
            <button className="p-2 text-text-dim hover:text-accent transition-colors" title="Search Cases">
              <Search size={20} />
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about cases, vehicles, legal provisions, or cross-station intelligence..."
              className="flex-1 bg-surface border border-border-soft rounded-full px-4 py-2.5 text-sm focus:border-brand outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-brand text-bg px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-bright disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
