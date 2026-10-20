import React from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Compass, 
  AlertOctagon, 
  CheckCircle2, 
  MapPin, 
  Droplets,
  Radio
} from 'lucide-react';
import { Shelter } from '../types';

interface EvacuationControlsProps {
  waterLevelMeters: number;
  setWaterLevelMeters: (val: number) => void;
  isBridgeBlocked: boolean;
  onToggleBridgeBlock: () => void;
  onGenerateRoute: () => void;
  onOpenSOSModal: () => void;
  shelters: Shelter[];
  selectedShelterId: string | null;
  setSelectedShelterId: (id: string | null) => void;
  isNetworkOutage: boolean;
}

export const EvacuationControls: React.FC<EvacuationControlsProps> = ({
  waterLevelMeters,
  setWaterLevelMeters,
  isBridgeBlocked,
  onToggleBridgeBlock,
  onGenerateRoute,
  onOpenSOSModal,
  shelters,
  selectedShelterId,
  setSelectedShelterId,
  isNetworkOutage
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 text-white shadow-xl flex flex-col gap-5">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Disaster Simulation & Navigation</h3>
            <p className="text-[11px] text-slate-400">Interactive hydrological & route stress testing</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Module 02 &bull; Evac Routing
        </span>
      </div>

      {/* 1. Water Level Slider (Requirement 2) */}
      <div className="flex flex-col gap-2 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="water-level-slider" className="font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Simulated Flood Surge Level:</span>
          </label>
          <span className="font-mono text-cyan-300 font-extrabold text-sm bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
            {waterLevelMeters.toFixed(1)} m
          </span>
        </div>

        <input
          id="water-level-slider"
          type="range"
          min="0.5"
          max="5.0"
          step="0.1"
          value={waterLevelMeters}
          onChange={(e) => setWaterLevelMeters(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0.5m (Riverbank Edge)</span>
          <span>2.5m (Valley Lowlands Inundated)</span>
          <span>5.0m (Extreme Flash Flood)</span>
        </div>

        <div className="text-[11px] text-cyan-200/80 bg-cyan-950/30 border border-cyan-900/40 rounded p-2 mt-1">
          {waterLevelMeters < 1.5 && "Water level elevated. Riverside promenade submerged; major bridge remains accessible."}
          {waterLevelMeters >= 1.5 && waterLevelMeters < 3.0 && "Moderate flood inundation. Ghat Enclave access submerged; water velocity approaching critical flow."}
          {waterLevelMeters >= 3.0 && "Severe flood surge! River plain width expanded +140%. Lowland arterial crossings impassable."}
        </div>
      </div>

      {/* 2. Bridge Blockage Toggle (Requirement 5) */}
      <div className="flex flex-col gap-2.5 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <AlertOctagon className={`w-4 h-4 ${isBridgeBlocked ? 'text-red-400' : 'text-slate-400'}`} />
              <span>North Riverside Bridge Status</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulates washed-out bridge, landslide debris, or high-water obstruction
            </p>
          </div>
        </div>

        <button
          onClick={onToggleBridgeBlock}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
            isBridgeBlocked
              ? 'bg-red-950/70 border-red-500/80 text-red-200 hover:bg-red-900/80 shadow-md shadow-red-950'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700/80'
          }`}
        >
          {isBridgeBlocked ? (
            <>
              <AlertOctagon className="w-4 h-4 text-red-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>BRIDGE IS MARKED BLOCKED (Click to Unblock)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mark North Riverside Bridge as Blocked</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Shelter Selector Option */}
      <div className="flex flex-col gap-1.5 text-xs">
        <label className="font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Evacuation Destination:</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {selectedShelterId ? 'Manual Selection' : 'Auto (Nearest Open)'}
          </span>
        </label>
        <select
          value={selectedShelterId || ''}
          onChange={(e) => setSelectedShelterId(e.target.value ? e.target.value : null)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">⚡ Auto-Detect Safest Nearest Open Shelter</option>
          {shelters.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.occupancy}/{s.capacity} - {s.status})
            </option>
          ))}
        </select>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        
        {/* Generate Route (Requirements 4 & 6) */}
        <button
          onClick={onGenerateRoute}
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all border border-blue-400/30"
        >
          <Compass className="w-4 h-4 text-blue-200" />
          <span>Calculate Safe Route</span>
        </button>

        {/* Report SOS Button (Requirements 8 & 9) */}
        <button
          onClick={onOpenSOSModal}
          className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all border border-red-400/30"
        >
          <ShieldAlert className="w-4 h-4 text-red-200 animate-pulse" />
          <span>Transmit Emergency SOS</span>
        </button>

      </div>

    </div>
  );
};
