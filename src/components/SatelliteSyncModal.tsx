import React, { useState } from 'react';
import { 
  X, 
  Satellite, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Cpu, 
  Orbit,
  Database
} from 'lucide-react';
import { db } from '../services/db';
import { SOSReport } from '../types';

interface SatelliteSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  queuedReports: SOSReport[];
  onSyncCompleted: () => void;
}

export const SatelliteSyncModal: React.FC<SatelliteSyncModalProps> = ({
  isOpen,
  onClose,
  queuedReports,
  onSyncCompleted
}) => {
  const [syncState, setSyncState] = useState<'IDLE' | 'TRANSMITTING' | 'SYNCED'>('IDLE');
  const [telemetryLog, setTelemetryLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleStartSync = async () => {
    setSyncState('TRANSMITTING');
    setTelemetryLog([
      'Acquiring simulated satellite pass beacon (SURAKSHA-SAT 04 @ 530km LEO orbit)...',
      'Establishing L-Band carrier sync frequency (1616.0 MHz simulated)...'
    ]);

    setTimeout(() => {
      setTelemetryLog(prev => [
        ...prev,
        `Serializing ${queuedReports.length} queued SOS packet(s) into compressed binary telemetry frames...`,
        'Burst transmission initiated via simulated satellite transceiver...'
      ]);
    }, 900);

    setTimeout(async () => {
      // Update reports in Dexie database
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      for (const r of queuedReports) {
        await db.sosReports.update(r.id, {
          status: 'SYNCED',
          syncMethod: 'SATELLITE_BURST_SIM',
          syncTimestamp: nowTime
        });
      }

      setTelemetryLog(prev => [
        ...prev,
        'Carrier uplink acknowledged by ground gateway station.',
        `All ${queuedReports.length} incident report(s) synced to Central Emergency Operations Center.`
      ]);
      setSyncState('SYNCED');
      onSyncCompleted();
    }, 2200);
  };

  const resetAndClose = () => {
    setSyncState('IDLE');
    setTelemetryLog([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl p-5 sm:p-6 text-white shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-md">
            <Satellite className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Satellite Sync (Simulation)</h3>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-bold uppercase">
                Simulated Burst
              </span>
            </div>
            <p className="text-xs text-slate-400">Offline emergency SOS uplink over backup constellation link</p>
          </div>
        </div>

        {/* Strict Honesty Disclaimer Banner */}
        <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5 mb-4 font-mono leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5">MANDATORY TECHNICAL HONESTY DISCLAIMER:</strong>
            Standard consumer smartphones cannot connect directly to commercial satellite internet. In a real-world disaster deployment, this sync operates via dedicated companion hardware (e.g. Meshtastic LoRa radios bridging to an Iridium/Inmarsat burst module, or 3GPP Rel-17 NTN satellite messaging chipsets). For this hackathon demo, the uplink is <strong>100% SIMULATED</strong>.
          </div>
        </div>

        {/* Queued Reports Inspection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Locally Stored Reports in Offline Queue ({queuedReports.length}):</span>
            <span className="text-slate-500 font-mono text-[11px]">IndexedDB Storage</span>
          </div>

          {queuedReports.length === 0 && syncState !== 'SYNCED' ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-300">Offline Queue is Empty</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Toggle &ldquo;Simulate network outage&rdquo; in the navbar and submit an SOS while offline to see it queue here.
              </p>
            </div>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {queuedReports.map((r) => (
                <div 
                  key={r.id}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-white">{r.id}</strong>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        r.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {r.urgency}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      GPS: {r.latitude.toFixed(4)}°N, {r.longitude.toFixed(4)}°E &bull; {r.peopleCount} people
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    syncState === 'SYNCED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  }`}>
                    {syncState === 'SYNCED' ? 'SYNCED' : 'QUEUED OFFLINE'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Telemetry Output Log */}
          {telemetryLog.length > 0 && (
            <div className="bg-black/80 rounded-xl p-3 border border-cyan-900/50 font-mono text-[11px] text-cyan-300 space-y-1">
              <div className="text-[10px] text-cyan-500 font-bold border-b border-cyan-950 pb-1 mb-1 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>SIMULATED SATELLITE BURST TELEMETRY CONSOLE</span>
              </div>
              {telemetryLog.map((line, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-600">&gt;</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          {syncState === 'SYNCED' ? (
            <button
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done (View Reports on Emergency Dashboard)</span>
            </button>
          ) : (
            <button
              onClick={handleStartSync}
              disabled={syncState === 'TRANSMITTING' || queuedReports.length === 0}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                queuedReports.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/40 border border-cyan-400/40'
              }`}
            >
              <Satellite className={`w-4 h-4 ${syncState === 'TRANSMITTING' ? 'animate-spin' : ''}`} />
              <span>
                {syncState === 'TRANSMITTING'
                  ? 'TRANSMITTING SIMULATED SATELLITE BURST...'
                  : `Initiate Satellite Burst Sync (${queuedReports.length} Queued)`}
              </span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
