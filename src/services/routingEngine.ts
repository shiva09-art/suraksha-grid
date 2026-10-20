import { GraphNode, GraphEdge, RouteResult, Shelter } from '../types';
import { isPointInPolygon } from './roadGraph';

export function calculateEvacuationRoute(
  startNodeId: string,
  targetShelterId: string | null, // null = auto find nearest open shelter
  nodes: GraphNode[],
  edges: GraphEdge[],
  blockedEdgeIds: Set<string>,
  waterLevelMeters: number,
  floodPolygon: [number, number][],
  shelters: Shelter[]
): RouteResult | null {
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Build adjacency list
  // Graph is undirected for road travel
  const adj = new Map<string, { neighbor: string; edge: GraphEdge; weight: number }[]>();
  nodes.forEach(n => adj.set(n.id, []));

  edges.forEach(edge => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;

    // Check if edge is explicitly blocked
    const isManuallyBlocked = blockedEdgeIds.has(edge.id) || !!edge.isBlocked;

    // Check if edge is flooded
    // Calculate midpoint
    const midPoint: [number, number] = [
      (fromNode.latitude + toNode.latitude) / 2,
      (fromNode.longitude + toNode.longitude) / 2
    ];
    
    // Low elevation roads along river get flooded when water level rises above threshold
    const avgElevation = (fromNode.elevation + toNode.elevation) / 2;
    const isMidInFloodPoly = isPointInPolygon(midPoint, floodPolygon);
    
    // If water level exceeds threshold and road is in flood poly, it's flooded
    // Note: EDGE_CITIZEN_EAST is the elevated causeway designed specifically for flood evacuation
    const isFlooded = isMidInFloodPoly && 
      (avgElevation < (315 + waterLevelMeters * 3)) && 
      (edge.id !== 'EDGE_CITIZEN_EAST');

    if (isManuallyBlocked || isFlooded) {
      // Impassable edge, skip adding to traversable graph
      return;
    }

    // Weight is physical distance in km
    adj.get(edge.from)?.push({ neighbor: edge.to, edge, weight: edge.distanceKm });
    adj.get(edge.to)?.push({ neighbor: edge.from, edge, weight: edge.distanceKm });
  });

  // Target candidate shelter nodes
  const candidateShelterNodeIds: string[] = [];
  if (targetShelterId) {
    const sNode = nodes.find(n => n.shelterId === targetShelterId);
    if (sNode) candidateShelterNodeIds.push(sNode.id);
  } else {
    // All open shelters
    shelters.filter(s => s.status !== 'FULL').forEach(s => {
      const sNode = nodes.find(n => n.shelterId === s.id);
      if (sNode) candidateShelterNodeIds.push(sNode.id);
    });
  }

  if (candidateShelterNodeIds.length === 0) {
    return null;
  }

  // Dijkstra Algorithm
  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; edge: GraphEdge }>();
  const unvisited = new Set<string>();

  nodes.forEach(n => {
    distances.set(n.id, Infinity);
    unvisited.add(n.id);
  });

  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Find node with smallest distance
    let current: string | null = null;
    let smallestDist = Infinity;
    for (const nodeId of unvisited) {
      const d = distances.get(nodeId)!;
      if (d < smallestDist) {
        smallestDist = d;
        current = nodeId;
      }
    }

    if (!current || smallestDist === Infinity) {
      break; // Remaining nodes are unreachable
    }

    unvisited.delete(current);

    // Stop early if we reached one of the candidate shelters and all remaining are greater
    const neighbors = adj.get(current) || [];
    for (const { neighbor, edge, weight } of neighbors) {
      if (!unvisited.has(neighbor)) continue;

      const alt = smallestDist + weight;
      if (alt < distances.get(neighbor)!) {
        distances.set(neighbor, alt);
        previous.set(neighbor, { nodeId: current, edge });
      }
    }
  }

  // Find the reachable candidate shelter with lowest distance
  let bestShelterNodeId: string | null = null;
  let minShelterDist = Infinity;

  for (const sId of candidateShelterNodeIds) {
    const d = distances.get(sId)!;
    if (d < minShelterDist) {
      minShelterDist = d;
      bestShelterNodeId = sId;
    }
  }

  if (!bestShelterNodeId || minShelterDist === Infinity) {
    // No route available due to total blockage
    return null;
  }

  // Reconstruct path
  const pathNodeIds: string[] = [];
  const pathEdges: GraphEdge[] = [];
  let curr: string | null = bestShelterNodeId;

  while (curr) {
    pathNodeIds.unshift(curr);
    const prevInfo = previous.get(curr);
    if (prevInfo) {
      pathEdges.unshift(prevInfo.edge);
      curr = prevInfo.nodeId;
    } else {
      curr = null;
    }
  }

  const coordinates: [number, number][] = pathNodeIds.map(nid => {
    const n = nodeMap.get(nid)!;
    return [n.latitude, n.longitude];
  });

  const totalDistanceKm = parseFloat(minShelterDist.toFixed(2));
  // Est speed: 20 km/h in disaster conditions + 1 min safety buffer per waypoint
  const estimatedMinutes = Math.max(3, Math.round((totalDistanceKm / 20) * 60 + pathNodeIds.length * 0.8));

  // Turn-by-turn step instructions
  const stepInstructions: string[] = [];
  stepInstructions.push(`Depart from ${nodeMap.get(startNodeId)?.name || 'Citizen Location'} inside hazard boundary.`);
  
  for (let i = 0; i < pathEdges.length; i++) {
    const edge = pathEdges[i];
    const targetNode = nodeMap.get(pathNodeIds[i + 1]);
    const bridgeNote = edge.isBridge ? ' [RIVER CROSSING BRIDGE]' : '';
    stepInstructions.push(
      `Take ${edge.name}${bridgeNote} toward ${targetNode?.name} (${edge.distanceKm} km)`
    );
  }
  
  const destinationNode = nodeMap.get(bestShelterNodeId);
  const destShelter = shelters.find(s => s.id === destinationNode?.shelterId);
  stepInstructions.push(
    `Arrive at safe elevation zone: ${destShelter?.name || destinationNode?.name} (Elev: ${destShelter?.elevationMeters}m).`
  );

  const avoidedBridge = blockedEdgeIds.has('EDGE_RIVERSIDE_BRIDGE');
  const isAlternative = avoidedBridge || totalDistanceKm > 4.5;

  return {
    pathNodeIds,
    coordinates,
    totalDistanceKm,
    estimatedMinutes,
    stepInstructions,
    isAlternative,
    avoidedBridge,
    avoidedFlood: waterLevelMeters > 2.0
  };
}
