import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMockState } from '../../mockServices/MockStateContext';
import { processAiraQuery, AiraResponse, AiraContext, AiraAction } from '../../services/airaService';
import { navigateAira } from '../../services/airaNavigationService';
import { GeminiLiveService, GeminiLiveState, GeminiLiveDiagnostics, parseFastCommand } from '../../services/geminiLiveService';

export type AiraListeningState = GeminiLiveState;

export interface AiraDiagnostics extends GeminiLiveDiagnostics {}

export interface AiraMessage {
  id: string;
  sender: 'USER' | 'AIRA';
  text: string;
  responseData?: AiraResponse;
  timestamp: string;
}

interface AiraContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  listeningState: AiraListeningState;
  setListeningState: (state: AiraListeningState) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  response: AiraResponse | null;
  setResponse: (resp: AiraResponse | null) => void;
  history: AiraMessage[];
  setHistory: React.Dispatch<React.SetStateAction<AiraMessage[]>>;
  audioLevel: number;
  geminiConnected: boolean;
  wakeWordEnabled: boolean;
  setWakeWordEnabled: (enabled: boolean) => void;
  diagnostics: AiraDiagnostics;
  showDiagnostics: boolean;
  setShowDiagnostics: (show: boolean) => void;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  handleSubmitQuery: (query: string) => void;
  executeAction: (action: AiraAction) => void;
  resetAira: () => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AiraContextObj = createContext<AiraContextType | undefined>(undefined);

export const useAira = () => {
  const ctx = useContext(AiraContextObj);
  if (!ctx) throw new Error('useAira must be used within an AiraProvider');
  return ctx;
};

