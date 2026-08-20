# CrimeLens SIH V2 Frontend Prototype

This package is a clean, self-contained copy of the CrimeLens Smart India Hackathon (SIH) V2 frontend. It contains all pages, layout systems, component resources, typescript/vite configuration, and UI references, but excludes the backend and development/deployment artifacts.

## Package Scope & Exclusions
To keep the package light and focused strictly on frontend styling and UI workflows, the following have been **intentionally excluded**:
* **Backend Code & Python Virtual Environment** (`backend/`, `backend/.venv/`)
* **Zoho Catalyst Configurations** (`.catalystrc`, `catalyst.json`, `deployment/`, Zoho SDK configurations, Catalyst deployment archives)
* **Local Generated Folders & Caches** (`node_modules/`, `dist/`, `__pycache__`, `.pytest_cache/`)
* **Git history** (`.git/`, `.github/`)

*Note: All original V2 UI functionality, routing, components, and mockup designs are fully preserved.*

---

## Setup & Running the Frontend

To run this prototype locally, follow these steps:

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Open the link shown in the terminal (usually `http://localhost:5173`).

---

## UI References

We have included raw UI reference mockups for comparison and guidance in:
* `ui-references/argus-ui-ux-mockup.html` (Argus Investigation System Interface)
* `ui-references/veritas-ui-ux-mockup.html` (Veritas Search/Analytics Interface)

---

## Architecture: Routes & Page Flow

All routes are declared in `frontend/src/App.tsx`. They correspond to the following core V2 modules:

### 1. Authentication
* **`/`** - **Login Page** (`pages/Login.tsx`): Authenticates officers and switches roles. Different roles reveal customized sidebars and action workflows.

### 2. Operations & Dashboard
* **`/dashboard`** - **Command Center** (`pages/CommandCenter.tsx`): Dashboard showing statistics, open FIRs count, status counters, and intelligence feeds.
* **`/reports`** - **Analytics Dashboard** (`pages/Analytics.tsx`): Visualization panel displaying stats of crimes, classifications, and regional alerts.

### 3. Investigation Workflows
* **`/cases/new`** - **Register FIR** (`pages/RegisterFIR.tsx`): Form for lodging a new First Information Report.
* **`/cases/:id`** - **Case Workspace** (`pages/CaseWorkspace.tsx` & `components/cases/CaseDetailPanel.tsx`): Main workspace displaying active case details, suspect relations, links, notes, and a timeline of events.
* **`/network`** - **Suspect Network Explorer** (`pages/NetworkExplorer.tsx` & `components/cases/CaseNetworkExplorer.tsx`): Interactive force-directed network graph showing suspect linkages and phone call records.

### 4. Mock Intelligence & Assistant
* **`/assistant` & `/legal`** - **Investigation Assistant** (`pages/InvestigationAssistant.tsx`): Mock AI Assistant interface featuring file summarization (e.g. dossiers, chargesheet drafters), chat UI, and legal advisory recommendations.
* **`/requests`** - **Access Requests Console** (`pages/AccessRequests.tsx`): Interface for commanders to view, approve, or reject dossiers sharing requests.
* **`/evidence`** - **Evidence Vault** (`pages/EvidenceVault.tsx`): Inventory list showing secure evidence hash verification and blockchain integrity log simulator.

---

## Mock State and Services

The frontend does not require a running backend to operate in mock mode. All interactive states are handled by client-side hooks:
* `frontend/src/mockServices/MockStateContext.tsx`: Manages context provider and global action reducers (`ADD_CASE`, `UPDATE_ACCESS_REQUEST_STATUS`, `ADD_ALERT`, etc.).
* `frontend/src/mockServices/initialData.ts`: Populates default cases, evidence, intelligence alerts, and requests for initial page load.
* `frontend/src/mockServices/intelligenceService.ts`: Simulates real-time intelligence feeds and incoming event streams.

*Note: The real FastAPI backend and the Intelligence Link Engine will be integrated during the final integration phase.*
