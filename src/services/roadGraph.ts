import { GraphNode, GraphEdge, Shelter, FloodZoneDefinition } from '../types';

export const SHELTERS: Shelter[] = [
  {
    id: 'SHELTER_HILLTOP',
    name: 'Hilltop Community Relief Center',
    latitude: 30.1620,
    longitude: 78.3240,
    capacity: 150,
    occupancy: 88,
    status: 'OPEN',
    supplies: 'OPTIMAL',
    elevationMeters: 420,
    contactNumber: '+91-135-243-9001'
  },
  {
    id: 'SHELTER_ARENA',
    name: 'District Sports Arena Shelter',
    latitude: 30.1330,
    longitude: 78.3220,
    capacity: 500,
    occupancy: 340,
    status: 'OPEN',
    supplies: 'OPTIMAL',
    elevationMeters: 360,
    contactNumber: '+91-135-243-9002'
  },
  {
    id: 'SHELTER_SCHOOL',
    name: 'North Ridge High School Gym',
    latitude: 30.1650,
    longitude: 78.3010,
    capacity: 200,
    occupancy: 192,
    status: 'NEAR_CAPACITY',
    supplies: 'MODERATE',
    elevationMeters: 390,
    contactNumber: '+91-135-243-9003'
  }
];

export const CITIZEN_START_COORDS: [number, number] = [30.1415, 78.2930]; // Ghat Riverside Enclave

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  {
    id: 'NODE_CITIZEN',
    name: 'Citizen Location (Ghat Enclave)',
    latitude: 30.1415,
    longitude: 78.2930,
    elevation: 310,
    isCitizenStart: true
  },
  {
    id: 'NODE_RIVER_ROAD',
    name: 'Riverfront Boulevard South',
    latitude: 30.1455,
    longitude: 78.2952,
    elevation: 312
  },
  {
    id: 'NODE_BRIDGE_SOUTH',
    name: 'North Riverside Bridge South Toll',
    latitude: 30.1490,
    longitude: 78.2985,
    elevation: 316
  },
  {
    id: 'NODE_BRIDGE_NORTH',
    name: 'North Riverside Bridge North Landing',
    latitude: 30.1545,
    longitude: 78.3032,
    elevation: 320
  },
  {
    id: 'NODE_NORTH_HIGHWAY',
    name: 'North Trunk Road Junction',
    latitude: 30.1595,
    longitude: 78.3075,
    elevation: 340
  },
  {
    id: 'NODE_RIDGE_ROAD',
    name: 'Highland Ridge Interconnect',
    latitude: 30.1600,
    longitude: 78.3180,
    elevation: 380
  },
  {
    id: 'NODE_EAST_LANE',
    name: 'East Valley Link Road (Elevated Causeway)',
    latitude: 30.1402,
    longitude: 78.3025,
    elevation: 360
  },
  {
    id: 'NODE_SOUTH_BYPASS',
    name: 'South Elevated Bypass Overpass',
    latitude: 30.1345,
    longitude: 78.3060,
    elevation: 375
  },
  {
    id: 'NODE_VALLEY_FORK',
    name: 'Valley Parkway Overpass Junction',
    latitude: 30.1370,
    longitude: 78.3175,
    elevation: 385
  },
  {
    id: 'NODE_SHELTER_HILLTOP',
    name: 'Hilltop Community Center',
    latitude: 30.1620,
    longitude: 78.3240,
    elevation: 420,
    isShelter: true,
    shelterId: 'SHELTER_HILLTOP'
  },
  {
    id: 'NODE_SHELTER_ARENA',
    name: 'District Sports Arena',
    latitude: 30.1330,
    longitude: 78.3220,
    elevation: 360,
    isShelter: true,
    shelterId: 'SHELTER_ARENA'
  },
  {
    id: 'NODE_SHELTER_SCHOOL',
    name: 'North Ridge High School',
    latitude: 30.1650,
    longitude: 78.3010,
    elevation: 390,
    isShelter: true,
    shelterId: 'SHELTER_SCHOOL'
  }
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  // Primary riverfront path to Bridge
  {
    id: 'EDGE_CITIZEN_RIVER',
    from: 'NODE_CITIZEN',
    to: 'NODE_RIVER_ROAD',
    distanceKm: 0.52,
    name: 'Ghat Enclave Access Road'
  },
  {
    id: 'EDGE_RIVER_BRIDGE_SOUTH',
    from: 'NODE_RIVER_ROAD',
    to: 'NODE_BRIDGE_SOUTH',
    distanceKm: 0.55,
    name: 'Riverfront Boulevard'
  },
  // KEY BRIDGE THAT CAN BE BLOCKED
  {
    id: 'EDGE_RIVERSIDE_BRIDGE',
    from: 'NODE_BRIDGE_SOUTH',
    to: 'NODE_BRIDGE_NORTH',
    distanceKm: 0.78,
    name: 'North Riverside Suspension Bridge',
    isBridge: true,
    isBlocked: false,
    blockageReason: 'Critical River Crossing'
  },
  // North side connections
  {
    id: 'EDGE_BRIDGE_NORTH_HWY',
    from: 'NODE_BRIDGE_NORTH',
    to: 'NODE_NORTH_HIGHWAY',
    distanceKm: 0.65,
    name: 'North Trunk Link'
  },
  {
    id: 'EDGE_NORTH_HWY_SCHOOL',
    from: 'NODE_NORTH_HIGHWAY',
    to: 'NODE_SHELTER_SCHOOL',
    distanceKm: 0.85,
    name: 'School Approach Road'
  },
  {
    id: 'EDGE_NORTH_HWY_RIDGE',
    from: 'NODE_NORTH_HIGHWAY',
    to: 'NODE_RIDGE_ROAD',
    distanceKm: 1.10,
    name: 'Highland Ridge Ascent'
  },
  {
    id: 'EDGE_RIDGE_HILLTOP',
    from: 'NODE_RIDGE_ROAD',
    to: 'NODE_SHELTER_HILLTOP',
    distanceKm: 0.62,
    name: 'Hilltop Shelter Drive'
  },
  // Alternative Safe Highland Bypass (avoiding bridge)
  {
    id: 'EDGE_CITIZEN_EAST',
    from: 'NODE_CITIZEN',
    to: 'NODE_EAST_LANE',
    distanceKm: 0.95,
    name: 'East Valley Connector (Elevated)'
  },
  {
    id: 'EDGE_EAST_SOUTH_BYPASS',
    from: 'NODE_EAST_LANE',
    to: 'NODE_SOUTH_BYPASS',
    distanceKm: 0.75,
    name: 'South Elevated Bypass Ramp'
  },
  {
    id: 'EDGE_SOUTH_BYPASS_ARENA',
    from: 'NODE_SOUTH_BYPASS',
    to: 'NODE_SHELTER_ARENA',
    distanceKm: 1.55,
    name: 'Stadium Boulevard'
  },
  {
    id: 'EDGE_SOUTH_BYPASS_VALLEY',
    from: 'NODE_SOUTH_BYPASS',
    to: 'NODE_VALLEY_FORK',
    distanceKm: 1.15,
    name: 'Upper Valley Arterial'
  },
  {
    id: 'EDGE_VALLEY_RIDGE',
    from: 'NODE_VALLEY_FORK',
    to: 'NODE_RIDGE_ROAD',
    distanceKm: 2.50,
    name: 'East Ridge Mountain Parkway'
  },
  {
    id: 'EDGE_VALLEY_ARENA',
    from: 'NODE_VALLEY_FORK',
    to: 'NODE_SHELTER_ARENA',
    distanceKm: 0.60,
    name: 'Arena East Gate Access'
  }
];

export const BASE_FLOOD_CENTER: [number, number] = [30.1440, 78.2930];

export function calculateFloodPolygon(waterLevelMeters: number): [number, number][] {
  // Flood extent dynamically scales with water depth
  // Water level 0.5m = 400m radius; Water level 5.0m = 1400m radius along river trough
  const scale = 0.0035 + (waterLevelMeters * 0.0022);
  
  return [
    [30.1440 + scale * 1.3, 78.2930 - scale * 0.8],
    [30.1485 + scale * 1.5, 78.2960 + scale * 0.4],
    [30.1510 + scale * 1.1, 78.3005 + scale * 0.7],
    [30.1480 + scale * 0.4, 78.3040 + scale * 0.9],
    [30.1420 - scale * 0.3, 78.3030 + scale * 0.5],
    [30.1370 - scale * 0.9, 78.2990 + scale * 0.2],
    [30.1360 - scale * 1.4, 78.2940 - scale * 0.6],
    [30.1390 - scale * 0.8, 78.2905 - scale * 1.1]
  ];
}

export function isPointInPolygon(point: [number, number], vs: [number, number][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
