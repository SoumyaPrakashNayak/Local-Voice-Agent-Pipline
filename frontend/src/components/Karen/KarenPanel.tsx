import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKaren } from './KarenProvider';
import { KarenVoiceVisualizer } from './KarenVoiceVisualizer';
import { KarenResponseCard } from './KarenResponseCard';
import { useMockState } from '../../mockServices/MockStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { navigateKaren } from '../../services/karenNavigationService';
import { Mic, ArrowLeft, Terminal, Bot, Sparkles, Navigation, X } from 'lucide-react';

export function KarenPanel() {
  const {
    isOpen,
    setIsOpen,
    listeningState,
    setListeningState,
    transcript,
    setTranscript,
    response,
    startListening,
    stopListening,
    handleSubmitQuery,
    resetKaren,
    speak,
    isSpeaking,
    stopSpeaking
  } = useKaren();

  const { state } = useMockState();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const role = state.currentUser?.role || 'OFFICER';

  const [processingStep, setProcessingStep] = useState(0);
  const [subtitleText, setSubtitleText] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownAction, setCountdownAction] = useState<(() => void) | null>(null);
  const prevIsOpen = useRef(isOpen);

  // Cycle through voice processing checkmarks
  useEffect(() => {
    if (listeningState === 'PROCESSING') {
      setProcessingStep(0);
      const t1 = setTimeout(() => setProcessingStep(0.5), 400);
      const t2 = setTimeout(() => setProcessingStep(1.0), 900);
      const t3 = setTimeout(() => setProcessingStep(1.5), 1400);
      const t4 = setTimeout(() => setProcessingStep(2.0), 1900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [listeningState]);

  // Handle countdowns for auto-redirect or auto-minimization
  useEffect(() => {
    if (listeningState === 'RESPONDING' && response) {
      if (response.route) {
        setCountdown(6);
        setCountdownAction(() => () => {
          stopSpeaking();
          navigateKaren(response.route || '', navigate);
          setIsOpen(false);
          resetKaren();
        });
      } else {
        setCountdown(10);
        setCountdownAction(() => () => {
          stopSpeaking();
          setIsOpen(false);
          resetKaren();
        });
      }
    } else {
      setCountdown(null);
      setCountdownAction(null);
    }
  }, [listeningState, response]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && countdownAction) {
      countdownAction();
    }
  }, [countdown, countdownAction]);

  // Fix Repeated Greeting Bug & Activation Voice flow
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      if (!response) {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setListeningState('SPEAKING');
        
        // Retrieve introduction tracking state keyed by role
        const key = `karenHasIntroduced_${role}`;
        const hasIntroduced = localStorage.getItem(key) === 'true';
        let greetingVoiceText = '';
        if (!hasIntroduced) {
          greetingVoiceText = `${getGreeting()} I am Karen, your CrimeLens Investigation Assistant. I am here to assist you with case analysis, intelligence discovery, and workflows.`;
          localStorage.setItem(key, 'true');
        } else {
          greetingVoiceText = `Good to see you again ${getGreetingName()}. How can I assist you?`;
        }
        setSubtitleText(greetingVoiceText);
        
        const t = setTimeout(() => {
          speak(greetingVoiceText, () => {
            setListeningState('IDLE');
          });
        }, 400);

        return () => clearTimeout(t);
      }
    } else if (!isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, response, role]);

  useEffect(() => {
    if (response) {
      setSubtitleText(response.response);
    }
  }, [response]);

  if (!isOpen) return null;
  if (location.pathname === '/' || location.pathname === '/login') return null;

  const name = state.currentUser?.name || 'Officer';

  function getGreeting() {
    if (role === 'SUPER_ADMIN') {
      return t('karen.greetingAdmin', `Good morning Commissioner.`);
    } else if (role === 'STATION_ADMIN') {
      return t('karen.greetingStation', `Good morning IIC Ramesh.`);
    } else {
      return t('karen.greeting', `Good day, ${name}. I am KAREN, your voice intelligence companion.`);
    }
  }

  function getGreetingName() {
    if (role === 'SUPER_ADMIN') {
      return `Commissioner`;
    } else if (role === 'STATION_ADMIN') {
      return `IIC Ramesh`;
    } else {
      return name;
    }
  }

  const handleMicToggle = () => {
    cancelTimers();
    stopSpeaking();
    if (listeningState === 'LISTENING') {
      stopListening();
      setListeningState('IDLE');
    } else {
      startListening();
    }
  };

  const handleTextAssistantRedirect = () => {
    stopSpeaking();
    setIsOpen(false);
    resetKaren();
    navigate('/assistant');
  };

  const handleSimulateCommand = (command: string) => {
    cancelTimers();
    setListeningState('LISTENING');
    setTranscript('');
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < command.length) {
        setTranscript(command.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          handleSubmitQuery(command);
        }, 600);
      }
    }, 40);
  };

  const cancelTimers = () => {
    setCountdown(null);
    setCountdownAction(null);
  };

  const mockCommands = [
    "Tell me about FIR 541",
    "Open FIR 541",
    "Show my cases",
    "Show pending cases",
    "Show linked cases",
    "Find similar crimes",
    "Open CCTV",
    "What BNS applies",
    "Generate report",
    "Open evidence vault",
    "Show case timeline",
    "Show investigation progress",
    "Check cross-station matches",
    "Scan applicable BNS provisions"
  ];

  return (
    <div className="fixed inset-0 z-[9995] bg-transparent pointer-events-none flex flex-col items-center select-none overflow-y-auto pt-[45vh] pb-10 px-4">
      {/* Centered Voice Visualizer */}
      <div className="fixed top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 z-[9996] pointer-events-none">
        <KarenVoiceVisualizer state={listeningState} />
      </div>

      {/* Floating Glassmorphic Container */}
      <div 
        className="w-full max-w-xl bg-[#09101f]/75 backdrop-blur-xl border border-border-soft/20 rounded-[2.5rem] p-8 pointer-events-auto flex flex-col items-center justify-center text-center space-y-6 z-10 relative shadow-2xl animate-fade-in"
        style={{ 
          boxShadow: '0 15px 50px -10px rgba(0, 243, 255, 0.18), inset 0 0 25px rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(0, 243, 255, 0.15)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={() => { stopSpeaking(); setIsOpen(false); resetKaren(); }}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-900/60 border border-border-soft/30 hover:bg-slate-800 text-text-dim hover:text-text transition-colors z-[9998]"
        >
          <X size={15} />
        </button>

        {/* Header Badge */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-bright uppercase flex items-center justify-center gap-1.5 animate-pulse">
            ◇ KAREN ASSISTANT
          </span>
        </div>

        {/* 1. SPEAKING STATE */}
        {listeningState === 'SPEAKING' && (
          <div className="space-y-4 animate-fade-in w-full max-w-md">
            <span className="text-[10px] font-mono font-bold text-brand-bright uppercase tracking-widest animate-pulse">
              Speaking...
            </span>
            <div className="text-xs font-mono text-text leading-relaxed p-4 bg-slate-950/40 rounded-2xl border border-border-soft/10 shadow-lg">
              {response ? response.response.replace(/\*\*/g, '').replace(/•/g, '') : subtitleText.replace(/\*\*/g, '').replace(/•/g, '')}
            </div>
          </div>
        )}

        {/* 2. IDLE & LISTENING STATES: Render Dedicated Microphone Mode */}
        {(listeningState === 'IDLE' || listeningState === 'LISTENING') && (
          <div className="space-y-5 animate-fade-in w-full">
            {listeningState === 'IDLE' && (
              <div className="space-y-1 text-xs text-text-dim max-w-md mx-auto leading-relaxed font-sans text-center">
                <p>Welcome {getGreetingName()}. Speak case commands or explore shortcuts.</p>
              </div>
            )}

            {listeningState === 'LISTENING' && (
              <div className="bg-bg/40 border border-brand/20 rounded-2xl p-4 w-full max-w-md mx-auto shadow-inner text-left min-h-[80px] flex flex-col justify-between">
                <div className="text-[9px] font-mono text-brand font-bold uppercase tracking-wider mb-1">
                  YOU SAID:
                </div>
                <div className="text-sm text-text font-semibold leading-relaxed italic font-mono">
                  {transcript ? `"${transcript}"` : 'Listening for audio query...'}
                </div>
              </div>
            )}

            {/* Dedicated Microphone Control */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <button
                onClick={handleMicToggle}
                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 relative group ${
                  listeningState === 'LISTENING'
                    ? 'bg-danger text-white shadow-glow-danger'
                    : 'bg-brand text-bg hover:bg-brand-bright hover:scale-105 shadow-glow-brand'
                }`}
              >
                <Mic size={22} className={`${listeningState === 'LISTENING' ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                {listeningState === 'LISTENING' && (
                  <span className="absolute -inset-1 rounded-full border border-danger/40 animate-ping opacity-75" />
                )}
              </button>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-dim">
                {listeningState === 'LISTENING' ? '🎙 Listening... Click to stop' : '🎙 ' + t('karen.tapToSpeak', 'Click to speak')}
              </span>
            </div>

            {/* Simulative command chips for demo verification */}
            <div className="space-y-2 pt-2 border-t border-border-soft/20">
              <div className="text-[9px] font-mono uppercase tracking-widest text-text-faint">
                Voice Command Shortcuts
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
                {mockCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleSimulateCommand(cmd)}
                    className="px-2.5 py-1 bg-[#0b1424] border border-border-soft/40 hover:bg-brand/10 hover:border-brand/35 text-text-dim hover:text-brand-bright text-[10px] font-mono rounded-lg transition-all duration-200"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. PROCESSING STATE */}
        {listeningState === 'PROCESSING' && (
          <div className="space-y-4 animate-fade-in w-full max-w-md">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-accent-bright uppercase flex items-center justify-center gap-1.5 animate-pulse">
                <Terminal size={12} className="animate-spin" /> KAREN ANALYZING
              </span>
            </div>

            {/* Step-by-step check status animations */}
            <div className="bg-black/30 border border-border-soft/30 rounded-2xl p-5 text-left font-mono text-[11.5px] text-text-dim space-y-3 shadow-lg flex flex-col justify-center">
              <div className="flex items-center gap-2.5">
                {processingStep >= 0.5 ? (
                  <span className="text-brand-bright font-bold">✓</span>
                ) : (
                  <span className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin inline-block" />
                )}
                <span className={processingStep >= 0.5 ? 'text-text font-semibold' : 'text-text-dim'}>Understanding request...</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                {processingStep >= 1.0 ? (
                  <span className="text-brand-bright font-bold">✓</span>
                ) : processingStep >= 0.5 ? (
                  <span className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <span className="text-text-faint">•</span>
                )}
                <span className={processingStep >= 1.0 ? 'text-text font-semibold' : 'text-text-dim'}>Searching CrimeLens intelligence...</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                {processingStep >= 1.5 ? (
                  <span className="text-brand-bright font-bold">✓</span>
                ) : processingStep >= 1.0 ? (
                  <span className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <span className="text-text-faint">•</span>
                )}
                <span className={processingStep >= 1.5 ? 'text-text font-semibold' : 'text-text-dim'}>Checking cases...</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                {processingStep >= 2.0 ? (
                  <span className="text-brand-bright font-bold">✓</span>
                ) : processingStep >= 1.5 ? (
                  <span className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <span className="text-text-faint">•</span>
                )}
                <span className={processingStep >= 2.0 ? 'text-text font-semibold' : 'text-text-dim'}>Preparing response...</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. RESPONDING STATE */}
        {listeningState === 'RESPONDING' && response && (
          <div className="space-y-4 w-full animate-slide-up">
            {countdown !== null && (
              <div className="bg-brand/10 border border-brand/30 text-brand-bright font-semibold font-mono text-[9px] rounded-lg px-3 py-1.5 flex items-center justify-between max-w-md mx-auto">
                <span className="flex items-center gap-1">
                  <Navigation size={10} className="animate-bounce" />
                  {response.route ? `Performing action in ${countdown}s...` : `Minimizing in ${countdown}s...`}
                </span>
                <button 
                  onClick={cancelTimers}
                  className="px-1.5 py-0.5 bg-slate-900 border border-border-soft/40 hover:bg-slate-800 rounded text-[9px] font-bold text-text-dim hover:text-text"
                >
                  Keep open
                </button>
              </div>
            )}

            <div className="w-full text-left max-h-[40vh] overflow-y-auto pr-1">
              <KarenResponseCard 
                response={response} 
                onActionTriggered={() => {
                  setIsOpen(false);
                  resetKaren();
                }}
              />
            </div>

            <div className="flex justify-center gap-2.5 pt-1">
              <button
                onClick={() => { cancelTimers(); resetKaren(); }}
                className="px-4 py-1.5 border border-border-soft/40 hover:bg-[#0b1424] hover:border-brand/40 text-text-dim hover:text-text rounded-full text-[11px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 bg-transparent"
              >
                <ArrowLeft size={11} /> Speak again
              </button>
              <button
                onClick={() => { setIsOpen(false); resetKaren(); }}
                className="px-4 py-1.5 bg-brand text-bg font-bold border border-brand hover:bg-brand-bright rounded-full text-[11px] font-mono uppercase tracking-wider transition-colors"
              >
                Done (Minimize)
              </button>
            </div>
          </div>
        )}

        {/* Link redirect footer */}
        <div className="pt-2 border-t border-border-soft/10 w-full text-center">
          <button
            onClick={handleTextAssistantRedirect}
            className="text-[10px] text-accent-bright hover:text-accent font-semibold font-sans tracking-wide"
          >
            Go to Text AI Assistant Page →
          </button>
        </div>

      </div>
    </div>
  );
}
