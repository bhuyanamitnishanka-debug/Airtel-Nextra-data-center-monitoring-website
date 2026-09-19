import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Zap,
  Fan,
  Gauge,
  TrendingDown,
  TrendingUp,
  Activity,
  Sparkles,
  Sun,
  Wind,
  Factory,
  TreePine,
  Car,
  Info,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Scale,
  Flame,
  Globe,
  Share2
} from 'lucide-react';
import { DataCenterMetrics } from '../../types';

interface EnvironmentalImpactSectionProps {
  metrics?: DataCenterMetrics;
  effectivePue: number; // Current live PUE or simulated PUE
  baselinePue: number; // Raw historical PUE before modifications
  activeModIds: string[];
  totalPueReduction: number;
}

// Carbon intensity levels standard (aligned with GHG Protocol and Green Grid)
export type CarbonIntensityTier = 'ultra_low' | 'low' | 'moderate' | 'high' | 'critical';

interface CarbonTierConfig {
  tier: CarbonIntensityTier;
  label: string;
  min: number;
  max: number;
  colorName: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
  glowColor: string;
  description: string;
  gridMixDescription: string;
}

const CARBON_TIERS: CarbonTierConfig[] = [
  {
    tier: 'ultra_low',
    label: 'Ultra-Low Carbon',
    min: 0,
    max: 50,
    colorName: 'emerald',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/60',
    badgeText: 'text-emerald-300',
    dotColor: 'bg-emerald-400',
    glowColor: 'shadow-emerald-500/30 ring-emerald-500/50',
    description: 'Near-zero carbon intensity powered by 100% on-site solar/wind or nuclear baseline.',
    gridMixDescription: '> 90% Renewable / Carbon-Free',
  },
  {
    tier: 'low',
    label: 'Low Carbon (Hyperscale PPA)',
    min: 51,
    max: 150,
    colorName: 'cyan',
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-500/60',
    badgeText: 'text-cyan-300',
    dotColor: 'bg-cyan-400',
    glowColor: 'shadow-cyan-500/30 ring-cyan-500/50',
    description: 'Optimal hyperscale tier with high renewable Power Purchase Agreement (PPA) hedging.',
    gridMixDescription: '65% - 85% Clean / Renewables Blend',
  },
  {
    tier: 'moderate',
    label: 'Moderate Carbon Intensity',
    min: 151,
    max: 300,
    colorName: 'amber',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-500/60',
    badgeText: 'text-amber-300',
    dotColor: 'bg-amber-400',
    glowColor: 'shadow-amber-500/30 ring-amber-500/50',
    description: 'Standard grid transition mix with combined-cycle natural gas and partial hydro.',
    gridMixDescription: '40% - 65% Transitional Grid Energy',
  },
  {
    tier: 'high',
    label: 'High Carbon Intensity',
    min: 301,
    max: 450,
    colorName: 'orange',
    badgeBg: 'bg-orange-950/80',
    badgeBorder: 'border-orange-500/60',
    badgeText: 'text-orange-300',
    dotColor: 'bg-orange-400',
    glowColor: 'shadow-orange-500/30 ring-orange-500/50',
    description: 'Heavy fossil utility dispatch; peaking turbines active during regional grid strain.',
    gridMixDescription: '20% - 40% Clean Generation',
  },
  {
    tier: 'critical',
    label: 'Critical Carbon Intensity',
    min: 451,
    max: 800,
    colorName: 'rose',
    badgeBg: 'bg-rose-950/80',
    badgeBorder: 'border-rose-500/60',
    badgeText: 'text-rose-300',
    dotColor: 'bg-rose-400',
    glowColor: 'shadow-rose-500/30 ring-rose-500/50',
    description: 'Predominantly sub-critical coal or diesel peakers; carbon abatement priority critical.',
    gridMixDescription: '< 20% Clean Energy',
  },
];

