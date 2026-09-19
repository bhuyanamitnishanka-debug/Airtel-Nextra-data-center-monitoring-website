import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Fan, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  AlertCircle,
  Zap,
  Gauge
} from 'lucide-react';
import { CoolingUnit, DataCenterMetrics } from '../types';

interface CoolingHvacViewProps {
  coolingUnits: CoolingUnit[];
  metrics: DataCenterMetrics;
  onUpdateUnitMode: (unitId: string, mode: 'auto' | 'boost' | 'eco') => void;
  onAdjustSetpoint: (newTemp: number) => void;
}

export const CoolingHvacView: React.FC<CoolingHvacViewProps> = ({
  coolingUnits,
  metrics,
  onUpdateUnitMode,
  onAdjustSetpoint,
}) => {
  const [economizerActive, setEconomizerActive] = useState<boolean>(false);
  const [targetSetpoint, setTargetSetpoint] = useState<number>(20.0);

  const crahUnits = coolingUnits.filter((u) => u.type === 'crah');
  const chillers = coolingUnits.filter((u) => u.type === 'chiller');

  const handleSetpointChange = (val: number) => {
    setTargetSetpoint(val);
    onAdjustSetpoint(val);
  };

  return (
    <div id="cooling-hvac-scada-view" className="space-y-5">
      {/* Header Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-teal-400" />
              Thermal Management & In-Row CRAH Cooling SCADA
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
              Closed Cold-Aisle Containment
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Overhead Chilled Water Distribution • Sub-floor Static Pressure Plenum (+23.8 Pa) • EC Fan Array
          </p>
        </div>

        {/* Global Economizer Mode */}
        <div className="flex items-center space-x-3">
          <button
            id="btn-toggle-economizer"
            onClick={() => setEconomizerActive(!economizerActive)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
              economizerActive
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>{economizerActive ? 'Free Cooling Economizer: ACTIVE' : 'Enable Free Cooling (Economizer)'}</span>
          </button>
        </div>
      </div>

      {/* Main Environmental Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Cold Supply Plenum */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            Plenum Supply Temp
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {metrics.coldAisleAvgTemp}°C
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Target Setpoint: {targetSetpoint.toFixed(1)}°C
          </div>
        </div>

        {/* Hot Exhaust Return */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            Hot Exhaust Return
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {metrics.hotAisleAvgTemp}°C
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Delta T: {(metrics.hotAisleAvgTemp - metrics.coldAisleAvgTemp).toFixed(1)}°C
          </div>
        </div>

        {/* Sub-floor Pressure Differential */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            Plenum Differential Pa
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            +{metrics.floorPressurePa} <span className="text-sm font-normal text-slate-400">Pa</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">
            Positive pressure seal intact
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            Relative Humidity
          </div>
          <div className="text-2xl font-bold font-mono text-blue-300">
            {metrics.humidityPercent}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            ASHRAE Class A1 Thermal Envelope
          </div>
        </div>
      </div>

      {/* Target Setpoint Slider Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Cold Aisle Target Temperature Optimization
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Adjusting setpoint dynamically modulates CRAH variable speed EC fan frequencies.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-72">
          <span className="text-xs font-mono text-slate-400">18°C</span>
          <input
            id="slider-cooling-setpoint"
            type="range"
            min={18}
            max={24}
            step={0.5}
            value={targetSetpoint}
            onChange={(e) => handleSetpointChange(parseFloat(e.target.value))}
            className="flex-1 accent-cyan-400 cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400">24°C</span>
          <span className="text-sm font-bold font-mono text-cyan-300 min-w-[50px]">
            {targetSetpoint.toFixed(1)}°C
          </span>
        </div>
      </div>

      {/* In-Row CRAH Unit Stations */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Fan className="w-4 h-4 text-cyan-400 animate-spin" />
            In-Row Precision Air Handlers (CRAH Pods)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Total Cooling Power Draw: <strong className="text-cyan-300">{(metrics.coolingLoadMw * 1000).toFixed(0)} kW</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crahUnits.map((unit) => (
            <div
              key={unit.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{unit.name}</h4>
                  <div className="text-[11px] font-mono text-slate-400">{unit.zone}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    unit.mode === 'boost' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                    unit.mode === 'eco' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {unit.mode} Mode
                  </span>
                </div>
              </div>

              {/* Fan & Temp telemetry */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <div>
                  <div className="text-slate-400 text-[10px]">Supply Air:</div>
                  <div className="text-cyan-300 font-bold">{unit.supplyTempC}°C</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Return Air:</div>
                  <div className="text-amber-300 font-bold">{unit.returnTempC}°C</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">EC Fan Speed:</div>
                  <div className="text-emerald-400 font-bold">{unit.fanSpeedPercent}%</div>
                </div>
              </div>

              {/* Mode Selector Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] font-mono text-slate-400">Fan Profile:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateUnitMode(unit.id, 'auto')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                      unit.mode === 'auto' ? 'bg-cyan-600 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => onUpdateUnitMode(unit.id, 'boost')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                      unit.mode === 'boost' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Boost (Hotspot)
                  </button>
                  <button
                    onClick={() => onUpdateUnitMode(unit.id, 'eco')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                      unit.mode === 'eco' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Eco
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Central Chiller Plant Telemetry */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Central Energy Plant: Chilled Water Loops (2N Redundant)
            </span>
            <span className="text-emerald-400">Variable Flow Secondary Pumps Online</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chillers.map((chiller) => (
              <div key={chiller.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{chiller.name}</span>
                  <span className="text-emerald-400">98.2% COP Efficiency</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-slate-300">
                  <div>Supply: <strong className="text-cyan-300">{chiller.supplyTempC}°C</strong></div>
                  <div>Return: <strong className="text-blue-300">{chiller.returnTempC}°C</strong></div>
                  <div>Flow: <strong className="text-white">{chiller.flowRateGpm} GPM</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
