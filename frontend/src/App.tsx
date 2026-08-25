import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';

// SIH Layout & Pages
import { SIHLayout } from './components/layout/SIHLayout';
import { Login } from './pages/Login';
import { CommandCenter } from './pages/CommandCenter';
import { RegisterFIR } from './pages/RegisterFIR';
import { CaseWorkspace } from './pages/CaseWorkspace';
import { EvidenceVault } from './pages/EvidenceVault';
import { AccessRequests } from './pages/AccessRequests';
import { InvestigationAssistant } from './pages/InvestigationAssistant';
import { Analytics } from './pages/Analytics';
import { NetworkExplorer } from './pages/NetworkExplorer';
import { Stations } from './pages/Stations';
import { Investigators } from './pages/Investigators';
import { Cases } from './pages/Cases';
import { CaseSearch } from './pages/CaseSearch';
import { LegalIntelligence } from './pages/LegalIntelligence';
import { CCTVModule } from './pages/CCTVModule';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<SIHLayout />}>
              <Route path="/dashboard" element={<CommandCenter />} />

              {/* Super Admin Routes */}
              <Route path="/stations" element={<Stations />} />

              {/* IIC Routes */}
              <Route path="/investigators" element={<Investigators />} />

              {/* Investigations */}
              <Route path="/cases" element={<Cases />} />
              <Route path="/case-search" element={<CaseSearch />} />
              <Route path="/cases/search" element={<Navigate to="/case-search" replace />} />
              <Route path="/cases/new" element={<RegisterFIR />} />
              <Route path="/cases/:id" element={<CaseWorkspace />} />
              <Route path="/investigations" element={<Navigate to="/cases" replace />} />
              <Route path="/investigations/:id" element={<Navigate to="/cases/:id" replace />} />

              {/* Intelligence */}
              <Route path="/intelligence/alerts" element={<CommandCenter />} />
              <Route path="/network" element={<NetworkExplorer />} />
              <Route path="/knowledge" element={<Navigate to="/network" replace />} />
              <Route path="/assistant" element={<InvestigationAssistant />} />
              <Route path="/legal" element={<LegalIntelligence />} />

              {/* Operations & Reports */}
              <Route path="/requests" element={<AccessRequests />} />
              <Route path="/evidence" element={<EvidenceVault />} />
              <Route path="/reports" element={<Analytics />} />
              <Route path="/cctv" element={<CCTVModule />} />
            </Route>
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LanguageProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
