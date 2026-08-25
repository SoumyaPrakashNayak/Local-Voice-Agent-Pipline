# CrimeLens (C.R.I.M.E) — Mock Data Architecture & Data Entry Guide
**Odisha Police Intelligence & Automated Investigation Support System**

---

## 1. Overview

In the **CrimeLens** system, mock data powers both the **frontend prototype** (enabling a fully functional, zero-backend, state-persistent demo) and the **backend database** (seeding baseline data on startup).

Mock data is structured across **four primary layers**:
1. **Static Datasets**: TypeScript and Java seed files defining police stations, officer credentials, cases, evidence, BNS legal provisions, and knowledge graph links.
2. **Batch Generation Scripts**: Node.js scripts that programmatically synthesize dozens of realistic police cases, officers, and cross-station entity links.
3. **In-Memory Reactive State**: React Context (`MockStateContext`) and reducer actions that allow dynamic creation and modification of cases, evidence, stations, and access requests directly from the UI.
4. **Simulated AI Services**: Client-side AI reasoning services that simulate NLP entity extraction, cross-station pattern detection, and automatic alert dispatching.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CRIMELENS MOCK DATA SYSTEM                            │
├────────────────────────────────┬────────────────────────────────────────────────┤
│ 1. STATIC SEED FILES           │ 2. GENERATION SCRIPTS                          │
│  • initialData.ts              │  • generateMock.mjs                            │
│  • legalProvisionMockData.ts   │  • scratch/gen.js                              │
│  • networkGraphData.ts         │  (Synthesizes stations, officers, cases)       │
│  • DataInitializer.java        │                                                │
├────────────────────────────────┼────────────────────────────────────────────────┤
│ 3. RUNTIME REACT STATE (UI)    │ 4. SIMULATED AI ENGINE                         │
│  • MockStateContext.tsx        │  • intelligenceService.ts                      │
│  • Reducer: ADD_CASE,          │  • karenService.ts                             │
│    ADD_EVIDENCE, ADD_USER,     │  (Simulates NLP entity extraction,             │
│    ADD_ACCESS_REQUEST, etc.    │   cross-station link scans, & copilot routing) │
└────────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 2. Where the Mock Data is Located

### 2.1 Frontend Files Summary Table

| File Path | Description / Contents | Primary Data Entities |
| :--- | :--- | :--- |
| [`frontend/src/mockServices/types.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/types.ts) | TypeScript interfaces for the entire mock data model. | `User`, `Station`, `CaseRecord`, `Evidence`, `Entity`, `AccessRequest`, `IntelligenceAlert`, `AppState` |
| [`frontend/src/mockServices/initialData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/initialData.ts) | Primary seed dataset loaded when the frontend starts. Contains 12 Odisha police stations, 30+ officers, 70+ cases, evidence, and alerts. | `stations[]`, `users[]`, `cases[]`, `evidence[]`, `accessRequests[]`, `alerts[]`, `initialState` |
| [`frontend/src/mockServices/MockStateContext.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/MockStateContext.tsx) | React Context + Reducer managing in-memory state. Provides dispatch actions to add or update records at runtime. | `MockStateProvider`, `useMockState`, `reducer` |
| [`frontend/src/mockServices/legalProvisionMockData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/legalProvisionMockData.ts) | Mock library of Bharatiya Nyaya Sanhita (BNS) & BNSS legal provisions with confidence scores, penalties, and case mapping bundles. | `BNS_PROVISIONS`, `HERO_CASE_PROVISIONS`, `ROBBERY_CASE_PROVISIONS`, `FIR_ANALYSIS_PROVISIONS` |
| [`frontend/src/mockServices/networkGraphData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/networkGraphData.ts) | Mock knowledge graph nodes and edges used by the Network Explorer and Case Knowledge Graph. | `NETWORK_NODES[]`, `NETWORK_EDGES[]` |
| [`frontend/src/mockServices/intelligenceService.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/intelligenceService.ts) | Mock AI service simulating LLM entity extraction, cross-station relationship detection, and evidence parsing. | `analyzeFIR()`, `scanCrossStationRelationships()`, `processEvidence()` |
| [`frontend/src/services/karenService.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/services/karenService.ts) | Rule engine and response synthesizer for the AI voice copilot (K.A.R.E.N.). | Direct intent patterns, case lookup routing, action generators |
| [`frontend/generateMock.mjs`](file:///e:/SIH2026/C.R.I.M.E/frontend/generateMock.mjs) & [`frontend/scratch/gen.js`](file:///e:/SIH2026/C.R.I.M.E/frontend/scratch/gen.js) | Standalone Node.js batch scripts to generate random mock datasets and overwrite `initialData.ts`. | Synthetic generation logic |

### 2.2 Backend Database Seeder

| File Path | Description / Contents |
| :--- | :--- |
| [`backend/src/main/java/com/crimelens/config/DataInitializer.java`](file:///e:/SIH2026/C.R.I.M.E/backend/src/main/java/com/crimelens/config/DataInitializer.java) | Spring Boot `CommandLineRunner` executing on server startup. Seeds 6 Odisha police stations, 6 users (Super Admin, IICs, SIs), and 4 sample cases into the SQL database if empty. Default password: `Demo@123`. |

---

## 3. Detailed File Breakdown

### 3.1 `initialData.ts` — The Central Frontend Database
Located at: [`frontend/src/mockServices/initialData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/initialData.ts)

