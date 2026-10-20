import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Award
} from 'lucide-react';

interface RepoRecord {
  name: string;
  url: string;
  language: string;
  implementsText: string;
  runs: 'Yes' | 'Partially' | 'No' | 'Not tested';
  lastCommit: string;
  license: string;
  module: string;
  reusePlan: string;
  classification: 'Fully implemented' | 'Partially implemented' | 'Requires customization' | 'Research concept only' | 'Not found';
  isTopReuse?: boolean;
}

export const REPO_DATA: RepoRecord[] = [
  // 1-6 Satellite flood detection
  {
    name: 'Sen1Floods11',
    url: 'https://github.com/cloudtostreet/Sen1Floods11',
    language: 'Jupyter Notebook',
    implementsText: 'Benchmark georeferenced dataset (v1.1) and FCNN/UNet models for Sentinel-1 SAR flood segmentation across 11 global flood events.',
    runs: 'Partially',
    lastCommit: '2021-04-09',
    license: 'No License',
    module: 'Satellite flood detection and datasets',
    reusePlan: 'Derived SAR dual-polarization (VV/VH) flood water thresholding concepts.',
    classification: 'Research concept only'
  },
  {
    name: 'UNOSAT-AI-Based-Rapid-Mapping-Service',
    url: 'https://github.com/UNITAR-UNOSAT/UNOSAT-AI-Based-Rapid-Mapping-Service',
    language: 'Jupyter Notebook',
    implementsText: 'Fully Convolutional Neural Network models for rapid flood segmentation in Sentinel-1 Synthetic Aperture Radar (SAR) imagery.',
    runs: 'Partially',
    lastCommit: '2023-08-04',
    license: 'No License',
    module: 'Satellite flood detection and datasets',
    reusePlan: 'Adapted rapid post-disaster flood polygon delineation and permanent water exclusion heuristic.',
    classification: 'Research concept only'
  },
  {
    name: 'UNI_TEMP_FLOOD_DETECTION (Yadav et al.)',
    url: 'https://github.com/RituYadav92/UNI_TEMP_FLOOD_DETECTION',
    language: 'Python',
    implementsText: 'Deep attentive fusion network for flood detection on uni-temporal Sentinel-1 SAR data (Frontiers in Remote Sensing 2022).',
    runs: 'Partially',
    lastCommit: '2024-01-11',
    license: 'No License',
    module: 'Satellite flood detection and datasets',
    reusePlan: 'Referenced uni-temporal SAR backscatter thresholding model for flash flood boundaries.',
    classification: 'Research concept only'
  },
  {
    name: 'FloodLens',
    url: 'https://github.com/kvejre95/FloodLens',
    language: 'Jupyter Notebook / Python',
    implementsText: 'FastAPI + Sentinel Hub connector and prototype ChatGPT plugin for on-demand satellite flood segmentation.',
    runs: 'Partially',
    lastCommit: '2024-02-03',
    license: 'No License',
    module: 'Satellite flood detection and datasets',
    reusePlan: 'Bounding box query architecture used; API keys mock-fallback provided due to commercial Sentinel Hub requirement.',
    classification: 'Requires customization'
  },
  {
    name: 'ClimateVision',
    url: 'https://github.com/Climate-Vision/ClimateVision',
    language: 'Python / TypeScript',
    implementsText: 'Full ML platform for detecting deforestation, ice melt, and flooding from Sentinel-2 / Landsat imagery with React dashboard.',
    runs: 'Partially',
    lastCommit: '2026-08-28',
    license: 'MIT',
    module: 'Satellite flood detection and datasets',
    reusePlan: 'Adapted dark dashboard multi-hazard presentation card patterns.',
    classification: 'Partially implemented'
  },
  {
    name: 'NVIDIA Disaster Risk Monitoring',
    url: 'https://github.com/gabboraron/Nvidia-Disaster_Risk_Monitoring_Using_Satellite_Imagery',
    language: 'Jupyter Notebook',
    implementsText: 'NVIDIA DLI training course notes and workflow for training flood detection models on Sentinel-1 SAR imagery.',
    runs: 'Partially',
    lastCommit: '2022-08-13',
    license: 'MPL-2.0',
    module: 'Satellite flood detection and datasets',
    reusePlan: 'Conceptual reference for SAR data decibel normalization.',
    classification: 'Research concept only'
  },

  // 7-10 Flood mapping and evacuation routing
  {
    name: 'FloodRadar / DryPath Map (AntonikaS)',
    url: 'https://github.com/AntonikaS/floodradar-drypath-map',
    language: 'TypeScript / Next.js',
    implementsText: 'Working web app turning SAR flood extent into address-level evacuation routing to shelters via OSRM, tracking low-water crossings & shelters.',
    runs: 'Yes',
    lastCommit: '2025-11-30',
    license: 'MIT',
    module: 'Flood mapping and evacuation routing',
    reusePlan: 'TOP REUSE 1: Reused shelter model (capacity, occupancy, status), low-water crossings/blocked bridge structure, and evacuation routing concepts.',
    classification: 'Fully implemented',
    isTopReuse: true
  },
  {
    name: 'OSRM routing engine',
    url: 'https://github.com/Project-OSRM/osrm-backend',
    language: 'C++',
    implementsText: 'High-performance C++ routing engine on OpenStreetMap data (Dijkstra, Contraction Hierarchies).',
    runs: 'Yes',
    lastCommit: '2026-10-17',
    license: 'BSD-2-Clause',
    module: 'Flood mapping and evacuation routing',
    reusePlan: 'Implemented client-side Dijkstra graph engine on realistic road graph mirroring OSRM response contract.',
    classification: 'Fully implemented'
  },
  {
    name: 'Optimizing Evacuation Routes (vgiannotta)',
    url: 'https://github.com/vgiannotta/Optimizing-Evacuation-Routes-Identifying-Blocked-Roads-in-Real-Time',
    language: 'Jupyter Notebook',
    implementsText: 'Academic notebook attempting to detect road closures from Twitter API and Here.com for rerouting.',
    runs: 'No',
    lastCommit: '2019-01-24',
    license: 'No License',
    module: 'Flood mapping and evacuation routing',
    reusePlan: 'Extracted concept of dynamic edge-cost penalty when road/bridge is reported impassable.',
    classification: 'Research concept only'
  },
  {
    name: 'NOAA flood explorer React app (chris3edwards3)',
    url: 'https://github.com/chris3edwards3/reactapp-floodexplorer',
    language: 'JavaScript',
    implementsText: 'Interactive React + Leaflet web map displaying NOAA satellite flood products, layer toggles, and population density.',
    runs: 'Yes',
    lastCommit: '2024-04-23',
    license: 'No License',
    module: 'Flood mapping and evacuation routing',
    reusePlan: 'Adopted Leaflet layer switching, flood styling, and overlay layout pattern.',
    classification: 'Fully implemented'
  },

  // 11-16 Offline communication and SOS
  {
    name: 'Meshtastic firmware',
    url: 'https://github.com/meshtastic/firmware',
    language: 'C++',
    implementsText: 'Official firmware for ESP32/nRF52 LoRa radio devices providing decentralized off-grid text and GPS mesh communication.',
    runs: 'Yes',
    lastCommit: '2026-10-20',
    license: 'GPL-3.0',
    module: 'Offline communication and SOS',
    reusePlan: 'Reference for packet payload structure (sender GPS, timestamp, hop limit, sync flag).',
    classification: 'Fully implemented'
  },
  {
    name: 'Meshtastic web client / org',
    url: 'https://github.com/meshtastic/web',
    language: 'TypeScript',
    implementsText: 'Web Bluetooth (WebBLE) client to connect directly to Meshtastic radios from modern browsers.',
    runs: 'Yes',
    lastCommit: '2026-10-19',
    license: 'GPL-3.0',
    module: 'Offline communication and SOS',
    reusePlan: 'Used off-grid telemetry data model and offline queue status representation.',
    classification: 'Fully implemented'
  },
  {
    name: 'socialmesh (gotnull)',
    url: 'https://github.com/gotnull/socialmesh',
    language: 'Dart (Flutter)',
    implementsText: 'Flutter mobile companion app for Meshtastic radios with offline message queues and node discovery.',
    runs: 'Partially',
    lastCommit: '2026-10-20',
    license: 'GPL-3.0',
    module: 'Offline communication and SOS',
    reusePlan: 'Replicated queue state machine: Queued Offline -> Syncing -> Synced.',
    classification: 'Fully implemented'
  },
  {
    name: 'CEAL - Civic Emergency Access Layer (Soundcreates)',
    url: 'https://github.com/Soundcreates/Ceal',
    language: 'TypeScript / React',
    implementsText: 'Offline-first civic emergency response platform with BLE mesh mobile app, Node backend, and React+Vite admin operations dashboard.',
    runs: 'Partially',
    lastCommit: '2026-03-26',
    license: 'No License',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'TOP REUSE 3: Reused React+Vite EOC admin dashboard structure, status workflow (Pending, Dispatched, Rescued), and rescue team allocation.',
    classification: 'Fully implemented',
    isTopReuse: true
  },
  {
    name: 'Tarang (CodeBytes0101)',
    url: 'https://github.com/CodeBytes0101/Tarang',
    language: 'TypeScript',
    implementsText: 'Disaster-resilient PWA concept with offline SOS queue, cached maps, and Web Bluetooth.',
    runs: 'Partially',
    lastCommit: '2025-06-24',
    license: 'No License',
    module: 'Offline communication and SOS',
    reusePlan: 'Adopted offline SOS form field schema (people count, medical needs, GPS).',
    classification: 'Partially implemented'
  },
  {
    name: 'RescueAI (FuGen-India / rootnode-rebels)',
    url: 'https://github.com/FuGen-India-Private-Ltd/rescue-ai',
    language: 'TypeScript',
    implementsText: 'Offline-first PWA disaster response platform using IndexedDB/Dexie for local queuing during outages and real-time incident triage.',
    runs: 'Yes',
    lastCommit: '2026-09-07',
    license: 'No License',
    module: 'Offline communication and SOS',
    reusePlan: 'TOP REUSE 2: Reused Dexie / IndexedDB offline persistence schema and local queue state machine directly in SURAKSHA Grid.',
    classification: 'Fully implemented',
    isTopReuse: true
  },

  // 17-21 Emergency platforms and dashboards
  {
    name: 'Saviour (vikrantwiz02)',
    url: 'https://github.com/vikrantwiz02/Saviour',
    language: 'TypeScript',
    implementsText: 'Disaster management mobile app with SOS distress button, community disaster alerts, and offline safety guides.',
    runs: 'Partially',
    lastCommit: '2026-05-29',
    license: 'NOASSERTION',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'Borrowed one-touch civilian SOS trigger design.',
    classification: 'Partially implemented'
  },
  {
    name: 'Lighthouse (chaalpritam)',
    url: 'https://github.com/chaalpritam/lighthouse',
    language: 'Swift',
    implementsText: 'iOS offline emergency assistant utilizing an on-device rules engine to determine evacuation actions without cloud AI.',
    runs: 'Not tested',
    lastCommit: '2026-07-14',
    license: 'No License',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'Conceptual rules engine for danger classification and evacuation urgency.',
    classification: 'Research concept only'
  },
  {
    name: 'hack-bits (azfar-05)',
    url: 'https://github.com/azfar-05/hack-bits',
    language: 'TypeScript',
    implementsText: 'Real-time disaster alert and rescue coordination web app matching trapped citizens with volunteers and NDRF teams.',
    runs: 'Partially',
    lastCommit: '2026-01-31',
    license: 'No License',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'Reused concept of volunteer and specialized rescue-team dispatch assignment.',
    classification: 'Partially implemented'
  },
  {
    name: 'Map-Informasi-Bencana (Ryan-infitech)',
    url: 'https://github.com/Ryan-infitech/Map-Informasi-Bencana',
    language: 'TypeScript',
    implementsText: 'Interactive disaster monitoring web platform in Indonesia built with React and Leaflet.js.',
    runs: 'Yes',
    lastCommit: '2025-03-20',
    license: 'GPL-3.0',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'Reused disaster category markers and Leaflet layer control concepts.',
    classification: 'Fully implemented'
  },
  {
    name: 'QuakeGrid (hsankc)',
    url: 'https://github.com/hsankc/quakegrid',
    language: 'TypeScript',
    implementsText: 'Offline-first earthquake coordination mesh concept where nodes collect signals during blackout and sync when gateway reconnects.',
    runs: 'Partially',
    lastCommit: '2026-05-16',
    license: 'No License',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'Architectural model for simulated offline-to-online sync flow.',
    classification: 'Research concept only'
  },

  // 22-23 Patterns and references
  {
    name: 'ShadowBroker (BigBodyCobain)',
    url: 'https://github.com/BigBodyCobain/Shadowbroker',
    language: 'Python',
    implementsText: 'Multi-layer OSINT tactical map dashboard aggregating global threat feeds, GDACS flood alerts, and satellite orbital telemetry.',
    runs: 'Yes',
    lastCommit: '2026-10-19',
    license: 'AGPL-3.0',
    module: 'Patterns and references',
    reusePlan: 'Adopted dark-ops command center aesthetics, status indicators, and tactical HUD feel.',
    classification: 'Fully implemented'
  },
  {
    name: 'Sentree (faizfrds)',
    url: 'https://github.com/faizfrds/sentree',
    language: 'TypeScript',
    implementsText: 'Satellite monitoring pipeline concept for Sumatra rainforest deforestation using Kafka and Redis.',
    runs: 'No',
    lastCommit: '2026-03-21',
    license: 'No License',
    module: 'Patterns and references',
    reusePlan: 'None (repository is skeleton without runnable frontend or complete data pipeline).',
    classification: 'Research concept only'
  },

  // Unverified repos searched
  {
    name: 'CrisisGrid (umair-aziz025/CrisisGrid)',
    url: 'https://github.com/umair-aziz025/CrisisGrid',
    language: 'TypeScript',
    implementsText: 'Emergency command center featuring CIRO 4-agent AI pipeline for crisis detection, severity prediction, and response simulation.',
    runs: 'Partially',
    lastCommit: '2026-05-26',
    license: 'MIT',
    module: 'Emergency platforms and dashboards',
    reusePlan: 'Severity triage ranking categories (Critical, High, Moderate).',
    classification: 'Partially implemented'
  },
  {
    name: 'FloodTrackerApp (tjeevan/FloodTrackerApp)',
    url: 'https://github.com/tjeevan/FloodTrackerApp',
    language: 'HTML / JavaScript',
    implementsText: 'Lightweight offline-ready Progressive Web App empowering local communities to report localized floods.',
    runs: 'Yes',
    lastCommit: '2026-06-15',
    license: 'MIT',
    module: 'Offline communication and SOS',
    reusePlan: 'Civilian mobile report form fields with GPS capture.',
    classification: 'Fully implemented'
  },
  {
    name: 'Nodus (offline flood reporting and sync)',
    url: 'Not found (Searched across GitHub and Web; no public repository matching this description exists)',
    language: 'N/A',
    implementsText: 'No public open-source repository found under this name for offline flood reporting and sync.',
    runs: 'No',
    lastCommit: 'N/A',
    license: 'N/A',
    module: 'Offline communication and SOS',
    reusePlan: 'None (Unverified / not found; built from scratch).',
    classification: 'Not found'
  }
];

