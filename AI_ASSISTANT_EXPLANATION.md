# AI Investigation Assistant & Reasoning Engine
**CrimeLens (C.R.I.M.E) — Odisha Police Intelligence Network**

---

## 1. Overview & Purpose

The **AI Investigation Assistant** page ([`frontend/src/pages/InvestigationAssistant.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/InvestigationAssistant.tsx)) serves as an intelligent investigative copilot for law enforcement officers, station commanders (IICs), and supervisory leadership.

It bridges the gap between raw police data (FIRs, CDR logs, vehicle registrations, CCTV footage) and actionable legal/investigative steps by:
1. **Context-Aware Reasoning**: Recognizing the logged-in officer, their home police station (e.g., Khandagiri PS, Bhubaneswar), and their active cases.
2. **Multi-Jurisdictional Link Analysis**: Correlating entities across police station boundaries to surface hidden crime syndicates.
3. **Statutory Legal Intelligence**: Recommending applicable sections under India's **Bharatiya Nyaya Sanhita (BNS)** and procedural safeguards under the **Bharatiya Nagarik Suraksha Sanhita (BNSS)**.
4. **Actionable UI Dispatching**: Generating embedded interactive cards and direct one-click navigation routes (e.g., opening the Knowledge Graph, initiating cross-station dossier access requests, or generating draft charge-sheets).

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            AI INVESTIGATION ASSISTANT WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

       Officer Input (Text Prompt)
                 │
                 ▼
 ┌────────────────────────────────┐
 │   InvestigationAssistant.tsx   │ ◄─── In-Memory Context (MockStateContext)
 └───────────────┬────────────────┘       • Current User Profile & Rank
                 │                        • Home Police Station Context
                 ▼                        • Active Case Dossiers & Evidence
 ┌────────────────────────────────┐
 │     INTENT & ENTITY PARSER     │
 └───────┬──────────────┬─────────┘
         │              │
         ├──────────────┼──────────────────────────────┬──────────────────────────────┐
         ▼              ▼                              ▼                              ▼
  ┌──────────────┐┌──────────────┐              ┌──────────────┐              ┌──────────────┐
  │ VEHICLE LINK ││  PHONE / CDR │              │  BNS LEGAL   │              │ CASE DOSSIER │
  │  REASONING   ││  REASONING   │              │  REASONING   │              │  RETRIEVAL   │
  └──────┬───────┘└──────┬───────┘              └──────┬───────┘              └──────┬───────┘
         │               │                             │                             │
         ▼               ▼                             ▼                             ▼
  Cross-Station   Multi-Jurisdiction            BNS Provisions,                Active Cases,
  Vehicle Match   Burner Phone Match            AI Confidence,                 Status, & Next
  (OD-02-AB-1234) (+91-9876543210)              Relevance Tiers                Investigation
                                                (BNS §303, §305)               Actions
         │               │                             │                             │
         └───────────────┴──────────────┬──────────────┴─────────────────────────────┘
                                        │
                                        ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   STRUCTURED AI RESPONSE                                   │
 ├────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 1. Natural Language Intelligence Explanation (Case links, evidence provenance, warnings)   │
 │ 2. Interactive BNS Provision Cards (Clickable for side drawer with statutory breakdown)    │
 │ 3. Action Dispatch Buttons ([View Knowledge Graph], [Request Access], [Generate Draft])    │
 └────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Workflow Breakdown

The operational workflow follows a 5-stage pipeline:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   STAGE 1   │────▶│   STAGE 2   │────▶│   STAGE 3   │────▶│   STAGE 4   │────▶│   STAGE 5   │
│ User Input  │     │ Context     │     │ Reasoning & │     │ Interactive │     │ Action      │
│ & Reception │     │ Enrichment  │     │ Deduction   │     │ Synthesis   │     │ Execution   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Stage 1: User Input & Reception
- The officer types a natural language query in the chat bar (or clicks predefined quick-action buttons like *Query BNS/BNSS* or *Search Cases*).
- The message is appended to the local `messages` state with `role: 'USER'`.
- The assistant displays an animated pulse indicator (`isTyping: true`).

### Stage 2: Context Enrichment
The assistant pulls ambient context directly from [`MockStateContext.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/MockStateContext.tsx):
- **User Identity**: `state.currentUser.name`, `state.currentUser.role` (`OFFICER`, `STATION_ADMIN`, `SUPER_ADMIN`).
- **Station Context**: `state.stations` (e.g. Khandagiri Police Station, Bhubaneswar).
- **Assigned Cases**: `state.cases.filter(c => c.investigatorId === currentUser.id)`.
- **Global Evidence & Linkages**: Cross-station evidence records in `state.evidence`.

### Stage 3: Reasoning & Deduction Pipeline
The assistant evaluates the user query across several specialized reasoning branches:

```
                                      REASONING BRANCHES
                                      
  Query Text
     │
     ├── Contains 'vehicle' / 'plate' / 'car' / 'od-' ────▶ [Vehicle Cross-Station Match]
     │                                                        • Scans local vs cross-station evidence
     │                                                        • Identifies OD-02-AB-1234 & OD-05-XY-7777
     │                                                        • Detects match between BBSR & Cuttack PS
     │
     ├── Contains 'bns' / 'legal' / 'charge' / 'section' ─▶ [Statutory Reasoning Engine]
     │                                                        • Evaluates case facts against BNS library
     │                                                        • Maps BNS §303, §305, §309, §331
     │                                                        • Computes confidence & relevance tiers
     │
     ├── Contains 'phone' / 'call' / 'number' / '9876' ───▶ [Telecommunications & CDR Reasoning]
     │                                                        • Flags phone +91-9876543210
     │                                                        • Detects 96% confidence multi-station link
     │                                                        • Flags organized syndicate pattern
     │
     ├── Contains 'case' / 'fir' / 'investigation' ───────▶ [Active Dossier Status Reasoning]
     │                                                        • Queries officer's active caseload
     │                                                        • Summarizes case IDs, statuses, priorities
     │
     └── Default Fallback ────────────────────────────────▶ [Exploratory Intelligence Guidance]
                                                              • Suggests domain prompts & search vectors
```

### Stage 4: Interactive Response Synthesis
The assistant constructs a rich response containing:
1. **Intelligence Summary**: Plaintext explanation formatted with bold highlights and warning badges.
2. **Interactive BNS Cards**: Embedded [`ProvisionCard`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/components/legal/ProvisionCard.tsx) elements displaying section numbers, relevance bars (e.g., 94%), and cognizable/non-bailable tags.
3. **Action Dispatch Buttons**: Direct action triggers with primary highlights.

### Stage 5: User Action Execution & UI Navigation
When the officer interacts with the generated response:
- **Clicking a BNS Card**: Opens the slide-out [`ProvisionDetailsDrawer`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/components/legal/ProvisionDetailsDrawer.tsx) on the right side of the screen without losing chat context.
- **Clicking [View Knowledge Graph]**: Navigates directly to `/network` (Network Explorer) with the relevant entities pre-focused.
- **Clicking [Request Access]**: Routes the officer to `/requests` to petition the target station commander for full dossier access.
- **Clicking [Generate Draft]**: Routes to `/reports` to produce an automated charge-sheet draft.

---

## 3. How the AI Gives Reasoning (Domain Logic)

### 3.1 Cross-Station Entity Correlation Reasoning

When an officer asks about suspects, vehicles, or phone numbers:
```
[Evidence Ingestion]
  Khandagiri PS: Case OD-BBSR-2026-0001 (Burglary) ──▶ Extracted Phone: +91-9876543210
  Cuttack City PS: Case OD-CTC-2026-00981 (Heist)  ──▶ Extracted Phone: +91-9876543210
                                                                   │
                                                                   ▼
                                                     [AI Cross-Station Reasoning]
                                                     • Same phone active across 2 stations
                                                     • Temporal proximity: within 3 days
                                                     • Crime signature: Forced entry & getaway van
                                                     • Confidence Score: 96% Match
                                                     • Action: Issue Cross-Station Alert & Access Link
```

**Assistant Response Output:**
> **1 phone number relationship identified across Odisha Police records.**
> 
> 1. **+91-9876543210**  
> Source: Cross-Station Match — *Khandagiri Police Station → Cuttack City PS*  
> Cases: `OD-BBSR-2026-0001` / `OD-CTC-2026-00981`  
> Match Confidence: **96%**  
> 
> ⚠️ *This phone number appears in two active investigations across different Odisha stations.*  
> `[View Knowledge Graph]` `[Request Access]`

---

### 3.2 BNS Legal & Statutory Reasoning

When the officer queries legal charges or case applicability:
1. The assistant queries [`legalProvisionMockData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/legalProvisionMockData.ts).
2. It breaks down each recommended provision into structured legal pillars:
   - **Statutory Definition**: Core text under Bharatiya Nyaya Sanhita, 2023.
   - **Key Elements (Ingredients of Offence)**: e.g., movable property taken without consent, forced entry into a dwelling structure.
   - **Relevance & Tier**: Classifies into **PRIMARY** (e.g. BNS §305 at 94% relevance) vs. **SUPPORTING** (e.g. BNS §331).
   - **Punishment & BNSS Classification**: Maximum penalty terms (e.g. *Rigorous imprisonment up to 7 years + Fine*) and whether the offence is *Cognizable / Non-bailable*.
   - **Case-Specific Rationale**: Explains *why* the AI mapped this specific section based on the incident narrative.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BNS §305  •  THEFT IN DWELLING HOUSE                         94% RELEVANCE │
│  Aggravated Property Offence  •  Cognizable, Non-bailable     [ PRIMARY ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│  AI Confidence: 0.94                                                        │
│  "Offence committed inside a commercial/residential structure used for the  │
│   custody of property, fulfilling aggravated conditions under BNS §305."    │
│                                                                             │
│  Key Legal Elements:                                                        │
│  ✔ Theft committed inside protected structure                               │
│  ✔ Higher culpability due to domestic/commercial security breach            │
│  ✔ Intent to steal established at time of entry                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Components Supporting the Assistant

| Component / Service | File Path | Role |
| :--- | :--- | :--- |
| **Investigation Assistant Page** | [`frontend/src/pages/InvestigationAssistant.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/pages/InvestigationAssistant.tsx) | Main chat interface, message dispatch, typing animations, and intent routing. |
| **Provision Details Drawer** | [`frontend/src/components/legal/ProvisionDetailsDrawer.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/components/legal/ProvisionDetailsDrawer.tsx) | Slide-out drawer displaying exhaustive legal analysis, statutory penalties, and required evidence lists. |
| **Provision Card** | [`frontend/src/components/legal/ProvisionCard.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/components/legal/ProvisionCard.tsx) | Compact, rich UI card embedded inside AI messages. |
| **Legal Provision Mock Dataset** | [`frontend/src/mockServices/legalProvisionMockData.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/legalProvisionMockData.ts) | Pre-configured statutory provisions, definitions, and case bundles. |
| **State Context** | [`frontend/src/mockServices/MockStateContext.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/mockServices/MockStateContext.tsx) | Supplies ambient user identity, cases, stations, and evidence records. |
| **AI Copilot (K.A.R.E.N.)** | [`frontend/src/services/karenService.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/services/karenService.ts) & [`KarenPanel.tsx`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/components/Karen/KarenPanel.tsx) | Voice-activated global copilot offering speech synthesis (TTS) and voice recognition (STT) navigation across the entire app. |
| **Backend REST Chat API** | [`frontend/src/services/api/chat.ts`](file:///e:/SIH2026/C.R.I.M.E/frontend/src/services/api/chat.ts) | Full-stack endpoint client (`/api/v1/chat`) to connect the assistant to live LLM backends. |

---

## 5. Summary

The AI Investigation Assistant operates not as a generic chatbot, but as a **context-aware legal and investigative intelligence system**:
- It reads the officer's real-time state and station assignment.
- It parses queries for vehicles, phones, cases, and BNS sections.
- It computes multi-jurisdictional correlations (e.g. cross-station vehicle/phone links).
- It injects interactive statutory cards with full legal breakdowns.
- It generates one-click navigation actions that guide the investigator directly into graph exploration, evidence viewing, access petitions, or report drafting.