This is the main initial state object (`initialState: AppState`) imported by [`MockStateContext.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/MockStateContext.tsx). It includes:

1. **Stations (`stations: Station[]`)**:
   - `OP-BBSR-CAP` (Khandagiri Police Station, Khordha / Bhubaneswar)
   - `OP-CTC-CITY` (Cuttack City PS, Cuttack)
   - `OP-RKL-CEN` (Rourkela Central PS, Sundargarh / Rourkela)
   - `OP-BAM-TWN` (Berhampur Town PS, Ganjam / Berhampur)
   - `OP-PURI-TWN` (Puri Town PS, Puri)
   - `OP-SBP-CEN` (Sambalpur Central PS, Sambalpur)
   - Plus Balasore, Angul, Jharsuguda, Koraput, Rayagada, and Jeypore stations.

2. **Users (`users: User[]`)**:
   - **Super Admin**: `OP-HQ-001` (Comm. Mahapatra, Commissioner)
   - **Station Admins (IICs)**: `IIC-BBSR-01` (IIC Ramesh), `IIC-CTC-01` (Insp. Prakash), `IIC-RKL-01` (Insp. Bikash), etc.
   - **Investigating Officers (SIs)**: `INV-BBSR-001` (SI Ranjan Samal), `INV-BBSR-002` (SI Ashok Mishra), `INV-CTC-006` (SI Sanjukta Sahoo), etc.

3. **Cases (`cases: CaseRecord[]`)**:
   - **Hero Case 1 (`CR-KHD-2026-004821` / `OD-BBSR-2026-0001`)**: High-Value Burglary at Unit IV, Bhubaneswar under Khandagiri PS. Contains entities: Phone `+91-9876543210` and Vehicle `OD-02-AB-1234`.
   - **Hero Case 2 (`OD-CTC-2026-00981`)**: Armed Jewelry Heist at Badambadi, Cuttack under Cuttack City PS. Shares identical Phone `+91-9876543210` and Vehicle `OD-02-AB-1234` (triggering cross-station match).
   - Dozens of procedural cases across all districts for search, filter, and analytics testing.

4. **Evidence (`evidence: Evidence[]`)**:
   - Initial CCTV footage records, seized documents, and CDR logs linked to cases with extracted entity tags.

5. **Cross-Station Access Requests (`accessRequests: AccessRequest[]`)**:
   - Sample access requests demonstrating `PENDING`, `APPROVED`, and `REJECTED` workflows between Khandagiri PS and Cuttack / Rourkela stations.

6. **Intelligence Alerts (`alerts: IntelligenceAlert[]`)**:
   - Pre-populated cross-jurisdiction entity correlation alerts (`CROSS_STATION_MATCH`).

---

### 3.2 `legalProvisionMockData.ts` — Statutory & AI Confidence Library
Located at: [`frontend/src/mockServices/legalProvisionMockData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/legalProvisionMockData.ts)

