import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User, CaseRecord, Evidence, AccessRequest, IntelligenceAlert } from './types';
import { initialState } from './initialData';

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_CASE'; payload: CaseRecord }
  | { type: 'UPDATE_CASE'; payload: CaseRecord }
  | { type: 'ADD_EVIDENCE'; payload: Evidence }
  | { type: 'ADD_ALERT'; payload: IntelligenceAlert }
  | { type: 'MARK_ALERT_READ'; payload: string }
  | { type: 'ADD_ACCESS_REQUEST'; payload: AccessRequest }
  | { type: 'UPDATE_ACCESS_REQUEST_STATUS'; payload: { id: string; status: 'APPROVED' | 'REJECTED' } }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'ADD_STATION'; payload: Station }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_CASE':
      return { ...state, cases: [...state.cases, action.payload] };
    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'ADD_EVIDENCE':
      return { ...state, evidence: [...state.evidence, action.payload] };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map((a) => (a.id === action.payload ? { ...a, isRead: true } : a)),
      };
    case 'ADD_ACCESS_REQUEST':
      return { ...state, accessRequests: [...state.accessRequests, action.payload] };
    case 'UPDATE_ACCESS_REQUEST_STATUS':
      return {
        ...state,
        accessRequests: state.accessRequests.map((r) =>
          r.id === action.payload.id ? { ...r, status: action.payload.status } : r
        ),
      };
    case 'SET_PROCESSING':
      return { ...state, isProcessingIntelligence: action.payload };
    case 'ADD_STATION':
      return { ...state, stations: [...state.stations, action.payload] };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    default:
      return state;
  }
};

const MockStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const MockStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MockStateContext.Provider value={{ state, dispatch }}>
      {children}
    </MockStateContext.Provider>
  );
};

export const useMockState = () => {
  const context = useContext(MockStateContext);
  if (!context) {
    throw new Error('useMockState must be used within a MockStateProvider');
  }
  return context;
};
