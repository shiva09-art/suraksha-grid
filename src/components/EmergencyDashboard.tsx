import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Truck, 
  CheckCircle, 
  Radio, 
  Clock, 
  MapPin, 
  HeartPulse, 
  Satellite, 
  Home, 
  Filter, 
  ArrowUpDown, 
  FileSpreadsheet
} from 'lucide-react';
import { SOSReport, Shelter, UrgencyLevel, IncidentStatus } from '../types';
import { db } from '../services/db';

interface EmergencyDashboardProps {
  incidents: SOSReport[];
  shelters: Shelter[];
  onRefreshData: () => void;
}

const RESCUE_TEAMS = [
  'Unassigned',
  'NDRF Quick Response Team 1',
  'SDRF Water Rescue Unit 4',
  'Civil Defense Ambulance 2',
  'Volunteer Boat Squad 7',
  'IAF Chopper Evac Unit 3'
];

export const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({
  incidents,
  shelters,
  onRefreshData
}) => {
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Handle Team Assignment Update
  const handleAssignTeam = async (reportId: string, teamName: string) => {
    await db.sosReports.update(reportId, { assignedTeam: teamName });
    onRefreshData();
  };

  // Handle Status Update
  const handleUpdateStatus = async (reportId: string, newStatus: IncidentStatus) => {
    await db.sosReports.update(reportId, { status: newStatus });
    onRefreshData();
  };

  // Sort incidents by priority (CRITICAL > HIGH > MODERATE) and then by time
  const urgencyWeight: Record<UrgencyLevel, number> = {
    CRITICAL: 3,
    HIGH: 2,
    MODERATE: 1
  };

  const filteredAndSortedIncidents = [...incidents]
    .filter(inc => {
      if (filterUrgency !== 'ALL' && inc.urgency !== filterUrgency) return false;
      if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      const weightDiff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.isoTime).getTime() - new Date(a.isoTime).getTime();
    });

  // Calculate live statistics
  const totalReports = incidents.length;
  const criticalCount = incidents.filter(i => i.urgency === 'CRITICAL').length;
  const queuedOfflineCount = incidents.filter(i => i.status === 'QUEUED_OFFLINE').length;
  const syncedCount = incidents.filter(i => i.status === 'SYNCED' || i.syncMethod === 'SATELLITE_BURST_SIM').length;
  const dispatchedCount = incidents.filter(i => i.status === 'DISPATCHED').length;
  const rescuedCount = incidents.filter(i => i.status === 'RESCUED').length;

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-white">Central Emergency Operations Command (EOC)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-hazard triage, offline SOS telemetry ingest & rescue dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-mono">
            Incidents: <strong className="text-cyan-300 font-bold">{totalReports}</strong>
          </span>
          <span className="text-xs bg-red-950 border border-red-800 text-red-300 px-3 py-1.5 rounded-lg font-mono">
            Critical: <strong className="text-red-400 font-bold">{criticalCount}</strong>
          </span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Total SOS Reports</span>
          <div className="text-2xl font-black font-mono text-white">{totalReports}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Stored in Dexie DB</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
          <span className="text-[11px] text-amber-400 flex items-center gap-1 mb-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Queued Offline</span>
          </span>
          <div className="text-2xl font-black font-mono text-amber-300">{queuedOfflineCount}</div>
          <span className="text-[10px] text-amber-500/80 font-mono mt-0.5 block">Pending Satellite Sync</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
          <span className="text-[11px] text-cyan-400 flex items-center gap-1 mb-1">
            <Satellite className="w-3 h-3" />
            <span>Synced via Sat / Net</span>
          </span>
          <div className="text-2xl font-black font-mono text-cyan-300">{syncedCount}</div>
          <span className="text-[10px] text-cyan-500/80 font-mono mt-0.5 block">Ready for Dispatch</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
          <span className="text-[11px] text-blue-400 flex items-center gap-1 mb-1">
            <Truck className="w-3 h-3" />
            <span>Teams Dispatched</span>
          </span>
          <div className="text-2xl font-black font-mono text-blue-300">{dispatchedCount}</div>
          <span className="text-[10px] text-blue-500/80 font-mono mt-0.5 block">En Route to Coordinates</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md col-span-2 sm:col-span-1">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3" />
            <span>Evacuated / Rescued</span>
          </span>
          <div className="text-2xl font-black font-mono text-emerald-300">{rescuedCount}</div>
          <span className="text-[10px] text-emerald-500/80 font-mono mt-0.5 block">Sheltered Safely</span>
        </div>
      </div>

      {/* Shelter Capacity Progress Bars (Required Additional Feature) */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">Live Evacuation Shelter Capacities</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time Logistics Status
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shelters.map((shelter) => {
            const pct = Math.round((shelter.occupancy / shelter.capacity) * 100);
            const isNearCapacity = pct >= 85;
            const isFull = pct >= 100;
            const barColor = isFull ? 'bg-red-500' : isNearCapacity ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div 
                key={shelter.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-xs text-white leading-tight">{shelter.name}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isFull ? 'bg-red-950 text-red-300 border border-red-800' :
                      isNearCapacity ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {shelter.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className="text-white font-bold">
                      {shelter.occupancy} / {shelter.capacity} <span className="text-[11px] text-slate-400">({pct}%)</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2 font-mono">
                  <span>Elev: {shelter.elevationMeters}m</span>
                  <span>Supplies: <strong className="text-slate-300">{shelter.supplies}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Triage List Table (Requirement 10) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        
        {/* Table Filters & Header */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">Prioritized Incident Queue</span>
            <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full font-mono">
              Sorted by Priority (Critical first)
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Filter by Urgency */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none text-xs"
              >
                <option value="ALL">All Urgencies</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Only</option>
                <option value="MODERATE">Moderate Only</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="QUEUED_OFFLINE">Queued Offline</option>
                <option value="SYNCED">Synced</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="RESCUED">Rescued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents Table / Cards (Responsive) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Priority / ID</th>
                <th className="py-3 px-4">Coordinates & Address</th>
                <th className="py-3 px-4">People & Triage</th>
                <th className="py-3 px-4">Transmission Channel</th>
                <th className="py-3 px-4">Assigned Shelter</th>
                <th className="py-3 px-4">Rescue-Team Assignment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAndSortedIncidents.map((incident) => {
                const isCrit = incident.urgency === 'CRITICAL';
                const isHigh = incident.urgency === 'HIGH';

                return (
                  <tr 
                    key={incident.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      incident.status === 'QUEUED_OFFLINE' ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    
                    {/* Priority & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isCrit ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                          isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}>
                          {incident.urgency}
                        </span>
                      </div>
                      <div className="font-mono text-white font-bold mt-1">
                        {incident.id}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {incident.timestamp}
                      </div>
                    </td>

                    {/* Coordinates & Address */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {incident.address}
                      </div>
                      <div className="font-mono text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{incident.latitude.toFixed(4)}°N, {incident.longitude.toFixed(4)}°E</span>
                      </div>
                      {incident.waterDepthMeters && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Water Surge: <strong className="text-amber-300 font-mono">{incident.waterDepthMeters}m</strong>
                        </div>
                      )}
                    </td>

                    {/* People & Notes */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>{incident.peopleCount} trapped</span>
                        </span>
                        {incident.medicalNeeds && (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded text-[10px] font-bold">
                            MEDEVAC
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-1" title={incident.specialNotes}>
                        {incident.specialNotes}
                      </div>
                    </td>

                    {/* Channel & Status */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5 mb-1">
                        {incident.syncMethod === 'SATELLITE_BURST_SIM' && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] flex items-center gap-1">
                            <Satellite className="w-2.5 h-2.5" />
                            <span>SAT-BURST (SIM)</span>
                          </span>
                        )}
                        {incident.syncMethod === 'OFFLINE_LOCAL' && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] flex items-center gap-1 animate-pulse">
                            <Radio className="w-2.5 h-2.5" />
                            <span>QUEUED OFFLINE</span>
                          </span>
                        )}
                        {incident.syncMethod === 'CELLULAR' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                            CELLULAR
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold ${
                        incident.status === 'RESCUED' ? 'text-emerald-400' :
                        incident.status === 'DISPATCHED' ? 'text-blue-400' :
                        incident.status === 'SYNCED' ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        Status: {incident.status}
                      </span>
                    </td>

                    {/* Assigned Shelter */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">
                        {incident.assignedShelter || 'Hilltop Community Center'}
                      </div>
                    </td>

                    {/* Rescue Team Assignment Field (Requirement 10) */}
                    <td className="py-3.5 px-4">
                      <select
                        value={incident.assignedTeam || 'Unassigned'}
                        onChange={(e) => handleAssignTeam(incident.id, e.target.value)}
                        className={`bg-slate-950 border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500 ${
                          incident.assignedTeam && incident.assignedTeam !== 'Unassigned'
                            ? 'border-blue-500/60 text-blue-200'
                            : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        {RESCUE_TEAMS.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {incident.status !== 'DISPATCHED' && incident.status !== 'RESCUED' && (
                          <button
                            onClick={() => handleUpdateStatus(incident.id, 'DISPATCHED')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
                            title="Dispatch assigned rescue team"
                          >
                            Dispatch
                          </button>
                        )}
                        {incident.status === 'DISPATCHED' && (
                          <button
                            onClick={() => handleUpdateStatus(incident.id, 'RESCUED')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
                            title="Mark civilian as successfully rescued"
                          >
                            Rescued
                          </button>
                        )}
                        {incident.status === 'RESCUED' && (
                          <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Safe</span>
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