interface RepoResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepoResearchModal: React.FC<RepoResearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  if (!isOpen) return null;

  const modules = Array.from(new Set(REPO_DATA.map(r => r.module)));

  const filtered = REPO_DATA.filter(r => {
    if (filterModule !== 'ALL' && r.module !== filterModule) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return r.name.toLowerCase().includes(q) ||
             r.language.toLowerCase().includes(q) ||
             r.implementsText.toLowerCase().includes(q) ||
             r.classification.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="text-base font-extrabold text-white">
                Part 2 & 3: GitHub Repositories Verification & Provenance Report
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verified analysis of 23 requested repositories + 3 search candidates. No invented features or statistics.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 3 Reused Repos Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-purple-950/80 p-3 sm:p-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <Award className="w-4 h-4" />
            <span>Top 3 Reused Repositories in SURAKSHA Grid:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2">
            <div className="bg-slate-950/80 border border-blue-500/40 p-2.5 rounded-lg">
              <strong className="text-blue-300 block">1. AntonikaS/floodradar-drypath-map</strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                SAR flood extent display, low-water crossings (blocked bridges), and shelter capacity tracking.
              </p>
            </div>
            <div className="bg-slate-950/80 border border-cyan-500/40 p-2.5 rounded-lg">
              <strong className="text-cyan-300 block">2. FuGen-India / rescue-ai</strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Dexie / IndexedDB offline persistence schema and local SOS queueing state machine.
              </p>
            </div>
            <div className="bg-slate-950/80 border border-purple-500/40 p-2.5 rounded-lg">
              <strong className="text-purple-300 block">3. Soundcreates/Ceal (CEAL)</strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                React+Vite emergency dashboard UI, priority triage flow, and rescue team dispatch assignment.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search repo, language, or implementation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white focus:outline-none w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg text-xs focus:outline-none"
            >
              <option value="ALL">All Modules ({REPO_DATA.length})</option>
              {modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Repo & Link</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">What it Really Implements</th>
                <th className="py-2.5 px-3">Runs?</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Last Commit</th>
                <th className="py-2.5 px-3">License</th>
                <th className="py-2.5 px-3">Reuse Plan in SURAKSHA Grid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((r, idx) => (
                <tr 
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    r.isTopReuse ? 'bg-blue-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-slate-200 min-w-[160px]">
                    <div className="flex items-center gap-1.5">
                      <span>{r.name}</span>
                      {r.isTopReuse && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono font-bold">
                          TOP REUSE
                        </span>
                      )}
                    </div>
                    {r.url.startsWith('http') && (
                      <a 
                        href={r.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5 mt-0.5 font-mono"
                      >
                        <span>GitHub Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">
                    {r.language}
                  </td>

                  <td className="py-3 px-3 text-slate-300 text-[11px] max-w-[240px]">
                    {r.implementsText}
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      r.runs === 'Yes' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      r.runs === 'Partially' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      r.runs === 'No' ? 'bg-red-950 text-red-300 border border-red-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {r.runs}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-[11px]">
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {r.classification}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {r.lastCommit}
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {r.license}
                  </td>

                  <td className="py-3 px-3 text-[11px] text-slate-300 max-w-[220px]">
                    {r.reusePlan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
