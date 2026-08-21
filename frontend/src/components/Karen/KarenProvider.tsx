import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMockState } from '../../mockServices/MockStateContext';
import { processKarenQuery, KarenResponse, KarenContext } from '../../services/karenService';

export type KarenListeningState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESPONDING';

export interface KarenMessage {
  sender: 'USER' | 'KAREN';
  text: string;
  responseData?: KarenResponse;
  timestamp: string;
}

interface KarenContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  listeningState: KarenListeningState;
  setListeningState: (state: KarenListeningState) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  response: KarenResponse | null;
  setResponse: (resp: KarenResponse | null) => void;
  history: KarenMessage[];
  setHistory: React.Dispatch<React.SetStateAction<KarenMessage[]>>;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  startListening: () => void;
  stopListening: () => void;
  handleSubmitQuery: (query: string) => void;
  speechSupported: boolean;
  resetKaren: () => void;
}

const KarenContextObj = createContext<KarenContextType | undefined>(undefined);

export const useKaren = () => {
  const ctx = useContext(KarenContextObj);
  if (!ctx) throw new Error('useKaren must be used within a KarenProvider');
  return ctx;
};

export const KarenProvider = ({ children }: { children: ReactNode }) => {
  const { state, dispatch } = useMockState();
  const location = useLocation();
  const navigate = useNavigate();

  // Positions persisted in localStorage
  const [position, setPos] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem('karen-position');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Fallback bottom-right
    return { x: window.innerWidth - 130, y: window.innerHeight - 130 };
  });

  const setPosition = (pos: { x: number; y: number }) => {
    setPos(pos);
    localStorage.setItem('karen-position', JSON.stringify(pos));
  };

  const [isOpen, setIsOpen] = useState(false);
  const [listeningState, setListeningState] = useState<KarenListeningState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<KarenResponse | null>(null);
  const [history, setHistory] = useState<KarenMessage[]>([]);

  // Speech Recognition API setup
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setListeningState('LISTENING');
        setTranscript('');
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        handleSubmitQuery(resultText);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setListeningState('IDLE');
      };

      rec.onend = () => {
        // Only reset if it didn't transition to PROCESSING
        setListeningState(prev => prev === 'LISTENING' ? 'IDLE' : prev);
      };

      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.warn('SpeechRecognition already running', e);
      }
    } else {
      // Simulate speech recognition for testing if unsupported or denied (e.g. headless chromium)
      setListeningState('LISTENING');
      setTranscript('');
      
      setTimeout(() => {
        const isCasePage = window.location.pathname.includes('/cases/');
        const simulatedText = isCasePage ? "Open CCTV" : "Tell me about FIR 541";
        setTranscript(simulatedText);
        
        // Brief pause to display the simulated text before processing
        setTimeout(() => {
          handleSubmitQuery(simulatedText);
        }, 1000);
      }, 3000);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    } else {
      setListeningState('IDLE');
    }
  };

  const resetKaren = () => {
    setListeningState('IDLE');
    setTranscript('');
    setResponse(null);
  };

  const handleSubmitQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    setListeningState('PROCESSING');
    setTranscript(queryText);

    // Context determination
    const match = location.pathname.match(/\/cases\/([^/]+)/);
    const currentCaseId = match ? match[1] : undefined;
    const role = state.currentUser?.role;
    const station = state.stations.find(s => s.id === state.currentUser?.stationId)?.name;
    const currentUser = state.currentUser?.name;

    const context: KarenContext = {
      currentUser,
      station,
      currentCaseId,
      currentPage: location.pathname,
      role
    };

    setTimeout(() => {
      const resp = processKarenQuery(queryText, context);
      setResponse(resp);
      setListeningState('RESPONDING');

      // Keep type compliance for history
      setHistory([
        {
          sender: 'USER',
          text: queryText,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          sender: 'KAREN',
          text: resp.response,
          responseData: resp,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 2000); // 2 second realistic delay
  };

  // Expose global test hook for automated verification
  useEffect(() => {
    (window as any).__karenSubmitQuery = (text: string) => {
      handleSubmitQuery(text);
    };
    return () => {
      delete (window as any).__karenSubmitQuery;
    };
  }, [isOpen]);

  // Watch for active background match alerts to trigger proactive alert UI
  const lastAlert = state.alerts[0];
  const [lastProcessedAlertId, setLastProcessedAlertId] = useState<string>('');

  useEffect(() => {
    if (!state.currentUser) return;
    if (
      lastAlert &&
      lastAlert.type === 'CROSS_STATION_MATCH' &&
      !lastAlert.isRead &&
      lastAlert.id !== lastProcessedAlertId
    ) {
      setLastProcessedAlertId(lastAlert.id);

      // Auto expand Karen core
      setIsOpen(true);
      setListeningState('RESPONDING');

      const currentUser = state.currentUser?.name || 'Inspector';

      const mockResponse: KarenResponse = {
        intent: 'PROACTIVE_ALERT',
        response: `${currentUser}, new intelligence has been discovered.
Cross-station relationship matching identified a related case in Cuttack Sadar.
• Case: **CR-CTC-2026-00981**
• Similarity: **94%**`,
        actions: [
          { label: 'VIEW RELATIONSHIP', route: `/cases/${lastAlert.relatedCaseId}` },
          { label: 'REQUEST ACCESS', route: `/requests` }
        ]
      };
      setResponse(mockResponse);
      setHistory([
        {
          sender: 'KAREN',
          text: mockResponse.response,
          responseData: mockResponse,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      // Automatically mark the alert as read
      dispatch({ type: 'MARK_ALERT_READ', payload: lastAlert.id });
    }
  }, [state.alerts, lastAlert, lastProcessedAlertId, state.currentUser, dispatch]);

  return (
    <KarenContextObj.Provider
      value={{
        isOpen,
        setIsOpen,
        listeningState,
        setListeningState,
        transcript,
        setTranscript,
        response,
        setResponse,
        history,
        setHistory,
        position,
        setPosition,
        startListening,
        stopListening,
        handleSubmitQuery,
        speechSupported,
        resetKaren
      }}
    >
      {children}
    </KarenContextObj.Provider>
  );
};
