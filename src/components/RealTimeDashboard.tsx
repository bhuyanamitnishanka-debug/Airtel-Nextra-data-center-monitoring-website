import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Thermometer, 
  Zap, 
  Network, 
  Activity, 
  Gauge, 
  Wind, 
  Droplets, 
  Radio, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Maximize2,
  RefreshCw,
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { 
  DataCenterMetrics, 
  EnvironmentalFeed, 
  NetworkTrafficFeed, 
  PowerFeed, 
  Rack, 
  ServerStatusFeed, 
  TimeSeriesPoint 
} from '../types';
import { 
  INITIAL_NETWORK_TIMESERIES, 
  INITIAL_POWER_TIMESERIES, 
  INITIAL_THERMAL_TIMESERIES 
} from '../data/datacenterMockData';

interface RealTimeDashboardProps {
  metrics: DataCenterMetrics;
  racks: Rack[];
  liveTicking: boolean;
  onToggleLiveTicking: () => void;
  onNavigateToRack: (rackId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({
  metrics,
  racks,
  liveTicking,
  onToggleLiveTicking,
  onNavigateToRack,
  onNavigateToTab,
}) => {
  const [activeFeed, setActiveFeed] = useState<'all' | 'servers' | 'environment' | 'power' | 'network'>('all');
  const [timeWindow, setTimeWindow] = useState<'15m' | '1h' | '24h'>('24h');
  const [showArchitectureDiagram, setShowArchitectureDiagram] = useState<boolean>(true);

  // Compute live server status aggregates
  const totalRacks = racks.length;
  let totalServers = 0;
  let serversUp = 0;
  let serversWarning = 0;
  let serversMaint = 0;
  let serversDown = 0;
  let totalCpu = 0;
  let totalRam = 0;

  racks.forEach((r) => {
    r.devices.forEach((d) => {
      totalServers++;
      if (d.status === 'online') serversUp++;
      else if (d.status === 'warning') serversWarning++;
      else if (d.status === 'maintenance') serversMaint++;
      else serversDown++;

      totalCpu += d.cpuUsage;
      totalRam += d.ramUsage;
    });
  });

  const avgCpu = totalServers > 0 ? Math.round(totalCpu / totalServers) : 48;
  const avgRam = totalServers > 0 ? Math.round(totalRam / totalServers) : 58;

  // Live fluctuating power & network jitter
  const liveBandwidthIn = 135 + Math.round((Math.random() - 0.5) * 6);
  const liveBandwidthOut = 112 + Math.round((Math.random() - 0.5) * 5);
  const loadAvg1m = (1.42 + (Math.random() - 0.5) * 0.05).toFixed(2);
  const loadAvg5m = (1.38 + (Math.random() - 0.5) * 0.03).toFixed(2);
  const loadAvg15m = '1.29';

  return (
    <div id="real-time-monitoring-dashboard" className="space-y-6">
      {/* Top Telemetry Control & Feed Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Real-Time Data Center Monitoring Dashboard
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Continuous SCADA & BMS Telemetry Feeds: Server Fleet, Thermal Envelopes, 2N Power, and Optical Backbone.
            </p>
          </div>
        </div>

        {/* Live Ticker Toggle & Feed Selector */}
        <div className="flex items-center space-x-2 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['all', 'servers', 'environment', 'power', 'network'] as const).map((feed) => (
              <button
                key={feed}
                onClick={() => setActiveFeed(feed)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  activeFeed === feed
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {feed === 'all' ? 'All Feeds' : feed}
              </button>
            ))}
          </div>

          {onNavigateToTab && (
            <button
              id="btn-goto-capacity-trends"
              onClick={() => onNavigateToTab('capacity_trends')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border border-cyan-700/80 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 transition-colors shadow-sm"
              title="Switch to 30-Day Historical Trend with Daily & Weekly Granularity"
            >
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>30-Day Recharts Trends</span>
            </button>
          )}

          <button
            onClick={onToggleLiveTicking}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              liveTicking
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${liveTicking ? 'animate-spin' : ''}`} />
            <span>{liveTicking ? 'Auto-Poll: 2.8s' : 'Polling Paused'}</span>
          </button>
        </div>
      </div>

      {/* Hand-Drawn Blueprint Reference: "How a Data Center Works & Cooling Thermodynamics" */}
      {showArchitectureDiagram && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-800/60 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-400">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Physical Principle: Closed-Loop Containment & Server Heat Dissipation
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                  Blueprint Reference
                </span>
              </h3>
            </div>
            <button
              onClick={() => setShowArchitectureDiagram(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕ Hide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono pt-1">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-cyan-400 font-bold flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                1. Cool Air Intake (Front)
              </div>
              <p className="text-[11px] text-slate-300">
                Chilled air is delivered at <strong>{metrics.coldAisleAvgTemp}°C</strong> via overhead ducts & subfloor plenum (+23.8 Pa) into server front grilles.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-indigo-300 font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                2. Inside Server Cooling
              </div>
              <p className="text-[11px] text-slate-300">
                Internal high-RPM fan banks pull cool air directly across the CPU heatsinks, RAM DIMMs, and NVMe storage drives.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />
                3. Hot Air Exhaust (To Rear)
              </div>
              <p className="text-[11px] text-slate-300">
                Heated air exhausts at <strong>{metrics.hotAisleAvgTemp}°C</strong> (Delta T: +{(metrics.hotAisleAvgTemp - metrics.coldAisleAvgTemp).toFixed(1)}°C) directly into isolated hot-aisle chimneys.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                4. Backup UPS & Grid Link
              </div>
              <p className="text-[11px] text-slate-300">
                Rotary UPS and standby Cummins diesel generators ensure continuous power to servers, while core switches route fiber traffic to the Internet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FEED 1: SERVER STATUS */}
      {(activeFeed === 'all' || activeFeed === 'servers') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  Feed 1: Server Status & Compute Load Average
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Cluster Up/Down Telemetry • CPU & Memory Utilization • Load Average Gauges
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-400">Total Monitored Nodes:</span>
              <strong className="text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{totalServers}</strong>
            </div>
          </div>

          {/* Server Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {/* Status: UP */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Nodes Online (Up)
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{serversUp}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {((serversUp / totalServers) * 100).toFixed(1)}% availability
              </div>
            </div>

            {/* Status: WARNING */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Thermal Warning
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">{serversWarning}</div>
              <div className="text-[10px] text-amber-400 font-mono">Cabinet B-04 (Blanking)</div>
            </div>

            {/* Status: MAINTENANCE */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Maintenance</div>
              <div className="text-2xl font-bold font-mono text-blue-400">{serversMaint}</div>
              <div className="text-[10px] text-slate-400 font-mono">Crash Cart Attached</div>
            </div>

            {/* Status: DOWN */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Nodes Offline (Down)</div>
              <div className="text-2xl font-bold font-mono text-slate-400">{serversDown}</div>
              <div className="text-[10px] text-emerald-400 font-mono">0 Unplanned Outages</div>
            </div>

            {/* Load Average: 1m / 5m / 15m */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 col-span-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Cluster Load Average</span>
                <span className="text-cyan-400">1m / 5m / 15m</span>
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300 flex items-center space-x-2">
                <span>{loadAvg1m}</span>
                <span className="text-slate-600">/</span>
                <span>{loadAvg5m}</span>
                <span className="text-slate-600">/</span>
                <span>{loadAvg15m}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Healthy multi-threaded distribution (Target &lt; 2.50)
              </div>
            </div>
          </div>

          {/* Average Resource Utilization Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Fleet Aggregate CPU Load:
                </span>
                <strong className="text-cyan-300">{avgCpu}%</strong>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${avgCpu}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                  Cluster Memory (RAM) Allocation:
                </span>
                <strong className="text-indigo-300">{avgRam}%</strong>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${avgRam}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEED 2: ENVIRONMENTAL CONDITIONS */}
      {(activeFeed === 'all' || activeFeed === 'environment') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-teal-950 border border-teal-800 text-teal-400">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  Feed 2: Environmental Conditions & Thermodynamics
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Intake vs Return Temperatures • Relative Humidity • Subfloor Positive Pressure Plenum
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
              ASHRAE Class A1 Envelope
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Cold Aisle Supply Temp */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Cold Aisle Supply Temp
              </div>
              <div className="text-3xl font-bold font-mono text-cyan-300">
                {metrics.coldAisleAvgTemp}°C
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Optimal range: 18°C – 22°C
              </div>
            </div>

            {/* Hot Exhaust Return Temp */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Hot Exhaust Return Temp
              </div>
              <div className="text-3xl font-bold font-mono text-amber-300">
                {metrics.hotAisleAvgTemp}°C
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Delta T: +{(metrics.hotAisleAvgTemp - metrics.coldAisleAvgTemp).toFixed(1)}°C
              </div>
            </div>

            {/* Relative Humidity */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Relative Humidity
              </div>
              <div className="text-3xl font-bold font-mono text-blue-300">
                {metrics.humidityPercent}%
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Non-condensing moisture barrier
              </div>
            </div>

            {/* Subfloor Static Air Pressure */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                Sub-floor Static Pressure
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-300">
                +{metrics.floorPressurePa} <span className="text-sm font-normal text-slate-400">Pa</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Positive seal prevents leakage
              </div>
            </div>
          </div>

          {/* 24-Point Thermal Trend SVG Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                24-Hour Thermal Trajectory (°C)
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Cold Supply
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Hot Exhaust
                </span>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="w-full h-36 relative">
              <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                {/* Hot Exhaust Line (v2) */}
                <path
                  d={INITIAL_THERMAL_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_THERMAL_TIMESERIES.length - 1)) * 500;
                    // scale 30°C - 36°C to y: 15 to 55
                    const y = 90 - (pt.v2! - 31) * 16;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Cold Supply Line (v1) */}
                <path
                  d={INITIAL_THERMAL_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_THERMAL_TIMESERIES.length - 1)) * 500;
                    // scale 19°C - 22°C to y: 80 to 110
                    const y = 115 - (pt.v1 - 19.5) * 22;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {INITIAL_THERMAL_TIMESERIES.map((pt, i) => {
                  const x = (i / (INITIAL_THERMAL_TIMESERIES.length - 1)) * 500;
                  const yHot = 90 - (pt.v2! - 31) * 16;
                  const yCold = 115 - (pt.v1 - 19.5) * 22;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yHot} r="3" fill="#fbbf24" />
                      <circle cx={x} cy={yCold} r="3" fill="#22d3ee" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* FEED 3: POWER USAGE & PDU STATUS */}
      {(activeFeed === 'all' || activeFeed === 'power') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-amber-950 border border-amber-800 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  Feed 3: Power Consumption & Redundant PDU Feeds
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Total Megawatts • Redundant PDU A & B Health • UPS Autonomy & PUE Ratio
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Efficiency:</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                PUE {metrics.pue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total IT Load */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Total IT Compute Load</div>
              <div className="text-3xl font-bold font-mono text-cyan-300">
                {metrics.totalItLoadMw.toFixed(2)} <span className="text-sm font-normal text-slate-400">MW</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Facility Gross: {metrics.facilityLoadMw.toFixed(2)} MW
              </div>
            </div>

            {/* Redundant PDU A Feed */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase font-bold text-cyan-400">Floor PDU A (Primary)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                  ONLINE
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">231.2 V / 824 A</div>
              <div className="text-[10px] text-slate-400 font-mono">
                Phase Imbalance: 0.8% • PF: 0.99
              </div>
            </div>

            {/* Redundant PDU B Feed */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase font-bold text-purple-400">Floor PDU B (Secondary)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                  ONLINE
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">230.8 V / 818 A</div>
              <div className="text-[10px] text-slate-400 font-mono">
                Phase Imbalance: 0.6% • Dual Cord Redundant
              </div>
            </div>
          </div>

          {/* 24-Hour Megawatt Power Curve */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                24-Hour Electrical Demand Curve (Megawatts)
              </span>
              <span className="text-slate-400 text-[11px]">
                UPS Battery Autonomy: <strong className="text-emerald-400">48 mins @ 100% Load</strong>
              </span>
            </div>

            <div className="w-full h-28 relative">
              <svg viewBox="0 0 500 90" className="w-full h-full overflow-visible">
                {/* Fill Area */}
                <path
                  d={`${INITIAL_POWER_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_POWER_TIMESERIES.length - 1)) * 500;
                    const y = 80 - (pt.v1 - 3.0) * 110;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')} L 500 90 L 0 90 Z`}
                  fill="rgba(245, 158, 11, 0.12)"
                />
                {/* Stroke */}
                <path
                  d={INITIAL_POWER_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_POWER_TIMESERIES.length - 1)) * 500;
                    const y = 80 - (pt.v1 - 3.0) * 110;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* FEED 4: NETWORK TRAFFIC & BANDWIDTH */}
      {(activeFeed === 'all' || activeFeed === 'network') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  Feed 4: Network Traffic & Optical Bandwidth Utilization
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Ingress / Egress Throughput • Top-of-Rack Switch Saturation • Packet Loss & Latency
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
              400GbE / 100GbE Backbone
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Live Ingress */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Live Ingress Traffic</div>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {liveBandwidthIn} <span className="text-sm font-normal text-slate-400">Gbps</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Transit Carriers Active</div>
            </div>

            {/* Live Egress */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Live Egress Traffic</div>
              <div className="text-3xl font-bold font-mono text-cyan-400">
                {liveBandwidthOut} <span className="text-sm font-normal text-slate-400">Gbps</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">CDN Edge Sync Nominal</div>
            </div>

            {/* Latency */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Intra-Hall Latency</div>
              <div className="text-3xl font-bold font-mono text-white">
                0.85 <span className="text-sm font-normal text-slate-400">ms</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">Zero packet drop detected</div>
            </div>

            {/* ToR Switch Port Saturation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">ToR Port Saturation</div>
              <div className="text-3xl font-bold font-mono text-purple-300">
                68.4%
              </div>
              <div className="text-[10px] text-slate-400 font-mono">32x 100G Uplinks Healthy</div>
            </div>
          </div>

          {/* Network Throughput Area Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Ingress vs Egress Bandwidth Stream (Gbps)
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Ingress
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Egress
                </span>
              </div>
            </div>

            <div className="w-full h-32 relative">
              <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
                {/* Ingress Line & Area */}
                <path
                  d={`${INITIAL_NETWORK_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_NETWORK_TIMESERIES.length - 1)) * 500;
                    const y = 95 - (pt.v1 - 40) * 0.85;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')} L 500 100 L 0 100 Z`}
                  fill="rgba(16, 185, 129, 0.1)"
                />
                <path
                  d={INITIAL_NETWORK_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_NETWORK_TIMESERIES.length - 1)) * 500;
                    const y = 95 - (pt.v1 - 40) * 0.85;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Egress Line */}
                <path
                  d={INITIAL_NETWORK_TIMESERIES.map((pt, i) => {
                    const x = (i / (INITIAL_NETWORK_TIMESERIES.length - 1)) * 500;
                    const y = 95 - (pt.v2! - 40) * 0.85;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
