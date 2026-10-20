import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HonestyBanner } from './components/HonestyBanner';
import { MapComponent } from './components/MapComponent';
import { EvacuationControls } from './components/EvacuationControls';
import { RouteDetailsPanel } from './components/RouteDetailsPanel';
import { EmergencyDashboard } from './components/EmergencyDashboard';
import { OfflineSosModal } from './components/OfflineSosModal';
import { SatelliteSyncModal } from './components/SatelliteSyncModal';
import { RepoResearchModal } from './components/RepoResearchModal';
import { GuidedTourBanner } from './components/GuidedTourBanner';
import { 
  SHELTERS, 
  INITIAL_GRAPH_NODES, 
  INITIAL_GRAPH_EDGES, 
  calculateFloodPolygon, 
  CITIZEN_START_COORDS 
} from './services/roadGraph';
import { calculateEvacuationRoute } from './services/routingEngine';
import { db, initializeDatabase } from './services/db';
import { SOSReport, RouteResult } from './types';

export function App() {
  // Navigation & View
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard'>('map');

  // Simulation Parameters
  const [waterLevelMeters, setWaterLevelMeters] = useState<number>(2.2);
  const [blockedEdgeIds, setBlockedEdgeIds] = useState<Set<string>>(new Set());
  const [isNetworkOutage, setIsNetworkOutage] = useState<boolean>(false);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);

  // Routing State
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  // Database / Incidents State
  const [incidents, setIncidents] = useState<SOSReport[]>([]);

  // Modals
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isSatSyncModalOpen, setIsSatSyncModalOpen] = useState<boolean>(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);

  // Guided Tour State
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);
  const [isTourAutoPlaying, setIsTourAutoPlaying] = useState<boolean>(false);

  // Calculate dynamic flood polygon
  const floodPolygon = useMemo(() => {
    return calculateFloodPolygon(waterLevelMeters);
  }, [waterLevelMeters]);

  // Load and refresh Dexie Database
  const refreshIncidents = useCallback(async () => {
    try {
      const all = await db.sosReports.toArray();
      setIncidents(all);
    } catch (e) {
      console.error('Error loading incidents from Dexie:', e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await initializeDatabase();
      await refreshIncidents();
    })();
  }, [refreshIncidents]);

  // Queued offline reports
  const queuedOfflineReports = useMemo(() => {
    return incidents.filter(i => i.status === 'QUEUED_OFFLINE');
  }, [incidents]);

  // Handle Route Calculation
  const handleCalculateRoute = useCallback(() => {
    const res = calculateEvacuationRoute(
      'NODE_CITIZEN',
      selectedShelterId,
      INITIAL_GRAPH_NODES,
      INITIAL_GRAPH_EDGES,
      blockedEdgeIds,
      waterLevelMeters,
      floodPolygon,
      SHELTERS
    );
    setRouteResult(res);
  }, [selectedShelterId, blockedEdgeIds, waterLevelMeters, floodPolygon]);

  // Automatically calculate and update route initially and on any parameter change
  useEffect(() => {
    handleCalculateRoute();
  }, [handleCalculateRoute]);

  // Toggle Bridge Blockage (North Riverside Bridge)
  const handleToggleBridgeBlock = useCallback(() => {
    setBlockedEdgeIds(prev => {
      const next = new Set(prev);
      if (next.has('EDGE_RIVERSIDE_BRIDGE')) {
        next.delete('EDGE_RIVERSIDE_BRIDGE');
      } else {
        next.add('EDGE_RIVERSIDE_BRIDGE');
      }
      return next;
    });
  }, []);

  // Toggle any specific edge
  const handleToggleEdgeBlockById = useCallback((edgeId: string) => {
    setBlockedEdgeIds(prev => {
      const next = new Set(prev);
      if (next.has(edgeId)) {
        next.delete(edgeId);
      } else {
        next.add(edgeId);
      }
      return next;
    });
  }, []);

  // Guided Tour Step Driver (Drives steps 1-10 seamlessly)
  const handleTourStepChange = useCallback(async (step: number) => {
    setTourStep(step);

    switch (step) {
      case 1:
        // Step 1: Open SURAKSHA Grid map with legend
        setActiveTab('map');
        setWaterLevelMeters(1.2);
        setBlockedEdgeIds(new Set());
        setRouteResult(null);
        setIsNetworkOutage(false);
        break;

      case 2:
        // Step 2: Flood surge level expands flood polygon
        setActiveTab('map');
        setWaterLevelMeters(3.2);
        break;

      case 3:
        // Step 3: Person (GPS marker) inside danger zone highlighted
        setActiveTab('map');
        // GPS marker is visible at [30.1415, 78.2930] in danger zone
        break;

      case 4:
        // Step 4: Generate evacuation route to nearest open shelter avoiding flooded roads
        setActiveTab('map');
        setBlockedEdgeIds(new Set());
        {
          const r = calculateEvacuationRoute(
            'NODE_CITIZEN',
            null,
            INITIAL_GRAPH_NODES,
            INITIAL_GRAPH_EDGES,
            new Set(),
            3.2,
            calculateFloodPolygon(3.2),
            SHELTERS
          );
          setRouteResult(r);
        }
        break;

      case 5:
        // Step 5: Mark bridge as blocked
        setActiveTab('map');
        setBlockedEdgeIds(new Set(['EDGE_RIVERSIDE_BRIDGE']));
        break;

      case 6:
        // Step 6: Alternative route calculated avoiding blocked bridge with length & steps
        setActiveTab('map');
        setBlockedEdgeIds(new Set(['EDGE_RIVERSIDE_BRIDGE']));
        {
          const altRoute = calculateEvacuationRoute(
            'NODE_CITIZEN',
            null,
            INITIAL_GRAPH_NODES,
            INITIAL_GRAPH_EDGES,
            new Set(['EDGE_RIVERSIDE_BRIDGE']),
            3.2,
            calculateFloodPolygon(3.2),
            SHELTERS
          );
          setRouteResult(altRoute);
        }
        break;

      case 7:
        // Step 7: Toggle network outage
        setIsNetworkOutage(true);
        break;

      case 8:
        // Step 8: Submit SOS while offline -> stored locally in IndexedDB with GPS fix and timestamp
        setIsNetworkOutage(true);
        {
          const now = new Date();
          const offlineReport: SOSReport = {
            id: 'SOS-2026-909',
            timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isoTime: now.toISOString(),
            latitude: CITIZEN_START_COORDS[0],
            longitude: CITIZEN_START_COORDS[1],
            address: 'Ghat Enclave Lowland (Guided Demo)',
            urgency: 'CRITICAL',
            peopleCount: 4,
            medicalNeeds: true,
            specialNotes: 'Trapped by expanding flood surge; local bridge impassable. Offline queueing verified.',
            status: 'QUEUED_OFFLINE',
            assignedShelter: 'Hilltop Community Relief Center',
            assignedTeam: 'Unassigned',
            syncMethod: 'OFFLINE_LOCAL',
            waterDepthMeters: 2.4
          };
          await db.sosReports.put(offlineReport);
          await refreshIncidents();
        }
        break;

      case 9:
        // Step 9: Satellite Sync -> triggers satellite burst simulation modal
        setIsSatSyncModalOpen(true);
        break;

      case 10:
        // Step 10: Central Emergency Dashboard showing prioritized incidents, shelter capacities & team assignment
        setIsSatSyncModalOpen(false);
        setActiveTab('dashboard');
        await refreshIncidents();
        break;

      default:
        break;
    }
  }, [refreshIncidents]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Mandatory Visible Honesty Banner on Every Screen */}
      <HonestyBanner />

      {/* 2. Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isNetworkOutage={isNetworkOutage}
        setIsNetworkOutage={setIsNetworkOutage}
        queuedOfflineCount={queuedOfflineReports.length}
        onOpenSatelliteSync={() => setIsSatSyncModalOpen(true)}
        onStartGuidedTour={() => {
          setIsTourActive(true);
          handleTourStepChange(1);
        }}
        onOpenResearchModal={() => setIsResearchModalOpen(true)}
        isTourActive={isTourActive}
      />

      {/* 3. Presenter Guided Tour Controller (if active) */}
      {isTourActive && (
        <GuidedTourBanner
          currentStep={tourStep}
          onSetStep={handleTourStepChange}
          onCloseTour={() => {
            setIsTourActive(false);
            setIsTourAutoPlaying(false);
          }}
          isAutoPlaying={isTourAutoPlaying}
          setIsAutoPlaying={setIsTourAutoPlaying}
        />
      )}

      {/* 4. Main Application Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5">
        
        {activeTab === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left 8 Cols: Map View */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <MapComponent
                nodes={INITIAL_GRAPH_NODES}
                edges={INITIAL_GRAPH_EDGES}
                shelters={SHELTERS}
                floodPolygon={floodPolygon}
                waterLevelMeters={waterLevelMeters}
                blockedEdgeIds={blockedEdgeIds}
                onToggleBlockEdge={handleToggleEdgeBlockById}
                routeResult={routeResult}
                selectedShelterId={selectedShelterId}
                onSelectShelter={setSelectedShelterId}
              />

              {/* Turn-by-Turn Route Details Panel below Map on Large screens */}
              <RouteDetailsPanel
                routeResult={routeResult}
                isBridgeBlocked={blockedEdgeIds.has('EDGE_RIVERSIDE_BRIDGE')}
              />
            </div>

            {/* Right 4 Cols: Interactive Controls */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <EvacuationControls
                waterLevelMeters={waterLevelMeters}
                setWaterLevelMeters={setWaterLevelMeters}
                isBridgeBlocked={blockedEdgeIds.has('EDGE_RIVERSIDE_BRIDGE')}
                onToggleBridgeBlock={handleToggleBridgeBlock}
                onGenerateRoute={handleCalculateRoute}
                onOpenSOSModal={() => setIsSOSModalOpen(true)}
                shelters={SHELTERS}
                selectedShelterId={selectedShelterId}
                setSelectedShelterId={setSelectedShelterId}
                isNetworkOutage={isNetworkOutage}
              />

              {/* Reusable Code Provenance Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 shadow-md">
                <div className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
                  <span>Open-Source Provenance</span>
                  <button 
                    onClick={() => setIsResearchModalOpen(true)}
                    className="text-cyan-400 hover:underline text-[11px] font-mono"
                  >
                    View All 23 Repos &rarr;
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <p>
                    &bull; <strong className="text-slate-200">Routing & Floods:</strong> Reused concepts from <span className="text-blue-400 font-mono">AntonikaS/floodradar-drypath-map</span> (OSRM & SAR extents).
                  </p>
                  <p>
                    &bull; <strong className="text-slate-200">Offline Queue:</strong> Local IndexedDB persistence via <span className="text-cyan-400 font-mono">rescue-ai / Dexie.js</span>.
                  </p>
                  <p>
                    &bull; <strong className="text-slate-200">EOC Dashboard:</strong> React admin triage architecture adapted from <span className="text-purple-400 font-mono">Soundcreates/Ceal</span>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <EmergencyDashboard
            incidents={incidents}
            shelters={SHELTERS}
            onRefreshData={refreshIncidents}
          />
        )}

      </main>

      {/* 5. Modals */}
      <OfflineSosModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        isNetworkOutage={isNetworkOutage}
        onSosSubmitted={refreshIncidents}
      />

      <SatelliteSyncModal
        isOpen={isSatSyncModalOpen}
        onClose={() => setIsSatSyncModalOpen(false)}
        queuedReports={queuedOfflineReports}
        onSyncCompleted={refreshIncidents}
      />

      <RepoResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-3 px-4 text-center text-xs text-slate-500 font-mono">
        SURAKSHA Grid &bull; Hackathon Demo &bull; Built with React, Vite, Leaflet & Dexie.js &bull; Strictly Simulated Feeds
      </footer>

    </div>
  );
}

export default App;
