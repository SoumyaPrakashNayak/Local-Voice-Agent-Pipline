/**
 * AIRA Structured Intelligence Tools
 * S.I.R.I.S — Odisha Police Mock Intelligence Dataset
 */

// Authoritative Mock FIR / Case Catalog
export const MOCK_CASES = {
  '504': {
    firNumber: '504',
    caseId: 'CR-KHD-2026-00504',
    title: 'Residential Burglary — Unit IV',
    status: 'INVESTIGATING',
    station: 'Khandagiri Police Station',
    district: 'Bhubaneswar Urban',
    crimeType: 'Burglary / Break-in',
    incidentDate: '2026-02-18 02:45 AM',
    registeredDate: '2026-02-18 07:15 AM',
    investigatingOfficer: 'SI Ranjan Samal (OD-INV-001)',
    suspects: ['Bikram Jena (alias Biku)', 'Unknown accomplice'],
    vehicles: ['OD-02-AB-1234 (Dark Blue Pulsar)'],
    phones: ['+91-9876543210'],
    evidenceCount: 3,
    linkedRecordsCount: 3,
    crossStationLink: 'Cuttack City PS (OD-CTC-2026-00981)',
    bnsSections: ['BNS 305 (Theft in dwelling)', 'BNS 331(4) (Lurking house-trespass by night)'],
    summary: 'FIR 504 is an active burglary investigation at Unit IV, Bhubaneswar. 3 linked records found with vehicle OD-02-AB-1234 matching a Cuttack robbery dossier.',
    route: '/cases/CR-KHD-2026-00504',
  },
  '541': {
    firNumber: '541',
    caseId: 'CR-KHD-2026-00541',
    title: 'Vehicle Theft — Khandagiri Square',
    status: 'ACTIVE',
    station: 'Khandagiri Police Station',
    district: 'Bhubaneswar Urban',
    crimeType: 'Vehicle Theft',
    incidentDate: '2026-02-20 11:30 PM',
    registeredDate: '2026-02-21 08:00 AM',
    investigatingOfficer: 'SI Ranjan Samal',
    suspects: ['Ganesh Mohanty'],
    vehicles: ['OD-02-XY-9876'],
    bnsSections: ['BNS 303(2) (Theft)'],
    summary: 'FIR 541 is an active vehicle theft investigation registered at Khandagiri Police Station.',
    route: '/cases/CR-KHD-2026-00541',
  },
  '0001': {
    firNumber: '001',
    caseId: 'OD-BBSR-2026-0001',
    title: 'Commercial Burglary — Saheed Nagar',
    status: 'INVESTIGATING',
    station: 'Saheed Nagar Police Station',
    district: 'Bhubaneswar Urban',
    crimeType: 'Burglary / Break-in',
    suspects: ['Bikram Jena'],
    vehicles: ['OD-02-AB-1234'],
    route: '/cases/OD-BBSR-2026-0001',
    summary: 'Hero commercial burglary case at Saheed Nagar, linked to Khandagiri via vehicle OD-02-AB-1234.',
  },
  '0981': {
    firNumber: '981',
    caseId: 'OD-CTC-2026-00981',
    title: 'Armed Heist — Badambadi Bus Stand',
    status: 'RESTRICTED',
    station: 'Cuttack City PS',
    district: 'Cuttack Urban',
    crimeType: 'Armed Robbery',
    route: '/cases/OD-CTC-2026-00981',
    summary: 'Armed heist at Badambadi. Cross-station vehicle link matching Khandagiri suspect network.',
  }
};

/**
 * Normalizes FIR query (e.g., '504', 'FIR 504', 'CR-KHD-2026-00504')
 */
export function resolveFirRecord(input) {
  if (!input) return null;
  const str = String(input).toUpperCase();
  if (MOCK_CASES[input]) return MOCK_CASES[input];
  if (str.includes('504')) return MOCK_CASES['504'];
  if (str.includes('541')) return MOCK_CASES['541'];
  if (str.includes('0001') || str.includes('001')) return MOCK_CASES['0001'];
  if (str.includes('0981') || str.includes('981')) return MOCK_CASES['0981'];
  return null;
}