Provides mock statutory information for India's new criminal code (Bharatiya Nyaya Sanhita - BNS):
- **Core Provision Library (`BNS_PROVISIONS`)**:
  - `BNS §303`: Theft (Property Offence, 94% relevance)
  - `BNS §305`: Theft in dwelling house / commercial building (Aggravated Property Offence, Non-bailable)
  - `BNS §309`: Robbery / Armed Heist
  - `BNS §331`: House-trespass / Lurking house-trespass
  - `BNS §111`: Organised Crime
  - `BNS §316`: Criminal Breach of Trust
  - `BNS §318`: Cheating / Fraud
- **Case Mapping Bundles**:
  - `HERO_CASE_PROVISIONS`: Provisions tailored for burglary cases.
  - `ROBBERY_CASE_PROVISIONS`: Provisions tailored for armed robbery/heist cases.
  - `FIR_ANALYSIS_PROVISIONS`: Default AI recommendations for intake.

---

### 3.3 `networkGraphData.ts` — Knowledge Graph Mock Data
Located at: [`frontend/src/mockServices/networkGraphData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/networkGraphData.ts)

Stores the graph nodes (`NetworkNode[]`) and edges (`NetworkEdge[]`) rendered by the **Network Explorer** and **Case Knowledge Graph**:
- **Node Types**: `STATION`, `CASE`, `PERSON`, `PHONE`, `VEHICLE`, `LOCATION`, `EVIDENCE`.
- **Relationship Types**: `SHARED_PHONE`, `SHARED_VEHICLE`, `SHARED_LOCATION`, `COMMON_ASSOCIATE`, `AI_DISCOVERED`, `INVOLVES`, `LOCATED_AT`, etc.
- **Node Access Levels**: `AUTHORIZED` (green/accessible) vs. `RESTRICTED` (blurred/locked until cross-station approval is granted).

---

### 3.4 `intelligenceService.ts` — Simulated AI Engine
Located at: [`frontend/src/mockServices/intelligenceService.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/intelligenceService.ts)

Simulates backend AI/LLM processing with simulated delays:
1. `analyzeFIR(narrative)`:
   - Scans text for phone numbers (e.g. `9876543210`), locations, and crime keywords.
   - Returns structured extracted entities, BNS classification, BNSS investigation steps, and crime signatures.
2. `scanCrossStationRelationships(entities, currentStationId, allCases)`:
   - Compares extracted entities against cases belonging to **other** police stations (`c.stationId !== currentStationId`).
   - If entity matches (e.g. `+91-9876543210` or `OD-02-AB-1234`), flags `matchFound: true` with high confidence score and returns target case/station IDs.
3. `processEvidence(description)`:
   - Parses unstructured notes/evidence descriptions to extract vehicle registrations and phone numbers.

---

## 4. How Mock Data is Entered (4 Methods)

