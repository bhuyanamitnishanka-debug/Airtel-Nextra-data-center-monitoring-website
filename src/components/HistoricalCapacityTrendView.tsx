import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  BarChart
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Server,
  Zap,
  Thermometer,
  ShieldCheck,
  Eye,
  BatteryCharging,
  Fuel,
  Network,
  Snowflake,
  Fan,
  Building2,
  ArrowUpRight,
  Sparkles,
  Download,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Cpu,
  HardDrive,
  Leaf
} from 'lucide-react';
import { 
  DAILY_HISTORICAL_DATA, 
  WEEKLY_HISTORICAL_DATA, 
  ENRICHED_DAILY_HISTORICAL_DATA,
  ENRICHED_WEEKLY_HISTORICAL_DATA,
  FACILITY_SUBSYSTEMS 
} from '../data/historicalCapacityData';
import { HistoricalDataPoint, FacilitySubsystemInfo } from '../types';
import { ExportCapacityCsvModal } from './capacity/ExportCapacityCsvModal';
import { ServerRackWorkingFlowCard } from './capacity/ServerRackWorkingFlowCard';
import { AiProjectionInsightsCard } from './capacity/AiProjectionInsightsCard';
import { generateCapacityProjections, ProjectedDataPoint } from '../utils/linearRegression';

interface HistoricalCapacityTrendViewProps {
  onNavigateToTab?: (tabId: string) => void;
  onNavigateToRack?: (rackId: string) => void;
}

// Map subsystem icon names to Lucide components
const SubsystemIconMap: Record<string, any> = {
  Server,
  Fan,
  Thermometer,
  Snowflake,
  BatteryCharging,
  Fuel,
  Network,
  Eye,
  ShieldCheck,
  Building2,
};

