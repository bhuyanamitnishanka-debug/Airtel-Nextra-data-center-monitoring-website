import React from 'react';
import { 
  Zap, 
  BatteryCharging, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  RefreshCw, 
  ArrowDown, 
  Layers,
  Fuel,
  Cpu
} from 'lucide-react';
import { DataCenterMetrics, PowerComponent } from '../types';

interface PowerChainViewProps {
  powerComponents: PowerComponent[];
  metrics: DataCenterMetrics;
  powerFailureActive: boolean;
  onSimulatePowerFailure: () => void;
}

export const PowerChainView: React.FC<PowerChainViewProps> = ({
  powerComponents,
  metrics,
  powerFailureActive,
  onSimulatePowerFailure,
}) => {
  const gridA = powerComponents.find((p) => p.id === 'GRID-01')!;
  const gridB = powerComponents.find((p) => p.id === 'GRID-02')!;
  const gen1 = powerComponents.find((p) => p.id === 'GEN-01')!;
  const gen2 = powerComponents.find((p) => p.id === 'GEN-02')!;
  const upsA = powerComponents.find((p) => p.id === 'UPS-A')!;
  const upsB = powerComponents.find((p) => p.id === 'UPS-B')!;
  const sts = powerComponents.find((p) => p.id === 'STS-01')!;
  const pdu1 = powerComponents.find((p) => p.id === 'PDU-HALL-1')!;
  const pdu2 = powerComponents.find((p) => p.id === 'PDU-HALL-2')!;

  return (
    <div id="power-chain-topology-view" className="space-y-5">
      {/* Top Banner & Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Power Chain Single-Line Diagram (SLD) & 2N Redundancy
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
              Tier IV 2(N+1) Concurrent Maintainability
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Utility 33kV Substation • Cummins 2500kVA Standby Gensets • Dual Lithium-Ion UPS Strings A & B
          </p>
        </div>

        {/* Drill Toggle Button */}
        <button
          id="btn-simulate-grid-outage-sld"
          onClick={onSimulatePowerFailure}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
            powerFailureActive
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{powerFailureActive ? 'RESTORE UTILITY 33kV GRID' : 'TEST UTILITY GRID DROPOUT'}</span>
        </button>
      </div>

      {/* Grid Outage Status Alert Banner */}
      {powerFailureActive && (
        <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-red-900 text-red-100 animate-bounce">
              <AlertTriangle className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">
                CRITICAL POWER SIMULATION: UTILITY SUBSTATION LOSS
              </div>
              <p className="text-xs text-red-300">
                Automatic Transfer Switch (ATS) engaged • UPS Strings A & B discharging battery reserves • Cummins Diesel Generators auto-cranking.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-red-700 text-amber-300">
              UPS Discharge: <strong>46 Mins Left</strong>
            </div>
            <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-red-700 text-emerald-400">
              Genset RPM: <strong>1500 (Syncd)</strong>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Single-Line Topology Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Tier 1: Utility Substation Feeds A & B */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Stage 1: Primary Dual 33kV Utility Ingress
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feed A */}
            <div className={`p-4 rounded-xl border transition-all ${
              powerFailureActive 
                ? 'bg-red-950/40 border-red-700 text-red-300' 
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className={`w-5 h-5 ${powerFailureActive ? 'text-red-400' : 'text-cyan-400'}`} />
                  <h4 className="font-bold text-sm text-white">{gridA.name}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  powerFailureActive ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {powerFailureActive ? 'Offline (Lost)' : 'Synchronized'}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                <div>Voltage: <strong className="text-white">{powerFailureActive ? '0V' : '33.0 kV'}</strong></div>
                <div>Active: <strong className="text-cyan-300">{powerFailureActive ? '0 kW' : `${gridA.currentKw} kW`}</strong></div>
                <div>Freq: <strong className="text-emerald-400">{powerFailureActive ? '0 Hz' : `${gridA.frequencyHz} Hz`}</strong></div>
              </div>
            </div>

            {/* Feed B */}
            <div className={`p-4 rounded-xl border transition-all ${
              powerFailureActive 
                ? 'bg-red-950/40 border-red-700 text-red-300' 
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className={`w-5 h-5 ${powerFailureActive ? 'text-red-400' : 'text-cyan-400'}`} />
                  <h4 className="font-bold text-sm text-white">{gridB.name}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  powerFailureActive ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {powerFailureActive ? 'Offline (Lost)' : 'Synchronized'}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                <div>Voltage: <strong className="text-white">{powerFailureActive ? '0V' : '33.0 kV'}</strong></div>
                <div>Active: <strong className="text-cyan-300">{powerFailureActive ? '0 kW' : `${gridB.currentKw} kW`}</strong></div>
                <div>Freq: <strong className="text-emerald-400">{powerFailureActive ? '0 Hz' : `${gridB.frequencyHz} Hz`}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Switch Arrow Bridge */}
        <div className="flex justify-around items-center text-slate-500 py-1 font-mono text-[11px]">
          <div className="flex items-center gap-1">
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Busway Feed Path A</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Busway Feed Path B</span>
          </div>
        </div>

        {/* Tier 2: Emergency Diesel Standby Generators */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-amber-400" />
              Stage 2: Standby Diesel Generation (Cummins 2500kVA N+1)
            </span>
            <span className="text-[11px] text-emerald-400">On-Site Fuel Reserve: 72 Hours Continuous</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
              powerFailureActive 
                ? 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md animate-pulse' 
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div>
                <div className="font-bold text-xs text-white">{gen1.name}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Fuel: <strong className="text-emerald-400">{gen1.fuelLevelPercent}%</strong> • Engine Block Heater: 45°C Ready
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                powerFailureActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {powerFailureActive ? 'Running & Supplying' : 'Warm Standby'}
              </span>
            </div>

            <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
              powerFailureActive 
                ? 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md animate-pulse' 
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div>
                <div className="font-bold text-xs text-white">{gen2.name}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Fuel: <strong className="text-emerald-400">{gen2.fuelLevelPercent}%</strong> • Engine Block Heater: 45°C Ready
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                powerFailureActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {powerFailureActive ? 'Running & Supplying' : 'Warm Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Transfer Switch Arrow Bridge */}
        <div className="flex justify-around items-center text-slate-500 py-1 font-mono text-[11px]">
          <div className="flex items-center gap-1">
            <ArrowDown className="w-4 h-4 text-emerald-400" />
            <span>Dual Battery Inverters</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-4 h-4 text-emerald-400" />
            <span>Static Transfer Bypass</span>
          </div>
        </div>

        {/* Tier 3: Dual 2N UPS Strings (String A and String B) */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            Stage 3: 2N Continuous Power Conditioning (Rotary & Lithium-Ion UPS)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UPS A */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BatteryCharging className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">{upsA.name}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {powerFailureActive ? 'Discharging (Battery)' : 'Online Double-Conversion'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>Load: <strong className="text-cyan-300">{upsA.currentKw} kW</strong></div>
                <div>Runtime: <strong className="text-emerald-400">{upsA.batteryRuntimeMin} min</strong></div>
                <div>Efficiency: <strong className="text-white">{upsA.efficiencyPercent}%</strong></div>
              </div>

              {/* 3-Phase load meter */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px] font-mono">
                <div className="text-slate-400 flex justify-between">
                  <span>Phase Balancing:</span>
                  <span className="text-emerald-400">0.8% Imbalance (Nominal)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    L1: <strong className="text-cyan-300">{upsA.phaseL1Load}%</strong>
                  </div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    L2: <strong className="text-cyan-300">{upsA.phaseL2Load}%</strong>
                  </div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    L3: <strong className="text-cyan-300">{upsA.phaseL3Load}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* UPS B */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BatteryCharging className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-sm text-white">{upsB.name}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {powerFailureActive ? 'Discharging (Battery)' : 'Online Double-Conversion'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>Load: <strong className="text-cyan-300">{upsB.currentKw} kW</strong></div>
                <div>Runtime: <strong className="text-emerald-400">{upsB.batteryRuntimeMin} min</strong></div>
                <div>Efficiency: <strong className="text-white">{upsB.efficiencyPercent}%</strong></div>
              </div>

              {/* 3-Phase load meter */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px] font-mono">
                <div className="text-slate-400 flex justify-between">
                  <span>Phase Balancing:</span>
                  <span className="text-emerald-400">0.6% Imbalance (Nominal)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    L1: <strong className="text-blue-300">{upsB.phaseL1Load}%</strong>
                  </div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    L2: <strong className="text-blue-300">{upsB.phaseL2Load}%</strong>
                  </div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">
                    L3: <strong className="text-blue-300">{upsB.phaseL3Load}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 4: Floor PDUs Feeding 48 Racks in Aisles A-D */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Stage 4: Data Hall Floor Isolation PDUs (Sub-Floor Distribution)
            </span>
            <span className="text-cyan-400">Total IT Whitespace Consumption: {metrics.totalItLoadMw} MW</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">{pdu1.name}</div>
                <div className="text-slate-400 text-[11px]">Feeds Aisles A & B (SuperPOD & Cloud)</div>
              </div>
              <div className="text-right">
                <div className="text-cyan-300 font-bold">{pdu1.currentKw} kW</div>
                <div className="text-[10px] text-emerald-400">3-Phase 400V Balanced</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">{pdu2.name}</div>
                <div className="text-slate-400 text-[11px]">Feeds Aisles C & D (SAN & Carrier)</div>
              </div>
              <div className="text-right">
                <div className="text-cyan-300 font-bold">{pdu2.currentKw} kW</div>
                <div className="text-[10px] text-emerald-400">3-Phase 400V Balanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