```
                                  HOW MOCK DATA ENTERS THE SYSTEM
                                  
    ┌───────────────────────────┐                     ┌───────────────────────────┐
    │  METHOD 1: CODE EDITING   │                     │  METHOD 2: BATCH SCRIPTS  │
    │  Edit initialData.ts,     │                     │  Run generateMock.mjs /   │
    │  legalProvisionMockData.ts│                     │  scratch/gen.js with Node │
    └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                  │                                                 │
                  ▼                                                 ▼
          ┌───────────────┐                                 ┌───────────────┐
          │ Static Config │                                 │ Overwrites    │
          │ in Codebase   │                                 │ initialData.ts│
          └───────┬───────┘                                 └───────┬───────┘
                  │                                                 │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                               ┌───────────────────────┐
                               │  MockStateContext.tsx │◄─────────────────────────┐
                               │  (In-Memory AppState) │                          │
                               └───────────┬───────────┘                          │
                                           │                                      │
                  ┌────────────────────────┴────────────────────────┐             │
                  │                                                 │             │
                  ▼                                                 ▼             │
    ┌───────────────────────────┐                     ┌───────────────────────────┴─┐
    │  METHOD 3: IN-APP UI      │                     │  METHOD 4: BACKEND SEEDER   │
    │  • Register FIR Form      │                     │  DataInitializer.java       │
    │  • Evidence Upload Vault  │                     │  Seeds PostgreSQL/H2 DB     │
    │  • Station / Officer Form │                     │  on Spring Boot startup     │
    │  • Access Request Dialog  │                     └─────────────────────────────┘
    └───────────────────────────┘
```

---

### Method 1: Manual / Static Code Entry
To permanently add or modify baseline mock data:
1. Open [`frontend/src/mockServices/initialData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/initialData.ts).
2. Add new entries to `stations`, `users`, `cases`, `evidence`, `accessRequests`, or `alerts`.
3. Save the file. Vite HMR (Hot Module Replacement) automatically updates the running app without losing login session.

**Example — Adding a new Case:**
```typescript
{
  id: 'OD-PURI-2026-0045',
  firNumber: 'FIR/2026/0045',
  stationId: 'OP-PURI-TWN',
  investigatorId: 'INV-PURI-018',
  title: 'Temple Road Pickpocketing Ring',
  description: 'Organized pickpocketing reported near Grand Road during festival.',
  crimeType: 'Theft',
  status: 'INVESTIGATING',
  priority: 'MEDIUM',
  createdAt: '2026-08-20T10:00:00Z',
  entities: [
    { id: 'ENT-P-99', type: 'PHONE', value: '+91-9876543210' } // Will cross-link!
  ]
}
```

---

### Method 2: Batch Generation Scripts
To regenerate dozens of populated records:
1. Review or customize generation parameters in [`frontend/generateMock.mjs`](file:///e:/SIH2026/C.R.I.M.E/frontend/generateMock.mjs) or [`frontend/scratch/gen.js`](file:///e:/SIH2026/C.R.I.M.E/frontend/scratch/gen.js).
2. Run the script via Node.js in the terminal:
   ```bash
   node e:/SIH2026/C.R.I.M.E/frontend/scratch/gen.js
   ```
3. The script outputs formatted TypeScript code and writes directly to `frontend/src/mockServices/initialData.ts`.

---

### Method 3: Dynamic In-App Runtime Entry (UI Forms)

The UI allows users to create and alter mock data on the fly via React state actions:

#### A. Registering a New FIR (`/cases/new`)
- **File**: [`frontend/src/pages/RegisterFIR.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/RegisterFIR.tsx)
- **Flow**:
  1. Officer types narrative (e.g. *"Robbed by two men in white van. Phone dropped: 9876543210"*).
  2. Clicks **Analyze with AI** $\rightarrow$ `intelligenceService.analyzeFIR()` extracts phone and location entities and suggests BNS sections.
  3. Clicks **File Case** $\rightarrow$ dispatches `{ type: 'ADD_CASE', payload: newCase }`.
  4. Triggers background asynchronous cross-station scan $\rightarrow$ if matching entity exists in another station's cases, dispatches `{ type: 'ADD_ALERT', payload: newAlert }`.

