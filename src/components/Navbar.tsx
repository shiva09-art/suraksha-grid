import React from 'react';
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Satellite, 
  PlayCircle, 
  BookOpen, 
  Map, 
  LayoutDashboard,
  Radio
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'dashboard';
  setActiveTab: (tab: 'map' | 'dashboard') => void;
  isNetworkOutage: boolean;
  setIsNetworkOutage: (val: boolean) => void;
  queuedOfflineCount: number;
  onOpenSatelliteSync: () => void;
  onStartGuidedTour: () => void;
  onOpenResearchModal: () => void;
  isTourActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isNetworkOutage,
  setIsNetworkOutage,
  queuedOfflineCount,
  onOpenSatelliteSync,
  onStartGuidedTour,
  onOpenResearchModal,
  isTourActive
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30 ring-1 ring-white/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                SURAKSHA <span className="text-red-400 font-semibold text-sm">Grid</span>
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase">
                v1.0 Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Disaster Monitoring &bull; Evacuation Routing &bull; Offline SOS Mesh
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map & Evacuation</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Emergency Dashboard</span>
            {queuedOfflineCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
        </div>

        {/* Action Controls & Network Simulation Toggle */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Network Outage Toggle (Requirement 7) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg gap-2">
            <span className="text-[11px] text-slate-300 font-mono hidden md:inline">
              Network:
            </span>
            <button
              onClick={() => setIsNetworkOutage(!isNetworkOutage)}
              title="Click to toggle simulated cellular/internet blackout"
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                isNetworkOutage
                  ? 'bg-red-950/90 text-red-300 border border-red-600/60 shadow-sm animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900/60'
              }`}
            >
              {isNetworkOutage ? (
                <>
                  <WifiOff className="w-3 h-3 text-red-400" />
                  <span>OFFLINE (Simulated Outage)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>ONLINE (Cellular Active)</span>
                </>
              )}
            </button>
          </div>

          {/* Offline Queue Badge & Satellite Sync Button (Requirements 8 & 9) */}
          <button
            onClick={onOpenSatelliteSync}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
              queuedOfflineCount > 0
                ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 hover:bg-amber-500/20 shadow-md shadow-amber-950/40 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80'
            }`}
            title="Uplink locally queued SOS reports via simulated satellite burst"
          >
            <Satellite className="w-3.5 h-3.5 text-amber-400" />
            <span>Satellite Sync</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
              queuedOfflineCount > 0
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-700 text-slate-300'
            }`}>
              {queuedOfflineCount > 0 ? `Queued (${queuedOfflineCount})` : 'Synced'}
            </span>
          </button>

          {/* Guided Demo Button for Presenters */}
          <button
            onClick={onStartGuidedTour}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
              isTourActive
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/50'
                : 'bg-purple-950/40 text-purple-200 border-purple-800/60 hover:bg-purple-900/50'
            }`}
            title="Launch step-by-step 2-minute guided presenter demo"
          >
            <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Guided Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Research Repositories Modal */}
          <button
            onClick={onOpenResearchModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="View verified 23+ GitHub repository research table & citations"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Repo Research</span>
          </button>

        </div>

      </div>
    </header>
  );
};
