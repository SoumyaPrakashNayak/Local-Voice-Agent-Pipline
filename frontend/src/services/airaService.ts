import { CaseRecord, Station, Evidence } from '../mockServices/types';

export interface AiraContext {
  currentUser?: string;
  station?: string;
  currentCaseId?: string;
  currentPage?: string;
  selectedEntity?: string;
  role?: string;
  cases?: CaseRecord[];
  stations?: Station[];
  evidence?: Evidence[];
}

export interface AiraAction {
  label: string;
  route: string;
  primary?: boolean;
}

export interface AiraResponse {
  intent: string;
  response: string;
  actions?: AiraAction[];
  route?: string;
  caseData?: CaseRecord;
}

/**
 * Deterministic Natural Language Command Router & Intelligence Synthesizer for AIRA.
 * Maps voice transcripts directly to validated intents, mock investigation records, and navigation paths.
 */
export function processAiraQuery(query: string, context: AiraContext): AiraResponse {
  const q = query.trim().toLowerCase();
  const cases = context.cases || [];
  const stations = context.stations || [];

  // Helper to extract case references or numbers (e.g. 504, 541, 0001, 00981)
  const findMatchingCase = (searchQuery: string = q): CaseRecord | undefined => {
    // 1. Look for standard case ID prefixes (CR-..., OD-..., FIR/...)
    const idMatch = searchQuery.match(/(cr|od|fir)[a-z0-9-]+/i);
    if (idMatch) {
      const matchId = idMatch[0].toUpperCase();
      const found = cases.find(
        (c) =>
          c.id.toUpperCase() === matchId ||
          c.id.replace(/-/g, '').toUpperCase() === matchId.replace(/-/g, '') ||
          c.firNumber.replace(/[\/\s-]/g, '').toUpperCase().includes(matchId.replace(/[\/\s-]/g, ''))
      );
      if (found) return found;
    }

    // 2. Numerical matches (e.g. 504, 541, 0001)
    const numberMatches = searchQuery.match(/\d+/g);
    if (numberMatches) {
      for (const numStr of numberMatches) {
        if (numStr.length >= 2) {
          const found = cases.find(
            (c) =>
              c.firNumber.includes(numStr) ||
              c.id.includes(numStr) ||
              c.id.replace(/[^0-9]/g, '').includes(numStr)
          );
          if (found) return found;
        }
      }
    }

    // 3. Fallback to active case in workspace
    if (context.currentCaseId) {
      const found = cases.find((c) => c.id === context.currentCaseId);
      if (found) return found;
    }

    return undefined;
  };

  const getCaseRoute = (caseId: string) => `/cases/${caseId}`;

  // ===========================================================================
  // 1. DIRECT FIR / CASE SPECIFIC COMMANDS (Priority 1)
  // ===========================================================================

  // Knowledge Graph for a specific FIR
  if (
    q.includes('knowledge graph') ||
    q.includes('graph for fir') ||
    q.includes('graph of fir') ||
    q.includes('relationships for fir') ||
    q.includes('relationships in fir') ||
    q.includes('relationships of fir') ||
    q.includes('investigation graph') ||
    q.includes('visualize fir') ||
    q.includes('connections for fir') ||
    q.includes('connections in fir') ||
    (q.includes('graph') && (q.includes('504') || q.includes('541') || q.includes('fir') || q.includes('case')))
  ) {
    const targetCase = findMatchingCase() || cases.find((c) => c.id === 'CR-KHD-2026-00504') || cases[0];
    if (targetCase) {
      const graphRoute = `/cases/${targetCase.id}?tab=graph`;
      return {
        intent: 'OPEN_FIR_KNOWLEDGE_GRAPH',
        response: `Opening knowledge graph for ${targetCase.firNumber} (${targetCase.title}).`,
        actions: [
          { label: 'OPEN KNOWLEDGE GRAPH', route: graphRoute, primary: true },
          { label: 'GLOBAL NETWORK EXPLORER', route: '/network' },
        ],
        route: graphRoute,
        caseData: targetCase,
      };
    }
  }

  // Case lookup / "Tell me about FIR 504 / 541"
  if (
    q.includes('tell me about') ||
    q.includes('tell me everything about') ||
    q.includes('what is fir') ||
    q.includes('details of fir') ||
    q.includes('details about fir') ||
    q.includes('explain fir') ||
    q.includes('summary of fir') ||
    q.includes('information on fir') ||
    q.includes('info on fir')
  ) {
    const targetCase = findMatchingCase() || cases.find((c) => c.id === 'CR-KHD-2026-00504') || cases[0];
    if (targetCase) {
      const station = stations.find((s) => s.id === targetCase.stationId);
      const stationName = station?.name || 'Khandagiri Police Station';
      const entityCount = targetCase.entities?.length || (targetCase.linkedCaseIds?.length || 0) + 1;
      const suspectStr = targetCase.suspects && targetCase.suspects.length > 0 ? targetCase.suspects.join(', ') : 'Under identification';

      return {
        intent: 'CASE_SUMMARY',
        response: `FIR ${targetCase.firNumber.replace(/^FIR\s*/i, '')} is a ${targetCase.crimeType.toLowerCase()} investigation registered at ${stationName}. The case is currently ${targetCase.status.toLowerCase()}. I found ${entityCount} linked intelligence records and suspect reference (${suspectStr}).`,
        actions: [
          { label: 'OPEN CASE FILE', route: getCaseRoute(targetCase.id), primary: true },
          { label: 'VIEW NETWORK GRAPH', route: `/network` },
          { label: 'VIEW EVIDENCE', route: `/evidence` }
        ],
        route: getCaseRoute(targetCase.id),
        caseData: targetCase
      };
    }
  }

  // "Open FIR 504" / "Take me to FIR 504" / "Show me FIR 504"
  if (
    q.includes('open fir') ||
    q.includes('open case') ||
    q.includes('take me to fir') ||
    q.includes('take me to case') ||
    q.includes('show me fir') ||
    q.includes('show fir') ||
    q.includes('view fir') ||
    q.includes('view case')
  ) {
    const targetCase = findMatchingCase() || cases.find((c) => c.id === 'CR-KHD-2026-00504') || cases[0];
    if (targetCase) {
      return {
        intent: 'OPEN_CASE',
        response: `Opening case workspace for ${targetCase.firNumber} (${targetCase.title}).`,
        actions: [
          { label: 'OPEN CASE WORKSPACE', route: getCaseRoute(targetCase.id), primary: true }
        ],
        route: getCaseRoute(targetCase.id),
        caseData: targetCase
      };
    }
  }

  // ===========================================================================
  // 2. CORE DEMO NAVIGATION COMMANDS
  // ===========================================================================

  // "Show my cases" / "Show assigned cases"
  if (q.includes('show my cases') || q.includes('my cases') || q.includes('assigned cases') || q.includes('show my investigations')) {
    const myCases = cases.filter((c) => c.investigatorId === 'INV-BBSR-001' || c.investigatorId === context.currentUser);
    const count = myCases.length || 5;
    return {
      intent: 'SHOW_MY_CASES',
      response: `Opening your active case desk. You have ${count} assigned investigations at your station.`,
      actions: [
        { label: 'OPEN CASE DESK', route: '/cases', primary: true }
      ],
      route: '/cases'
    };
  }

  // "Show pending cases" / "What cases are pending"
  if (
    q.includes('pending cases') ||
    q.includes('show pending') ||
    q.includes('what cases are pending') ||
    q.includes('pending investigations') ||
    q.includes('open pending')
  ) {
    const pendingCount = cases.filter((c) => c.status === 'INVESTIGATING' || c.status === 'PENDING').length;
    return {
      intent: 'SHOW_PENDING_CASES',
      response: `Displaying ${pendingCount} pending investigations across active police stations.`,
      actions: [
        { label: 'VIEW PENDING CASES', route: '/cases?filter=pending', primary: true }
      ],
      route: '/cases?filter=pending'
    };
  }

  // "Open Evidence Vault"
  if (
    q.includes('evidence vault') ||
    q.includes('open evidence') ||
    q.includes('evidence locker') ||
    q.includes('show evidence') ||
    q.includes('vault')
  ) {
    return {
      intent: 'OPEN_EVIDENCE_VAULT',
      response: 'Opening the Evidence Vault. Ingest unstructured documents, logs, and extract vehicle or phone entities.',
      actions: [
        { label: 'GO TO EVIDENCE VAULT', route: '/evidence', primary: true }
      ],
      route: '/evidence'
    };
  }

  // "Open Network Explorer" / "Show knowledge graph"
  if (
    q.includes('network explorer') ||
    q.includes('open network') ||
    q.includes('knowledge graph') ||
    q.includes('entity graph') ||
    q.includes('relationship graph') ||
    q.includes('link graph') ||
    q.includes('network graph')
  ) {
    return {
      intent: 'OPEN_NETWORK_EXPLORER',
      response: 'Opening Network Explorer. Statewide multi-hop entity relationships and cross-station links are loaded.',
      actions: [
        { label: 'VIEW NETWORK EXPLORER', route: '/network', primary: true }
      ],
      route: '/network'
    };
  }

  // "Open Legal Intelligence" / "Scan applicable BNS provisions"
  if (
    q.includes('legal intelligence') ||
    q.includes('open legal') ||
    q.includes('bns provisions') ||
    q.includes('bns sections') ||
    q.includes('applicable bns') ||
    q.includes('what bns') ||
    q.includes('legal charges') ||
    q.includes('bnss')
  ) {
    return {
      intent: 'OPEN_LEGAL_INTELLIGENCE',
      response: 'Accessing Bharatiya Nyaya Sanhita (BNS) intelligence and procedural recommendations.',
      actions: [
        { label: 'EXPLORE BNS PROVISIONS', route: '/legal', primary: true },
        { label: 'GENERATE CHARGE SHEET DRAFT', route: '/reports' }
      ],
      route: '/legal'
    };
  }

  // "Show crime hotspots" / "Show hotspots"
  if (
    q.includes('crime hotspots') ||
    q.includes('show hotspots') ||
    q.includes('hotspots') ||
    q.includes('hotspot') ||
    q.includes('crime map') ||
    q.includes('workload trends')
  ) {
    return {
      intent: 'SHOW_CRIME_HOTSPOTS',
      response: 'Opening crime hotspot and district intelligence analytics. Khordha and Cuttack corridors show elevated burglary indices.',
      actions: [
        { label: 'VIEW CRIME HOTSPOTS', route: '/reports', primary: true }
      ],
      route: '/reports'
    };
  }

  // "Find similar crimes" / "Similar cases"
  if (
    q.includes('similar crimes') ||
    q.includes('similar cases') ||
    q.includes('find similar') ||
    q.includes('matching modus operandi') ||
    q.includes('crime similarity')
  ) {
    const activeCase = findMatchingCase() || cases.find((c) => c.id === 'CR-KHD-2026-00504');
    const titleStr = activeCase ? ` for ${activeCase.firNumber}` : '';
    return {
      intent: 'FIND_SIMILAR_CRIMES',
      response: `Searching multi-jurisdiction pattern matrix${titleStr}. Identified cross-station match with Case OD-CTC-2026-00981 (Cuttack City PS).`,
      actions: [
        { label: 'VIEW SIMILARITY GRAPH', route: '/network?mode=similarity', primary: true },
        { label: 'REQUEST ACCESS', route: '/requests' }
      ],
      route: '/network?mode=similarity'
    };
  }

  // "Open CCTV"
  if (q.includes('open cctv') || q.includes('cctv feeds') || q.includes('cctv') || q.includes('surveillance') || q.includes('camera')) {
    return {
      intent: 'OPEN_CCTV',
      response: 'Accessing live CCTV traffic and surveillance feeds for Bhubaneswar and Cuttack junctions.',
      actions: [
        { label: 'OPEN CCTV MODULE', route: '/cctv', primary: true }
      ],
      route: '/cctv'
    };
  }

  // "Generate report" / "Draft charge sheet"
  if (
    q.includes('generate report') ||
    q.includes('create report') ||
    q.includes('draft report') ||
    q.includes('charge sheet') ||
    q.includes('investigation report') ||
    q.includes('case report')
  ) {
    return {
      intent: 'GENERATE_REPORT',
      response: 'Opening the Case Reports and Automated Charge-Sheet Drafting desk.',
      actions: [
        { label: 'OPEN REPORT GENERATOR', route: '/reports', primary: true }
      ],
      route: '/reports'
    };
  }

  // "Show case timeline" / "Case progress"
  if (q.includes('timeline') || q.includes('case timeline') || q.includes('investigation progress') || q.includes('progress')) {
    const targetCase = findMatchingCase() || cases.find((c) => c.id === 'CR-KHD-2026-00504') || cases[0];
    return {
      intent: 'SHOW_CASE_TIMELINE',
      response: `Opening chronological investigation timeline for ${targetCase.firNumber}.`,
      actions: [
        { label: 'VIEW TIMELINE', route: `${getCaseRoute(targetCase.id)}?tab=overview`, primary: true }
      ],
      route: `${getCaseRoute(targetCase.id)}?tab=overview`,
      caseData: targetCase
    };
  }

  // "Check cross-station matches" / "State alerts"
  if (
    q.includes('cross-station') ||
    q.includes('cross station') ||
    q.includes('state alerts') ||
    q.includes('intelligence alerts') ||
    q.includes('alerts')
  ) {
    return {
      intent: 'CHECK_CROSS_STATION_MATCHES',
      response: 'Cross-station intelligence scan active: Vehicle plate OD-02-AB-1234 and phone +91-9876543210 matched between Khandagiri PS and Cuttack City PS.',
      actions: [
        { label: 'VIEW INTELLIGENCE ALERTS', route: '/intelligence/alerts', primary: true },
        { label: 'VIEW NETWORK LINK', route: '/network' }
      ],
      route: '/intelligence/alerts'
    };
  }

  // "Register FIR" / "New case"
  if (
    q.includes('register fir') ||
    q.includes('new fir') ||
    q.includes('register case') ||
    q.includes('file case') ||
    q.includes('file fir') ||
    q.includes('new case')
  ) {
    return {
      intent: 'REGISTER_FIR',
      response: 'Opening smart FIR registration intake with real-time AI entity extraction.',
      actions: [
        { label: 'REGISTER NEW FIR', route: '/cases/new', primary: true }
      ],
      route: '/cases/new'
    };
  }

  // "Open Stations" / "Police stations"
  if (q.includes('stations') || q.includes('police stations') || q.includes('station registry')) {
    return {
      intent: 'OPEN_STATIONS',
      response: 'Opening Statewide Police Stations Registry overview.',
      actions: [
        { label: 'VIEW STATIONS', route: '/stations', primary: true }
      ],
      route: '/stations'
    };
  }

  // "Open Investigators" / "Officers"
  if (q.includes('investigators') || q.includes('officers') || q.includes('police officers') || q.includes('station staff')) {
    return {
      intent: 'OPEN_OFFICERS',
      response: 'Opening Station Investigators Roster and workload assignment desk.',
      actions: [
        { label: 'VIEW OFFICERS', route: '/investigators', primary: true }
      ],
      route: '/investigators'
    };
  }

  // "Open Access Requests"
  if (q.includes('access requests') || q.includes('requests') || q.includes('dossier access') || q.includes('permission')) {
    return {
      intent: 'OPEN_ACCESS_REQUESTS',
      response: 'Opening Cross-Station Access Requests and jurisdictional authorizations desk.',
      actions: [
        { label: 'VIEW ACCESS REQUESTS', route: '/requests', primary: true }
      ],
      route: '/requests'
    };
  }

  // "Open Dashboard" / "Command Center"
  if (q.includes('dashboard') || q.includes('command center') || q.includes('home') || q.includes('main screen')) {
    return {
      intent: 'OPEN_DASHBOARD',
      response: 'Navigating to Odisha Police State Command Center Dashboard.',
      actions: [
        { label: 'GO TO DASHBOARD', route: '/dashboard', primary: true }
      ],
      route: '/dashboard'
    };
  }

  // ===========================================================================
  // 3. VEHICLE & TELECOM ENTITY LOOKUP
  // ===========================================================================

  if (q.includes('vehicle') || q.includes('car') || q.includes('plate') || q.includes('od-02') || q.includes('od-')) {
    return {
      intent: 'ENTITY_VEHICLE_LOOKUP',
      response: `Vehicle Intelligence: Vehicle registration **OD-02-AB-1234** is linked across 3 active investigations (Khandagiri PS & Cuttack City PS). Cross-station match is verified with 96% confidence.`,
      actions: [
        { label: 'VIEW IN NETWORK GRAPH', route: '/network', primary: true },
        { label: 'VIEW EVIDENCE', route: '/evidence' },
        { label: 'REQUEST DOSSIER ACCESS', route: '/requests' }
      ],
      route: '/network'
    };
  }

  if (q.includes('phone') || q.includes('mobile') || q.includes('number') || q.includes('call') || q.includes('9876')) {
    return {
      intent: 'ENTITY_PHONE_LOOKUP',
      response: `Telecom Intelligence: Mobile number **+91-9876543210** detected in CDR logs for Burglary (Case OD-BBSR-2026-0001) and Badambadi Armed Heist (Case OD-CTC-2026-00981).`,
      actions: [
        { label: 'VIEW IN NETWORK GRAPH', route: '/network', primary: true },
        { label: 'REQUEST DOSSIER ACCESS', route: '/requests' }
      ],
      route: '/network'
    };
  }

  // Generic fallback with case matches if any case ID was referenced
  const matchedCase = findMatchingCase();
  if (matchedCase) {
    const station = stations.find((s) => s.id === matchedCase.stationId);
    const stationName = station?.name || 'Khandagiri Police Station';
    return {
      intent: 'CASE_LOOKUP',
      response: `Case Record **${matchedCase.firNumber}**: ${matchedCase.title} registered at ${stationName}. Current status: **${matchedCase.status}** with priority **${matchedCase.priority}**.`,
      actions: [
        { label: 'OPEN CASE WORKSPACE', route: getCaseRoute(matchedCase.id), primary: true },
        { label: 'VIEW NETWORK', route: '/network' }
      ],
      route: getCaseRoute(matchedCase.id),
      caseData: matchedCase
    };
  }

  // Default Operational Greeting & Command Suggestions
  return {
    intent: 'GENERAL_ASSISTANCE',
    response: `I am AIRA, your S.I.R.I.S Intelligence Assistant. I am connected to the Odisha Police investigation network. You can ask me to open cases (e.g. "Tell me about FIR 504"), show pending cases, open the Evidence Vault, or check cross-station hotspots.`,
    actions: [
      { label: 'SHOW MY CASES', route: '/cases', primary: true },
      { label: 'OPEN EVIDENCE VAULT', route: '/evidence' },
      { label: 'VIEW NETWORK GRAPH', route: '/network' }
    ]
  };
}
