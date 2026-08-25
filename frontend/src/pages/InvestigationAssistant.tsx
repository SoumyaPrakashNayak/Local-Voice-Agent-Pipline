import React, { useState, useEffect } from 'react';
import { User, Scale, Mic, MicOff, VolumeX, Radio } from 'lucide-react';
import { useMockState } from '../mockServices/MockStateContext';
import { useNavigate } from 'react-router-dom';
import { LegalProvision, FIR_ANALYSIS_PROVISIONS } from '../mockServices/legalProvisionMockData';
import { ProvisionCard } from '../components/legal/ProvisionCard';
import { ProvisionDetailsDrawer } from '../components/legal/ProvisionDetailsDrawer';
import { useAira } from '../components/Aira/AiraProvider';
import { processAiraQuery, AiraContext } from '../services/airaService';
import { navigateAira } from '../services/airaNavigationService';
import { AiraVoiceVisualizer } from '../components/Aira/AiraVoiceVisualizer';

export function InvestigationAssistant() {
  const { state } = useMockState();
  const navigate = useNavigate();
  const {
    listeningState,
    transcript,
    startListening,
    stopListening,
    handleSubmitQuery,
    stopSpeaking,
    isSpeaking,
    audioLevel,
  } = useAira();

  const myStation = state.stations.find((s) => s.id === state.currentUser?.stationId);
  const stationName = myStation?.name ?? 'Khandagiri Police Station';

  const [messages, setMessages] = useState<
    { role: 'USER' | 'AI'; text: string; actions?: any[]; provisions?: LegalProvision[]; timestamp?: string }[]
  >([
    {
      role: 'AI',
      text: `I am AIRA, your Legal & Investigation Intelligence Assistant, connected to the Odisha Police state intelligence network. I am context-aware of your station (${stationName}) and active cases. You can type or use real-time voice commands.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [drawerProvision, setDrawerProvision] = useState<LegalProvision | null>(null);

  const isVoiceActive =
    listeningState === 'LISTENING' || listeningState === 'REQUESTING_MIC' || listeningState === 'CONNECTING';

  // Synchronize incoming voice transcript when speaking finishes
  useEffect(() => {
    if (transcript && listeningState === 'PROCESSING') {
      handleUserQuery(transcript);
    }
  }, [listeningState, transcript]);

  const handleUserQuery = (userQueryText: string) => {
    if (!userQueryText.trim()) return;

    const userMsgText = userQueryText.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { role: 'USER', text: userMsgText, timestamp: timeStr }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const airaContext: AiraContext = {
        currentUser: state.currentUser?.id,
        station: stationName,
        role: state.currentUser?.role,
        currentPage: '/assistant',
        cases: state.cases,
        stations: state.stations,
        evidence: state.evidence,
      };

      const airaRes = processAiraQuery(userMsgText, airaContext);

      let responseProvisions: LegalProvision[] | undefined = undefined;
      const lower = userMsgText.toLowerCase();
      if (lower.includes('bns') || lower.includes('legal') || lower.includes('section') || lower.includes('provision')) {
        responseProvisions = FIR_ANALYSIS_PROVISIONS;
      }

      // Map actions to React Router navigation
      const mappedActions = airaRes.actions?.map((act) => ({
        label: act.label,
        primary: act.primary,
        onClick: () => navigateAira(act.route, navigate),
      }));

      setMessages((prev) => [
        ...prev,
        {
          role: 'AI',
          text: airaRes.response,
          actions: mappedActions,
          provisions: responseProvisions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsTyping(false);

      // Unified Gemini voice playback
      handleSubmitQuery(userMsgText);
    }, 400);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleUserQuery(input);
  };

  const toggleVoiceMode = () => {
    if (isVoiceActive) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      {/* Legal Provision Details Drawer */}
      <ProvisionDetailsDrawer provision={drawerProvision} onClose={() => setDrawerProvision(null)} />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#070d1e] border border-cyan-400/40 p-0.5 flex items-center justify-center">
              <img src="/AIRA.png" alt="AIRA" className="w-full h-full object-contain" />
            </div>
            <span>AIRA Intelligence Assistant</span>
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Odisha Police · Context-aware investigative reasoning and BNS statutory intelligence.
          </p>
        </div>

        {/* Voice Mode Quick Toggle Badge */}
        <button
          onClick={toggleVoiceMode}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
            isVoiceActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse shadow-lg shadow-cyan-500/20'
              : 'bg-surface border-border-soft text-text-dim hover:text-cyan-400 hover:border-cyan-400/40'
          }`}
        >
          {isVoiceActive ? <Radio size={13} className="animate-spin text-cyan-400" /> : <Mic size={13} />}
          <span>{isVoiceActive ? 'VOICE MODE ACTIVE' : 'ENABLE VOICE MODE'}</span>
        </button>
      </div>

      {/* Main Conversation Glass Card */}
      <div className="flex-1 bg-surface border border-border-soft rounded-2xl flex flex-col overflow-hidden shadow-card">
        {/* Voice Activity Bar (when voice is actively streaming) */}
        {isVoiceActive && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-950/40 via-surface to-cyan-950/40 border-b border-cyan-500/30 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>
                {listeningState === 'REQUESTING_MIC'
                  ? 'REQUESTING MICROPHONE...'
                  : listeningState === 'CONNECTING'
                  ? 'CONNECTING TO GEMINI LIVE...'
                  : audioLevel > 0.08
                  ? 'RECEIVING SPEECH...'
                  : 'LISTENING TO MICROPHONE...'}
              </span>
              {transcript && <span className="italic text-text">"{transcript}"</span>}
            </div>
            <AiraVoiceVisualizer state={listeningState} audioLevel={audioLevel} isCompact />
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow ${
                  msg.role === 'USER' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-[#070d1e] border border-cyan-400/40 p-1'
                }`}
              >
                {msg.role === 'USER' ? (
                  <User size={16} />
                ) : (
                  <img src="/AIRA.png" alt="AIRA" className="w-full h-full object-contain" />
                )}
              </div>
              <div
                className={`rounded-2xl p-4 text-sm ${
                  msg.role === 'USER'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none max-w-[80%] shadow-md'
                    : 'glass rounded-tl-none text-text leading-relaxed w-full max-w-[90%] border border-border-soft'
                }`}
              >
                {msg.text.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line.includes('**') ? (
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ) : (
                      line
                    )}
                    {idx < msg.text.split('\n').length - 1 && <br />}
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

                {/* Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border-soft">
                    {msg.actions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={act.onClick}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          act.primary
                            ? 'bg-brand text-bg hover:bg-brand-bright shadow-md shadow-brand/20'
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
              <div className="h-8 w-8 rounded-full bg-[#070d1e] border border-cyan-400/40 p-1 flex items-center justify-center shrink-0">
                <img src="/AIRA.png" alt="AIRA" className="w-full h-full object-contain animate-pulse" />
              </div>
              <div className="glass rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area with Integrated Mic Button */}
        <div className="p-4 border-t border-border-soft bg-bg-elev">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceMode}
              className={`p-2.5 rounded-full border transition-all ${
                isVoiceActive
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-surface border-border-soft text-cyan-400 hover:border-cyan-400 hover:bg-surface-hover'
              }`}
              title={isVoiceActive ? 'Stop Voice Recording' : 'Start Voice Recording'}
            >
              {isVoiceActive ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
                title="Stop AIRA Speech Output"
              >
                <VolumeX size={18} />
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about FIR 504, vehicle plates, BNS legal provisions, or say 'Hey AIRA'..."
              className="flex-1 bg-surface border border-border-soft rounded-full px-4 py-2.5 text-sm focus:border-cyan-400 focus:outline-none placeholder:text-text-faint"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-brand text-bg px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-bright disabled:opacity-50 transition-colors shadow"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
