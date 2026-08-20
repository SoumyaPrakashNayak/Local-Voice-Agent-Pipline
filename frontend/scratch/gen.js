const fs = require('fs');

const stations = [
  { id: 'KSP-BLR-CEN', name: 'Bengaluru Central', district: 'Bengaluru Urban', city: 'Bengaluru', status: 'ACTIVE' },
  { id: 'KSP-MYS-CTY', name: 'Mysuru City', district: 'Mysuru', city: 'Mysuru', status: 'ACTIVE' },
  { id: 'KSP-MNG-NTH', name: 'Mangaluru North', district: 'Dakshina Kannada', city: 'Mangaluru', status: 'ACTIVE' },
  { id: 'KSP-HUB-CEN', name: 'Hubballi Central', district: 'Dharwad', city: 'Hubballi', status: 'ACTIVE' },
  { id: 'KSP-BEL-CTY', name: 'Belagavi City', district: 'Belagavi', city: 'Belagavi', status: 'ACTIVE' },
  { id: 'KSP-SHV-TWN', name: 'Shivamogga Town', district: 'Shivamogga', city: 'Shivamogga', status: 'ACTIVE' },
  { id: 'KSP-TUM-CEN', name: 'Tumakuru Central', district: 'Tumakuru', city: 'Tumakuru', status: 'ACTIVE' },
  { id: 'KSP-BAL-CTY', name: 'Ballari City', district: 'Ballari', city: 'Ballari', status: 'ACTIVE' },
  { id: 'KSP-BLR-KOR', name: 'Koramangala', district: 'Bengaluru Urban', city: 'Bengaluru', status: 'ACTIVE' },
  { id: 'KSP-BLR-IND', name: 'Indiranagar', district: 'Bengaluru Urban', city: 'Bengaluru', status: 'ACTIVE' },
  { id: 'KSP-UUD-TWN', name: 'Udupi Town', district: 'Udupi', city: 'Udupi', status: 'ACTIVE' },
  { id: 'KSP-GLB-CEN', name: 'Kalaburagi Central', district: 'Kalaburagi', city: 'Kalaburagi', status: 'ACTIVE' }
];

let users = [
  { id: 'KSP-HQ-001', name: 'Comm. Sharma', role: 'SUPER_ADMIN', status: 'ACTIVE', rank: 'Commissioner' }
];

let cases = [];
let evidence = [];
let alerts = [];

const firstNames = ['Ramesh', 'Gowda', 'Vikram', 'Anjali', 'Karthik', 'Rajesh', 'Meera', 'Arjun', 'Kumar', 'Priya', 'Deepak', 'Suresh', 'Anita', 'Manjunath', 'Pratap', 'Siddharth', 'Nandini', 'Venkatesh', 'Kiran', 'Divya'];
const lastNames = ['Rao', 'Patil', 'Nair', 'Singh', 'Shetty', 'Hegde', 'Gowda', 'Naidu', 'Iyer', 'Menon', 'Bhat', 'Desai'];

function randomName() {
  return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
}

let officerCounter = 1;
stations.forEach((st, idx) => {
  // 1 IIC per station
  users.push({
    id: `IIC-${st.id.split('-')[1]}-01`,
    name: `Insp. ${firstNames[idx % firstNames.length]}`,
    role: 'STATION_ADMIN',
    stationId: st.id,
    status: 'ACTIVE',
    rank: 'Inspector'
  });

  // 3-5 Officers per station
  const numOfficers = Math.floor(Math.random() * 3) + 3;
  for(let i=0; i<numOfficers; i++) {
    users.push({
      id: `INV-${st.id.split('-')[1]}-${String(officerCounter).padStart(3, '0')}`,
      name: `SI ${randomName()}`,
      role: 'OFFICER',
      stationId: st.id,
      status: 'ACTIVE',
      rank: 'Sub-Inspector'
    });
    officerCounter++;
  }
});

// Generate cross-station linked entities
const sharedEntities = [
  { id: 'ENT-V-01', type: 'VEHICLE', value: 'KA-01-AB-1234' },
  { id: 'ENT-P-01', type: 'PHONE', value: '+91-9876543210' },
  { id: 'ENT-P-02', type: 'PHONE', value: '+91-9999988888' },
  { id: 'ENT-V-02', type: 'VEHICLE', value: 'KA-05-XY-7777' },
  { id: 'ENT-N-01', type: 'PERSON', value: 'Unknown Subject Alias "Ranga"' }
];