// Tool Implementations
export const airaTools = {
  open_fir: (args) => {
    const firId = args?.fir_id || '504';
    const rec = resolveFirRecord(firId);
    if (!rec) {
      return {
        success: false,
        error: `FIR ${firId} not found in demonstration dataset.`,
        action: 'UNKNOWN_CASE',
      };
    }
    return {
      success: true,
      action: 'OPEN_CASE',
      firId: rec.firNumber,
      caseId: rec.caseId,
      route: rec.route,
      spokenConfirmation: `Opening FIR ${rec.firNumber}.`,
    };
  },

  open_fir_knowledge_graph: (args) => {
    const firId = args?.fir_id || '504';
    const rec = resolveFirRecord(firId);
    if (!rec) {
      return {
        success: false,
        error: `FIR ${firId} not found in demonstration dataset.`,
        action: 'UNKNOWN_CASE',
      };
    }
    return {
      success: true,
      action: 'OPEN_FIR_KNOWLEDGE_GRAPH',
      firId: rec.firNumber,
      caseId: rec.caseId,
      route: `${rec.route}?tab=graph`,
      spokenConfirmation: `Opening knowledge graph for FIR ${rec.firNumber}.`,
    };
  },

  get_fir_details: (args) => {
    const firId = args?.fir_id || '504';
    const rec = resolveFirRecord(firId);
    if (!rec) {
      return {
        success: false,
        error: `FIR ${firId} not found in demonstration dataset.`,
      };
    }
    return {
      success: true,
      action: 'CASE_SUMMARY',
      firId: rec.firNumber,
      caseId: rec.caseId,
      title: rec.title,
      crimeType: rec.crimeType,
      status: rec.status,
      station: rec.station,
      suspects: rec.suspects,
      vehicles: rec.vehicles,
      bnsSections: rec.bnsSections,
      route: rec.route,
      spokenResponse: `${rec.summary}`,
    };
  },

  show_my_cases: () => ({
    success: true,
    action: 'SHOW_MY_CASES',
    route: '/cases',
    spokenConfirmation: 'Opening your active cases.',
  }),

  show_pending_cases: () => ({
    success: true,
    action: 'SHOW_PENDING_CASES',
    route: '/cases?filter=pending',
    spokenConfirmation: 'Showing pending cases.',
  }),

  open_evidence_vault: () => ({
    success: true,
    action: 'OPEN_EVIDENCE_VAULT',
    route: '/evidence',
    spokenConfirmation: 'Opening the Evidence Vault.',
  }),

  open_network_explorer: () => ({
    success: true,
    action: 'OPEN_NETWORK_EXPLORER',
    route: '/network',
    spokenConfirmation: 'Opening Network Explorer.',
  }),

  show_crime_hotspots: () => ({
    success: true,
    action: 'SHOW_CRIME_HOTSPOTS',
    route: '/reports',
    spokenConfirmation: 'Showing crime hotspots and district analytics.',
  }),

  find_similar_crimes: (args) => ({
    success: true,
    action: 'FIND_SIMILAR_CRIMES',
    route: '/network?mode=similarity',
    spokenConfirmation: 'Finding similar cross-station crime patterns.',
    details: 'Matched pattern with Case OD-CTC-2026-00981 (Cuttack City PS).',
  }),

  open_cctv: () => ({
    success: true,
    action: 'OPEN_CCTV',
    route: '/cctv',
    spokenConfirmation: 'Opening CCTV feeds.',
  }),

  generate_report: () => ({
    success: true,
    action: 'GENERATE_REPORT',
    route: '/reports',
    spokenConfirmation: 'Generating case reports desk.',
  }),

  show_case_timeline: (args) => {
    const firId = args?.fir_id || '504';
    const rec = resolveFirRecord(firId) || MOCK_CASES['504'];
    return {
      success: true,
      action: 'SHOW_CASE_TIMELINE',
      route: `${rec.route}?tab=overview`,
      spokenConfirmation: `Showing case timeline for FIR ${rec.firNumber}.`,
    };
  },

  check_cross_station_matches: () => ({
    success: true,
    action: 'CHECK_CROSS_STATION_MATCHES',
    route: '/intelligence/alerts',
    spokenConfirmation: 'Showing cross-station intelligence alerts.',
    details: 'Vehicle OD-02-AB-1234 linked across Khandagiri and Cuttack.',
  }),

  open_legal_intelligence: () => ({
    success: true,
    action: 'OPEN_LEGAL_INTELLIGENCE',
    route: '/legal',
    spokenConfirmation: 'Scanning applicable BNS legal provisions.',
  }),
};