export const EnvironmentalImpactSection: React.FC<EnvironmentalImpactSectionProps> = ({
  metrics,
  effectivePue,
  baselinePue,
  activeModIds,
  totalPueReduction,
}) => {
  // Live values from system metrics (with robust defaults)
  const defaultItLoadMw = metrics?.totalItLoadMw || 3.42;
  const defaultGridIntensity = metrics?.carbonIntensityGPerKwh || 124;
  const defaultRenewablePct = metrics?.renewableEnergyPercent || 78;

  // Interactive user simulation parameters
  const [customItLoadMw, setCustomItLoadMw] = useState<number>(defaultItLoadMw);
  const [customIntensityG, setCustomIntensityG] = useState<number>(defaultGridIntensity);
  const [accountingMode, setAccountingMode] = useState<'market_based' | 'location_based'>('market_based');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Raw regional location factor (unhedged local utility grid)
  const RAW_REGIONAL_GRID_INTENSITY_G = 385; // g CO2e / kWh

  // Effective grid carbon intensity used in calculation
  const effectiveIntensityG =
    accountingMode === 'market_based'
      ? customIntensityG
      : RAW_REGIONAL_GRID_INTENSITY_G;

  // Real-time calculation physics:
  // 1. Total Facility Power = IT Load (MW) * PUE
  const currentItLoadKw = customItLoadMw * 1000;
  const totalFacilityPowerKw = currentItLoadKw * effectivePue;
  const totalFacilityPowerMw = Number((totalFacilityPowerKw / 1000).toFixed(3));
  const coolingAndOverheadKw = totalFacilityPowerKw - currentItLoadKw;

  // 2. Real-time CO2 emissions rate:
  // Emissions Rate (kg CO2e / hr) = Total Power (kW) * Grid Intensity (g CO2e / kWh) / 1000
  const hourlyEmissionsKg = Number(
    ((totalFacilityPowerKw * effectiveIntensityG) / 1000).toFixed(2)
  );
  const hourlyEmissionsMt = Number((hourlyEmissionsKg / 1000).toFixed(4));

  // 3. Projections
  const dailyEmissionsMt = Number(((hourlyEmissionsKg * 24) / 1000).toFixed(2));
  const annualEmissionsMt = Number(((hourlyEmissionsKg * 24 * 365) / 1000).toFixed(1));

  // 4. Breakdown of emissions
  const itComputeEmissionsKg = Number(
    ((currentItLoadKw * effectiveIntensityG) / 1000).toFixed(2)
  );
  const overheadEmissionsKg = Number(
    ((coolingAndOverheadKw * effectiveIntensityG) / 1000).toFixed(2)
  );
  const itSharePercent = Number(((itComputeEmissionsKg / hourlyEmissionsKg) * 100).toFixed(1));
  const overheadSharePercent = Number(
    ((overheadEmissionsKg / hourlyEmissionsKg) * 100).toFixed(1)
  );

  // 5. Avoided Emissions Analysis
  // Compared to Global Industry Average PUE (1.58)
  const globalBenchmarkPowerKw = currentItLoadKw * 1.58;
  const benchmarkHourlyEmissionsKg = (globalBenchmarkPowerKw * effectiveIntensityG) / 1000;
  const annualAvoidedVsGlobalMt = Math.max(
    0,
    Number((((benchmarkHourlyEmissionsKg - hourlyEmissionsKg) * 24 * 365) / 1000).toFixed(1))
  );

  // Avoided by active modifications (delta between baseline PUE and simulated PUE)
  const baselineFacilityPowerKw = currentItLoadKw * baselinePue;
  const baselineHourlyEmissionsKg = (baselineFacilityPowerKw * effectiveIntensityG) / 1000;
  const activeModsHourlySavedKg = Math.max(
    0,
    Number((baselineHourlyEmissionsKg - hourlyEmissionsKg).toFixed(2))
  );
  const activeModsAnnualSavedMt = Number(
    ((activeModsHourlySavedKg * 24 * 365) / 1000).toFixed(1)
  );

  // 6. Tangible Real-World Environmental Equivalencies (EPA Greenhouse Gas Equivalencies)
  // 1 passenger vehicle emits ~4.6 MT CO2e/year
  // 1 urban tree absorbs ~0.021 MT CO2e/year
  const annualTreesEquivalent = Math.round(annualAvoidedVsGlobalMt / 0.021);
  const carsRemovedEquivalent = Math.round(annualAvoidedVsGlobalMt / 4.6);

  // Find matching carbon tier
  const currentTier = useMemo(() => {
    return (
      CARBON_TIERS.find(
        (t) => effectiveIntensityG >= t.min && effectiveIntensityG <= t.max
      ) || CARBON_TIERS[CARBON_TIERS.length - 1]
    );
  }, [effectiveIntensityG]);

  // Copy quick audit summary
  const handleCopySummary = () => {
    const summaryText = `[NxtraDCIM Environmental Audit]
Date: ${new Date().toISOString()}
PUE: ${effectivePue.toFixed(3)} (Reduction: -${totalPueReduction})
IT Compute Load: ${customItLoadMw.toFixed(2)} MW
Total Facility Power: ${totalFacilityPowerMw} MW
Carbon Intensity Factor: ${effectiveIntensityG} g CO2e/kWh (${currentTier.label})
Real-Time Emissions: ${hourlyEmissionsKg} kg CO2e/hr (${hourlyEmissionsMt} MT/hr)
Projected Daily Emissions: ${dailyEmissionsMt} MT CO2e/day
Annualized Run-Rate: ${annualEmissionsMt} MT CO2e/year
Annual Carbon Avoided vs 1.58 Global PUE: ${annualAvoidedVsGlobalMt} MT CO2e/year`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      id="environmental-impact-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Decorative ambient background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* ---------------- 1. SUB-SECTION HEADER & REAL-TIME STATUS ---------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>ENVIRONMENTAL IMPACT INTELLIGENCE</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
              GHG Protocol Scope 2 Dual-Reporting
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono border border-cyan-800">
              ISO 14064-1 Auditable
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Real-Time Carbon Emissions & Grid Intensity</span>
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Real-time carbon footprint dynamically derived from active PUE (
            <strong className="text-emerald-300 font-mono">{effectivePue.toFixed(3)}</strong>), total IT compute load (
            <strong className="text-cyan-300 font-mono">{customItLoadMw.toFixed(2)} MW</strong>), and localized grid carbon emission factors.
          </p>
        </div>

        {/* Action Buttons & Accounting Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Accounting Mode Toggle: Market-Based vs Location-Based */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-mono">
            <button
              onClick={() => setAccountingMode('market_based')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                accountingMode === 'market_based'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Market-Based accounting reflects contractual instruments and 78% renewable Power Purchase Agreements (PPAs)"
            >
              Market-Based ({customIntensityG}g)
            </button>
            <button
              onClick={() => setAccountingMode('location_based')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                accountingMode === 'location_based'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Location-Based accounting reflects raw regional grid mix (385 g CO2e/kWh) without PPA credits"
            >
              Location-Based (385g)
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            title="Copy real-time environmental metrics summary to clipboard"
          >
            {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isCopied ? 'Audited Summary Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. COLOR-CODED CARBON INTENSITY INDICATOR & GAUGE ---------------- */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Color-Coded Pulsing Status Indicator */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl ${currentTier.badgeBg} border ${currentTier.badgeBorder} shadow-lg ${currentTier.glowColor}`}>
              <div className={`w-4 h-4 rounded-full ${currentTier.dotColor} animate-ping absolute opacity-60`} />
              <div className={`w-4 h-4 rounded-full ${currentTier.dotColor}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Current Carbon Intensity Level
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${currentTier.badgeBg} ${currentTier.badgeBorder} ${currentTier.badgeText}`}>
                  {currentTier.label}
                </span>
              </div>
              <div className="text-xl md:text-2xl font-bold font-mono text-white mt-0.5 flex items-baseline gap-2">
                <span>{effectiveIntensityG}</span>
                <span className="text-xs font-mono font-normal text-slate-400">g CO₂e / kWh</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold ml-2 hidden sm:inline">
                  • {currentTier.gridMixDescription}
                </span>
              </div>
            </div>
          </div>

          {/* Quick-test Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-500 mr-1 hidden sm:inline">Grid Presets:</span>
            <button
              onClick={() => {
                setCustomIntensityG(42);
                setAccountingMode('market_based');
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                customIntensityG === 42 && accountingMode === 'market_based'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Solar/Wind Peak (42g)
            </button>
            <button
              onClick={() => {
                setCustomIntensityG(124);
                setAccountingMode('market_based');
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                customIntensityG === 124 && accountingMode === 'market_based'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Nxtra PPA Baseline (124g)
            </button>
            <button
              onClick={() => {
                setCustomIntensityG(260);
                setAccountingMode('market_based');
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                customIntensityG === 260 && accountingMode === 'market_based'
                  ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Gas CCGT (260g)
            </button>
            <button
              onClick={() => {
                setAccountingMode('location_based');
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                accountingMode === 'location_based'
                  ? 'bg-orange-950 border-orange-500 text-orange-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Regional Grid (385g)
            </button>
          </div>
        </div>

        {/* Multi-Segment Color-Coded Spectrum Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="relative w-full h-4 rounded-xl overflow-hidden flex shadow-inner border border-slate-800">
            {/* Ultra Low: 0-50 */}
            <div
              style={{ width: '15%' }}
              className="h-full bg-emerald-500 transition-colors"
              title="Ultra-Low (0 - 50 g/kWh)"
            />
            {/* Low: 51-150 */}
            <div
              style={{ width: '25%' }}
              className="h-full bg-cyan-500 transition-colors"
              title="Low / Hyperscale PPA (51 - 150 g/kWh)"
            />
            {/* Moderate: 151-300 */}
            <div
              style={{ width: '25%' }}
              className="h-full bg-amber-500 transition-colors"
              title="Moderate (151 - 300 g/kWh)"
            />
            {/* High: 301-450 */}
            <div
              style={{ width: '20%' }}
              className="h-full bg-orange-500 transition-colors"
              title="High (301 - 450 g/kWh)"
            />
            {/* Critical: 451+ */}
            <div
              style={{ width: '15%' }}
              className="h-full bg-rose-600 transition-colors"
              title="Critical (> 450 g/kWh)"
            />
          </div>

          {/* Marker Indicator Arrow */}
          <div className="relative h-6 w-full text-xs font-mono">
            {/* Calculate marker percentage across 0 to 600g range */}
            {(() => {
              const clamped = Math.min(600, Math.max(0, effectiveIntensityG));
              const pct = (clamped / 600) * 100;
              return (
                <div
                  style={{ left: `${pct}%` }}
                  className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none"
                >
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-white" />
                  <span className="text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 mt-0.5 whitespace-nowrap shadow-md">
                    {effectiveIntensityG} g/kWh
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Spectrum Scale Labels */}
          <div className="grid grid-cols-5 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="text-emerald-400">0 - 50 (Ultra-Low)</span>
            <span className="text-cyan-400 text-center">51 - 150 (Low PPA)</span>
            <span className="text-amber-400 text-center">151 - 300 (Moderate)</span>
            <span className="text-orange-400 text-center">301 - 450 (High)</span>
            <span className="text-rose-400 text-right">&gt; 450 (Critical)</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-1">
          <strong className="text-slate-200">Environmental Assessment: </strong>
          {currentTier.description} Operating at <strong className="text-white font-mono">{effectiveIntensityG} g CO₂e/kWh</strong> ensures compliance with Science-Based Targets initiative (SBTi) 1.5°C climate trajectories.
        </p>
      </div>

      {/* ---------------- 3. CORE REAL-TIME CALCULATED CO2 METRICS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Real-Time Hourly Emissions */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-400" /> Hourly Rate
            </span>
            <span className="text-[10px] text-slate-500">Real-Time</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {hourlyEmissionsKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg CO₂e/hr</span>
            </div>
            <div className="text-xs font-mono text-emerald-300 mt-1 flex items-center gap-1">
              <span>{hourlyEmissionsMt} Metric Tons / hr</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-800/60 pt-2">
            Calculated as: {totalFacilityPowerMw} MW facility draw × {effectiveIntensityG} g/kWh.
          </p>
        </div>

        {/* Metric 2: Projected Daily Emissions */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-cyan-400" /> Daily Run-Rate
            </span>
            <span className="text-[10px] text-slate-500">24-Hour Cycle</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-cyan-300 tracking-tight">
              {dailyEmissionsMt} <span className="text-xs font-normal text-slate-400">MT CO₂e / day</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              {(dailyEmissionsMt * 1000).toLocaleString()} kg CO₂e / day
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-800/60 pt-2">
            Accounts for continuous 24/7 mission-critical compute and CRAH cooling loops.
          </p>
        </div>

        {/* Metric 3: Annualized Carbon Footprint */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-amber-400" /> Annual Scope 2
            </span>
            <span className="text-[10px] text-slate-500">Annualized</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-amber-300 tracking-tight">
              {annualEmissionsMt.toLocaleString()} <span className="text-xs font-normal text-slate-400">MT CO₂e/yr</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              At current PUE {effectivePue.toFixed(2)} & IT load {customItLoadMw.toFixed(2)} MW
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-800/60 pt-2">
            Dual-reported under Corporate Standard (Market-Based GHG inventory).
          </p>
        </div>

        {/* Metric 4: Carbon Avoided vs Industry Benchmark */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-900/60 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <TrendingDown className="w-4 h-4" /> Carbon Avoided
            </span>
            <span className="text-[10px] text-emerald-300/80">vs 1.58 Global</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {annualAvoidedVsGlobalMt.toLocaleString()} <span className="text-xs font-normal text-slate-300">MT CO₂e/yr</span>
            </div>
            <div className="text-xs font-mono text-emerald-300/80 mt-1">
              {(annualAvoidedVsGlobalMt / 365).toFixed(1)} MT avoided per day
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/60 pt-2">
            Achieved through advanced PUE efficiency vs global average data centers.
          </p>
        </div>
      </div>

      {/* ---------------- 4. DETAILED BREAKDOWN & FORMULA TRANSPARENCY ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Emissions Apportionment (IT Workload vs PUE Overhead) */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Emissions Apportionment by DCIM Subsystem</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Total: <strong className="text-white">{hourlyEmissionsKg} kg/hr</strong>
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* IT Core Compute */}
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> Direct IT Compute Workload
                </span>
                <span className="text-white font-bold">
                  {itComputeEmissionsKg} kg/hr ({itSharePercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${itSharePercent}%` }}
                  className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Servers, GPUs, storage SAN, and switches drawing {customItLoadMw.toFixed(2)} MW.
              </p>
            </div>

            {/* Parasitic PUE Overhead */}
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <Fan className="w-3.5 h-3.5" /> Parasitic Overhead (Cooling & UPS Loss)
                </span>
                <span className="text-teal-300 font-bold">
                  {overheadEmissionsKg} kg/hr ({overheadSharePercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${overheadSharePercent}%` }}
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Cooling plants, chillers, CRAH fans, and electrical transformation ({coolingAndOverheadKw.toFixed(0)} kW overhead).
              </p>
            </div>
          </div>

          {/* Active Energy Modifications Carbon Contribution */}
          {activeModIds.length > 0 && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs font-mono text-emerald-200 mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Active Modifications Abatement (3 Mods):
                </span>
              </div>
              <span className="font-bold text-emerald-300 text-sm">
                -{activeModsHourlySavedKg} kg/hr ({activeModsAnnualSavedMt} MT/yr)
              </span>
            </div>
          )}
        </div>

        {/* Right: Real-World Environmental Equivalency & Formula */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Equivalencies & Thermodynamic Calculation Model</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">EPA GHG Model</span>
            </div>

            {/* EPA Equivalency Cards */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                <Car className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-lg font-bold font-mono text-white">
                  {carsRemovedEquivalent.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Vehicles Removed from Road/yr
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                <TreePine className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-lg font-bold font-mono text-white">
                  {annualTreesEquivalent.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Urban Tree Seedlings Grown 10 yrs
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Formula Pill */}
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="font-bold text-emerald-400">Live Mathematical Formula:</span>
              <span>ISO 14064 Standard</span>
            </div>
            <div className="text-white font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 text-xs">
              CO₂ (kg/hr) = [IT Load ({customItLoadMw} MW) × PUE ({effectivePue.toFixed(3)}) × 1000] × [{effectiveIntensityG} g/kWh ÷ 1000]
            </div>
            <div className="text-[10px] text-slate-400 pt-0.5">
              = {totalFacilityPowerKw.toFixed(0)} kW × {(effectiveIntensityG / 1000).toFixed(3)} kg/kWh = <strong className="text-emerald-300">{hourlyEmissionsKg} kg CO₂e / hr</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 5. INTERACTIVE CARBON SENSITIVITY SLIDERS ---------------- */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Interactive Carbon Sensitivity Simulator:</span>
            <span className="text-slate-400">Adjust Total IT Load or Grid Emission Factor</span>
          </div>

          {(customItLoadMw !== defaultItLoadMw || customIntensityG !== defaultGridIntensity) && (
            <button
              onClick={() => {
                setCustomItLoadMw(defaultItLoadMw);
                setCustomIntensityG(defaultGridIntensity);
                setAccountingMode('market_based');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Live Telemetry ({defaultItLoadMw} MW, {defaultGridIntensity}g)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-xs">
          {/* Slider 1: Total IT Load */}
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-slate-300 mb-1.5">
              <span>Simulated IT Compute Load:</span>
              <strong className="text-cyan-400 text-sm">{customItLoadMw.toFixed(2)} MW</strong>
            </div>
            <input
              type="range"
              min="1.50"
              max="5.00"
              step="0.05"
              value={customItLoadMw}
              onChange={(e) => setCustomItLoadMw(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1.50 MW (Low Load)</span>
              <span>3.42 MW (Current Actual)</span>
              <span>5.00 MW (Hall B Expansion)</span>
            </div>
          </div>

          {/* Slider 2: Carbon Intensity */}
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-slate-300 mb-1.5">
              <span>Grid Carbon Intensity Factor:</span>
              <strong className="text-emerald-400 text-sm">{effectiveIntensityG} g CO₂e/kWh</strong>
            </div>
            <input
              type="range"
              min="20"
              max="650"
              step="5"
              value={customIntensityG}
              disabled={accountingMode === 'location_based'}
              onChange={(e) => setCustomIntensityG(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-950 rounded-lg disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>20g (Pure Clean)</span>
              <span>124g (PPA Standard)</span>
              <span>385g (Regional Grid)</span>
              <span>650g (Coal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