const crimeTypes = ['Theft', 'Assault', 'Fraud', 'Burglary', 'Extortion', 'Cyber Crime', 'Narcotics', 'Missing Person'];
const statuses = ['INVESTIGATING', 'INVESTIGATING', 'INVESTIGATING', 'SOLVED', 'CLOSED'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

let caseCounter = 1;

stations.forEach(st => {
  const stationOfficers = users.filter(u => u.stationId === st.id && u.role === 'OFFICER');
  
  // 4-8 cases per station
  const numCases = Math.floor(Math.random() * 5) + 4;
  for(let i=0; i<numCases; i++) {
    const isShared = Math.random() > 0.8;
    let ents = [];
    if (isShared) {
      ents.push(sharedEntities[Math.floor(Math.random() * sharedEntities.length)]);
    } else {
      ents.push({ id: `ENT-V-${caseCounter}`, type: 'VEHICLE', value: `KA-${Math.floor(Math.random()*60).toString().padStart(2,'0')}-XX-${Math.floor(Math.random()*9000)+1000}` });
    }

    const c = {
      id: `CR-${st.id.split('-')[1]}-25-${String(caseCounter).padStart(4, '0')}`,
      firNumber: `FIR/2025/${String(caseCounter).padStart(4, '0')}`,
      stationId: st.id,
      investigatorId: stationOfficers[Math.floor(Math.random() * stationOfficers.length)].id,
      title: `${crimeTypes[Math.floor(Math.random() * crimeTypes.length)]} in ${st.district}`,
      description: `Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.`,
      crimeType: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
      entities: ents
    };
    cases.push(c);
    
    // Add 1-2 evidence items for some cases
    if (Math.random() > 0.5) {
      evidence.push({
        id: `EV-${caseCounter}`,
        caseId: c.id,
        description: `Collected during preliminary sweep. Initial tagging done.`,
        type: Math.random() > 0.5 ? 'DOCUMENT' : 'VIDEO',
        uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)).toISOString(),
        entitiesExtracted: ents
      });
    }
    caseCounter++;
  }
});

// Specific Hero Cases to ensure the demo works flawlessly
// Case A in Bengaluru Central
const heroCaseA = {
  id: 'CR-BLR-25-0001',
  firNumber: 'FIR/2025/0001',
  stationId: 'KSP-BLR-CEN',
  investigatorId: users.find(u => u.stationId === 'KSP-BLR-CEN' && u.role === 'OFFICER').id,
  title: 'High-Value Commercial Burglary (MG Road)',
  description: 'Electronic goods stolen from a warehouse at night. Suspects disabled CCTV. One partial vehicle plate found in neighboring camera.',
  crimeType: 'Burglary',
  status: 'INVESTIGATING',
  priority: 'HIGH',
  createdAt: new Date().toISOString(),
  entities: [
    { id: 'ENT-V-HERO', type: 'VEHICLE', value: 'KA-01-AB-1234' }
  ]
};
cases.unshift(heroCaseA);

// Case B in Koramangala
const heroCaseB = {
  id: 'CR-KOR-25-0981',
  firNumber: 'FIR/2025/0981',
  stationId: 'KSP-BLR-KOR',
  investigatorId: users.find(u => u.stationId === 'KSP-BLR-KOR' && u.role === 'OFFICER').id,
  title: 'Jewelry Store Armed Heist',
  description: 'Armed robbery at a jewelry store in Koramangala. Suspects fled in a white van.',
  crimeType: 'Armed Robbery',
  status: 'INVESTIGATING',
  priority: 'CRITICAL',
  createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  entities: [
    { id: 'ENT-V-HERO', type: 'VEHICLE', value: 'KA-01-AB-1234' },
    { id: 'ENT-P-HERO', type: 'PHONE', value: '+91-9876543210' }
  ]
};
cases.unshift(heroCaseB);

// Generate some cross-station alerts
alerts.push({
  id: 'ALT-001',
  type: 'CROSS_STATION_MATCH',
  message: 'Cross-station relationship detected. Vehicle KA-01-AB-1234 matched between Burglary and Armed Heist.',
  relatedCaseId: 'CR-BLR-25-0001',
  targetCaseId: 'CR-KOR-25-0981',
  targetStationId: 'KSP-BLR-KOR',
  isRead: false,
  createdAt: new Date().toISOString()
});

const output = \`import { AppState, User, Station, CaseRecord, Evidence, AccessRequest, IntelligenceAlert } from './types';

const stations: Station[] = \${JSON.stringify(stations, null, 2)};
const users: User[] = \${JSON.stringify(users, null, 2)};
const cases: CaseRecord[] = \${JSON.stringify(cases, null, 2)};
const evidence: Evidence[] = \${JSON.stringify(evidence, null, 2)};
const alerts: IntelligenceAlert[] = \${JSON.stringify(alerts, null, 2)};

export const initialState: AppState = {
  currentUser: null,
  users,
  stations,
  cases,
  evidence,
  accessRequests: [],
  alerts,
  isProcessingIntelligence: false,
};
\`;

fs.writeFileSync('e:/desk/Crime-Lens 2026/TraceX/CrimeLens-SIH-V2-Frontend/frontend/src/mockServices/initialData.ts', output);
