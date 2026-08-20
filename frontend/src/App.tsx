import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';

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
import { LegalIntelligence } from './pages/LegalIntelligence';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
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
            <Route path="/cases/new" element={<RegisterFIR />} />
            <Route path="/cases/:id" element={<CaseWorkspace />} />
            
            {/* Intelligence */}
            <Route path="/intelligence/alerts" element={<CommandCenter />} /> {/* TODO: Make a dedicated alerts page if needed, or point to CC alerts tab */}
            <Route path="/network" element={<NetworkExplorer />} />
            <Route path="/assistant" element={<InvestigationAssistant />} />
            <Route path="/legal" element={<LegalIntelligence />} /> 
            
            {/* Operations */}
            <Route path="/requests" element={<AccessRequests />} />
            <Route path="/evidence" element={<EvidenceVault />} />
            <Route path="/reports" element={<Analytics />} /> 
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