#### B. Uploading Evidence (`/evidence`)
- **File**: [`frontend/src/pages/EvidenceVault.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/EvidenceVault.tsx)
- **Flow**:
  1. Officer selects case and enters evidence narrative or document notes.
  2. Clicks **Process & Ingest Evidence** $\rightarrow$ `intelligenceService.processEvidence()` extracts vehicle numbers (`OD-02-AB-1234`) or phones.
  3. Dispatches `{ type: 'ADD_EVIDENCE', payload: newEvidence }`.
  4. Dispatches `{ type: 'UPDATE_CASE', payload: updatedCaseWithNewEntities }`.
  5. Scans for cross-station matches and triggers intelligence alerts if a connection is found.

#### C. Registering Police Stations (`/stations`)
- **File**: [`frontend/src/pages/Stations.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/Stations.tsx)
- **Flow**:
  - Logged in as Super Admin (`OP-HQ-001`), click **+ Add Station**.
  - Submit form $\rightarrow$ dispatches `{ type: 'ADD_STATION', payload: newStation }`.

#### D. Adding Officers & Reassigning Cases (`/investigators`)
- **File**: [`frontend/src/pages/Investigators.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/Investigators.tsx)
- **Flow**:
  - Logged in as Station Admin (IIC), click **+ Add Officer**.
  - Submit form $\rightarrow$ dispatches `{ type: 'ADD_USER', payload: newUser }`.
  - Reassigning case $\rightarrow$ dispatches `{ type: 'UPDATE_CASE', payload: { ...case, investigatorId } }`.

#### E. Cross-Station Access Requests (`/requests` and `/cases/:id`)
- **Files**: [`frontend/src/pages/AccessRequests.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/AccessRequests.tsx) & [`frontend/src/pages/CaseWorkspace.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/CaseWorkspace.tsx)
- **Flow**:
  - Officer viewing a restricted cross-station match clicks **Request Dossier Access**.
  - Dispatches `{ type: 'ADD_ACCESS_REQUEST', payload: newRequest }`.
  - Station Commander of the target station visits `/requests` and clicks **Approve** or **Reject**.
  - Dispatches `{ type: 'UPDATE_ACCESS_REQUEST_STATUS', payload: { id, status: 'APPROVED' } }`.
  - The restricted case dossier immediately unlocks for the requesting officer.

---

### Method 4: Backend Database Seeding
Located at: [`backend/src/main/java/com/crimelens/config/DataInitializer.java`](file:///e:/SIH2026/C.R.I.M.E/backend/src/main/java/com/crimelens/config/DataInitializer.java)

When running the Spring Boot backend (`mvn spring-boot:run`):
1. The `DataInitializer` checks `stationRepository.count()`.
2. If `0`, it inserts:
   - 6 Police Stations (`OP-BBSR-CAP`, `OP-CTC-CITY`, `OP-RKL-CEN`, `OP-BAM-TWN`, `OP-PURI-TWN`, `OP-SBP-CEN`).
   - 6 Users with BCrypt-hashed password for `Demo@123`.
   - 4 Cases including cross-jurisdiction burglary and heist records with linked phone `+91-9876543210`.
3. If data already exists, seeding is skipped.

---

## 5. Summary & Quick Reference

| Action | Where to go / What file to edit |
| :--- | :--- |
| **View or edit starting mock cases & users** | [`frontend/src/mockServices/initialData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/initialData.ts) |
| **Add a case during live demo** | Navigate to `http://localhost:5173/cases/new` (Register FIR) |
| **Add evidence & trigger link alert** | Navigate to `http://localhost:5173/evidence` (Evidence Vault) |
| **Edit BNS Legal Sections & Penalties** | [`frontend/src/mockServices/legalProvisionMockData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/legalProvisionMockData.ts) |
| **Edit Network Graph Nodes & Links** | [`frontend/src/mockServices/networkGraphData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/networkGraphData.ts) |
| **Modify AI extraction behavior** | [`frontend/src/mockServices/intelligenceService.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/intelligenceService.ts) |
| **Inspect or add state dispatch actions** | [`frontend/src/mockServices/MockStateContext.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/MockStateContext.tsx) |
| **Backend Database Seed Data** | [`backend/src/main/java/com/crimelens/config/DataInitializer.java`](file:///e:/SIH2026/C.R.I.M.E/backend/src/main/java/com/crimelens/config/DataInitializer.java) |
