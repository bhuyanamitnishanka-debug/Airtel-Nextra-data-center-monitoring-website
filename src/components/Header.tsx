import React from 'react';
import { 
  Server, 
  Activity, 
  Zap, 
  Thermometer, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Play, 
  Pause,
  Layers,
  Leaf,
  Clock,
  Building2,
  TrendingUp
} from 'lucide-react';
import { DataCenterMetrics } from '../types';

interface HeaderProps {
  metrics: DataCenterMetrics;
  liveTicking: boolean;
  onToggleLiveTicking: () => void;
  onOpenImageAnalysis: () => void;
  onNavigateToAnatomy?: () => void;
  onNavigateToCapacityTrends?: () => void;
  onNavigateToNocAlerts?: () => void;
  onNavigateToSustainability?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeAlertCount: number;
  onTriggerSimulatedAlert: () => void;
  onSimulatePowerFailure: () => void;
  powerFailureActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  liveTicking,
  onToggleLiveTicking,
  onOpenImageAnalysis,
  onNavigateToAnatomy,
  onNavigateToCapacityTrends,
  onNavigateToNocAlerts,
  onNavigateToSustainability,
  soundEnabled,
  onToggleSound,
  activeAlertCount,
  onTriggerSimulatedAlert,
  onSimulatePowerFailure,
  powerFailureActive,
}) => {
  return (
    <header id="dcim-main-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* Top Banner Ticker */}
      <div className="bg-slate-950/90 px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${powerFailureActive ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${powerFailureActive ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            SYSTEM: {powerFailureActive ? 'AUXILIARY UPS DISCHARGE MODE' : 'PRIMARY GRID SYNCHRONIZED'}
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            FACILITY: <strong className="text-white">Nxtra BLR-01 Hyperscale Hall Alpha</strong>
          </span>
          <span className="text-slate-400 hidden lg:inline">|</span>
          <span className="text-slate-400 hidden lg:inline">
            CONTAINMENT: <span className="text-emerald-400">Cold Aisle Dual-Plenum Active (+23.8 Pa)</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">UTC 12:51:44</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px]">TIER IV UPTIME: 99.999%</span>
          </div>

          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Reference Badge */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Nxtra<span className="text-cyan-400 font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">DCIM</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-medium">
                Internal Management Console
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hyperscale White Space • 42U Telemetry • Power Chain & BMS
            </p>
          </div>
        </div>

        {/* Live Operational Metric Pill Clusters */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          {/* PUE KPI */}
          <button
            onClick={onNavigateToSustainability}
            className={`rounded-lg px-3 py-1.5 flex items-center space-x-2 border transition-all text-left ${
              onNavigateToSustainability
                ? 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 hover:border-emerald-500 cursor-pointer group'
                : 'bg-slate-800/80 border-slate-700/80 cursor-default'
            }`}
            title="Click to view 30-Day PUE Trends & Energy-Saving Modifications"
          >
            <div className="p-1.5 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 group-hover:text-emerald-300">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                <span>PUE Target</span>
                <span className="text-[9px] text-emerald-400 font-bold">30D</span>
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono leading-none">
                {metrics.pue.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">Eff.</span>
              </div>
            </div>
          </button>

          {/* IT Load */}
          <button
            onClick={onNavigateToCapacityTrends}
            className={`rounded-lg px-3 py-1.5 flex items-center space-x-2 border transition-all text-left ${
              onNavigateToCapacityTrends 
                ? 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 hover:border-cyan-600 cursor-pointer group' 
                : 'bg-slate-800/80 border-slate-700/80 cursor-default'
            }`}
            title="Click to inspect 30-Day Historical Trend for IT Load & Rack Capacity"
          >
            <div className="p-1.5 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 group-hover:text-cyan-300">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                <span>IT Power Load</span>
                <span className="text-[9px] text-cyan-400 font-bold">30D</span>
              </div>
              <div className="text-sm font-bold text-cyan-300 font-mono leading-none">
                {metrics.totalItLoadMw.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">MW</span>
              </div>
            </div>
          </button>

          {/* Hall Thermal */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Supply / Return</div>
              <div className="text-sm font-bold text-blue-300 font-mono leading-none">
                {metrics.coldAisleAvgTemp.toFixed(1)}° <span className="text-[11px] text-amber-400">/ {metrics.hotAisleAvgTemp.toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          {/* Active Alarms */}
          <button
            id="btn-header-noc-alerts"
            onClick={onNavigateToNocAlerts}
            title="Open NOC Command Bridge, Alert Trends & Proactive Maintenance"
            className={`rounded-lg px-3 py-1.5 flex items-center space-x-2 border transition-colors text-left ${
              activeAlertCount > 0 
                ? 'bg-amber-950/60 hover:bg-amber-900/60 border-amber-800/80 text-amber-300 shadow-sm' 
                : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-300'
            }`}
          >
            <div className={`p-1.5 rounded-md border ${
              activeAlertCount > 0 
                ? 'bg-amber-900/60 border-amber-700 text-amber-400' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">NOC Alerts</div>
              <div className="text-sm font-bold font-mono leading-none flex items-center gap-1">
                {activeAlertCount} <span className="text-[10px] font-normal text-slate-400">Active</span>
                <span className="text-[10px] text-emerald-400 font-bold ml-1">• PM</span>
              </div>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* 30-Day Recharts Trends Button */}
          {onNavigateToCapacityTrends && (
            <button
              id="btn-open-capacity-trends-header"
              onClick={onNavigateToCapacityTrends}
              className="px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Open 30-Day Recharts Historical Trend for IT Load & Rack Capacity"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">30-Day Trends</span>
              <span className="text-[10px] px-1 py-0.5 bg-emerald-400 text-slate-950 rounded font-mono font-bold">Recharts</span>
            </button>
          )}

          {/* 14-Feature Anatomy Blueprint Button */}
          {onNavigateToAnatomy && (
            <button
              id="btn-open-facility-anatomy"
              onClick={onNavigateToAnatomy}
              className="px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Open The Anatomy of a Data Center (14 Features Blueprint)"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Facility Anatomy</span>
              <span className="text-[10px] px-1 py-0.5 bg-cyan-500 text-slate-950 rounded font-mono font-bold">14</span>
            </button>
          )}

          {/* Reference Image Analysis Modal Toggle */}
          <button
            id="btn-inspect-reference-photo"
            onClick={onOpenImageAnalysis}
            className="px-3 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            title="Inspect how the reference image translates to datacenter software features"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Facility Photo Analysis</span>
          </button>

          {/* Live Simulator Ticker Toggle */}
          <button
            id="btn-toggle-telemetry-stream"
            onClick={onToggleLiveTicking}
            className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              liveTicking 
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/70' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {liveTicking ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Feed ON</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>Feed Paused</span>
              </>
            )}
          </button>

          {/* Simulation Drills Dropdown / Action */}
          <button
            id="btn-drill-power-outage"
            onClick={onSimulatePowerFailure}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              powerFailureActive
                ? 'bg-red-950/80 border-red-600 text-red-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700/90 border-slate-700 text-slate-300'
            }`}
            title="Simulate Grid failure and watch automatic UPS switchover"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{powerFailureActive ? 'Grid Outage Active!' : 'Test Grid Outage'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
