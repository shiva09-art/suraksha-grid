import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Mic, 
  Sparkles, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export interface TourStepInfo {
  stepNumber: number;
  title: string;
  actionSummary: string;
  presenterScript: string;
}

export const TOUR_STEPS: TourStepInfo[] = [
  {
    stepNumber: 1,
    title: 'Tactical Map & Geospatial Overview',
    actionSummary: 'SURAKSHA Grid initialized with OpenStreetMap baseline and tactical layer legend.',
    presenterScript: 'Judges, welcome to SURAKSHA Grid. Notice the live tactical map with low-water crossings, designated high-ground shelters, and an interactive legend showing all hazard and route layers.'
  },
  {
    stepNumber: 2,
    title: 'Synthetic SAR Flood Inundation Surge',
    actionSummary: 'Water surge level slider increased to 3.2m; flood extent polygon expands across the river trough.',
    presenterScript: 'As monsoonal rainfall increases river surge to 3.2 meters, our simulated SAR flood boundary expands dynamically, submerging low-lying riverfront access routes.'
  },
  {
    stepNumber: 3,
    title: 'Citizen GPS Fix in Danger Zone',
    actionSummary: 'Pulsing radar marker placed at 30.1415°N, 78.2930°E in the Ghat Enclave floodway.',
    presenterScript: 'Here is a civilian trapped inside the danger zone at 310 meters elevation with floodwaters actively surrounding their location.'
  },
  {
    stepNumber: 4,
    title: 'Primary Evacuation Route Generation',
    actionSummary: 'Dijkstra shortest path calculated to Hilltop Shelter (3.8 km, ~11 mins) via North Riverside Bridge.',
    presenterScript: 'With one click, SURAKSHA Grid computes an optimal evacuation route to the nearest open shelter, guiding the citizen across the North Riverside Bridge.'
  },
  {
    stepNumber: 5,
    title: 'Critical Bridge Blockage Event',
    actionSummary: 'North Riverside Suspension Bridge marked BLOCKED due to structural hazard.',
    presenterScript: 'Suddenly, field sensors report the North Riverside Bridge is blocked by debris. The map immediately flags the river crossing in red.'
  },
  {
    stepNumber: 6,
    title: 'Dynamic Real-Time Alternative Reroute',
    actionSummary: 'System automatically recalculates resilient alternative path via South Elevated Bypass (5.6 km, ~18 mins).',
    presenterScript: 'Instantly, our routing engine recalculates an alternative route via the elevated South Parkway, completely avoiding the blocked bridge and showing updated turn-by-turn guidance.'
  },
  {
    stepNumber: 7,
    title: 'Simulated Cellular Network Outage',
    actionSummary: 'Cellular tower down; system enters true offline-first local mode.',
    presenterScript: 'In real disasters, cell towers collapse. We now toggle the network outage: the system is completely offline.'
  },
  {
    stepNumber: 8,
    title: 'Offline SOS Capture in IndexedDB',
    actionSummary: 'Civilian SOS submitted offline; persisted locally in browser Dexie IndexedDB with GPS fix; counter reads "Queued offline (1)".',
    presenterScript: 'The stranded civilian sends an emergency SOS. Even without internet, it is safely stored in local IndexedDB with precise GPS coordinates, incrementing our Queued Offline counter.'
  },
  {
    stepNumber: 9,
    title: 'Simulated Satellite Burst Sync',
    actionSummary: 'Initiating simulated satellite uplink pass; queued SOS transitions from Queued to Synced.',
    presenterScript: 'When a simulated satellite pass occurs, clicking Satellite Sync triggers a burst transmission, transitioning the report from queued to synced with transparent honesty disclaimers.'
  },
  {
    stepNumber: 10,
    title: 'Central Emergency Control Dashboard',
    actionSummary: 'Synchronized SOS appears in EOC triage queue, prioritized by severity with shelter capacity bars and rescue team assignment.',
    presenterScript: 'Finally, over at the Emergency Operations Center dashboard, the synced SOS appears sorted by priority at the top. Authorities can monitor shelter capacity bars and assign NDRF rescue teams immediately.'
  }
];

interface GuidedTourBannerProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onCloseTour: () => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (val: boolean) => void;
}

export const GuidedTourBanner: React.FC<GuidedTourBannerProps> = ({
  currentStep,
  onSetStep,
  onCloseTour,
  isAutoPlaying,
  setIsAutoPlaying
}) => {
  const stepInfo = TOUR_STEPS[currentStep - 1] || TOUR_STEPS[0];

  // Auto play timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < 10) {
        onSetStep(currentStep + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 8500);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, onSetStep, setIsAutoPlaying]);

  return (
    <div className="bg-slate-900/95 border-b-2 border-purple-500 text-white p-3 sm:p-4 shadow-2xl relative z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Step Badge & Title */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-600 text-white font-extrabold text-[11px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>DEMO STEP {stepInfo.stepNumber} OF 10</span>
            </span>
            <span className="text-purple-300 font-bold text-sm">
              {stepInfo.title}
            </span>
          </div>

          {/* Action Caption & Presenter Script */}
          <div className="text-xs text-slate-300 space-y-1">
            <p className="text-[11px] text-slate-400 font-mono">
              <strong className="text-cyan-300">Action:</strong> {stepInfo.actionSummary}
            </p>
            <div className="bg-slate-950/80 border border-purple-900/60 rounded-lg px-2.5 py-1.5 flex items-start gap-2 text-[12px] text-purple-100 italic">
              <Mic className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>&ldquo;{stepInfo.presenterScript}&rdquo;</span>
            </div>
          </div>
        </div>

        {/* Right: Tour Navigation Controls */}
        <div className="flex items-center flex-wrap gap-2 shrink-0 self-end md:self-center">
          
          {/* Step Progress Dots */}
          <div className="flex items-center gap-1 mr-2 hidden sm:flex">
            {TOUR_STEPS.map((s) => (
              <button
                key={s.stepNumber}
                onClick={() => onSetStep(s.stepNumber)}
                title={`Jump to Step ${s.stepNumber}: ${s.title}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s.stepNumber === currentStep
                    ? 'bg-purple-400 w-5'
                    : s.stepNumber < currentStep
                    ? 'bg-purple-700'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Prev */}
          <button
            onClick={() => onSetStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs"
            title="Previous step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Auto Play / Pause Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              isAutoPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto-Play</span>
              </>
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => onSetStep(Math.min(10, currentStep + 1))}
            disabled={currentStep === 10}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-xs"
            title="Next step"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Exit Tour */}
          <button
            onClick={onCloseTour}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors ml-1"
            title="Exit guided tour"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
