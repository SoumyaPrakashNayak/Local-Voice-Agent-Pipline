import fs from 'fs';
import path from 'path';

const content = `import { AppState, User, Station, CaseRecord, Evidence, AccessRequest, IntelligenceAlert } from './types';

const stations: Station[] = [
  { id: 'KSP-BLR-CEN', name: 'Bengaluru Central', district: 'Bengaluru', city: 'Bengaluru', status: 'ACTIVE' },
  { id: 'KSP-MYS-CTY', name: 'Mysuru City', district: 'Mysuru', city: 'Mysuru', status: 'ACTIVE' },
  { id: 'KSP-MNG-NTH', name: 'Mangaluru North', district: 'Dakshina Kannada', city: 'Mangaluru', status: 'ACTIVE' },
  { id: 'KSP-HUB-CEN', name: 'Hubballi Central', district: 'Dharwad', city: 'Hubballi', status: 'ACTIVE' },
  { id: 'KSP-BEL-CTY', name: 'Belagavi City', district: 'Belagavi', city: 'Belagavi', status: 'ACTIVE' },
  { id: 'KSP-SHV-TWN', name: 'Shivamogga Town', district: 'Shivamogga', city: 'Shivamogga', status: 'ACTIVE' },
  { id: 'KSP-TUM-CEN', name: 'Tumakuru Central', district: 'Tumakuru', city: 'Tumakuru', status: 'ACTIVE' },
  { id: 'KSP-BAL-CTY', name: 'Ballari City', district: 'Ballari', city: 'Ballari', status: 'ACTIVE' },
  { id: 'KSP-BLR-KOR', name: 'Koramangala', district: 'Bengaluru', city: 'Bengaluru', status: 'ACTIVE' },
  { id: 'KSP-BLR-IND', name: 'Indiranagar', district: 'Bengaluru', city: 'Bengaluru', status: 'ACTIVE' }
];

const users: User[] = [
  { id: 'KSP-HQ-001', name: 'Comm. Sharma', role: 'SUPER_ADMIN', status: 'ACTIVE', rank: 'Commissioner' },
  
  // IICs
  { id: 'IIC-BLR-01', name: 'Insp. Ramesh', role: 'STATION_ADMIN', stationId: 'KSP-BLR-CEN', status: 'ACTIVE', rank: 'Inspector' },
  { id: 'IIC-MYS-01', name: 'Insp. Gowda', role: 'STATION_ADMIN', stationId: 'KSP-MYS-CTY', status: 'ACTIVE', rank: 'Inspector' },
  { id: 'IIC-KOR-01', name: 'Insp. Vikram', role: 'STATION_ADMIN', stationId: 'KSP-BLR-KOR', status: 'ACTIVE', rank: 'Inspector' },
  { id: 'IIC-IND-01', name: 'Insp. Anjali', role: 'STATION_ADMIN', stationId: 'KSP-BLR-IND', status: 'ACTIVE', rank: 'Inspector' },
  
  // Investigating Officers
  { id: 'INV-BLR-014', name: 'SI Karthik', role: 'OFFICER', stationId: 'KSP-BLR-CEN', status: 'ACTIVE', rank: 'Sub-Inspector' },
  { id: 'INV-MYS-022', name: 'SI Rajesh', role: 'OFFICER', stationId: 'KSP-MYS-CTY', status: 'ACTIVE', rank: 'Sub-Inspector' },
  { id: 'INV-KOR-005', name: 'SI Meera', role: 'OFFICER', stationId: 'KSP-BLR-KOR', status: 'ACTIVE', rank: 'Sub-Inspector' },
  { id: 'INV-IND-007', name: 'SI Arjun', role: 'OFFICER', stationId: 'KSP-BLR-IND', status: 'ACTIVE', rank: 'Sub-Inspector' },
  { id: 'INV-BLR-015', name: 'ASI Kumar', role: 'OFFICER', stationId: 'KSP-BLR-CEN', status: 'ACTIVE', rank: 'Asst. Sub-Inspector' }
];

const cases: CaseRecord[] = [
  {
    id: 'CR-KOR-25-0981',
    firNumber: 'FIR/2025/0981',
    stationId: 'KSP-BLR-KOR',
    investigatorId: 'INV-KOR-005',
    title: 'Jewelry Store Heist',
    description: 'Armed robbery at a jewelry store in Koramangala. Suspects fled in a white van.',
    crimeType: 'Armed Robbery',
    status: 'INVESTIGATING',
    priority: 'HIGH',
    createdAt: '2025-10-15T10:00:00Z',
    entities: [
      { id: 'ENT-P-01', type: 'PHONE', value: '+91-9876543210' },
      { id: 'ENT-V-01', type: 'VEHICLE', value: 'KA-01-AB-1234' }
    ]
  },
  {
    id: 'CR-IND-25-0100',
    firNumber: 'FIR/2025/0100',
    stationId: 'KSP-BLR-IND',
    investigatorId: 'INV-IND-007',
    title: 'Chain Snatching 100ft Road',
    description: 'Chain snatched by two men on a bike.',
    crimeType: 'Theft',
    status: 'SOLVED',
    priority: 'MEDIUM',
    createdAt: '2025-11-01T08:00:00Z',
    entities: [
      { id: 'ENT-V-02', type: 'VEHICLE', value: 'KA-03-XY-9999' }
    ]
  },
  {
    id: 'CR-BLR-25-0044',
    firNumber: 'FIR/2025/0044',
    stationId: 'KSP-BLR-CEN',
    investigatorId: 'INV-BLR-014',
    title: 'Commercial Burglary MG Road',
    description: 'Electronic goods stolen from a warehouse at night.',
    crimeType: 'Burglary',
    status: 'INVESTIGATING',
    priority: 'HIGH',
    createdAt: '2025-11-12T02:00:00Z',
    entities: [
      { id: 'ENT-V-01-B', type: 'VEHICLE', value: 'KA-01-AB-1234' } // Shared entity with KOR
    ]
  },
  {
    id: 'CR-MYS-25-0888',
    firNumber: 'FIR/2025/0888',
    stationId: 'KSP-MYS-CTY',
    investigatorId: 'INV-MYS-022',
    title: 'Extortion Call',
    description: 'Business owner received threats for ransom.',
    crimeType: 'Extortion',
    status: 'INVESTIGATING',
    priority: 'CRITICAL',
    createdAt: '2025-11-14T09:00:00Z',
    entities: [
      { id: 'ENT-P-01-B', type: 'PHONE', value: '+91-9876543210' } // Shared entity with KOR
    ]
  }
];

// Add 10 more dummy cases to make the UI look populated
for (let i = 1; i <= 20; i++) {
  cases.push({
    id: \`CR-DUMMY-\${i}\`,
    firNumber: \`FIR/2025/10\${i}\`,
    stationId: stations[i % stations.length].id,
    investigatorId: users.filter(u => u.role === 'OFFICER')[i % 4].id,
    title: \`Routine Investigation \${i}\`,
    description: 'Standard investigation protocols being followed for reported incident.',
    crimeType: i % 3 === 0 ? 'Theft' : i % 2 === 0 ? 'Assault' : 'Fraud',
    status: i % 5 === 0 ? 'SOLVED' : 'INVESTIGATING',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    entities: []
  });
}

const evidence: Evidence[] = [
  {
    id: 'EV-001',
    caseId: 'CR-KOR-25-0981',
    description: 'CCTV Footage from neighboring shop showing white van.',
    type: 'VIDEO',
    uploadedAt: '2025-10-16T12:00:00Z',
    entitiesExtracted: [
      { id: 'ENT-V-01', type: 'VEHICLE', value: 'KA-01-AB-1234' }
    ]
  }
];

const alerts: IntelligenceAlert[] = [
  {
    id: 'ALT-001',
    type: 'CROSS_STATION_MATCH',
    message: 'Cross-station relationship detected. Vehicle KA-01-AB-1234 matched.',
    relatedCaseId: 'CR-BLR-25-0044',
    targetCaseId: 'CR-KOR-25-0981',
    targetStationId: 'KSP-BLR-KOR',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const initialState: AppState = {
  currentUser: null, // Start at login screen
  users,
  stations,
  cases,
  evidence,
  accessRequests: [],
  alerts,
  isProcessingIntelligence: false,
};
`;

fs.writeFileSync(path.join('e:/desk/Crime-Lens 2026/TraceX/CrimeLens-SIH-V2-Frontend/frontend/src/mockServices/initialData.ts'), content);
