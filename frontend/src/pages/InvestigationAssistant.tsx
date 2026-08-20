import React, { useState } from 'react';
import { Bot, User, Sparkles, Scale, Search, FileText } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { useNavigate } from 'react-router-dom';

export function InvestigationAssistant() {
  const { state } = useMockState();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<{role: 'USER'|'AI', text: string, actions?: any[]}[]>([
    {
      role: 'AI',
      text: "I am your Legal & Investigation Intelligence Assistant. I am connected to the state intelligence database. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'USER', text: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "Based on the evidence, this fits the pattern of a residential burglary. I recommend reviewing nearby CCTV footage.";
      let responseActions: any[] = [];
      
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('vehicle') || lowerInput.includes('car') || lowerInput.includes('plate')) {
        responseText = `2 vehicle relationships identified across the state network.

1. **KA-01-AB-1234**
Source: Evidence EV-001 (Bengaluru Central)

2. **KA-05-XY-7777**
Source: Related Case CR-KOR-25-0981 (Koramangala)`;

        responseActions = [
          { label: 'View Knowledge Graph', onClick: () => navigate('/network') },
          { label: 'Open Evidence', onClick: () => navigate('/evidence') },
          { label: 'Request Access', onClick: () => navigate('/requests'), primary: true }
        ];
      } 
      else if (lowerInput.includes('bns') || lowerInput.includes('legal') || lowerInput.includes('charge')) {
        responseText = `Under the Bharatiya Nyaya Sanhita (BNS), Theft in a dwelling house is covered under **Section 305 BNS**. If forced entry was used at night, **Section 331 BNS (House-trespass)** also applies. 

Investigation procedure requires filing a report under **Section 173 BNSS**.`;
        
        responseActions = [
          { label: 'View Legal Intelligence', onClick: () => navigate('/legal'), primary: true },
          { label: 'Generate Draft', onClick: () => navigate('/reports') }
        ];
      }
      else if (lowerInput.includes('phone') || lowerInput.includes('call') || lowerInput.includes('number')) {
        responseText = `1 phone number relationship identified.

1. **+91-9876543210**
Source: Cross-Station Match (Mysuru City to Koramangala)`;

        responseActions = [
          { label: 'View Knowledge Graph', onClick: () => navigate('/network') },
          { label: 'Request Access', onClick: () => navigate('/requests'), primary: true }
        ];
      }
      else {
         responseText = "I have scanned the intelligence database. No immediate high-confidence patterns match your query. Consider providing a specific vehicle number, phone number, or requesting BNS procedures.";
      }

      setMessages(prev => [...prev, { role: 'AI', text: responseText, actions: responseActions }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
          <Sparkles className="text-brand" /> AI Intelligence Assistant
        </h2>
        <p className="text-sm text-text-dim mt-1">Context-aware investigative and legal reasoning.</p>
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
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                msg.role === 'USER' ? 'bg-brand text-bg rounded-tr-none' : 'glass rounded-tl-none text-text leading-relaxed'
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
                
                {/* Actionable Navigation Injection */}
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
              placeholder="Ask about cases, legal provisions, or evidence..."
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
