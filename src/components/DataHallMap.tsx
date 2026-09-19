import React, { useState } from 'react';
import { 
  Thermometer, 
  Zap, 
  Layers, 
  Activity, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Wrench, 
  Compass, 
  Wind, 
  Eye,
  UserCheck,
  Maximize2
} from 'lucide-react';
import { Aisle, FieldTechnician, Rack } from '../types';

interface DataHallMapProps {
  aisles: Aisle[];
  racks: Rack[];
  technicians: FieldTechnician[];
  selectedRack: Rack | null;
  onSelectRack: (rack: Rack) => void;
  onOpenNocConsole: () => void;
}

type ViewMode = 'thermal' | 'power' | 'capacity' | 'status';

export const DataHallMap: React.FC<DataHallMapProps> = ({
  aisles,
  racks,
  technicians,
  selectedRack,
  onSelectRack,
  onOpenNocConsole,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('thermal');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAisle, setFilterAisle] = useState<string>('all');

  const filteredRacks = racks.filter((rack) => {
    const matchesAisle = filterAisle === 'all' || rack.aisleId === filterAisle;
    const matchesQuery = 
      rack.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rack.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAisle && matchesQuery;
  });

  // Calculate rack display color based on view mode
  const getRackColor = (rack: Rack) => {
    if (viewMode === 'status') {
      if (rack.status === 'critical') return 'bg-red-500/80 border-red-400 text-white shadow-red-500/50';
      if (rack.status === 'warning') return 'bg-amber-500/80 border-amber-400 text-slate-950 shadow-amber-500/40 animate-pulse';
      if (rack.status === 'maintenance') return 'bg-blue-600/80 border-blue-400 text-white';
      return 'bg-emerald-600/70 border-emerald-400 text-emerald-100';
    }

    if (viewMode === 'thermal') {
      // Temps range from ~19C to ~38C
      if (rack.currentTempC >= 36) return 'bg-gradient-to-t from-red-600 to-amber-500 border-red-400 text-white shadow-red-600/50 animate-pulse';
      if (rack.currentTempC >= 30) return 'bg-gradient-to-t from-amber-600 to-amber-500 border-amber-400 text-slate-950';
      if (rack.currentTempC >= 24) return 'bg-gradient-to-t from-cyan-700 to-teal-600 border-teal-400 text-teal-100';
      return 'bg-gradient-to-t from-blue-700 to-cyan-600 border-cyan-400 text-cyan-100';
    }

    if (viewMode === 'power') {
      // Density from 10kW to 38kW
      const ratio = rack.currentKw / rack.maxKw;
      if (ratio > 0.85) return 'bg-gradient-to-t from-purple-700 to-fuchsia-600 border-fuchsia-400 text-white shadow-fuchsia-500/40';
      if (ratio > 0.65) return 'bg-gradient-to-t from-blue-700 to-indigo-600 border-indigo-400 text-indigo-100';
      return 'bg-gradient-to-t from-slate-700 to-cyan-700 border-cyan-400 text-cyan-100';
    }

    if (viewMode === 'capacity') {
      const uRatio = rack.uOccupied / rack.totalU;
      if (uRatio >= 0.9) return 'bg-purple-600/80 border-purple-400 text-white';
      if (uRatio >= 0.7) return 'bg-cyan-600/80 border-cyan-400 text-white';
      return 'bg-emerald-600/70 border-emerald-400 text-white';
    }

    return 'bg-slate-700 border-slate-600 text-slate-200';
  };

  return (
    <div id="data-hall-floorplan-view" className="space-y-4">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Left: View Mode Selectors */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Heatmap Layer:
          </span>
          <button
            id="btn-view-thermal"
            onClick={() => setViewMode('thermal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'thermal'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow-md shadow-cyan-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal Gradient (°C)</span>
          </button>
          <button
            id="btn-view-power"
            onClick={() => setViewMode('power')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'power'
                ? 'bg-fuchsia-600 text-white font-bold shadow-md shadow-fuchsia-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Power Density (kW)</span>
          </button>
          <button
            id="btn-view-capacity"
            onClick={() => setViewMode('capacity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'capacity'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Space Capacity (U)</span>
          </button>
          <button
            id="btn-view-status"
            onClick={() => setViewMode('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'status'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Health Status</span>
          </button>
        </div>

        {/* Right: Search & Aisle Filter */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              id="input-search-racks"
              type="text"
              placeholder="Search cabinet, tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <select
            id="select-aisle-filter"
            value={filterAisle}
            onChange={(e) => setFilterAisle(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Aisles (A-D)</option>
            <option value="Aisle-A">Aisle A (AI/GPU Pod)</option>
            <option value="Aisle-B">Aisle B (Cloud Compute)</option>
            <option value="Aisle-C">Aisle C (SAN Storage)</option>
            <option value="Aisle-D">Aisle D (Optical Telco)</option>
          </select>
        </div>
      </div>

      {/* Main Floor Grid Canvas Representation */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Overhead Mezzanine NOC Banner (Directly mimicking the photo's 2nd-floor glass command room) */}
        <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-700/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-900/60 border border-indigo-600 text-indigo-300">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>MEZZANINE NOC COMMAND BRIDGE (LEVEL 2 OVERLOOK)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  nxtra by airtel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct sightline over 48 contained rack cabinets • 24/7 Engineers Sarah M. & Elena R. on active duty
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNocConsole}
            className="px-3 py-1.5 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-600 text-indigo-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Open NOC Console</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4 pb-3 border-b border-slate-800/80 text-slate-400 font-mono">
          <div className="flex items-center space-x-4 flex-wrap">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Overhead Air Circulation:
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-3 h-3 rounded bg-blue-600/80 border border-cyan-400 inline-block"></span>
              Cold Aisle Corridor (~20°C Supply)
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-3 h-3 rounded bg-amber-600/80 border border-amber-400 inline-block"></span>
              Hot Aisle Exhaust (~33-38°C Return)
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-3 h-3 rounded bg-fuchsia-600/80 border border-fuchsia-400 inline-block"></span>
              High-Density AI Cluster (35kW+)
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Sub-floor Plenum: +23.8 Pa
            </span>
            <span className="text-cyan-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              Technician Rajesh K. on Crash Cart #2
            </span>
          </div>
        </div>

        {/* Aisles Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {aisles.map((aisle) => {
            const aisleRacks = filteredRacks.filter((r) => r.aisleId === aisle.id);
            if (filterAisle !== 'all' && aisle.id !== filterAisle) return null;

            // Split into Column 1 (Left Row) and Column 2 (Right Row) flanking the contained cold corridor
            const col1 = aisleRacks.filter((r) => r.column === 1);
            const col2 = aisleRacks.filter((r) => r.column === 2);

            const hasActiveTech = aisle.id === 'Aisle-B'; // Rajesh is in Aisle B in the photo!

            return (
              <div 
                key={aisle.id} 
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative shadow-md hover:border-slate-700 transition-all"
              >
                {/* Aisle Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{aisle.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {aisle.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {aisle.purpose}
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono">
                    <div className="text-cyan-300 font-semibold">{aisle.avgTempC}°C Supply</div>
                    <div className="text-[10px] text-slate-400">Delta P: {aisle.differentialPressurePa} Pa</div>
                  </div>
                </div>

                {/* Simulated Technician Presence Pin */}
                {hasActiveTech && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-600/70 text-blue-200 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                      </span>
                      <strong className="text-white">Active Crash Cart Station:</strong> Rajesh K. (Crash Cart #2 connected to B-04)
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">Live KVM Diag</span>
                  </div>
                )}

                {/* The 2 Flanking Rows with Central Contained Cold Corridor */}
                <div className="space-y-3">
                  {/* Row 1 (Top / West side of Aisle) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 px-1">
                      <span>Row A-West (Hot Aisle Exhaust Rear)</span>
                      <span>6 Cabinets (42U)</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {col1.map((rack) => {
                        const isSelected = selectedRack?.id === rack.id;
                        return (
                          <button
                            key={rack.id}
                            id={`rack-btn-${rack.id}`}
                            onClick={() => onSelectRack(rack)}
                            className={`p-2 rounded-lg border text-center transition-all group relative ${getRackColor(rack)} ${
                              isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-105 z-10' : ''
                            }`}
                            title={`Cabinet ${rack.id} | ${rack.clientName} | ${rack.currentKw}kW | ${rack.currentTempC}°C`}
                          >
                            {/* Visual LED status strip inspired by image's glowing rack pillars */}
                            <div className="absolute left-1 top-1.5 bottom-1.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                            
                            <div className="font-mono font-bold text-xs pl-1.5 tracking-tight">{rack.id}</div>
                            <div className="text-[10px] font-mono opacity-90 pl-1.5 mt-0.5">
                              {viewMode === 'thermal' && `${rack.currentTempC}°C`}
                              {viewMode === 'power' && `${rack.currentKw} kW`}
                              {viewMode === 'capacity' && `${rack.uOccupied}U`}
                              {viewMode === 'status' && rack.status}
                            </div>

                            {/* Alert pip if warning/critical */}
                            {rack.status === 'warning' && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-ping"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Central Contained Cold Aisle Walkway (Visualized with Cold Air Flow vectors) */}
                  <div className="relative py-2.5 px-3 rounded-lg bg-blue-950/50 border border-blue-700/50 flex items-center justify-between text-xs font-mono text-cyan-300 overflow-hidden">
                    {/* Simulated air flow arrows */}
                    <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 relative z-10">
                      <Wind className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                      COLD AISLE CONTAINMENT CORRIDOR (ROOF SEALED)
                    </span>
                    <span className="text-[10px] text-blue-200 relative z-10 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-600/40">
                      Plenum Inflow: 4,800 CFM
                    </span>
                  </div>

                  {/* Row 2 (Bottom / East side of Aisle) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 px-1">
                      <span>Row A-East (Hot Aisle Exhaust Rear)</span>
                      <span>6 Cabinets (42U)</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {col2.map((rack) => {
                        const isSelected = selectedRack?.id === rack.id;
                        return (
                          <button
                            key={rack.id}
                            id={`rack-btn-${rack.id}`}
                            onClick={() => onSelectRack(rack)}
                            className={`p-2 rounded-lg border text-center transition-all group relative ${getRackColor(rack)} ${
                              isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-105 z-10' : ''
                            }`}
                            title={`Cabinet ${rack.id} | ${rack.clientName} | ${rack.currentKw}kW | ${rack.currentTempC}°C`}
                          >
                            <div className="absolute left-1 top-1.5 bottom-1.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                            
                            <div className="font-mono font-bold text-xs pl-1.5 tracking-tight">{rack.id}</div>
                            <div className="text-[10px] font-mono opacity-90 pl-1.5 mt-0.5">
                              {viewMode === 'thermal' && `${rack.currentTempC}°C`}
                              {viewMode === 'power' && `${rack.currentKw} kW`}
                              {viewMode === 'capacity' && `${rack.uOccupied}U`}
                              {viewMode === 'status' && rack.status}
                            </div>

                            {rack.status === 'warning' && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-ping"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer assigned cooling unit */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Assigned: <strong className="text-slate-300">{aisle.crahUnitAssigned}</strong></span>
                  <span className="text-cyan-400">12 Racks Deployed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Rack Drawer Preview */}
        {selectedRack && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-600 text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">
                    Selected: {selectedRack.name}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                    selectedRack.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  }`}>
                    {selectedRack.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Tenant: <strong className="text-slate-200">{selectedRack.clientName}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mt-1">
                  <span>Power: <strong className="text-cyan-400">{selectedRack.currentKw} kW</strong> / {selectedRack.maxKw} kW</span>
                  <span>Temp: <strong className={selectedRack.currentTempC > 35 ? 'text-amber-400' : 'text-blue-300'}>{selectedRack.currentTempC}°C</strong></span>
                  <span>Occupancy: <strong className="text-purple-400">{selectedRack.uOccupied} / {selectedRack.totalU} U</strong> ({selectedRack.devices.length} Devices)</span>
                  <span>PDU Feed A: {selectedRack.pduAAmps}A | Feed B: {selectedRack.pduBAmps}A</span>
                </div>
              </div>
            </div>

            <button
              id="btn-inspect-selected-rack"
              onClick={() => onSelectRack(selectedRack)}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-md"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Launch 42U Elevation Inspector</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