export const HistoricalCapacityTrendView: React.FC<HistoricalCapacityTrendViewProps> = ({
  onNavigateToTab,
  onNavigateToRack,
}) => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly'>('daily');
  const [activeSubsystemId, setActiveSubsystemId] = useState<string | null>('server_rooms');
  const [showPeakLine, setShowPeakLine] = useState<boolean>(true);
  const [showAiProjection, setShowAiProjection] = useState<boolean>(true);
  const [scenarioBoostRacks, setScenarioBoostRacks] = useState<number>(0);
  const [chartMetricMode, setChartMetricMode] = useState<'load_and_capacity' | 'thermal_correlation' | 'power_chain_stress'>('load_and_capacity');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Select base enriched data based on granularity
  const rawData = granularity === 'daily' ? ENRICHED_DAILY_HISTORICAL_DATA : ENRICHED_WEEKLY_HISTORICAL_DATA;

  // Apply scenario boost if user is testing AI Pod expansion
  const chartData = useMemo(() => {
    if (scenarioBoostRacks === 0) return rawData;
    const additionalMw = (scenarioBoostRacks * 18) / 1000; // 18kW per high-density rack
    const additionalPercent = Number(((scenarioBoostRacks / 240) * 100).toFixed(1));

    return rawData.map((d) => ({
      ...d,
      itLoadMw: Number((d.itLoadMw + additionalMw).toFixed(2)),
      itLoadPeakMw: Number((d.itLoadPeakMw + additionalMw * 1.15).toFixed(2)),
      rackCapacityPercent: Math.min(100, Number((d.rackCapacityPercent + additionalPercent).toFixed(1))),
      occupiedRacks: Math.min(240, d.occupiedRacks + scenarioBoostRacks),
      heatExchangerKw: Math.round(d.heatExchangerKw + additionalMw * 980),
      upsLoadPercent: Math.min(100, Number((d.upsLoadPercent + (additionalMw / 4.2) * 100).toFixed(1))),
    }));
  }, [rawData, scenarioBoostRacks]);

  // Compute 30-Day Ordinary Least Squares Linear Regression Projection
  const { projectedData, summary: projectionSummary } = useMemo(() => {
    return generateCapacityProjections(chartData, 30);
  }, [chartData]);

  // Active dataset fed into Recharts (switches when projection is toggled)
  const activeChartData = showAiProjection ? projectedData : chartData;

  // Current stats summary (from historical baseline)
  const latestPoint = chartData[chartData.length - 1];
  const firstPoint = chartData[0];
  const mwGrowth = (latestPoint.itLoadMw - firstPoint.itLoadMw).toFixed(2);
  const rackGrowth = (latestPoint.rackCapacityPercent - firstPoint.rackCapacityPercent).toFixed(1);
  const peakMw = Math.max(...chartData.map((d) => d.itLoadPeakMw));

  const selectedSubsystem = FACILITY_SUBSYSTEMS.find((s) => s.id === activeSubsystemId) || FACILITY_SUBSYSTEMS[0];

  // Export CSV handler
  const handleExportCsv = () => {
    const targetSet = showAiProjection ? projectedData : chartData;
    const headers = 'Period,Date,Classification,IT Load (MW),Peak IT Load (MW),Rack Capacity (%),Occupied Racks,Rooftop Heat Exchangers (kW),UPS Load (%),Fiber Traffic (Gbps),PUE\n';
    const rows = targetSet
      .map(
        (d: any) =>
          `"${d.period}","${d.timestamp}","${d.isProjection ? 'AI Projected' : 'Historical Actual'}",${d.itLoadMw},${d.itLoadPeakMw},${d.rackCapacityPercent},${d.occupiedRacks},${d.heatExchangerKw},${d.upsLoadPercent},${d.networkFiberGbps},${d.pueRatio}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nxtradcim_${showAiProjection ? '30day_projection_' : ''}capacity_${granularity}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: ProjectedDataPoint = payload[0].payload;
      const isProj = !!dataPoint.isProjection;

      if (isProj) {
        return (
          <div className="bg-slate-950 border border-violet-600/90 p-3.5 rounded-xl shadow-2xl text-xs font-mono max-w-xs space-y-2">
            <div className="flex items-center justify-between border-b border-violet-900/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="font-bold text-violet-200 text-sm">{dataPoint.period}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-700">
                AI 30-Day Projection
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-violet-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-violet-400" /> Projected IT Load:
                </span>
                <strong className="text-white text-xs">{dataPoint.projectedItLoadMw || dataPoint.itLoadMw} MW</strong>
              </div>

              {dataPoint.projectedItLoadLowerMw !== undefined && dataPoint.projectedItLoadUpperMw !== undefined && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">90% CI Range:</span>
                  <span className="text-violet-300">
                    [{dataPoint.projectedItLoadLowerMw} – {dataPoint.projectedItLoadUpperMw} MW]
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> Est. Rack Capacity:
                </span>
                <strong className="text-amber-300 text-xs">
                  {dataPoint.projectedRackCapacityPercent || dataPoint.rackCapacityPercent}% ({dataPoint.occupiedRacks}/240 U)
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-teal-400 flex items-center gap-1.5">
                  <Fan className="w-3.5 h-3.5" /> Forecast Heat kW:
                </span>
                <span className="text-teal-300">{dataPoint.heatExchangerKw} kW</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5" /> Projected 2N UPS:
                </span>
                <span className="text-emerald-300">{dataPoint.upsLoadPercent}%</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-violet-950/80 space-y-1 text-[10px] text-slate-400">
              <div className="flex items-center justify-between text-violet-300/90 font-mono">
                <span>Formula: {projectionSummary.itLoadRegression.formula}</span>
                <span>R² = {projectionSummary.itLoadRegression.rSquared}</span>
              </div>
              <div className="text-[9px] text-slate-500 italic">
                Ordinary Least Squares regression with 90% confidence envelope
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="bg-slate-950 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono max-w-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white text-sm">{dataPoint.period}</span>
            <span className="text-slate-400 text-[11px]">{dataPoint.timestamp}</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> IT Load:
              </span>
              <strong className="text-white text-xs">{dataPoint.itLoadMw} MW</strong>
            </div>

            {showAiProjection && dataPoint.regressionFitItLoadMw !== undefined && (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-violet-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Regression Trend:
                </span>
                <span className="text-violet-300">{dataPoint.regressionFitItLoadMw} MW</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-rose-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Peak Spike:
              </span>
              <span className="text-rose-300">{dataPoint.itLoadPeakMw} MW</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> Rack Capacity:
              </span>
              <strong className="text-white text-xs">
                {dataPoint.rackCapacityPercent}% ({dataPoint.occupiedRacks}/240 U)
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-teal-400 flex items-center gap-1.5">
                <Fan className="w-3.5 h-3.5" /> Rooftop Rejection:
              </span>
              <span className="text-teal-300">{dataPoint.heatExchangerKw} kW</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5" /> 2N UPS Load:
              </span>
              <span className="text-emerald-300">{dataPoint.upsLoadPercent}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-400 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" /> Carrier Fiber:
              </span>
              <span className="text-purple-300">{dataPoint.networkFiberGbps} Gbps</span>
            </div>

            {/* Server Rack Working Flow metrics from diagram */}
            <div className="pt-1 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-indigo-400" /> CPU / RAM:
                </span>
                <span className="text-indigo-300 font-mono">
                  {dataPoint.cpuProcessingPercent || 68.4}% / {dataPoint.ramMemoryPercent || 74.2}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-amber-400" /> NVMe IOPS:
                </span>
                <span className="text-amber-300 font-mono">
                  {(dataPoint.storageIops || 56400).toLocaleString()} IOPS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" /> PDU Draw:
                </span>
                <span className="text-emerald-300 font-mono">
                  {dataPoint.pduBranchAmps || 27.8} A ({dataPoint.airflowCfm || 2650} CFM)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>PUE Ratio: <strong className="text-emerald-400">{dataPoint.pueRatio}</strong></span>
            <span>Unallocated: <strong className="text-slate-300">{dataPoint.totalRacks - dataPoint.occupiedRacks} Racks</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="historical-capacity-trend-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                RECHARTS TELEMETRY ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">30-Day Historical Trend & Subsystem Impact</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Total IT Load (MW) & Rack Capacity Utilization
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Long-term capacity modeling tracking compute power consumption against physical rack occupancy, correlated with the 10 data center subsystems from the facility architecture blueprint.
            </p>
          </div>

          {/* Granularity Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Granularity Pill */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                id="btn-granularity-daily"
                onClick={() => setGranularity('daily')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  granularity === 'daily'
                    ? 'bg-cyan-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily (30 Days)</span>
              </button>
              <button
                id="btn-granularity-weekly"
                onClick={() => setGranularity('weekly')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  granularity === 'weekly'
                    ? 'bg-cyan-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Weekly (5 Weeks)</span>
              </button>
            </div>

            {/* Export CSV Buttons */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-open-custom-csv-export"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                title="Open CSV Export customizer with Server Rack working flow columns"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                id="btn-quick-download-csv"
                onClick={handleExportCsv}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
                title="Instant 1-click CSV download"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Quick CSV</span>
              </button>

              {onNavigateToTab && (
                <button
                  id="btn-nav-to-sustainability"
                  onClick={() => onNavigateToTab('energy_sustainability')}
                  className="px-3 py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900 border border-teal-700 text-teal-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Open 30-Day PUE Trends & Energy-Saving Modifications"
                >
                  <Leaf className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden md:inline">Energy & PUE</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Current IT Load</span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {latestPoint.itLoadMw} <span className="text-xs text-cyan-400">MW</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{mwGrowth} MW over 30 days (+{((Number(mwGrowth) / firstPoint.itLoadMw) * 100).toFixed(1)}%)</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Rack Space Occupancy</span>
              <Server className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {latestPoint.rackCapacityPercent}% <span className="text-xs text-slate-400">({latestPoint.occupiedRacks}/240 U)</span>
            </div>
            <div className="text-[10px] font-mono text-amber-300 mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{rackGrowth}% occupancy (+33 Racks deployed)</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>30-Day Peak Spike</span>
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-300 mt-1">
              {peakMw} <span className="text-xs text-rose-400">MW Peak</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              <span>Facility IT Cap: 3.60 MW (78.9% ceiling)</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Rooftop Heat Rejection</span>
              <Fan className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-xl font-bold font-mono text-teal-300 mt-1">
              {latestPoint.heatExchangerKw} <span className="text-xs text-teal-400">kW</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              <span>PUE Efficiency: {latestPoint.pueRatio} (Hyperscale Grade)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Container with Mode Selectors */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>30-Day Capacity Trend Telemetry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                  {granularity === 'daily' ? '30 Discrete Days' : '5 Weekly Aggregations'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Primary Y-Axis: Total IT Load (MW) • Secondary Y-Axis: Rack Capacity Utilization (%)
              </p>
            </div>
          </div>

          {/* Chart View Mode Controls & Toggle */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setChartMetricMode('load_and_capacity')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetricMode === 'load_and_capacity'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-600/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IT Load & Rack %
            </button>
            <button
              onClick={() => setChartMetricMode('thermal_correlation')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetricMode === 'thermal_correlation'
                  ? 'bg-slate-800 text-teal-300 border border-teal-600/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thermal Heat Rejection (kW)
            </button>
            <button
              onClick={() => setChartMetricMode('power_chain_stress')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetricMode === 'power_chain_stress'
                  ? 'bg-slate-800 text-purple-300 border border-purple-600/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2N UPS & Carrier Fiber
            </button>

            <button
              onClick={() => setShowPeakLine(!showPeakLine)}
              className={`ml-2 px-2.5 py-1.5 rounded-lg border text-[11px] transition-colors ${
                showPeakLine
                  ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              Peak Spikes: {showPeakLine ? 'ON' : 'OFF'}
            </button>

            <button
              id="btn-toggle-ai-projection"
              onClick={() => setShowAiProjection(!showAiProjection)}
              className={`ml-1 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                showAiProjection
                  ? 'bg-gradient-to-r from-violet-950 to-indigo-950 border-violet-500 text-violet-200 shadow-md shadow-violet-950/50 ring-1 ring-violet-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle 30-Day AI Projection Line (Ordinary Least Squares Linear Regression)"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>AI 30d Projection: {showAiProjection ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* The Recharts Responsive Canvas */}
        <div className="w-full h-[400px] select-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={activeChartData} margin={{ top: 20, right: 25, left: 10, bottom: 20 }}>
              <defs>
                {/* Gradient for IT Load MW */}
                <linearGradient id="itLoadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for Thermal kW */}
                <linearGradient id="thermalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for Rack Capacity Bar */}
                <linearGradient id="rackBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="period"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />

              {/* Primary Left Y-Axis: IT Load (MW) */}
              <YAxis
                yAxisId="left"
                domain={[1.5, 3.8]}
                tick={{ fill: '#06b6d4', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#0891b2' }}
                tickLine={{ stroke: '#0891b2' }}
                unit=" MW"
              />

              {/* Secondary Right Y-Axis: Rack Capacity (%) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[50, 100]}
                tick={{ fill: '#f59e0b', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#d97706' }}
                tickLine={{ stroke: '#d97706' }}
                unit="%"
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12, fontSize: 11, fontFamily: 'monospace' }}
              />

              {/* Reference Lines */}
              <ReferenceLine
                yAxisId="left"
                y={3.6}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: '3.6 MW IT Power Cap', fill: '#f43f5e', fontSize: 10, position: 'insideTopLeft' }}
              />
              <ReferenceLine
                yAxisId="right"
                y={90}
                stroke="#eab308"
                strokeDasharray="4 4"
                label={{ value: '90% Rack Warning', fill: '#eab308', fontSize: 10, position: 'insideTopRight' }}
              />

              {/* Forecast Horizon Demarcation Line */}
              {showAiProjection && (
                <ReferenceLine
                  yAxisId="left"
                  x={granularity === 'daily' ? 'Day 30' : 'Week 5'}
                  stroke="#a855f7"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'AI Forecast Horizon (+30 Days)',
                    fill: '#c084fc',
                    fontSize: 10,
                    fontFamily: 'monospace',
                    position: 'insideTopLeft',
                  }}
                />
              )}

              {chartMetricMode === 'load_and_capacity' && (
                <>
                  {/* Rack Capacity Utilization as Bars */}
                  <Bar
                    yAxisId="right"
                    dataKey={showAiProjection ? 'historicalRackCapacityPercent' : 'rackCapacityPercent'}
                    name="Historical Rack Capacity (%)"
                    fill="url(#rackBarGradient)"
                    barSize={granularity === 'daily' ? (showAiProjection ? 8 : 12) : 28}
                    radius={[4, 4, 0, 0]}
                  />

                  {/* IT Load (MW) as Area */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey={showAiProjection ? 'historicalItLoadMw' : 'itLoadMw'}
                    name="Historical IT Load (MW)"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#itLoadGradient)"
                  />

                  {/* Peak Spike Line */}
                  {showPeakLine && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="itLoadPeakMw"
                      name="Peak Spike (MW)"
                      stroke="#f43f5e"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      dot={{ fill: '#f43f5e', r: 2 }}
                    />
                  )}

                  {/* AI 30-Day Projection Lines (Linear Regression) */}
                  {showAiProjection && (
                    <>
                      {/* 90% Confidence Interval Band */}
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="projectedItLoadUpperMw"
                        name="AI Forecast 90% CI (MW)"
                        stroke="transparent"
                        fill="#8b5cf6"
                        fillOpacity={0.12}
                      />

                      {/* Primary AI Linear Regression Line */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="projectedItLoadMw"
                        name="AI 30d Projected IT Load (MW)"
                        stroke="#a855f7"
                        strokeWidth={3}
                        strokeDasharray="4 4"
                        connectNulls={true}
                        dot={(props: any) => {
                          if (props.payload?.isProjection && props.index % 3 === 0) {
                            return (
                              <circle
                                key={`proj-dot-${props.cx}-${props.cy}`}
                                cx={props.cx}
                                cy={props.cy}
                                r={3}
                                fill="#c084fc"
                                stroke="#581c87"
                                strokeWidth={1}
                              />
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Projected Rack Utilization Line */}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="projectedRackCapacityPercent"
                        name="Projected Rack Capacity (%)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        connectNulls={true}
                        dot={false}
                      />
                    </>
                  )}
                </>
              )}

              {chartMetricMode === 'thermal_correlation' && (
                <>
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey={showAiProjection ? 'historicalItLoadMw' : 'itLoadMw'}
                    name="Historical IT Load (MW)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={0.2}
                    fill="url(#itLoadGradient)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="heatExchangerKw"
                    name="Rooftop Heat Exchangers (kW)"
                    stroke="#2dd4bf"
                    strokeWidth={2.5}
                    dot={{ fill: '#14b8a6', r: 3 }}
                  />
                  {showAiProjection && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="projectedItLoadMw"
                      name="AI 30d Projected IT Load (MW)"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      connectNulls={true}
                      dot={false}
                    />
                  )}
                </>
              )}

              {chartMetricMode === 'power_chain_stress' && (
                <>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="upsLoadPercent"
                    name="2N UPS Load (%)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#059669', r: 3 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="networkFiberGbps"
                    name="Carrier Fiber Traffic (Gbps)"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: '#9333ea', r: 3 }}
                  />
                  {showAiProjection && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="projectedItLoadMw"
                      name="AI 30d Projected IT Load (MW)"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      connectNulls={true}
                      dot={false}
                    />
                  )}
                </>
              )}

              {/* Scrubber Brush for Daily Granularity */}
              {granularity === 'daily' && (
                <Brush
                  dataKey="period"
                  height={24}
                  stroke="#0284c7"
                  fill="#020617"
                  travellerWidth={10}
                  tickFormatter={() => ''}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity Expansion Scenario Slider */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                Predictive Capacity Simulator: Add High-Density GPU Racks
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">
              +{scenarioBoostRacks} Racks (+{(scenarioBoostRacks * 18 / 1000).toFixed(2)} MW IT Draw)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-mono text-slate-500">Baseline (0 Racks)</span>
            <input
              type="range"
              min="0"
              max="36"
              step="2"
              value={scenarioBoostRacks}
              onChange={(e) => setScenarioBoostRacks(Number(e.target.value))}
              className="flex-1 accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-[11px] font-mono text-slate-400">Max Reserve (+36 Racks / Hall Capacity)</span>
            {scenarioBoostRacks > 0 && (
              <button
                onClick={() => setScenarioBoostRacks(0)}
                className="text-[10px] font-mono text-slate-400 hover:text-white underline"
              >
                Reset
              </button>
            )}
          </div>

          {scenarioBoostRacks > 0 && (
            <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-800/80 text-xs font-mono text-cyan-200 flex items-center justify-between">
              <span>
                Projected Impact: IT Load rises to <strong>{latestPoint.itLoadMw} MW</strong> • Occupancy jumps to <strong>{latestPoint.rackCapacityPercent}% ({latestPoint.occupiedRacks}/240 U)</strong>.
              </span>
              <span className="text-emerald-400 font-bold">Safe within 3.6 MW Power Cap</span>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- SECTION 1.5: AI-DRIVEN 30-DAY CAPACITY PROJECTION (LINEAR REGRESSION ENGINE) ---------------- */}
      <AiProjectionInsightsCard
        summary={projectionSummary}
        projectionEnabled={showAiProjection}
        onToggleProjection={() => setShowAiProjection(!showAiProjection)}
      />

      {/* ---------------- SECTION 2: SERVER RACK WORKING FLOW & ANATOMY (FROM IMAGE ANALYSIS) ---------------- */}
      <ServerRackWorkingFlowCard
        currentPoint={latestPoint}
        onOpenExportCsv={() => setIsExportModalOpen(true)}
        onNavigateToRack={onNavigateToRack}
      />

      {/* ---------------- SECTION 3: ARCHITECTURAL SUBSYSTEMS FROM FACILITY BLUEPRINT ---------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                FACILITY ARCHITECTURE BLUEPRINT
              </span>
              <span className="text-xs font-mono text-slate-400">10 Subsystems Analyzed from Diagram</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Subsystem Correlation & Operational Impact
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              How the 30-day capacity ramp from 2.12 MW to 2.84 MW directly correlates with each critical facility component from the architectural cutaway.
            </p>
          </div>
        </div>

        {/* 10 Subsystem Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {FACILITY_SUBSYSTEMS.map((sub) => {
            const Icon = SubsystemIconMap[sub.iconName] || Server;
            const isSelected = activeSubsystemId === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubsystemId(sub.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? `${sub.accentBg} ${sub.borderColor} ring-1 ring-cyan-500 shadow-md`
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${sub.accentBg} ${sub.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 uppercase font-semibold">
                    {sub.status}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-white tracking-tight truncate">{sub.imageLabel}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{sub.currentMetric}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Focused Subsystem Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-slate-800">
            <div className="flex items-start space-x-3">
              <div className={`p-3 rounded-xl ${selectedSubsystem.accentBg} border ${selectedSubsystem.borderColor} ${selectedSubsystem.color}`}>
                {React.createElement(SubsystemIconMap[selectedSubsystem.iconName] || Server, { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    CALLOUT FROM DIAGRAM
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    {selectedSubsystem.name}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedSubsystem.imageLabel}</h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400">Current Operational Status</div>
              <div className="text-sm font-bold text-emerald-400">{selectedSubsystem.currentMetric}</div>
            </div>
          </div>

          {/* Exact Quote from User Diagram */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Diagram Architectural Function:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "{selectedSubsystem.diagramQuote}"
            </p>
          </div>

          {/* 30-Day Historical Trend Correlation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Impact of 30-Day IT Load & Rack Ramp:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSubsystem.relationshipToTrend}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Remaining Headroom & Capacity Reserve:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSubsystem.capacityImpact}
              </p>
            </div>
          </div>

          {/* Cross Navigation into DCIM Modules */}
          {onNavigateToTab && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400">
                Direct Telemetry Navigation:
              </span>
              <div className="flex items-center space-x-2">
                {selectedSubsystem.id === 'server_rooms' && (
                  <button
                    onClick={() => onNavigateToTab('rack_inspector')}
                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-colors"
                  >
                    Inspect 42U Server Racks
                  </button>
                )}
                {(selectedSubsystem.id === 'heat_exchangers' || selectedSubsystem.id === 'air_conditioning' || selectedSubsystem.id === 'cooling_units_247') && (
                  <button
                    onClick={() => onNavigateToTab('cooling_hvac')}
                    className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs font-mono transition-colors"
                  >
                    Open Rooftop HVAC SCADA
                  </button>
                )}
                {(selectedSubsystem.id === 'ups_units' || selectedSubsystem.id === 'backup_generators') && (
                  <button
                    onClick={() => onNavigateToTab('power_chain')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono transition-colors"
                  >
                    Open 2N Power Chain SLD
                  </button>
                )}
                {selectedSubsystem.id === 'network_racks' && (
                  <button
                    onClick={() => onNavigateToTab('realtime_dashboard')}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-colors"
                  >
                    View Carrier Fiber Feeds
                  </button>
                )}
                {selectedSubsystem.id === 'noc' && (
                  <button
                    onClick={() => onNavigateToTab('alerting_notifications')}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono transition-colors"
                  >
                    View NOC Alert Engine
                  </button>
                )}
                {(selectedSubsystem.id === 'security' || selectedSubsystem.id === 'concrete_steel') && (
                  <button
                    onClick={() => onNavigateToTab('anatomy_14_features')}
                    className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs font-mono transition-colors"
                  >
                    View Facility Security Blueprint
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Capacity Trends CSV Modal */}
      <ExportCapacityCsvModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dailyData={ENRICHED_DAILY_HISTORICAL_DATA}
        weeklyData={ENRICHED_WEEKLY_HISTORICAL_DATA}
        projectedData={projectedData}
        currentGranularity={granularity}
      />
    </div>
  );
};
