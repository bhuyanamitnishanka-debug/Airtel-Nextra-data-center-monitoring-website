import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';
import {
  Leaf,
  Zap,
  Fan,
  TrendingDown,
  DollarSign,
  Download,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Info,
  Calendar,
  RotateCcw,
  Check,
  Scale
} from 'lucide-react';
import { 
  PUE_SUSTAINABILITY_30D_DATA, 
  THREE_ACTIONABLE_ENERGY_MODIFICATIONS, 
  computeSimulatedPueDataset 
} from '../data/sustainabilityData';
import { ActionableEnergyCard } from './sustainability/ActionableEnergyCard';
import { EnvironmentalImpactSection } from './sustainability/EnvironmentalImpactSection';
import { PueSustainabilityPoint, DataCenterMetrics } from '../types';

interface EnergySustainabilityViewProps {
  metrics?: DataCenterMetrics;
  onNavigateToTab?: (tabId: string) => void;
}

export const EnergySustainabilityView: React.FC<EnergySustainabilityViewProps> = ({
  metrics,
  onNavigateToTab,
}) => {
  // Active energy modifications in simulation
  const [activeModIds, setActiveModIds] = useState<string[]>([
    'cooling-sat-reset',
    'cooling-ec-fan-vfd',
    'power-ups-eco-mode',
  ]);

  // Chart view mode
  const [chartViewMode, setChartViewMode] = useState<'pue_trend' | 'power_overhead' | 'energy_carbon'>(
    'pue_trend'
  );

  // Industry benchmark toggles
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(true);

  // Toggle individual modification
  const handleToggleMod = (id: string) => {
    setActiveModIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setActiveModIds(THREE_ACTIONABLE_ENERGY_MODIFICATIONS.map((m) => m.id));
  };

  const handleClearAll = () => {
    setActiveModIds([]);
  };

  // Compute simulated dataset and impact totals
  const {
    simulatedData,
    totalPueReduction,
    totalKwReduction,
    totalAnnualKwhSaved,
    totalAnnualCostSavedUsd,
    totalAnnualCarbonAvoidedMt,
  } = useMemo(() => {
    return computeSimulatedPueDataset(PUE_SUSTAINABILITY_30D_DATA, activeModIds);
  }, [activeModIds]);

  // Statistical calculations from 30-day baseline
  const currentPoint = PUE_SUSTAINABILITY_30D_DATA[PUE_SUSTAINABILITY_30D_DATA.length - 1];
  const firstPoint = PUE_SUSTAINABILITY_30D_DATA[0];
  const pueValues = PUE_SUSTAINABILITY_30D_DATA.map((d) => d.pueRatio);
  const minPue = Math.min(...pueValues);
  const maxPue = Math.max(...pueValues);
  const avgPue = Number(
    (pueValues.reduce((sum, v) => sum + v, 0) / pueValues.length).toFixed(3)
  );

  const currentSimulatedPue = Number(Math.max(1.06, currentPoint.pueRatio - totalPueReduction).toFixed(3));
  const cumulative30dEnergyMwh = Number(
    (PUE_SUSTAINABILITY_30D_DATA.reduce((sum, d) => sum + d.dailyKwh, 0) / 1000).toFixed(1)
  );
  const totalCoolingOverheadMw = currentPoint.coolingPowerMw;
  const coolingOverheadPercent = Number(
    ((currentPoint.coolingPowerMw / currentPoint.totalFacilityPowerMw) * 100).toFixed(1)
  );

  // CSV Export handler
  const handleExportCsv = () => {
    const headers =
      'Day,Period,Date,Historical PUE,Simulated PUE,IT Load (MW),Cooling Power (MW),Power Distribution Loss (kW),Total Facility Power (MW),Daily Energy (kWh),Carbon Footprint (kg CO2e)\n';
    const rows = simulatedData
      .map(
        (d) =>
          `${d.day},"${d.period}","${d.timestamp}",${d.pueRatio},${d.simulatedPueRatio ?? d.pueRatio},${d.itLoadMw},${d.coolingPowerMw},${d.powerLossesKw},${d.totalFacilityPowerMw},${d.dailyKwh},${d.carbonKg}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nxtradcim_30day_pue_sustainability.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom Chart Tooltip
  const CustomPueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: PueSustainabilityPoint = payload[0].payload;
      const isSimulated = activeModIds.length > 0;

      return (
        <div className="bg-slate-950 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono max-w-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white text-sm">{dataPoint.period}</span>
            <span className="text-slate-400 text-[11px]">{dataPoint.timestamp}</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> Historical PUE:
              </span>
              <strong className="text-white text-xs">{dataPoint.pueRatio.toFixed(3)}</strong>
            </div>

            {isSimulated && (
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Simulated Post-Mod PUE:
                </span>
                <strong className="text-cyan-300 text-xs">
                  {dataPoint.simulatedPueRatio?.toFixed(3)} (-{totalPueReduction})
                </strong>
              </div>
            )}

            <div className="pt-1 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Facility Power:</span>
                <strong className="text-white">{dataPoint.totalFacilityPowerMw} MW</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> IT Compute Load:
                </span>
                <span className="text-cyan-300">{dataPoint.itLoadMw} MW ({((dataPoint.itLoadMw / dataPoint.totalFacilityPowerMw) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-teal-400 flex items-center gap-1">
                  <Fan className="w-3 h-3" /> Cooling Overhead:
                </span>
                <span className="text-teal-300">{dataPoint.coolingPowerMw} MW ({((dataPoint.coolingPowerMw / dataPoint.totalFacilityPowerMw) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 flex items-center gap-1">
                  <Scale className="w-3 h-3" /> Distribution Loss:
                </span>
                <span className="text-amber-300">{dataPoint.powerLossesKw} kW</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Daily Energy: <strong className="text-slate-200">{(dataPoint.dailyKwh / 1000).toFixed(1)} MWh</strong></span>
              <span>Grid CO₂e: <strong className="text-teal-300">{dataPoint.carbonKg.toLocaleString()} kg</strong></span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="energy-sustainability-view" className="space-y-6">
      {/* ---------------- SECTION 1: HEADER & SUSTAINABILITY INDEX ---------------- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>ENERGY & SUSTAINABILITY INTELLIGENCE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                ASHRAE Standard 90.4 & TC 9.9 Compliant
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono">
                Tier-IV Hyperscale Efficiency Class
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              PUE Trends & Energy-Saving Optimizations
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Continuous 30-day Power Usage Effectiveness (PUE) tracking coupled with data-driven cooling and power distribution modifications to achieve target green hyperscale efficiency.
            </p>
          </div>

          {/* Quick Actions & CSV Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-export-sustainability-csv"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              title="Export 30-Day PUE and Energy Sustainability Telemetry to RFC-4180 CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export PUE CSV</span>
            </button>

            <button
              id="btn-jump-to-environmental-impact"
              onClick={() => {
                document.getElementById('environmental-impact-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Jump to Real-Time Environmental Impact & Carbon Intensity Section"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Carbon & CO₂e</span>
            </button>

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('cooling_hvac')}
                className="px-3.5 py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900 border border-teal-700 text-teal-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Fan className="w-3.5 h-3.5" />
                <span>Cooling SCADA</span>
              </button>
            )}

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('power_chain')}
                className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Power Chain SLD</span>
              </button>
            )}
          </div>
        </div>

        {/* Top KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" /> Current PUE
            </span>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
              {currentPoint.pueRatio.toFixed(2)}
            </div>
            <span className="text-[9px] text-emerald-400/80 font-mono">
              30d Avg: {avgPue} (Min {minPue})
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Simulated PUE
            </span>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
              {activeModIds.length > 0 ? currentSimulatedPue.toFixed(2) : currentPoint.pueRatio.toFixed(2)}
            </div>
            <span className="text-[9px] text-cyan-400/80 font-mono">
              {activeModIds.length > 0 ? `-${totalPueReduction} Delta Applied` : '0 Mods Active'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Fan className="w-3 h-3 text-teal-400" /> Cooling Overhead
            </span>
            <div className="text-xl font-bold font-mono text-teal-300 mt-1">
              {totalCoolingOverheadMw} MW
            </div>
            <span className="text-[9px] text-slate-500 font-mono">
              {coolingOverheadPercent}% of Facility Draw
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Continuous Savings
            </span>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">
              {totalKwReduction > 0 ? `-${totalKwReduction} kW` : '0 kW'}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">
              {(totalAnnualKwhSaved / 1000).toLocaleString()} MWh/yr
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Annual OPEX Delta
            </span>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
              ${totalAnnualCostSavedUsd.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">@ $0.11 / kWh</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Leaf className="w-3 h-3 text-teal-400" /> Carbon Avoidance
            </span>
            <div className="text-xl font-bold font-mono text-teal-300 mt-1">
              {totalAnnualCarbonAvoidedMt} MT
            </div>
            <span className="text-[9px] text-teal-400/80 font-mono">CO₂e / year</span>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 2: 30-DAY PUE LINE CHART & TELEMETRY BREAKDOWN ---------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {/* Controls bar above chart */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-8 bg-emerald-500 rounded-full" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>30-Day Power Usage Effectiveness (PUE) Trend</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (Aug 21 – Sep 19)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                PUE = Total Facility Power / IT Load • Ideal Target: 1.15 Green Hyperscale
              </p>
            </div>
          </div>

          {/* Metric View Modes & Benchmark Toggle */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setChartViewMode('pue_trend')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartViewMode === 'pue_trend'
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-600/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PUE Ratio (1.06 - 1.60)
            </button>
            <button
              onClick={() => setChartViewMode('power_overhead')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartViewMode === 'power_overhead'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-600/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Power Breakdown (MW)
            </button>
            <button
              onClick={() => setChartViewMode('energy_carbon')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartViewMode === 'energy_carbon'
                  ? 'bg-slate-800 text-teal-300 border border-teal-600/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Energy & CO₂e
            </button>

            {chartViewMode === 'pue_trend' && (
              <button
                onClick={() => setShowBenchmarks(!showBenchmarks)}
                className={`ml-2 px-2.5 py-1.5 rounded-lg border text-[11px] transition-colors ${
                  showBenchmarks
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                title="Toggle industry benchmark reference lines (Uptime Institute 1.58, Tier-III 1.20, Hyperscale 1.15)"
              >
                Benchmarks: {showBenchmarks ? 'ON' : 'OFF'}
              </button>
            )}
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-[400px] select-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={simulatedData} margin={{ top: 20, right: 25, left: 10, bottom: 20 }}>
              <defs>
                {/* Gradients */}
                <linearGradient id="pueLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="itLoadAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="coolingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="period"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />

              {chartViewMode === 'pue_trend' && (
                <>
                  <YAxis
                    yAxisId="pue"
                    domain={[1.05, 1.65]}
                    ticks={[1.10, 1.15, 1.20, 1.30, 1.40, 1.58]}
                    tick={{ fill: '#10b981', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#059669' }}
                    tickLine={{ stroke: '#059669' }}
                    unit=" PUE"
                  />

                  <Tooltip content={<CustomPueTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 12, fontSize: 11, fontFamily: 'monospace' }}
                  />

                  {/* Benchmark Reference Lines */}
                  {showBenchmarks && (
                    <>
                      <ReferenceLine
                        yAxisId="pue"
                        y={1.58}
                        stroke="#f43f5e"
                        strokeDasharray="4 4"
                        label={{
                          value: '1.58 Global DC Average (Uptime Institute)',
                          fill: '#f43f5e',
                          fontSize: 10,
                          position: 'insideTopLeft',
                        }}
                      />
                      <ReferenceLine
                        yAxisId="pue"
                        y={1.20}
                        stroke="#eab308"
                        strokeDasharray="3 3"
                        label={{
                          value: '1.20 Standard Enterprise Tier-III Cap',
                          fill: '#eab308',
                          fontSize: 10,
                          position: 'insideTopLeft',
                        }}
                      />
                      <ReferenceLine
                        yAxisId="pue"
                        y={1.15}
                        stroke="#10b981"
                        strokeDasharray="4 4"
                        label={{
                          value: '1.15 Target Green Hyperscale Benchmark',
                          fill: '#10b981',
                          fontSize: 10,
                          position: 'insideBottomLeft',
                        }}
                      />
                    </>
                  )}

                  {/* Primary 30-Day Historical PUE Line */}
                  <Line
                    yAxisId="pue"
                    type="monotone"
                    dataKey="pueRatio"
                    name="Historical PUE (30-Day Actual)"
                    stroke="url(#pueLineGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 6, fill: '#34d399' }}
                  />

                  {/* Simulated Post-Optimization PUE Line */}
                  {activeModIds.length > 0 && (
                    <Line
                      yAxisId="pue"
                      type="monotone"
                      dataKey="simulatedPueRatio"
                      name={`Simulated PUE (-${totalPueReduction} Delta)`}
                      stroke="#a855f7"
                      strokeWidth={3}
                      strokeDasharray="4 4"
                      dot={{ fill: '#c084fc', r: 3 }}
                      activeDot={{ r: 6, fill: '#e9d5ff' }}
                    />
                  )}
                </>
              )}

              {chartViewMode === 'power_overhead' && (
                <>
                  <YAxis
                    yAxisId="mw"
                    domain={[0, 4.0]}
                    tick={{ fill: '#06b6d4', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#0891b2' }}
                    tickLine={{ stroke: '#0891b2' }}
                    unit=" MW"
                  />

                  <Tooltip content={<CustomPueTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 12, fontSize: 11, fontFamily: 'monospace' }}
                  />

                  {/* Stacked / Area Power Components */}
                  <Area
                    yAxisId="mw"
                    type="monotone"
                    dataKey="itLoadMw"
                    name="IT Compute Load (MW)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#itLoadAreaGrad)"
                    fillOpacity={1}
                  />
                  <Line
                    yAxisId="mw"
                    type="monotone"
                    dataKey="coolingPowerMw"
                    name="Cooling Plant Overhead (MW)"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    dot={{ fill: '#0d9488', r: 2.5 }}
                  />
                  <Line
                    yAxisId="mw"
                    type="monotone"
                    dataKey="totalFacilityPowerMw"
                    name="Total Facility Power (MW)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </>
              )}

              {chartViewMode === 'energy_carbon' && (
                <>
                  <YAxis
                    yAxisId="kwh"
                    domain={[40000, 85000]}
                    tick={{ fill: '#14b8a6', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#0d9488' }}
                    tickLine={{ stroke: '#0d9488' }}
                    unit=" kWh"
                  />
                  <YAxis
                    yAxisId="carbon"
                    orientation="right"
                    domain={[3000, 12000]}
                    tick={{ fill: '#f43f5e', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#e11d48' }}
                    tickLine={{ stroke: '#e11d48' }}
                    unit=" kg"
                  />

                  <Tooltip content={<CustomPueTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 12, fontSize: 11, fontFamily: 'monospace' }}
                  />

                  <Bar
                    yAxisId="kwh"
                    dataKey="dailyKwh"
                    name="Daily Energy Consumed (kWh)"
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Line
                    yAxisId="carbon"
                    type="monotone"
                    dataKey="carbonKg"
                    name="Net Carbon Emissions (kg CO₂e)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ fill: '#e11d48', r: 3 }}
                  />
                </>
              )}

              <Brush
                dataKey="period"
                height={24}
                stroke="#10b981"
                fill="#020617"
                travellerWidth={10}
                tickFormatter={() => ''}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Real-time simulation bar */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">Interactive PUE Model Status:</span>
            <span className="text-cyan-300">
              {activeModIds.length} of 3 Modifications Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeModIds.length < 3 && (
              <button
                onClick={handleSelectAll}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 transition-colors text-[11px]"
              >
                Apply All 3 Modifications (-0.060 PUE)
              </button>
            )}
            {activeModIds.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-[11px] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 3: THREE ACTIONABLE ENERGY-SAVING MODIFICATIONS ---------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-teal-500 rounded-full" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                3 Actionable Energy-Saving Modifications
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-4.5">
              Engineered modifications for cooling plants and power distribution derived directly from the 30-day operational telemetry.
            </p>
          </div>

          {/* Cumulative Potential Banner */}
          <div className="bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-800/60 px-4 py-2 rounded-xl text-xs font-mono text-emerald-200 flex items-center gap-3">
            <div>
              <span className="text-slate-400 text-[10px] block">Combined Annual Impact:</span>
              <strong className="text-emerald-300 font-bold text-sm">
                -${totalAnnualCostSavedUsd.toLocaleString()} / yr
              </strong>
            </div>
            <div className="border-l border-emerald-800/80 pl-3">
              <span className="text-slate-400 text-[10px] block">Net Carbon Avoided:</span>
              <strong className="text-teal-300 font-bold text-sm">
                {totalAnnualCarbonAvoidedMt} MT CO₂e
              </strong>
            </div>
          </div>
        </div>

        {/* Grid of the 3 Actionable Modifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {THREE_ACTIONABLE_ENERGY_MODIFICATIONS.map((mod, index) => (
            <ActionableEnergyCard
              key={mod.id}
              modification={mod}
              isActive={activeModIds.includes(mod.id)}
              onToggle={handleToggleMod}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* ---------------- SECTION 4: ENVIRONMENTAL IMPACT & REAL-TIME CO2 EMISSIONS ---------------- */}
      <EnvironmentalImpactSection
        metrics={metrics}
        effectivePue={activeModIds.length > 0 ? currentSimulatedPue : currentPoint.pueRatio}
        baselinePue={currentPoint.pueRatio}
        activeModIds={activeModIds}
        totalPueReduction={totalPueReduction}
      />

      {/* ---------------- SECTION 5: FACILITY ENERGY WATERFALL & LOSS AUDIT ---------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-7 bg-amber-500 rounded-full" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Facility Power Distribution Waterfall & Energy Allocation
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end breakdown of the 3.39 MW grid service draw into compute workload vs. overhead
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            Total Input: <strong className="text-white">3.39 MW</strong>
          </span>
        </div>

        {/* Visual Waterfall Bars */}
        <div className="space-y-3 font-mono text-xs">
          {/* 1. Useful IT Load */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Zap className="w-4 h-4" /> 1. IT Compute Load (Useful Workload)
              </span>
              <span className="text-white font-bold">2.86 MW (84.4%)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-[84.4%]" />
            </div>
            <p className="text-[11px] text-slate-400">
              Dual-corded 42U compute servers, AI GPU drawers, SAN storage arrays, and spine/leaf network fabrics.
            </p>
          </div>

          {/* 2. Cooling & HVAC Overhead */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                <Fan className="w-4 h-4" /> 2. Cooling Plant & Heat Rejection Overhead
              </span>
              <span className="text-teal-300 font-bold">0.53 MW (15.6%)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full w-[15.6%]" />
            </div>
            <p className="text-[11px] text-slate-400">
              Rooftop heat exchangers (2,785 kW thermal rejection), chillers, and CRAH underfloor EC blower fans. Target reduction of 125 kW via Modifications #1 and #2.
            </p>
          </div>

          {/* 3. Electrical Distribution Loss */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Scale className="w-4 h-4" /> 3. Power Transformation & 2N UPS Inverter Losses
              </span>
              <span className="text-amber-300 font-bold">0.048 MW / 48 kW (1.4%)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full w-[1.4%]" />
            </div>
            <p className="text-[11px] text-slate-400">
              Medium-voltage transformer excitation, 2N UPS double-conversion silicon losses, static transfer switches (STS), and PDU copper resistance. Target reduction of 45 kW via Modification #3.
            </p>
          </div>
        </div>

        {/* Direct Link Footer */}
        {onNavigateToTab && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span>Direct DCIM Subsystem Navigation:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigateToTab('cooling_hvac')}
                className="px-3 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 border border-teal-800 text-teal-300 flex items-center gap-1"
              >
                <span>Inspect CRAH EC Fans & Chilled Water</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab('power_chain')}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 flex items-center gap-1"
              >
                <span>Inspect 2N UPS Power Chain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab('capacity_trends')}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 flex items-center gap-1"
              >
                <span>View Capacity 30d Trends</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
