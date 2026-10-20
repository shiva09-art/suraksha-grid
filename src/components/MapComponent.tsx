import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  GraphNode, 
  GraphEdge, 
  RouteResult, 
  Shelter 
} from '../types';
import { CITIZEN_START_COORDS } from '../services/roadGraph';

interface MapComponentProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  shelters: Shelter[];
  floodPolygon: [number, number][];
  waterLevelMeters: number;
  blockedEdgeIds: Set<string>;
  onToggleBlockEdge: (edgeId: string) => void;
  routeResult: RouteResult | null;
  selectedShelterId: string | null;
  onSelectShelter: (shelterId: string | null) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  nodes,
  edges,
  shelters,
  floodPolygon,
  waterLevelMeters,
  blockedEdgeIds,
  onToggleBlockEdge,
  routeResult,
  selectedShelterId,
  onSelectShelter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups for dynamic updating
  const floodLayerRef = useRef<L.Polygon | null>(null);
  const edgesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center over river basin around [30.1500, 78.3080]
    const map = L.map(mapContainerRef.current, {
      center: [30.1500, 78.3080],
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      zoomControl: true
    });

    // High performance OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | SURAKSHA Grid Simulation',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create Layer Groups
    edgesLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Flood Polygon
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (floodLayerRef.current) {
      floodLayerRef.current.remove();
    }

    const floodPoly = L.polygon(floodPolygon, {
      color: '#0284c7',
      fillColor: '#38bdf8',
      fillOpacity: 0.42,
      weight: 2,
      dashArray: '6, 6'
    }).addTo(map);

    floodPoly.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
        <strong style="color: #0369a1;">🌊 Simulated Flood Hazard Plain</strong><br/>
        Surge Depth: <strong>${waterLevelMeters.toFixed(1)} m</strong><br/>
        Risk Category: <span style="color: #dc2626; font-weight: bold;">EXTREME INUNDATION</span><br/>
        <small style="color: #64748b;">Synthetic SAR-derived flood mask</small>
      </div>
    `);

    floodLayerRef.current = floodPoly;
  }, [floodPolygon, waterLevelMeters]);

  // Update Road Edges & Bridges
  useEffect(() => {
    const group = edgesLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    const nodeMap = new Map<string, GraphNode>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    edges.forEach(edge => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) return;

      const isBlocked = blockedEdgeIds.has(edge.id) || !!edge.isBlocked;
      const isBridge = !!edge.isBridge;

      const coords: [number, number][] = [
        [fromNode.latitude, fromNode.longitude],
        [toNode.latitude, toNode.longitude]
      ];

      let color = '#94a3b8';
      let weight = 3;
      let dashArray: string | undefined = undefined;

      if (isBridge) {
        if (isBlocked) {
          color = '#ef4444';
          weight = 7;
          dashArray = '8, 6';
        } else {
          color = '#2563eb';
          weight = 6;
        }
      }

      const poly = L.polyline(coords, {
        color,
        weight,
        dashArray,
        opacity: isBlocked ? 0.95 : 0.7
      }).addTo(group);

      // Tooltip & Click-to-block
      const statusText = isBlocked ? '🛑 BLOCKED / IMPASSABLE' : '✅ OPEN';
      const bridgeNote = isBridge ? ' (Click to toggle Blockage)' : '';
      poly.bindTooltip(
        `<strong>${edge.name}</strong><br/>Status: ${statusText}${bridgeNote}`,
        { sticky: true }
      );

      poly.on('click', () => {
        onToggleBlockEdge(edge.id);
      });
    });
  }, [nodes, edges, blockedEdgeIds, onToggleBlockEdge]);

  // Update Markers: Citizen & Shelters
  useEffect(() => {
    const group = markersLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    // 1. Citizen Marker (inside danger zone)
    const citizenIcon = L.divIcon({
      className: 'citizen-marker-wrapper',
      html: `
        <div style="position: relative; width: 36px; height: 36px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 28px; height: 28px; border-radius: 50%; background: #dc2626; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);">
            <span style="color: white; font-size: 14px; font-weight: bold;">👤</span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const citizenMarker = L.marker(CITIZEN_START_COORDS, { icon: citizenIcon }).addTo(group);
    citizenMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 13px; color: #0f172a; min-width: 200px;">
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 4px 8px; margin-bottom: 6px; border-radius: 2px;">
          <strong style="color: #991b1b;">⚠️ Citizen In Danger Zone</strong>
        </div>
        <strong>Location:</strong> Ghat Enclave Lowland<br/>
        <strong>Coordinates:</strong> 30.1415°N, 78.2930°E<br/>
        <strong>Local Elevation:</strong> 310 m<br/>
        <strong>Risk Status:</strong> Imminent flooding from river surge.<br/>
        <div style="margin-top: 6px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
          Evacuate immediately to designated high-ground shelter.
        </div>
      </div>
    `);

    // 2. Shelter Markers
    shelters.forEach(s => {
      const isSelected = selectedShelterId === s.id;
      const isNearFull = s.status === 'NEAR_CAPACITY';
      const isFull = s.status === 'FULL';

      const bgCol = isFull ? '#ef4444' : isNearFull ? '#f59e0b' : '#10b981';
      const pct = Math.round((s.occupancy / s.capacity) * 100);

      const shelterIcon = L.divIcon({
        className: 'shelter-marker-wrapper',
        html: `
          <div style="position: relative; width: 34px; height: 34px; cursor: pointer;">
            ${isSelected ? '<div style="position: absolute; inset: -4px; border-radius: 50%; border: 3px solid #3b82f6; animation: pulse 2s infinite;"></div>' : ''}
            <div style="width: 34px; height: 34px; border-radius: 8px; background: ${bgCol}; border: 2px solid #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);">
              <span style="color: white; font-size: 14px;">🏕️</span>
              <span style="color: white; font-size: 9px; font-weight: 800; font-family: monospace; line-height: 1;">${pct}%</span>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const sMarker = L.marker([s.latitude, s.longitude], { icon: shelterIcon }).addTo(group);
      
      sMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 220px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1e293b;">${s.name}</h4>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Status:</span>
            <strong style="color: ${bgCol};">${s.status}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Capacity:</span>
            <strong>${s.occupancy} / ${s.capacity} (${pct}%)</strong>
          </div>
          <div style="background: #e2e8f0; border-radius: 9999px; height: 6px; overflow: hidden; margin-bottom: 6px;">
            <div style="background: ${bgCol}; width: ${pct}%; height: 100%;"></div>
          </div>
          <div style="font-size: 11px; color: #475569;">
            Elev: <strong>${s.elevationMeters}m</strong> | Supplies: <strong>${s.supplies}</strong><br/>
            Contact: <strong>${s.contactNumber}</strong>
          </div>
        </div>
      `);

      sMarker.on('click', () => {
        onSelectShelter(s.id);
      });
    });

  }, [shelters, selectedShelterId, onSelectShelter]);

  // Update Evacuation Route Polyline
  useEffect(() => {
    const group = routeLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    if (!routeResult || routeResult.coordinates.length < 2) return;

    const isAlt = routeResult.isAlternative;
    const routeColor = isAlt ? '#f59e0b' : '#10b981'; // Amber for alternative, Emerald for primary
    const haloColor = isAlt ? '#b45309' : '#047857';

    // 1. Glow Halo
    L.polyline(routeResult.coordinates, {
      color: haloColor,
      weight: 9,
      opacity: 0.5
    }).addTo(group);

    // 2. Main route path
    const routePoly = L.polyline(routeResult.coordinates, {
      color: routeColor,
      weight: 5,
      opacity: 0.95,
      dashArray: isAlt ? '10, 8' : undefined
    }).addTo(group);

    routePoly.bindPopup(`
      <div style="font-family: sans-serif; font-size: 13px; color: #0f172a;">
        <strong style="color: ${routeColor}; font-size: 14px;">
          ${isAlt ? '⚡ ALTERNATIVE BYPASS ROUTE' : '🛡️ RECOMMENDED EVACUATION ROUTE'}
        </strong><br/>
        Distance: <strong>${routeResult.totalDistanceKm} km</strong><br/>
        Est. Transit Time: <strong>~${routeResult.estimatedMinutes} mins</strong><br/>
        ${routeResult.avoidedBridge ? '<span style="color: #dc2626; font-size: 11px; font-weight: bold;">Avoided Blocked North Riverside Bridge!</span>' : ''}
      </div>
    `);

    // Add waypoint dot markers
    routeResult.coordinates.forEach((coord, idx) => {
      if (idx === 0 || idx === routeResult.coordinates.length - 1) return;
      L.circleMarker(coord, {
        radius: 4,
        color: '#ffffff',
        fillColor: routeColor,
        fillOpacity: 1,
        weight: 2
      }).addTo(group);
    });

  }, [routeResult]);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Map Target Div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Interactive Floating Map Legend (Requirement 1) */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 shadow-xl max-w-[270px] pointer-events-auto">
        <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-1.5 mb-2 text-white">
          <span className="flex items-center gap-1.5 text-xs">
            🗺️ Tactical Map Legend
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            OSM Grid
          </span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-600 border border-white flex items-center justify-center text-[10px]">👤</span>
            <span>Citizen in Hazard Zone (GPS Fix)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-600 border border-white flex items-center justify-center text-[9px]">🏕️</span>
            <span>Evacuation Shelters (Capacity %)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-3 rounded bg-sky-400/50 border border-sky-400 border-dashed"></span>
            <span>Simulated Flood Zone (Depth: {waterLevelMeters.toFixed(1)}m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded bg-blue-600"></span>
            <span>Riverside Bridge (Click to Block)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded bg-red-500 border border-red-300 border-dashed"></span>
            <span>Blocked Bridge / Washout Hazard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded bg-emerald-500 shadow-sm shadow-emerald-500"></span>
            <span>Primary Safe Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded bg-amber-500 border border-amber-300 border-dashed"></span>
            <span>Alternative Bypass Route</span>
          </div>
        </div>
      </div>

      {/* Floating Bridge Blockage Quick Status Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        {blockedEdgeIds.has('EDGE_RIVERSIDE_BRIDGE') ? (
          <div className="bg-red-950/90 border border-red-600/80 text-red-200 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>BRIDGE BLOCKED: Rerouting via South Bypass</span>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Riverside Bridge Open (Click to simulate blockage)</span>
          </div>
        )}
      </div>

    </div>
  );
};
