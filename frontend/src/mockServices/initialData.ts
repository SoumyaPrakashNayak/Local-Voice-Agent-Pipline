import { AppState, User, Station, CaseRecord, Evidence, AccessRequest, IntelligenceAlert } from './types';

const stations: Station[] = [
  {
    "id": "KSP-BLR-CEN",
    "name": "Bengaluru Central",
    "district": "Bengaluru Urban",
    "city": "Bengaluru",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-MYS-CTY",
    "name": "Mysuru City",
    "district": "Mysuru",
    "city": "Mysuru",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-MNG-NTH",
    "name": "Mangaluru North",
    "district": "Dakshina Kannada",
    "city": "Mangaluru",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-HUB-CEN",
    "name": "Hubballi Central",
    "district": "Dharwad",
    "city": "Hubballi",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-BEL-CTY",
    "name": "Belagavi City",
    "district": "Belagavi",
    "city": "Belagavi",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-SHV-TWN",
    "name": "Shivamogga Town",
    "district": "Shivamogga",
    "city": "Shivamogga",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-TUM-CEN",
    "name": "Tumakuru Central",
    "district": "Tumakuru",
    "city": "Tumakuru",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-BAL-CTY",
    "name": "Ballari City",
    "district": "Ballari",
    "city": "Ballari",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-BLR-KOR",
    "name": "Koramangala",
    "district": "Bengaluru Urban",
    "city": "Bengaluru",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-BLR-IND",
    "name": "Indiranagar",
    "district": "Bengaluru Urban",
    "city": "Bengaluru",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-UUD-TWN",
    "name": "Udupi Town",
    "district": "Udupi",
    "city": "Udupi",
    "status": "ACTIVE"
  },
  {
    "id": "KSP-GLB-CEN",
    "name": "Kalaburagi Central",
    "district": "Kalaburagi",
    "city": "Kalaburagi",
    "status": "ACTIVE"
  }
];
const users: User[] = [
  {
    "id": "KSP-HQ-001",
    "name": "Comm. Sharma",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "rank": "Commissioner"
  },
  {
    "id": "IIC-BLR-01",
    "name": "Insp. Ramesh",
    "role": "STATION_ADMIN",
    "stationId": "KSP-BLR-CEN",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-BLR-001",
    "name": "SI Anita Iyer",
    "role": "OFFICER",
    "stationId": "KSP-BLR-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-002",
    "name": "SI Gowda Rao",
    "role": "OFFICER",
    "stationId": "KSP-BLR-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-003",
    "name": "SI Kumar Naidu",
    "role": "OFFICER",
    "stationId": "KSP-BLR-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-004",
    "name": "SI Anita Nair",
    "role": "OFFICER",
    "stationId": "KSP-BLR-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-005",
    "name": "SI Ramesh Naidu",
    "role": "OFFICER",
    "stationId": "KSP-BLR-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-MYS-01",
    "name": "Insp. Gowda",
    "role": "STATION_ADMIN",
    "stationId": "KSP-MYS-CTY",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-MYS-006",
    "name": "SI Vikram Iyer",
    "role": "OFFICER",
    "stationId": "KSP-MYS-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MYS-007",
    "name": "SI Ramesh Desai",
    "role": "OFFICER",
    "stationId": "KSP-MYS-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MYS-008",
    "name": "SI Manjunath Menon",
    "role": "OFFICER",
    "stationId": "KSP-MYS-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MYS-009",
    "name": "SI Pratap Hegde",
    "role": "OFFICER",
    "stationId": "KSP-MYS-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-MNG-01",
    "name": "Insp. Vikram",
    "role": "STATION_ADMIN",
    "stationId": "KSP-MNG-NTH",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-MNG-010",
    "name": "SI Priya Desai",
    "role": "OFFICER",
    "stationId": "KSP-MNG-NTH",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MNG-011",
    "name": "SI Kumar Rao",
    "role": "OFFICER",
    "stationId": "KSP-MNG-NTH",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MNG-012",
    "name": "SI Rajesh Bhat",
    "role": "OFFICER",
    "stationId": "KSP-MNG-NTH",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MNG-013",
    "name": "SI Ramesh Gowda",
    "role": "OFFICER",
    "stationId": "KSP-MNG-NTH",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-MNG-014",
    "name": "SI Priya Singh",
    "role": "OFFICER",
    "stationId": "KSP-MNG-NTH",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-HUB-01",
    "name": "Insp. Anjali",
    "role": "STATION_ADMIN",
    "stationId": "KSP-HUB-CEN",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-HUB-015",
    "name": "SI Gowda Bhat",
    "role": "OFFICER",
    "stationId": "KSP-HUB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-HUB-016",
    "name": "SI Ramesh Shetty",
    "role": "OFFICER",
    "stationId": "KSP-HUB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-HUB-017",
    "name": "SI Pratap Hegde",
    "role": "OFFICER",
    "stationId": "KSP-HUB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-HUB-018",
    "name": "SI Venkatesh Patil",
    "role": "OFFICER",
    "stationId": "KSP-HUB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-HUB-019",
    "name": "SI Manjunath Iyer",
    "role": "OFFICER",
    "stationId": "KSP-HUB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-BEL-01",
    "name": "Insp. Karthik",
    "role": "STATION_ADMIN",
    "stationId": "KSP-BEL-CTY",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-BEL-020",
    "name": "SI Deepak Desai",
    "role": "OFFICER",
    "stationId": "KSP-BEL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BEL-021",
    "name": "SI Gowda Rao",
    "role": "OFFICER",
    "stationId": "KSP-BEL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BEL-022",
    "name": "SI Karthik Bhat",
    "role": "OFFICER",
    "stationId": "KSP-BEL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-SHV-01",
    "name": "Insp. Rajesh",
    "role": "STATION_ADMIN",
    "stationId": "KSP-SHV-TWN",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-SHV-023",
    "name": "SI Suresh Menon",
    "role": "OFFICER",
    "stationId": "KSP-SHV-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-SHV-024",
    "name": "SI Gowda Gowda",
    "role": "OFFICER",
    "stationId": "KSP-SHV-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-SHV-025",
    "name": "SI Rajesh Naidu",
    "role": "OFFICER",
    "stationId": "KSP-SHV-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-TUM-01",
    "name": "Insp. Meera",
    "role": "STATION_ADMIN",
    "stationId": "KSP-TUM-CEN",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-TUM-026",
    "name": "SI Pratap Shetty",
    "role": "OFFICER",
    "stationId": "KSP-TUM-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-TUM-027",
    "name": "SI Nandini Rao",
    "role": "OFFICER",
    "stationId": "KSP-TUM-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-TUM-028",
    "name": "SI Siddharth Rao",
    "role": "OFFICER",
    "stationId": "KSP-TUM-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-TUM-029",
    "name": "SI Arjun Bhat",
    "role": "OFFICER",
    "stationId": "KSP-TUM-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-BAL-01",
    "name": "Insp. Arjun",
    "role": "STATION_ADMIN",
    "stationId": "KSP-BAL-CTY",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-BAL-030",
    "name": "SI Anita Desai",
    "role": "OFFICER",
    "stationId": "KSP-BAL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BAL-031",
    "name": "SI Rajesh Menon",
    "role": "OFFICER",
    "stationId": "KSP-BAL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BAL-032",
    "name": "SI Nandini Hegde",
    "role": "OFFICER",
    "stationId": "KSP-BAL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BAL-033",
    "name": "SI Ramesh Menon",
    "role": "OFFICER",
    "stationId": "KSP-BAL-CTY",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-BLR-01",
    "name": "Insp. Kumar",
    "role": "STATION_ADMIN",
    "stationId": "KSP-BLR-KOR",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-BLR-034",
    "name": "SI Kumar Menon",
    "role": "OFFICER",
    "stationId": "KSP-BLR-KOR",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-035",
    "name": "SI Ramesh Desai",
    "role": "OFFICER",
    "stationId": "KSP-BLR-KOR",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-036",
    "name": "SI Karthik Rao",
    "role": "OFFICER",
    "stationId": "KSP-BLR-KOR",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-037",
    "name": "SI Kiran Bhat",
    "role": "OFFICER",
    "stationId": "KSP-BLR-KOR",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-BLR-01",
    "name": "Insp. Priya",
    "role": "STATION_ADMIN",
    "stationId": "KSP-BLR-IND",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-BLR-038",
    "name": "SI Nandini Menon",
    "role": "OFFICER",
    "stationId": "KSP-BLR-IND",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-039",
    "name": "SI Ramesh Bhat",
    "role": "OFFICER",
    "stationId": "KSP-BLR-IND",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-BLR-040",
    "name": "SI Pratap Singh",
    "role": "OFFICER",
    "stationId": "KSP-BLR-IND",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-UUD-01",
    "name": "Insp. Deepak",
    "role": "STATION_ADMIN",
    "stationId": "KSP-UUD-TWN",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-UUD-041",
    "name": "SI Suresh Iyer",
    "role": "OFFICER",
    "stationId": "KSP-UUD-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-UUD-042",
    "name": "SI Meera Rao",
    "role": "OFFICER",
    "stationId": "KSP-UUD-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-UUD-043",
    "name": "SI Siddharth Menon",
    "role": "OFFICER",
    "stationId": "KSP-UUD-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-UUD-044",
    "name": "SI Kumar Hegde",
    "role": "OFFICER",
    "stationId": "KSP-UUD-TWN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "IIC-GLB-01",
    "name": "Insp. Suresh",
    "role": "STATION_ADMIN",
    "stationId": "KSP-GLB-CEN",
    "status": "ACTIVE",
    "rank": "Inspector"
  },
  {
    "id": "INV-GLB-045",
    "name": "SI Anita Shetty",
    "role": "OFFICER",
    "stationId": "KSP-GLB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-GLB-046",
    "name": "SI Kumar Shetty",
    "role": "OFFICER",
    "stationId": "KSP-GLB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-GLB-047",
    "name": "SI Siddharth Singh",
    "role": "OFFICER",
    "stationId": "KSP-GLB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  },
  {
    "id": "INV-GLB-048",
    "name": "SI Manjunath Bhat",
    "role": "OFFICER",
    "stationId": "KSP-GLB-CEN",
    "status": "ACTIVE",
    "rank": "Sub-Inspector"
  }
];
const cases: CaseRecord[] = [
  {
    "id": "CR-KOR-25-0981",
    "firNumber": "FIR/2025/0981",
    "stationId": "KSP-BLR-KOR",
    "investigatorId": "INV-BLR-034",
    "title": "Jewelry Store Armed Heist",
    "description": "Armed robbery at a jewelry store in Koramangala. Suspects fled in a white van.",
    "crimeType": "Armed Robbery",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-08-18T09:34:58.374Z",
    "entities": [
      {
        "id": "ENT-V-HERO",
        "type": "VEHICLE",
        "value": "KA-01-AB-1234"
      },
      {
        "id": "ENT-P-HERO",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0001",
    "firNumber": "FIR/2025/0001",
    "stationId": "KSP-BLR-CEN",
    "investigatorId": "INV-BLR-001",
    "title": "High-Value Commercial Burglary (MG Road)",
    "description": "Electronic goods stolen from a warehouse at night. Suspects disabled CCTV. One partial vehicle plate found in neighboring camera.",
    "crimeType": "Burglary",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-08-20T09:34:58.374Z",
    "entities": [
      {
        "id": "ENT-V-HERO",
        "type": "VEHICLE",
        "value": "KA-01-AB-1234"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0001",
    "firNumber": "FIR/2025/0001",
    "stationId": "KSP-BLR-CEN",
    "investigatorId": "INV-BLR-003",
    "title": "Narcotics in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-07-23T00:36:36.506Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0002",
    "firNumber": "FIR/2025/0002",
    "stationId": "KSP-BLR-CEN",
    "investigatorId": "INV-BLR-003",
    "title": "Narcotics in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-03T09:26:26.899Z",
    "entities": [
      {
        "id": "ENT-V-2",
        "type": "VEHICLE",
        "value": "KA-49-XX-4001"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0003",
    "firNumber": "FIR/2025/0003",
    "stationId": "KSP-BLR-CEN",
    "investigatorId": "INV-BLR-001",
    "title": "Burglary in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "SOLVED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-05T06:51:39.103Z",
    "entities": [
      {
        "id": "ENT-V-3",
        "type": "VEHICLE",
        "value": "KA-46-XX-7640"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0004",
    "firNumber": "FIR/2025/0004",
    "stationId": "KSP-BLR-CEN",
    "investigatorId": "INV-BLR-001",
    "title": "Narcotics in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-08-14T14:41:56.213Z",
    "entities": [
      {
        "id": "ENT-V-4",
        "type": "VEHICLE",
        "value": "KA-25-XX-1786"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0005",
    "firNumber": "FIR/2025/0005",
    "stationId": "KSP-BLR-CEN",
    "investigatorId": "INV-BLR-004",
    "title": "Assault in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Missing Person",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-30T08:51:46.263Z",
    "entities": [
      {
        "id": "ENT-V-5",
        "type": "VEHICLE",
        "value": "KA-15-XX-5285"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0006",
    "firNumber": "FIR/2025/0006",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-006",
    "title": "Burglary in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-25T21:37:17.164Z",
    "entities": [
      {
        "id": "ENT-V-6",
        "type": "VEHICLE",
        "value": "KA-32-XX-9738"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0007",
    "firNumber": "FIR/2025/0007",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-008",
    "title": "Narcotics in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-07-23T11:13:37.743Z",
    "entities": [
      {
        "id": "ENT-V-7",
        "type": "VEHICLE",
        "value": "KA-17-XX-4884"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0008",
    "firNumber": "FIR/2025/0008",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-006",
    "title": "Theft in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-07T14:28:07.647Z",
    "entities": [
      {
        "id": "ENT-V-8",
        "type": "VEHICLE",
        "value": "KA-07-XX-5228"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0009",
    "firNumber": "FIR/2025/0009",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-007",
    "title": "Cyber Crime in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-08-05T12:22:34.228Z",
    "entities": [
      {
        "id": "ENT-P-02",
        "type": "PHONE",
        "value": "+91-9999988888"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0010",
    "firNumber": "FIR/2025/0010",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-009",
    "title": "Extortion in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-08-08T17:00:51.136Z",
    "entities": [
      {
        "id": "ENT-V-10",
        "type": "VEHICLE",
        "value": "KA-12-XX-1195"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0011",
    "firNumber": "FIR/2025/0011",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-007",
    "title": "Narcotics in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-08-08T02:17:42.087Z",
    "entities": [
      {
        "id": "ENT-V-11",
        "type": "VEHICLE",
        "value": "KA-10-XX-8488"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0012",
    "firNumber": "FIR/2025/0012",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-008",
    "title": "Theft in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-07-31T09:26:54.787Z",
    "entities": [
      {
        "id": "ENT-V-12",
        "type": "VEHICLE",
        "value": "KA-41-XX-2283"
      }
    ]
  },
  {
    "id": "CR-MYS-25-0013",
    "firNumber": "FIR/2025/0013",
    "stationId": "KSP-MYS-CTY",
    "investigatorId": "INV-MYS-006",
    "title": "Burglary in Mysuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-08-02T11:41:29.227Z",
    "entities": [
      {
        "id": "ENT-V-13",
        "type": "VEHICLE",
        "value": "KA-52-XX-6187"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0014",
    "firNumber": "FIR/2025/0014",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-010",
    "title": "Theft in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "SOLVED",
    "priority": "MEDIUM",
    "createdAt": "2026-07-23T23:17:06.760Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0015",
    "firNumber": "FIR/2025/0015",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-013",
    "title": "Assault in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-07-23T17:52:46.603Z",
    "entities": [
      {
        "id": "ENT-V-15",
        "type": "VEHICLE",
        "value": "KA-26-XX-3530"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0016",
    "firNumber": "FIR/2025/0016",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-013",
    "title": "Assault in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "CLOSED",
    "priority": "HIGH",
    "createdAt": "2026-07-31T00:23:35.239Z",
    "entities": [
      {
        "id": "ENT-V-16",
        "type": "VEHICLE",
        "value": "KA-56-XX-4213"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0017",
    "firNumber": "FIR/2025/0017",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-014",
    "title": "Burglary in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-07-30T22:06:52.555Z",
    "entities": [
      {
        "id": "ENT-V-17",
        "type": "VEHICLE",
        "value": "KA-02-XX-4857"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0018",
    "firNumber": "FIR/2025/0018",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-010",
    "title": "Assault in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-07-22T23:05:41.609Z",
    "entities": [
      {
        "id": "ENT-V-18",
        "type": "VEHICLE",
        "value": "KA-32-XX-4312"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0019",
    "firNumber": "FIR/2025/0019",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-014",
    "title": "Narcotics in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-08-06T05:45:45.499Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-MNG-25-0020",
    "firNumber": "FIR/2025/0020",
    "stationId": "KSP-MNG-NTH",
    "investigatorId": "INV-MNG-012",
    "title": "Burglary in Dakshina Kannada",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-08-18T05:46:33.690Z",
    "entities": [
      {
        "id": "ENT-V-20",
        "type": "VEHICLE",
        "value": "KA-29-XX-5465"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0021",
    "firNumber": "FIR/2025/0021",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-015",
    "title": "Fraud in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-08-19T02:21:21.207Z",
    "entities": [
      {
        "id": "ENT-V-21",
        "type": "VEHICLE",
        "value": "KA-46-XX-9990"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0022",
    "firNumber": "FIR/2025/0022",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-017",
    "title": "Theft in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "SOLVED",
    "priority": "CRITICAL",
    "createdAt": "2026-07-25T02:24:30.260Z",
    "entities": [
      {
        "id": "ENT-V-02",
        "type": "VEHICLE",
        "value": "KA-05-XY-7777"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0023",
    "firNumber": "FIR/2025/0023",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-015",
    "title": "Assault in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Missing Person",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-08-11T16:31:06.929Z",
    "entities": [
      {
        "id": "ENT-V-23",
        "type": "VEHICLE",
        "value": "KA-49-XX-6254"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0024",
    "firNumber": "FIR/2025/0024",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-016",
    "title": "Fraud in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-26T12:19:21.692Z",
    "entities": [
      {
        "id": "ENT-V-24",
        "type": "VEHICLE",
        "value": "KA-44-XX-3118"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0025",
    "firNumber": "FIR/2025/0025",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-015",
    "title": "Narcotics in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-08T22:36:29.004Z",
    "entities": [
      {
        "id": "ENT-V-25",
        "type": "VEHICLE",
        "value": "KA-42-XX-4783"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0026",
    "firNumber": "FIR/2025/0026",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-018",
    "title": "Cyber Crime in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "CLOSED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-20T03:09:52.636Z",
    "entities": [
      {
        "id": "ENT-V-26",
        "type": "VEHICLE",
        "value": "KA-28-XX-7880"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0027",
    "firNumber": "FIR/2025/0027",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-017",
    "title": "Theft in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-07-29T11:31:53.935Z",
    "entities": [
      {
        "id": "ENT-V-27",
        "type": "VEHICLE",
        "value": "KA-11-XX-6694"
      }
    ]
  },
  {
    "id": "CR-HUB-25-0028",
    "firNumber": "FIR/2025/0028",
    "stationId": "KSP-HUB-CEN",
    "investigatorId": "INV-HUB-019",
    "title": "Theft in Dharwad",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-25T12:11:40.131Z",
    "entities": [
      {
        "id": "ENT-V-28",
        "type": "VEHICLE",
        "value": "KA-04-XX-5330"
      }
    ]
  },
  {
    "id": "CR-BEL-25-0029",
    "firNumber": "FIR/2025/0029",
    "stationId": "KSP-BEL-CTY",
    "investigatorId": "INV-BEL-022",
    "title": "Assault in Belagavi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "CLOSED",
    "priority": "LOW",
    "createdAt": "2026-08-02T22:33:12.502Z",
    "entities": [
      {
        "id": "ENT-V-29",
        "type": "VEHICLE",
        "value": "KA-47-XX-7234"
      }
    ]
  },
  {
    "id": "CR-BEL-25-0030",
    "firNumber": "FIR/2025/0030",
    "stationId": "KSP-BEL-CTY",
    "investigatorId": "INV-BEL-022",
    "title": "Cyber Crime in Belagavi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "CLOSED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-14T00:33:02.487Z",
    "entities": [
      {
        "id": "ENT-V-30",
        "type": "VEHICLE",
        "value": "KA-12-XX-1883"
      }
    ]
  },
  {
    "id": "CR-BEL-25-0031",
    "firNumber": "FIR/2025/0031",
    "stationId": "KSP-BEL-CTY",
    "investigatorId": "INV-BEL-022",
    "title": "Narcotics in Belagavi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-08-09T18:39:07.152Z",
    "entities": [
      {
        "id": "ENT-V-31",
        "type": "VEHICLE",
        "value": "KA-15-XX-6178"
      }
    ]
  },
  {
    "id": "CR-BEL-25-0032",
    "firNumber": "FIR/2025/0032",
    "stationId": "KSP-BEL-CTY",
    "investigatorId": "INV-BEL-020",
    "title": "Assault in Belagavi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "SOLVED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-11T22:24:15.973Z",
    "entities": [
      {
        "id": "ENT-V-32",
        "type": "VEHICLE",
        "value": "KA-44-XX-5524"
      }
    ]
  },
  {
    "id": "CR-BEL-25-0033",
    "firNumber": "FIR/2025/0033",
    "stationId": "KSP-BEL-CTY",
    "investigatorId": "INV-BEL-021",
    "title": "Assault in Belagavi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "SOLVED",
    "priority": "MEDIUM",
    "createdAt": "2026-07-24T12:45:16.138Z",
    "entities": [
      {
        "id": "ENT-V-33",
        "type": "VEHICLE",
        "value": "KA-16-XX-3366"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0034",
    "firNumber": "FIR/2025/0034",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-023",
    "title": "Theft in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-28T14:49:53.706Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0035",
    "firNumber": "FIR/2025/0035",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-024",
    "title": "Missing Person in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-02T21:35:49.967Z",
    "entities": [
      {
        "id": "ENT-V-35",
        "type": "VEHICLE",
        "value": "KA-10-XX-6464"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0036",
    "firNumber": "FIR/2025/0036",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-024",
    "title": "Burglary in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "CLOSED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-03T21:04:36.461Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0037",
    "firNumber": "FIR/2025/0037",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-025",
    "title": "Assault in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-08-10T07:55:43.547Z",
    "entities": [
      {
        "id": "ENT-V-37",
        "type": "VEHICLE",
        "value": "KA-57-XX-1309"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0038",
    "firNumber": "FIR/2025/0038",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-025",
    "title": "Theft in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-30T06:13:55.070Z",
    "entities": [
      {
        "id": "ENT-V-38",
        "type": "VEHICLE",
        "value": "KA-02-XX-5230"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0039",
    "firNumber": "FIR/2025/0039",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-023",
    "title": "Cyber Crime in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-05T01:56:59.575Z",
    "entities": [
      {
        "id": "ENT-V-39",
        "type": "VEHICLE",
        "value": "KA-56-XX-8964"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0040",
    "firNumber": "FIR/2025/0040",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-024",
    "title": "Burglary in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-08-11T14:53:06.103Z",
    "entities": [
      {
        "id": "ENT-V-40",
        "type": "VEHICLE",
        "value": "KA-36-XX-1462"
      }
    ]
  },
  {
    "id": "CR-SHV-25-0041",
    "firNumber": "FIR/2025/0041",
    "stationId": "KSP-SHV-TWN",
    "investigatorId": "INV-SHV-025",
    "title": "Extortion in Shivamogga",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-07-27T08:26:40.582Z",
    "entities": [
      {
        "id": "ENT-V-41",
        "type": "VEHICLE",
        "value": "KA-32-XX-8669"
      }
    ]
  },
  {
    "id": "CR-TUM-25-0042",
    "firNumber": "FIR/2025/0042",
    "stationId": "KSP-TUM-CEN",
    "investigatorId": "INV-TUM-026",
    "title": "Theft in Tumakuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-08-14T02:01:53.907Z",
    "entities": [
      {
        "id": "ENT-V-02",
        "type": "VEHICLE",
        "value": "KA-05-XY-7777"
      }
    ]
  },
  {
    "id": "CR-TUM-25-0043",
    "firNumber": "FIR/2025/0043",
    "stationId": "KSP-TUM-CEN",
    "investigatorId": "INV-TUM-029",
    "title": "Cyber Crime in Tumakuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-07-22T09:54:48.648Z",
    "entities": [
      {
        "id": "ENT-V-43",
        "type": "VEHICLE",
        "value": "KA-39-XX-8476"
      }
    ]
  },
  {
    "id": "CR-TUM-25-0044",
    "firNumber": "FIR/2025/0044",
    "stationId": "KSP-TUM-CEN",
    "investigatorId": "INV-TUM-026",
    "title": "Extortion in Tumakuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-31T15:43:44.438Z",
    "entities": [
      {
        "id": "ENT-V-44",
        "type": "VEHICLE",
        "value": "KA-21-XX-1090"
      }
    ]
  },
  {
    "id": "CR-TUM-25-0045",
    "firNumber": "FIR/2025/0045",
    "stationId": "KSP-TUM-CEN",
    "investigatorId": "INV-TUM-027",
    "title": "Missing Person in Tumakuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-27T19:49:48.260Z",
    "entities": [
      {
        "id": "ENT-V-45",
        "type": "VEHICLE",
        "value": "KA-50-XX-4647"
      }
    ]
  },
  {
    "id": "CR-TUM-25-0046",
    "firNumber": "FIR/2025/0046",
    "stationId": "KSP-TUM-CEN",
    "investigatorId": "INV-TUM-028",
    "title": "Fraud in Tumakuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-07-28T06:34:15.345Z",
    "entities": [
      {
        "id": "ENT-V-46",
        "type": "VEHICLE",
        "value": "KA-07-XX-1456"
      }
    ]
  },
  {
    "id": "CR-TUM-25-0047",
    "firNumber": "FIR/2025/0047",
    "stationId": "KSP-TUM-CEN",
    "investigatorId": "INV-TUM-029",
    "title": "Theft in Tumakuru",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-08-18T22:31:21.058Z",
    "entities": [
      {
        "id": "ENT-V-47",
        "type": "VEHICLE",
        "value": "KA-06-XX-2439"
      }
    ]
  },
  {
    "id": "CR-BAL-25-0048",
    "firNumber": "FIR/2025/0048",
    "stationId": "KSP-BAL-CTY",
    "investigatorId": "INV-BAL-030",
    "title": "Narcotics in Ballari",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-08-08T12:48:46.718Z",
    "entities": [
      {
        "id": "ENT-V-01",
        "type": "VEHICLE",
        "value": "KA-01-AB-1234"
      }
    ]
  },
  {
    "id": "CR-BAL-25-0049",
    "firNumber": "FIR/2025/0049",
    "stationId": "KSP-BAL-CTY",
    "investigatorId": "INV-BAL-032",
    "title": "Extortion in Ballari",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "SOLVED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-04T22:04:56.243Z",
    "entities": [
      {
        "id": "ENT-V-49",
        "type": "VEHICLE",
        "value": "KA-21-XX-8858"
      }
    ]
  },
  {
    "id": "CR-BAL-25-0050",
    "firNumber": "FIR/2025/0050",
    "stationId": "KSP-BAL-CTY",
    "investigatorId": "INV-BAL-030",
    "title": "Extortion in Ballari",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Missing Person",
    "status": "SOLVED",
    "priority": "HIGH",
    "createdAt": "2026-08-14T22:54:25.521Z",
    "entities": [
      {
        "id": "ENT-V-50",
        "type": "VEHICLE",
        "value": "KA-20-XX-9608"
      }
    ]
  },
  {
    "id": "CR-BAL-25-0051",
    "firNumber": "FIR/2025/0051",
    "stationId": "KSP-BAL-CTY",
    "investigatorId": "INV-BAL-032",
    "title": "Assault in Ballari",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Missing Person",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-08-04T10:03:04.971Z",
    "entities": [
      {
        "id": "ENT-V-51",
        "type": "VEHICLE",
        "value": "KA-28-XX-6957"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0052",
    "firNumber": "FIR/2025/0052",
    "stationId": "KSP-BLR-KOR",
    "investigatorId": "INV-BLR-035",
    "title": "Cyber Crime in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "CLOSED",
    "priority": "MEDIUM",
    "createdAt": "2026-08-19T01:45:23.894Z",
    "entities": [
      {
        "id": "ENT-V-52",
        "type": "VEHICLE",
        "value": "KA-03-XX-6347"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0053",
    "firNumber": "FIR/2025/0053",
    "stationId": "KSP-BLR-KOR",
    "investigatorId": "INV-BLR-036",
    "title": "Cyber Crime in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "CLOSED",
    "priority": "HIGH",
    "createdAt": "2026-07-29T20:14:26.048Z",
    "entities": [
      {
        "id": "ENT-V-53",
        "type": "VEHICLE",
        "value": "KA-30-XX-2848"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0054",
    "firNumber": "FIR/2025/0054",
    "stationId": "KSP-BLR-KOR",
    "investigatorId": "INV-BLR-036",
    "title": "Narcotics in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-06T11:34:42.963Z",
    "entities": [
      {
        "id": "ENT-V-02",
        "type": "VEHICLE",
        "value": "KA-05-XY-7777"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0055",
    "firNumber": "FIR/2025/0055",
    "stationId": "KSP-BLR-KOR",
    "investigatorId": "INV-BLR-034",
    "title": "Narcotics in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Missing Person",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-26T10:16:43.630Z",
    "entities": [
      {
        "id": "ENT-V-55",
        "type": "VEHICLE",
        "value": "KA-56-XX-8597"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0056",
    "firNumber": "FIR/2025/0056",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-040",
    "title": "Extortion in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "SOLVED",
    "priority": "HIGH",
    "createdAt": "2026-08-13T02:15:14.845Z",
    "entities": [
      {
        "id": "ENT-V-56",
        "type": "VEHICLE",
        "value": "KA-11-XX-9299"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0057",
    "firNumber": "FIR/2025/0057",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-039",
    "title": "Extortion in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "SOLVED",
    "priority": "CRITICAL",
    "createdAt": "2026-07-25T11:41:32.245Z",
    "entities": [
      {
        "id": "ENT-P-02",
        "type": "PHONE",
        "value": "+91-9999988888"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0058",
    "firNumber": "FIR/2025/0058",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-040",
    "title": "Theft in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "CLOSED",
    "priority": "HIGH",
    "createdAt": "2026-08-10T18:18:36.406Z",
    "entities": [
      {
        "id": "ENT-V-58",
        "type": "VEHICLE",
        "value": "KA-47-XX-5311"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0059",
    "firNumber": "FIR/2025/0059",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-038",
    "title": "Extortion in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-07-28T22:52:59.158Z",
    "entities": [
      {
        "id": "ENT-V-59",
        "type": "VEHICLE",
        "value": "KA-49-XX-2521"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0060",
    "firNumber": "FIR/2025/0060",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-040",
    "title": "Extortion in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-07-28T17:42:22.972Z",
    "entities": [
      {
        "id": "ENT-P-02",
        "type": "PHONE",
        "value": "+91-9999988888"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0061",
    "firNumber": "FIR/2025/0061",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-040",
    "title": "Fraud in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Narcotics",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-08-19T23:01:53.582Z",
    "entities": [
      {
        "id": "ENT-V-61",
        "type": "VEHICLE",
        "value": "KA-34-XX-9233"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0062",
    "firNumber": "FIR/2025/0062",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-038",
    "title": "Theft in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "CLOSED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-19T11:55:18.130Z",
    "entities": [
      {
        "id": "ENT-V-62",
        "type": "VEHICLE",
        "value": "KA-31-XX-6042"
      }
    ]
  },
  {
    "id": "CR-BLR-25-0063",
    "firNumber": "FIR/2025/0063",
    "stationId": "KSP-BLR-IND",
    "investigatorId": "INV-BLR-038",
    "title": "Burglary in Bengaluru Urban",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Missing Person",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-18T13:47:31.043Z",
    "entities": [
      {
        "id": "ENT-V-63",
        "type": "VEHICLE",
        "value": "KA-11-XX-9752"
      }
    ]
  },
  {
    "id": "CR-UUD-25-0064",
    "firNumber": "FIR/2025/0064",
    "stationId": "KSP-UUD-TWN",
    "investigatorId": "INV-UUD-041",
    "title": "Narcotics in Udupi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "SOLVED",
    "priority": "MEDIUM",
    "createdAt": "2026-07-30T04:58:49.106Z",
    "entities": [
      {
        "id": "ENT-N-01",
        "type": "PERSON",
        "value": "Unknown Subject Alias Ranga"
      }
    ]
  },
  {
    "id": "CR-UUD-25-0065",
    "firNumber": "FIR/2025/0065",
    "stationId": "KSP-UUD-TWN",
    "investigatorId": "INV-UUD-042",
    "title": "Assault in Udupi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "SOLVED",
    "priority": "CRITICAL",
    "createdAt": "2026-08-10T23:45:32.042Z",
    "entities": [
      {
        "id": "ENT-V-65",
        "type": "VEHICLE",
        "value": "KA-39-XX-6768"
      }
    ]
  },
  {
    "id": "CR-UUD-25-0066",
    "firNumber": "FIR/2025/0066",
    "stationId": "KSP-UUD-TWN",
    "investigatorId": "INV-UUD-042",
    "title": "Burglary in Udupi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-07-31T07:33:02.854Z",
    "entities": [
      {
        "id": "ENT-V-66",
        "type": "VEHICLE",
        "value": "KA-38-XX-4856"
      }
    ]
  },
  {
    "id": "CR-UUD-25-0067",
    "firNumber": "FIR/2025/0067",
    "stationId": "KSP-UUD-TWN",
    "investigatorId": "INV-UUD-044",
    "title": "Assault in Udupi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-10T11:13:43.649Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0068",
    "firNumber": "FIR/2025/0068",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-047",
    "title": "Extortion in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Assault",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-08-13T18:28:41.099Z",
    "entities": [
      {
        "id": "ENT-V-68",
        "type": "VEHICLE",
        "value": "KA-31-XX-5319"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0069",
    "firNumber": "FIR/2025/0069",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-048",
    "title": "Fraud in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Cyber Crime",
    "status": "INVESTIGATING",
    "priority": "CRITICAL",
    "createdAt": "2026-07-25T07:38:14.043Z",
    "entities": [
      {
        "id": "ENT-V-69",
        "type": "VEHICLE",
        "value": "KA-02-XX-8915"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0070",
    "firNumber": "FIR/2025/0070",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-045",
    "title": "Fraud in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Theft",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-08-03T01:09:01.343Z",
    "entities": [
      {
        "id": "ENT-V-70",
        "type": "VEHICLE",
        "value": "KA-57-XX-1207"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0071",
    "firNumber": "FIR/2025/0071",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-048",
    "title": "Burglary in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-08-03T06:29:31.797Z",
    "entities": [
      {
        "id": "ENT-N-01",
        "type": "PERSON",
        "value": "Unknown Subject Alias Ranga"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0072",
    "firNumber": "FIR/2025/0072",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-048",
    "title": "Narcotics in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "INVESTIGATING",
    "priority": "HIGH",
    "createdAt": "2026-07-27T00:15:56.553Z",
    "entities": [
      {
        "id": "ENT-V-72",
        "type": "VEHICLE",
        "value": "KA-22-XX-8830"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0073",
    "firNumber": "FIR/2025/0073",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-045",
    "title": "Fraud in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Burglary",
    "status": "INVESTIGATING",
    "priority": "MEDIUM",
    "createdAt": "2026-07-27T01:21:19.330Z",
    "entities": [
      {
        "id": "ENT-V-73",
        "type": "VEHICLE",
        "value": "KA-04-XX-9841"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0074",
    "firNumber": "FIR/2025/0074",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-046",
    "title": "Fraud in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Fraud",
    "status": "SOLVED",
    "priority": "HIGH",
    "createdAt": "2026-08-03T11:55:50.441Z",
    "entities": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "CR-GLB-25-0075",
    "firNumber": "FIR/2025/0075",
    "stationId": "KSP-GLB-CEN",
    "investigatorId": "INV-GLB-046",
    "title": "Missing Person in Kalaburagi",
    "description": "Reported incident being investigated by assigned officer. Standard protocols are in effect. Witness statements and preliminary evidence collected.",
    "crimeType": "Extortion",
    "status": "INVESTIGATING",
    "priority": "LOW",
    "createdAt": "2026-07-23T04:06:36.532Z",
    "entities": [
      {
        "id": "ENT-V-75",
        "type": "VEHICLE",
        "value": "KA-32-XX-4167"
      }
    ]
  }
];
const evidence: Evidence[] = [
  {
    "id": "EV-3",
    "caseId": "CR-BLR-25-0003",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-13T03:48:38.741Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-3",
        "type": "VEHICLE",
        "value": "KA-46-XX-7640"
      }
    ]
  },
  {
    "id": "EV-4",
    "caseId": "CR-BLR-25-0004",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-18T15:56:52.579Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-4",
        "type": "VEHICLE",
        "value": "KA-25-XX-1786"
      }
    ]
  },
  {
    "id": "EV-6",
    "caseId": "CR-MYS-25-0006",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-17T15:51:06.976Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-6",
        "type": "VEHICLE",
        "value": "KA-32-XX-9738"
      }
    ]
  },
  {
    "id": "EV-7",
    "caseId": "CR-MYS-25-0007",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-12T22:02:15.967Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-7",
        "type": "VEHICLE",
        "value": "KA-17-XX-4884"
      }
    ]
  },
  {
    "id": "EV-12",
    "caseId": "CR-MYS-25-0012",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-15T15:46:28.658Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-12",
        "type": "VEHICLE",
        "value": "KA-41-XX-2283"
      }
    ]
  },
  {
    "id": "EV-14",
    "caseId": "CR-MNG-25-0014",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-10T22:33:10.245Z",
    "entitiesExtracted": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "EV-16",
    "caseId": "CR-MNG-25-0016",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-18T18:10:09.853Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-16",
        "type": "VEHICLE",
        "value": "KA-56-XX-4213"
      }
    ]
  },
  {
    "id": "EV-18",
    "caseId": "CR-MNG-25-0018",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-17T14:47:13.335Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-18",
        "type": "VEHICLE",
        "value": "KA-32-XX-4312"
      }
    ]
  },
  {
    "id": "EV-19",
    "caseId": "CR-MNG-25-0019",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-10T10:56:52.283Z",
    "entitiesExtracted": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "EV-22",
    "caseId": "CR-HUB-25-0022",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-18T16:57:01.522Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-02",
        "type": "VEHICLE",
        "value": "KA-05-XY-7777"
      }
    ]
  },
  {
    "id": "EV-24",
    "caseId": "CR-HUB-25-0024",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-12T04:38:37.324Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-24",
        "type": "VEHICLE",
        "value": "KA-44-XX-3118"
      }
    ]
  },
  {
    "id": "EV-26",
    "caseId": "CR-HUB-25-0026",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-12T10:15:19.007Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-26",
        "type": "VEHICLE",
        "value": "KA-28-XX-7880"
      }
    ]
  },
  {
    "id": "EV-27",
    "caseId": "CR-HUB-25-0027",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-15T22:55:08.123Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-27",
        "type": "VEHICLE",
        "value": "KA-11-XX-6694"
      }
    ]
  },
  {
    "id": "EV-28",
    "caseId": "CR-HUB-25-0028",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-10T18:44:48.888Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-28",
        "type": "VEHICLE",
        "value": "KA-04-XX-5330"
      }
    ]
  },
  {
    "id": "EV-32",
    "caseId": "CR-BEL-25-0032",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-14T09:36:08.394Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-32",
        "type": "VEHICLE",
        "value": "KA-44-XX-5524"
      }
    ]
  },
  {
    "id": "EV-33",
    "caseId": "CR-BEL-25-0033",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-17T21:53:17.903Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-33",
        "type": "VEHICLE",
        "value": "KA-16-XX-3366"
      }
    ]
  },
  {
    "id": "EV-34",
    "caseId": "CR-SHV-25-0034",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-18T09:46:09.043Z",
    "entitiesExtracted": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  },
  {
    "id": "EV-38",
    "caseId": "CR-SHV-25-0038",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-11T13:47:04.213Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-38",
        "type": "VEHICLE",
        "value": "KA-02-XX-5230"
      }
    ]
  },
  {
    "id": "EV-39",
    "caseId": "CR-SHV-25-0039",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-15T21:32:10.383Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-39",
        "type": "VEHICLE",
        "value": "KA-56-XX-8964"
      }
    ]
  },
  {
    "id": "EV-44",
    "caseId": "CR-TUM-25-0044",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-15T14:00:53.949Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-44",
        "type": "VEHICLE",
        "value": "KA-21-XX-1090"
      }
    ]
  },
  {
    "id": "EV-45",
    "caseId": "CR-TUM-25-0045",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-17T13:14:45.478Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-45",
        "type": "VEHICLE",
        "value": "KA-50-XX-4647"
      }
    ]
  },
  {
    "id": "EV-47",
    "caseId": "CR-TUM-25-0047",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-12T07:02:22.481Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-47",
        "type": "VEHICLE",
        "value": "KA-06-XX-2439"
      }
    ]
  },
  {
    "id": "EV-51",
    "caseId": "CR-BAL-25-0051",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-12T20:14:13.245Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-51",
        "type": "VEHICLE",
        "value": "KA-28-XX-6957"
      }
    ]
  },
  {
    "id": "EV-52",
    "caseId": "CR-BLR-25-0052",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-19T03:48:02.702Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-52",
        "type": "VEHICLE",
        "value": "KA-03-XX-6347"
      }
    ]
  },
  {
    "id": "EV-54",
    "caseId": "CR-BLR-25-0054",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-12T19:46:42.707Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-02",
        "type": "VEHICLE",
        "value": "KA-05-XY-7777"
      }
    ]
  },
  {
    "id": "EV-55",
    "caseId": "CR-BLR-25-0055",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-19T18:37:38.869Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-55",
        "type": "VEHICLE",
        "value": "KA-56-XX-8597"
      }
    ]
  },
  {
    "id": "EV-60",
    "caseId": "CR-BLR-25-0060",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-18T18:55:25.591Z",
    "entitiesExtracted": [
      {
        "id": "ENT-P-02",
        "type": "PHONE",
        "value": "+91-9999988888"
      }
    ]
  },
  {
    "id": "EV-61",
    "caseId": "CR-BLR-25-0061",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-18T19:25:01.844Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-61",
        "type": "VEHICLE",
        "value": "KA-34-XX-9233"
      }
    ]
  },
  {
    "id": "EV-62",
    "caseId": "CR-BLR-25-0062",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-10T22:59:00.053Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-62",
        "type": "VEHICLE",
        "value": "KA-31-XX-6042"
      }
    ]
  },
  {
    "id": "EV-65",
    "caseId": "CR-UUD-25-0065",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-13T01:18:44.791Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-65",
        "type": "VEHICLE",
        "value": "KA-39-XX-6768"
      }
    ]
  },
  {
    "id": "EV-66",
    "caseId": "CR-UUD-25-0066",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-18T21:30:28.699Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-66",
        "type": "VEHICLE",
        "value": "KA-38-XX-4856"
      }
    ]
  },
  {
    "id": "EV-68",
    "caseId": "CR-GLB-25-0068",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-15T17:59:32.867Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-68",
        "type": "VEHICLE",
        "value": "KA-31-XX-5319"
      }
    ]
  },
  {
    "id": "EV-70",
    "caseId": "CR-GLB-25-0070",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "DOCUMENT",
    "uploadedAt": "2026-08-11T12:59:57.271Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-70",
        "type": "VEHICLE",
        "value": "KA-57-XX-1207"
      }
    ]
  },
  {
    "id": "EV-72",
    "caseId": "CR-GLB-25-0072",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-19T06:25:07.739Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-72",
        "type": "VEHICLE",
        "value": "KA-22-XX-8830"
      }
    ]
  },
  {
    "id": "EV-73",
    "caseId": "CR-GLB-25-0073",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-15T16:13:21.498Z",
    "entitiesExtracted": [
      {
        "id": "ENT-V-73",
        "type": "VEHICLE",
        "value": "KA-04-XX-9841"
      }
    ]
  },
  {
    "id": "EV-74",
    "caseId": "CR-GLB-25-0074",
    "description": "Collected during preliminary sweep. Initial tagging done.",
    "type": "VIDEO",
    "uploadedAt": "2026-08-16T18:41:32.924Z",
    "entitiesExtracted": [
      {
        "id": "ENT-P-01",
        "type": "PHONE",
        "value": "+91-9876543210"
      }
    ]
  }
];
const alerts: IntelligenceAlert[] = [
  {
    "id": "ALT-001",
    "type": "CROSS_STATION_MATCH",
    "message": "Cross-station relationship detected. Vehicle KA-01-AB-1234 matched between Burglary and Armed Heist.",
    "relatedCaseId": "CR-BLR-25-0001",
    "targetCaseId": "CR-KOR-25-0981",
    "targetStationId": "KSP-BLR-KOR",
    "isRead": false,
    "createdAt": "2026-08-20T09:34:58.374Z"
  }
];

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
