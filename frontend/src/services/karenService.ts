export interface KarenContext {
  currentUser?: string;
  station?: string;
  currentCaseId?: string;
  currentPage?: string;
  selectedEntity?: string;
  role?: string;
}

export interface KarenAction {
  label: string;
  route: string;
  primary?: boolean;
}

export interface KarenResponse {
  intent: string;
  response: string;
  actions?: KarenAction[];
  route?: string;
}

export function processKarenQuery(query: string, context: KarenContext): KarenResponse {
  const q = query.trim().toLowerCase();

  // 1. Command: "Tell me about FIR 541"
  if (q.includes('fir 541') || q.includes('541')) {
    return {
      intent: 'CASE_LOOKUP',
      response: `FIR 541 details:
• Case ID: **CR-KHD-2026-00541**
• Crime: **Vehicle Theft**
• Police Station: **Khandagiri PS**
• Officer: **Inspector Vikram**
• Status: **Investigation Ongoing**`,
      actions: [
        { label: 'OPEN CASE', route: '/investigations/CR-KHD-2026-00541', primary: true },
        { label: 'VIEW NETWORK', route: '/network' },
        { label: 'VIEW CCTV', route: '/cctv' }
      ]
    };
  }

  // 2. Command: "Show my pending cases"
  if (q.includes('pending cases') || q.includes('my pending') || q.includes('case desk')) {
    return {
      intent: 'PENDING_CASES',
      response: `You have:
• **12 Active Cases**
• **4 Pending Investigations**
• **2 High Priority Cases**`,
      actions: [
        { label: 'OPEN CASE DESK', route: '/investigations', primary: true }
      ],
      route: '/investigations'
    };
  }

  // 3. Command: "Open this case"
  if (q.includes('open this case') || q.includes('open case')) {
    const targetCaseId = context.currentCaseId || 'CR-KHD-2026-00541';
    return {
      intent: 'OPEN_CASE',
      response: `Opening case workspace for **${targetCaseId}**.`,
      actions: [
        { label: 'OPEN CASE WORKSPACE', route: `/investigations/${targetCaseId}`, primary: true }
      ],
      route: `/investigations/${targetCaseId}`
    };
  }

  // 4. Command: "Show linked cases"
  if (q.includes('linked cases') || q.includes('related cases') || q.includes('linked') || q.includes('relationship')) {
    return {
      intent: 'LINKED_CASES',
      response: `I found **3 related investigations** in the central intelligence registry.
Highest relationship: **CR-CTC-2026-00981**
Similarity Score: **94%**`,
      actions: [
        { label: 'OPEN NETWORK', route: '/network', primary: true }
      ],
      route: '/network'
    };
  }

  // 5. Command: "Find similar crimes"
  if (q.includes('similar crimes') || q.includes('similar cases') || q.includes('find similar')) {
    return {
      intent: 'SIMILAR_CRIMES',
      response: `Scanning Odisha database for similar crime patterns...
Matched **2 cases** with vehicle theft characteristics.`,
      actions: [
        { label: 'VIEW SIMILAR CASES', route: '/legal', primary: true }
      ],
      route: '/legal'
    };
  }

  // 6. Command: "Open CCTV footage" / "Open CCTV"
  if (q.includes('cctv') || q.includes('camera') || q.includes('footage') || q.includes('surveillance')) {
    return {
      intent: 'CCTV_LOOKUP',
      response: `I found CCTV streams connected to this investigation.
• Location: **Patrapada Junction**
• Time bounds: **22:30 - 23:30**`,
      actions: [
        { label: 'OPEN CCTV', route: '/cctv', primary: true }
      ],
      route: '/cctv'
    };
  }

  // 7. Command: "Show BNS sections"
  if (q.includes('bns sections') || q.includes('bns') || q.includes('sections') || q.includes('provisions') || q.includes('legal')) {
    return {
      intent: 'LEGAL_INFO',
      response: `Possible applicable provisions:
• **BNS Section 303** (Theft)
• **BNS Section 316** (Criminal breach of trust)`,
      actions: [
        { label: 'OPEN LEGAL INTELLIGENCE', route: '/legal', primary: true }
      ],
      route: '/legal'
    };
  }

  // 8. Command: "Generate report"
  if (q.includes('generate report') || q.includes('report') || q.includes('draft report')) {
    return {
      intent: 'GENERATE_REPORT',
      response: `Preparing investigation report draft. Redirecting to reports...`,
      actions: [
        { label: 'VIEW REPORTS', route: '/reports', primary: true }
      ],
      route: '/reports'
    };
  }

  // 9. Command: "Show crime hotspots"
  if (q.includes('hotspots') || q.includes('crime hotspots') || q.includes('hotspot')) {
    return {
      intent: 'CRIME_HOTSPOTS',
      response: `Crime hot-spot analytics loaded.
High activity detected in **Khordha district** (18% increase).`,
      actions: [
        { label: 'VIEW HOTSPOT ANALYTICS', route: '/reports', primary: true }
      ],
      route: '/reports'
    };
  }

  // 10. Context Awareness Mock: "Show network" with active case
  if (q.includes('show network') || q.includes('open network')) {
    if (context.currentCaseId) {
      return {
        intent: 'CONTEXT_NETWORK',
        response: `Opening network graph for active case **${context.currentCaseId}**.`,
        actions: [
          { label: 'OPEN CASE GRAPH', route: `/investigations/${context.currentCaseId}`, primary: true }
        ],
        route: `/investigations/${context.currentCaseId}`
      };
    } else {
      return {
        intent: 'GLOBAL_NETWORK',
        response: `Opening State Network Explorer.`,
        actions: [
          { label: 'OPEN STATE NETWORK', route: '/network', primary: true }
        ],
        route: '/network'
      };
    }
  }

  // 11. Role Awareness & General Fallbacks
  const role = context.role || 'OFFICER';
  if (role === 'SUPER_ADMIN') {
    return {
      intent: 'ROLE_GREETING',
      response: `State Admin console active. Cyber crime has increased 18% in Khordha district. How can I assist you with state analytics?`,
      actions: [
        { label: 'VIEW DISTRICT REPORTS', route: '/reports' }
      ]
    };
  } else if (role === 'STATION_ADMIN') {
    return {
      intent: 'ROLE_GREETING',
      response: `Station Admin console active. 3 investigations require attention at your station. How can I assist you today?`,
      actions: [
        { label: 'VIEW STATION CASES', route: '/investigations' }
      ]
    };
  } else {
    // Default Investigator / Officer role
    return {
      intent: 'ROLE_GREETING',
      response: `Investigator companion online. New related case detected. How can I assist you in your investigations today?`,
      actions: [
        { label: 'VIEW SIMILAR CASES', route: '/legal' }
      ]
    };
  }
}
