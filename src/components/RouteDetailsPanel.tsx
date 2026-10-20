import React from 'react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Footprints,
  CornerDownRight,
  Info
} from 'lucide-react';
import { RouteResult } from '../types';

interface RouteDetailsPanelProps {
  routeResult: RouteResult | null;
  isBridgeBlocked: boolean;
}

export const RouteDetailsPanel: React.FC<RouteDetailsPanelProps> = ({
  routeResult,
  isBridgeBlocked
}) => {
  if (!routeResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs shadow-lg">
        <Navigation className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="font-semibold text-slate-300">No Active Evacuation Route</p>
        <p className="text-[11px] mt-1 text-slate-500">
          Click &ldquo;Calculate Safe Route&rdquo; to generate dynamic hazard-avoiding directions.
        </p>
      </div>
    );
  }

  const isAlt = routeResult.isAlternative;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 text-white shadow-xl flex flex-col gap-4">
      
      {/* Route Header & Metrics */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase ${
              isAlt
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {isAlt ? '⚡ ALTERNATIVE BYPASS ROUTE' : '🛡️ PRIMARY EVACUATION ROUTE'}
            </span>
          </div>
          <h3 className="font-extrabold text-base text-slate-100 mt-1">
            {isAlt ? 'Bypassing Blocked North Riverside Bridge' : 'Direct Highland Evacuation Corridor'}
          </h3>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold font-mono text-cyan-300">
            {routeResult.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-end gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>~{routeResult.estimatedMinutes} mins transit</span>
          </div>
        </div>
      </div>

      {/* Honesty Route Disclaimer */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-2.5 text-[11px] text-amber-200/90 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Evacuation Route Recommendation:</span>
          <span className="ml-1 text-amber-200/80">
            Routes are algorithmic recommendations computed over currently known impassable hazards. No route is guaranteed safe against flash debris or unexpected structural collapse.
          </span>
        </div>
      </div>

      {/* Step by Step Turn Guidance */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span>Turn-by-Turn Navigation Steps ({routeResult.stepInstructions.length})</span>
          <span className="text-[10px] font-mono text-slate-500">Dijkstra Shortest Path</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {routeResult.stepInstructions.map((step, idx) => (
            <div 
              key={idx}
              className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                idx === 0 
                  ? 'bg-red-950/20 border-red-900/40 text-red-200' 
                  : idx === routeResult.stepInstructions.length - 1
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200 font-semibold'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300 shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 leading-snug">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
