export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE';

export type IncidentStatus = 
  | 'QUEUED_OFFLINE' 
  | 'SYNCING_SATELLITE' 
  | 'SYNCED' 
  | 'DISPATCHED' 
  | 'RESCUED';

export type SyncMethod = 
  | 'OFFLINE_LOCAL' 
  | 'SATELLITE_BURST_SIM' 
  | 'CELLULAR';

export interface SOSReport {
  id: string;
  timestamp: string;
  isoTime: string;
  latitude: number;
  longitude: number;
  address: string;
  urgency: UrgencyLevel;
  peopleCount: number;
  medicalNeeds: boolean;
  specialNotes: string;
  status: IncidentStatus;
  assignedShelter: string;
  assignedTeam: string;
  syncMethod: SyncMethod;
  syncTimestamp?: string;
  waterDepthMeters?: number;
}

export interface Shelter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupancy: number;
  status: 'OPEN' | 'NEAR_CAPACITY' | 'FULL';
  supplies: 'OPTIMAL' | 'MODERATE' | 'LOW';
  elevationMeters: number;
  contactNumber: string;
}

export interface GraphNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  isShelter?: boolean;
  shelterId?: string;
  isCitizenStart?: boolean;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  name: string;
  isBridge?: boolean;
  isBlocked?: boolean;
  blockageReason?: string;
  inFloodZone?: boolean;
}

export interface RouteResult {
  pathNodeIds: string[];
  coordinates: [number, number][];
  totalDistanceKm: number;
  estimatedMinutes: number;
  stepInstructions: string[];
  isAlternative: boolean;
  avoidedBridge: boolean;
  avoidedFlood: boolean;
}

export interface FloodZoneDefinition {
  center: [number, number];
  baseRadiusMeters: number;
  polygonPoints: [number, number][];
  waterLevelMeters: number;
  dangerRadiusKm: number;
}
