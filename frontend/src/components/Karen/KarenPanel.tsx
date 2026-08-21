import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKaren } from './KarenProvider';
import { KarenVoiceVisualizer } from './KarenVoiceVisualizer';
import { KarenResponseCard } from './KarenResponseCard';
import { useMockState } from '../../mockServices/MockStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Mic, X, Sparkles, ArrowLeft, Navigation, Terminal
} from 'lucide-react';

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
    isSpeaking,
    stopSpeaking
  } = useKaren();

  const { state } = useMockState();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [processingStep, setProcessingStep] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownAction, setCountdownAction] = useState<(() => void) | null>(null);

  // Cycle through realistic database scanning lines during PROCESSING state
  useEffect(() => {
    if (listeningState === 'PROCESSING') {
      setProcessingStep(0);
      const t1 = setTimeout(() => setProcessingStep(1), 500);
      const t2 = setTimeout(() => setProcessingStep(2), 1100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [listeningState]);

  // Handle countdowns for auto-redirect or auto-minimization
  useEffect(() => {
    if (listeningState === 'RESPONDING' && response) {
      if (response.route) {
        // Auto redirect countdown
        setCountdown(6);
        setCountdownAction(() => () => {
          let target = response.route || '';
          if (target.startsWith('/investigations/')) {
            target = target.replace('/investigations/', '/cases/');
          } else if (target === '/investigations') {
            target = '/cases';
          }
          stopSpeaking();
          navigate(target);
          setIsOpen(false);
          resetKaren();
        });
      } else {
        // Generous auto-minimize
        setCountdown(12);
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

  if (!isOpen) return null;

  const name = state.currentUser?.name || 'Officer';

  // Customized operating-system greeting
  const getGreeting = () => {
    return t('karen.greeting', `Good day, ${name}. I am KAREN, your voice intelligence companion.`);
  };

  const handleMicToggle = () => {
    // Cancel any active auto-nav/minimization timers when user interacts
    setCountdown(null);
    setCountdownAction(null);
    stopSpeaking();
    
    if (listeningState === 'LISTENING') {
      stopListening();
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
    setCountdown(null);
    setCountdownAction(null);
    setListeningState('LISTENING');
    setTranscript('');
    
    // Animate typing mock simulation
    setTimeout(() => {
      setTranscript(command);
      setTimeout(() => {
        handleSubmitQuery(command);
      }, 1000);
    }, 800);
  };

  const cancelTimers = () => {
    setCountdown(null);
    setCountdownAction(null);
  };

  const mockCommands = [
    "Tell me about FIR 541",
    "Open CCTV for CR-CTC-2026-00981",
    "Check cross-station matches",
    "Scan applicable BNS provisions"
  ];

  return (
    <div className="fixed inset-0 z-[9995] bg-bg/85 backdrop-blur-md flex flex-col justify-end p-8 pb-10 animate-fade-in select-none">
      {/* Background visual elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Close button top right */}
      <button 
        onClick={() => { stopSpeaking(); setIsOpen(false); resetKaren(); }}
        className="absolute top-6 right-6 p-2 rounded-full bg-surface-2 border border-border-soft hover:bg-surface-hover text-text-dim hover:text-text transition-colors z-[9998]"
      >
        <X size={18} />
      </button>

      {/* Embedded visualizer around the centered orb */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 z-[9996]">
        <KarenVoiceVisualizer state={listeningState} />
      </div>

      {/* Main voice UI container (positioned under the core) */}
      <div className="mx-auto w-full max-w-xl flex flex-col items-center justify-center text-center space-y-6 z-10 pointer-events-auto">
        
        {/* 1. IDLE STATE: Welcome Greeting, Voice triggers & Pre-selected command simulation chips */}
        {listeningState === 'IDLE' && (
          <div className="space-y-6 animate-slide-in w-full">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-bright uppercase flex items-center justify-center gap-1.5">
                <Sparkles size={11} className="animate-pulse" /> INTELLIGENCE CORE ACTIVE
              </span>
              <h1 className="text-xl font-bold font-display text-text">
                {getGreeting()}
              </h1>
              <p className="text-xs text-text-dim max-w-md mx-auto leading-relaxed font-sans">
                Speak or tap a command chip below to trigger platform actions and receive text & audio responses.
              </p>
            </div>

            {/* Glowing Voice Button */}
            <div className="flex flex-col items-center gap-2.5">
              <button
                onClick={handleMicToggle}
                className="h-16 w-16 rounded-full bg-brand text-bg flex items-center justify-center hover:bg-brand-bright hover:scale-105 shadow-glow-brand transition-all duration-300 relative group"
              >
                <Mic size={24} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -inset-1 rounded-full border border-brand/40 animate-ping opacity-75" />
              </button>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand animate-pulse">
                🎙 {t('karen.tapToSpeak', 'Tap to Speak Command')}
              </span>
            </div>

            {/* Futuristic command simulator chips */}
            <div className="space-y-2.5 pt-3 border-t border-border-soft/40">
              <div className="text-[9px] font-mono uppercase tracking-widest text-text-faint">
                Quick Command Simulators
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {mockCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleSimulateCommand(cmd)}
                    className="px-3 py-1.5 bg-surface-2 border border-border-soft hover:bg-brand/10 hover:border-brand/35 text-text-dim hover:text-brand-bright text-[10.5px] font-mono rounded-lg transition-all duration-200"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border-soft/30 flex flex-col gap-1">
              <button
                onClick={handleTextAssistantRedirect}
                className="text-xs text-accent-bright hover:text-accent font-semibold font-sans tracking-wide"
              >
                Go to Text AI Assistant Page →
              </button>
            </div>
          </div>
        )}

        {/* 2. LISTENING STATE: Visual representation of live audio capture */}
        {listeningState === 'LISTENING' && (
          <div className="space-y-6 animate-fade-in w-full">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-danger-bright uppercase animate-pulse">
                {t('karen.listening', 'LISTENING ACTIVE')}
              </span>
              <p className="text-xs text-text-dim">Speak case query (e.g. "Tell me about FIR 541")</p>
            </div>

            {/* Live speech feedback display */}
            <div className="bg-bg-elev/80 border border-brand/20 rounded-2xl p-5 w-full max-w-md mx-auto shadow-inner text-left min-h-[90px] flex flex-col justify-between">
              <div className="text-[10px] font-mono text-brand font-bold uppercase tracking-wider mb-2">
                YOU SAID:
              </div>
              <div className="text-sm text-text font-semibold leading-relaxed italic font-mono">
                {transcript ? `"${transcript}"` : 'Listening for audio input...'}
              </div>
            </div>

            <button
              onClick={handleMicToggle}
              className="px-6 py-2 bg-danger text-white rounded-full text-xs font-bold font-mono tracking-widest uppercase hover:bg-danger-bright transition-colors shadow-md shadow-danger/10"
            >
              Mute Mic
            </button>
          </div>
        )}

        {/* 3. PROCESSING STATE: Database scanning statements */}
        {listeningState === 'PROCESSING' && (
          <div className="space-y-5 animate-fade-in w-full max-w-md">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-accent-bright uppercase flex items-center justify-center gap-1.5 animate-pulse">
                <Terminal size={12} className="animate-spin" /> KAREN ANALYZING
              </span>
              <p className="text-xs text-text-dim">Processing voice request: "{transcript}"</p>
            </div>

            {/* Animated CLI status messages */}
            <div className="bg-black/40 border border-border-soft rounded-2xl p-5 text-left font-mono text-[11px] text-text-dim space-y-2 h-[125px] shadow-lg flex flex-col justify-center">
              <div className={processingStep >= 0 ? 'text-accent-bright font-semibold' : 'opacity-25'}>
                &gt; Searching CrimeLens intelligence...
              </div>
              <div className={processingStep >= 1 ? 'text-accent-bright font-semibold' : 'opacity-25'}>
                &gt; Checking case database...
              </div>
              <div className={processingStep >= 2 ? 'text-brand-bright font-bold animate-pulse' : 'opacity-25'}>
                &gt; Preparing investigation response...
              </div>
            </div>
          </div>
        )}

        {/* 4. RESPONDING STATE: Structured answer panel */}
        {listeningState === 'RESPONDING' && response && (
          <div className="space-y-5 w-full animate-slide-up">
            
            {/* Auto-countdown Alert Banner */}
            {countdown !== null && (
              <div className="bg-brand/10 border border-brand/30 text-brand-bright font-semibold font-mono text-[10px] rounded-lg px-4 py-2 flex items-center justify-between max-w-md mx-auto">
                <span className="flex items-center gap-1">
                  <Navigation size={11} className="animate-bounce" />
                  {response.route ? `Redirecting to destination in ${countdown}s...` : `Minimizing assistant in ${countdown}s...`}
                </span>
                <button 
                  onClick={cancelTimers}
                  className="px-2 py-0.5 bg-surface-2 border border-border-soft hover:bg-surface-hover rounded text-[9px] font-bold text-text-dim hover:text-text"
                >
                  Keep open
                </button>
              </div>
            )}

            <div className="w-full text-left">
              <KarenResponseCard 
                response={response} 
                onActionTriggered={() => {
                  setIsOpen(false);
                  resetKaren();
                }}
              />
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => { cancelTimers(); resetKaren(); }}
                className="px-5 py-2 border border-border-soft hover:bg-surface-hover hover:border-border text-text-dim hover:text-text rounded-full text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 bg-surface"
              >
                <ArrowLeft size={12} /> Speak again
              </button>
              <button
                onClick={() => { setIsOpen(false); resetKaren(); }}
                className="px-5 py-2 bg-brand text-bg font-bold border border-brand hover:bg-brand-bright rounded-full text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Done (Minimize)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
