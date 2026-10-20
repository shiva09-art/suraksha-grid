import Dexie, { type EntityTable } from 'dexie';
import { SOSReport } from '../types';

export const db = new Dexie('SurakshaGridDatabase') as Dexie & {
  sosReports: EntityTable<SOSReport, 'id'>;
};

db.version(1).stores({
  sosReports: 'id, timestamp, urgency, status, syncMethod'
});

export const INITIAL_SEED_INCIDENTS: SOSReport[] = [
  {
    id: 'SOS-2026-081',
    timestamp: '10:14 AM',
    isoTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    latitude: 30.1442,
    longitude: 78.2915,
    address: 'Sector 4, Ghat Road Lowland',
    urgency: 'CRITICAL',
    peopleCount: 4,
    medicalNeeds: true,
    specialNotes: 'Elderly patient with oxygen cylinder; ground floor flooded up to 1.8m.',
    status: 'SYNCED',
    assignedShelter: 'Hilltop Community Relief Center',
    assignedTeam: 'NDRF Quick Response Team 1',
    syncMethod: 'SATELLITE_BURST_SIM',
    syncTimestamp: '10:18 AM',
    waterDepthMeters: 2.1
  },
  {
    id: 'SOS-2026-082',
    timestamp: '11:05 AM',
    isoTime: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    latitude: 30.1485,
    longitude: 78.2990,
    address: 'Old Bridge Colony, Near Sluice Gate',
    urgency: 'HIGH',
    peopleCount: 6,
    medicalNeeds: false,
    specialNotes: 'Family trapped on terrace; power lines submerged nearby.',
    status: 'DISPATCHED',
    assignedShelter: 'District Sports Arena Shelter',
    assignedTeam: 'SDRF Water Rescue Unit 4',
    syncMethod: 'CELLULAR',
    syncTimestamp: '11:06 AM',
    waterDepthMeters: 1.5
  },
  {
    id: 'SOS-2026-083',
    timestamp: '11:42 AM',
    isoTime: new Date(Date.now() - 1800000).toISOString(),
    latitude: 30.1380,
    longitude: 78.3050,
    address: 'Market Lane Behind Bus Depot',
    urgency: 'MODERATE',
    peopleCount: 2,
    medicalNeeds: false,
    specialNotes: 'Shopkeepers stranded on mezzanine floor; drinking water exhausted.',
    status: 'SYNCED',
    assignedShelter: 'Hilltop Community Relief Center',
    assignedTeam: 'Unassigned',
    syncMethod: 'SATELLITE_BURST_SIM',
    syncTimestamp: '11:46 AM',
    waterDepthMeters: 0.9
  }
];

export async function initializeDatabase() {
  const count = await db.sosReports.count();
  if (count === 0) {
    await db.sosReports.bulkAdd(INITIAL_SEED_INCIDENTS);
  }
}