export const AiraProvider = ({ children }: { children: ReactNode }) => {
  const { state } = useMockState();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [listeningState, setListeningState] = useState<AiraListeningState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState<AiraResponse | null>(null);
  const [history, setHistory] = useState<AiraMessage[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Diagnostics State
  const [diagnostics, setDiagnostics] = useState<AiraDiagnostics>({
    microphoneReady: false,
    permissionGranted: false,
    geminiConnected: false,
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    inputSampleRate: 0,
    resamplingActive: false,
    audioFramesSent: 0,
    audioBytesSent: 0,
    lastTranscript: '',
    lastResponse: '',
    lastTool: '',
  });

  const geminiServiceRef = useRef<GeminiLiveService | null>(null);

  // Initialize Direct Gemini Live Client Service
  useEffect(() => {
    const service = new GeminiLiveService({
      onStateChange: (newState) => {
        setListeningState(newState);
        if (newState === 'LISTENING') {
          setGeminiConnected(true);
          setErrorMessage('');
        } else if (newState === 'DISCONNECTED') {
          setGeminiConnected(false);
        }
        updateDiagnostics();
      },
      onUserTranscript: (userText, isFinal) => {
        setTranscript(userText);
        setDiagnostics((prev) => ({ ...prev, lastTranscript: userText }));

        if (isFinal && userText.trim()) {
          // Append User Message to conversation history
          const userMsg: AiraMessage = {
            id: `msg-user-${Date.now()}`,
            sender: 'USER',
            text: userText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setHistory((prev) => [...prev, userMsg]);
        }
      },
      onAssistantTranscript: (assistantText) => {
        setDiagnostics((prev) => ({ ...prev, lastResponse: assistantText }));
      },
      onToolCall: async (name: string, args: any) => {
        const actionReceivedAt = performance.now();
        console.log(`[AIRA FRONTEND TOOL EXECUTION] Executing: ${name} with args:`, args);
        setDiagnostics((prev) => ({ ...prev, lastTool: `${name}(${JSON.stringify(args)})` }));

        // Map Tool Call to Authoritative Action & Navigation
        let route = '';
        let spoken = `Opening ${name}`;

        if (name === 'open_fir') {
          const rawFirId = String(args?.fir_id || '504');
          const firNum = rawFirId.replace(/[^0-9]/g, '') || '504';
          route = `/cases/CR-KHD-2026-00504`;
          if (firNum === '541') {
            route = '/cases/CR-KHD-2026-00541';
          } else if (firNum === '0001' || firNum === '1') {
            route = '/cases/OD-BBSR-2026-0001';
          } else if (firNum === '0981' || firNum === '981') {
            route = '/cases/OD-CTC-2026-00981';
          }
          spoken = `Opening FIR ${firNum}.`;
        } else if (name === 'open_fir_knowledge_graph') {
          const rawFirId = String(args?.fir_id || '504');
          const firNum = rawFirId.replace(/[^0-9]/g, '') || '504';
          route = `/cases/CR-KHD-2026-00504?tab=graph`;
          if (firNum === '541') {
            route = '/cases/CR-KHD-2026-00541?tab=graph';
          } else if (firNum === '0001' || firNum === '1') {
            route = '/cases/OD-BBSR-2026-0001?tab=graph';
          } else if (firNum === '0981' || firNum === '981') {
            route = '/cases/OD-CTC-2026-00981?tab=graph';
          }
          spoken = `Opening knowledge graph for FIR ${firNum}.`;
        } else if (name === 'get_fir_details') {
          const rawFirId = String(args?.fir_id || '504');
          const firNum = rawFirId.replace(/[^0-9]/g, '') || '504';
          route = `/cases/CR-KHD-2026-00504`;
          spoken = `FIR ${firNum} is an active burglary investigation at Unit IV, Bhubaneswar.`;
        } else if (name === 'show_my_cases' || name === 'show_pending_cases') {
          route = '/cases';
          spoken = 'Opening case docket.';
        } else if (name === 'open_evidence_vault') {
          route = '/evidence';
          spoken = 'Opening Evidence Vault.';
        } else if (name === 'open_network_explorer' || name === 'find_similar_crimes') {
          route = '/network';
          spoken = 'Opening Network Explorer.';
        } else if (name === 'show_crime_hotspots' || name === 'generate_report') {
          route = '/reports';
          spoken = 'Opening analytics and reports.';
        } else if (name === 'open_cctv') {
          route = '/cctv';
          spoken = 'Opening CCTV camera feeds.';
        } else if (name === 'open_legal_intelligence') {
          route = '/legal';
          spoken = 'Opening Legal Intelligence.';
        } else if (name === 'show_case_timeline') {
          route = '/cases/CR-KHD-2026-00504?tab=overview';
          spoken = 'Showing case timeline.';
        } else if (name === 'check_cross_station_matches') {
          route = '/intelligence/alerts';
          spoken = 'Showing cross-station matches.';
        }

        const agentMsg: AiraMessage = {
          id: `msg-aira-${Date.now()}`,
          sender: 'AIRA',
          text: spoken,
          responseData: {
            intent: name,
            response: spoken,
            route: route || undefined,
            actions: route ? [{ label: 'View File', route, primary: true }] : [],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setHistory((prev) => [...prev, agentMsg]);

        // Immediate authoritative navigation without artificial delays
        if (route) {
          console.log(`[AIRA FRONTEND] Navigating immediately to: ${route}`);
          navigateAira(route, navigate);
          const navStartedAt = performance.now();
          const frontendActionMs = Math.max(0, Math.round(navStartedAt - actionReceivedAt));
          console.log(`[AIRA LATENCY] Frontend action: ${frontendActionMs} ms`);
        }

        return {
          success: true,
          action: name,
          route,
          status: 'EXECUTED',
        };
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
      onSpeakingChange: (speaking) => {
        setIsSpeaking(speaking);
      },
    });

    geminiServiceRef.current = service;

    return () => {
      service.stop();
      geminiServiceRef.current = null;
    };
  }, [navigate]);

  const updateDiagnostics = () => {
    if (geminiServiceRef.current) {
      setDiagnostics(geminiServiceRef.current.getDiagnostics());
    }
  };

  // Start Voice Pipeline
  const startListening = async () => {
    setErrorMessage('');
    setTranscript('');

    if (geminiServiceRef.current) {
      await geminiServiceRef.current.start();
      updateDiagnostics();
    }
  };

  // Stop Voice Pipeline
  const stopListening = async () => {
    if (geminiServiceRef.current) {
      geminiServiceRef.current.stop();
      updateDiagnostics();
    }
    setListeningState('IDLE');
  };

  // Execute Direct UI Action
  const executeAction = (action: AiraAction) => {
    if (action.route) {
      navigateAira(action.route, navigate);
    }
  };

  // Authoritative Command Pipeline (Used for Predefined Buttons & Text Queries)
  const handleSubmitQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: AiraMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory((prev) => [...prev, userMsg]);
    setTranscript(query);
    setListeningState('PROCESSING');

    // 1. Process deterministic local intelligence state
    const currentStation = state.stations.find((s) => s.id === state.currentUser?.stationId);
    const airaContext: AiraContext = {
      currentUser: state.currentUser?.name,
      station: currentStation?.name,
      currentPage: location.pathname,
      role: state.currentUser?.role,
      cases: state.cases,
      stations: state.stations,
      evidence: state.evidence,
    };

    const resp = processAiraQuery(query, airaContext);
    setResponse(resp);

    // 2. Fast Path UI Navigation for deterministic commands (<5ms perceived latency)
    if (resp.route) {
      console.log(`[AIRA FAST PATH] Instant navigation triggered for: "${query}" -> ${resp.route}`);
      navigateAira(resp.route, navigate);
    }

    // 3. Dispatch through Gemini Live for Puck voice confirmation & natural understanding
    if (geminiServiceRef.current) {
      geminiServiceRef.current.sendTextCommand(query);
    }
  };

  const stopSpeaking = () => {
    setIsSpeaking(false);
    if (listeningState === 'AIRA_SPEAKING') {
      setListeningState('IDLE');
    }
  };

  const resetAira = () => {
    stopListening();
    setHistory([]);
    setResponse(null);
    setTranscript('');
    setErrorMessage('');
    setListeningState('IDLE');
  };

  return (
    <AiraContextObj.Provider
      value={{
        isOpen,
        setIsOpen,
        listeningState,
        setListeningState,
        transcript,
        setTranscript,
        errorMessage,
        setErrorMessage,
        response,
        setResponse,
        history,
        setHistory,
        audioLevel,
        geminiConnected,
        wakeWordEnabled,
        setWakeWordEnabled,
        diagnostics,
        showDiagnostics,
        setShowDiagnostics,
        startListening,
        stopListening,
        handleSubmitQuery,
        executeAction,
        resetAira,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {children}
    </AiraContextObj.Provider>
  );
};
