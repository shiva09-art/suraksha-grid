import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Users, 
  HeartPulse, 
  Send, 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  Database 
} from 'lucide-react';
import { db } from '../services/db';
import { SOSReport, UrgencyLevel } from '../types';
import { CITIZEN_START_COORDS } from '../services/roadGraph';

interface OfflineSosModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNetworkOutage: boolean;
  onSosSubmitted: () => void;
}

export const OfflineSosModal: React.FC<OfflineSosModalProps> = ({
  isOpen,
  onClose,
  isNetworkOutage,
  onSosSubmitted
}) => {
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [medicalNeeds, setMedicalNeeds] = useState<boolean>(true);
  const [specialNotes, setSpecialNotes] = useState<string>(
    'Flood water entering ground floor (1.4m depth); two seniors requiring immediate extraction.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReport: SOSReport = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: formattedTime,
      isoTime: now.toISOString(),
      latitude: CITIZEN_START_COORDS[0],
      longitude: CITIZEN_START_COORDS[1],
      address: 'Ghat Riverside Enclave, Sector 2',
      urgency,
      peopleCount,
      medicalNeeds,
      specialNotes,
      status: isNetworkOutage ? 'QUEUED_OFFLINE' : 'SYNCED',
      assignedShelter: 'Hilltop Community Relief Center',
      assignedTeam: 'Unassigned (Awaiting EOC Dispatch)',
      syncMethod: isNetworkOutage ? 'OFFLINE_LOCAL' : 'CELLULAR',
      syncTimestamp: isNetworkOutage ? undefined : formattedTime,
      waterDepthMeters: 1.8
    };

    // Save to Dexie IndexedDB
    await db.sosReports.add(newReport);

    setIsSubmitting(false);
    if (isNetworkOutage) {
      setSubmittedMessage(
        'OFFLINE PERSISTENCE CONFIRMED: SOS report has been stored in local IndexedDB with GPS fix (30.1415°N, 78.2930°E) and timestamp. Queued offline counter incremented. Ready for Satellite Burst Sync.'
      );
    } else {
      setSubmittedMessage(
        'CELLULAR DISPATCH: SOS report submitted directly to Central Emergency Dashboard via simulated cellular channel.'
      );
    }

    onSosSubmitted();

    setTimeout(() => {
      setSubmittedMessage(null);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-5 sm:p-6 text-white shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-md">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Emergency Civilian SOS Distress Report</h3>
            <p className="text-xs text-slate-400">Offline-first local dispatch & satellite packet queueing</p>
          </div>
        </div>

        {submittedMessage ? (
          <div className="p-5 bg-slate-950 border border-emerald-600/50 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-emerald-300 text-sm">Disaster SOS Successfully Recorded</h4>
            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              {submittedMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Live GPS & Network Status Card */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>GPS Telemetry:</span>
                </span>
                <span className="text-white font-bold block mt-0.5">
                  30.1415°N, 78.2930°E
                </span>
                <span className="text-[10px] text-red-400">Ghat Enclave Hazard Zone</span>
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  {isNetworkOutage ? (
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>Bearer Network:</span>
                </span>
                <span className={`font-bold block mt-0.5 ${isNetworkOutage ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isNetworkOutage ? 'OFFLINE (Cell Tower Down)' : 'ONLINE (Cellular Connected)'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isNetworkOutage ? 'Local Dexie DB Queue Active' : 'Direct API Link'}
                </span>
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">
                Incident Severity & Urgency:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CRITICAL', 'HIGH', 'MODERATE'] as UrgencyLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 px-2 rounded-lg font-bold text-center border transition-all ${
                      urgency === level
                        ? level === 'CRITICAL'
                          ? 'bg-red-600 border-red-400 text-white shadow-md shadow-red-950'
                          : level === 'HIGH'
                          ? 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-950'
                          : 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* People Trapped & Medical Needs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Number of People:</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>Medical Urgency:</span>
                </label>
                <div 
                  onClick={() => setMedicalNeeds(!medicalNeeds)}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                    medicalNeeds
                      ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={medicalNeeds}
                    onChange={() => {}}
                    className="accent-rose-500 cursor-pointer"
                  />
                  <span className="font-semibold text-[11px]">
                    {medicalNeeds ? 'Immediate Medevac Needed' : 'No Critical Injuries'}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Rescue Details & Hazards:
              </label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none"
                placeholder="Describe current water depth, hazards, seniors/infants..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-xl shadow-red-950 transition-all flex items-center justify-center gap-2 border border-red-400/40"
            >
              <Send className="w-4 h-4 text-white" />
              <span>
                {isNetworkOutage 
                  ? 'SUBMIT SOS TO LOCAL OFFLINE QUEUE' 
                  : 'TRANSMIT SOS DIRECTLY (ONLINE)'}
              </span>
            </button>

            {isNetworkOutage && (
              <p className="text-[11px] text-amber-300/80 text-center font-mono">
                ⚡ Cell tower offline: will write report into browser IndexedDB and show as &ldquo;Queued offline&rdquo;.
              </p>
            )}

          </form>
        )}

      </div>
    </div>
  );
};
