import React from 'react';
import { AlertTriangle, Satellite, Info } from 'lucide-react';

export const HonestyBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/80 border-b border-amber-600/40 text-amber-200 px-3 py-1.5 text-xs font-mono flex items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider text-[10px]">
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
          SIMULATED DEMO DATA
        </span>
        <span className="truncate">
          Not connected to live satellite feeds. Ordinary phones do not connect directly to satellite internet. Evacuation routes are data recommendations, not guaranteed safe.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3 shrink-0 text-amber-300/80 text-[11px]">
        <span className="flex items-center gap-1">
          <Satellite className="w-3 h-3" />
          Synthetic SAR & Telemetry Simulation
        </span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="System Operational"></span>
      </div>
    </div>
  );
};
