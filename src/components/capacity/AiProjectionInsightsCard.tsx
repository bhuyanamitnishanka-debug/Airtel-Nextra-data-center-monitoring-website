import React from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Zap,
  Server,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';
import { CapacityProjectionSummary } from '../../utils/linearRegression';

interface AiProjectionInsightsCardProps {
  summary: CapacityProjectionSummary;
  projectionEnabled: boolean;
  onToggleProjection: () => void;
}

export const AiProjectionInsightsCard: React.FC<AiProjectionInsightsCardProps> = ({
  summary,
  projectionEnabled,
  onToggleProjection,
}) => {
  const {
    itLoadRegression,
    rackCapacityRegression,
    currentItLoadMw,
    projectedItLoad30dMw,
    itLoadGrowthMw30d,
    itLoadGrowthPercent30d,
    currentRackPercent,
    projectedRackPercent30d,
    rackGrowthPercent30d,
    projectedOccupiedRacks30d,
    daysToPowerCap3_6Mw,
    daysToRackWarning90Pct,
    milestones,
  } = summary;

  // Fit quality rating
  const getFitQualityBadge = (r2: number) => {
    if (r2 >= 0.9) {
      return {
        label: 'Strong Fit',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
        desc: 'High correlation with continuous infrastructure demand'
      };
    }
    if (r2 >= 0.75) {
      return {
        label: 'Moderate Fit',
        color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
        desc: 'Consistent growth with minor diurnal/workload fluctuations'
      };
    }
    return {
      label: 'Emerging Fit',
      color: 'text-amber-400 bg-amber-950/80 border-amber-800',
      desc: 'High variance in recent telemetry'
    };
  };

  const itFit = getFitQualityBadge(itLoadRegression.rSquared);
  const rackFit = getFitQualityBadge(rackCapacityRegression.rSquared);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-violet-950/70 border border-violet-700/60 text-violet-400 shadow-sm shadow-violet-950/50">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  AI-Driven 30-Day Capacity Projection Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-violet-900/60 text-violet-300 border border-violet-700/70 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  OLS Linear Regression
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mathematical trajectory modeling fitted on 30-day baseline telemetry to forecast electrical and white space runway.
              </p>
            </div>
          </div>
        </div>

        {/* Master Projection Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-400">Projection Overlay:</span>
          <button
            id="btn-toggle-ai-projection-line"
            onClick={onToggleProjection}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md ${
              projectionEnabled
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-950/60 ring-2 ring-violet-500/40'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>30-Day Forecast: {projectionEnabled ? 'ACTIVE' : 'INACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* Projection Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: IT Load Projection */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-3.5 h-3.5" /> IT Load in +30 Days
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              +{itLoadGrowthPercent30d}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {projectedItLoad30dMw} <span className="text-xs text-cyan-400">MW</span>
            </span>
            <span className="text-xs font-mono text-slate-500 line-through">
              {currentItLoadMw} MW
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
            <span>Daily Velocity:</span>
            <span className="text-cyan-300 font-semibold">+{itLoadRegression.dailyGrowthRate} MW/day</span>
          </div>

          <div className="text-[10px] font-mono text-slate-500">
            Forecast delta: +{itLoadGrowthMw30d} MW across 30 days
          </div>
        </div>

        {/* Card 2: Rack Space Projection */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Server className="w-3.5 h-3.5" /> Rack Capacity in +30 Days
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              +{rackGrowthPercent30d}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {projectedRackPercent30d}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({projectedOccupiedRacks30d}/240 Racks)
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
            <span>Daily Velocity:</span>
            <span className="text-amber-300 font-semibold">+{rackCapacityRegression.dailyGrowthRate}%/day</span>
          </div>

          <div className="text-[10px] font-mono text-slate-500">
            {projectedOccupiedRacks30d - 188} new racks deployed over forecast window
          </div>
        </div>

        {/* Card 3: Model Fit & Correlation */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-violet-400">
              <Activity className="w-3.5 h-3.5" /> Regression Fit (R²)
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${itFit.color}`}>
              {itFit.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-violet-300">
              {itLoadRegression.rSquared.toFixed(3)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              (Pearson r = {itLoadRegression.pearsonR.toFixed(3)})
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
            <span>Std Error (Se):</span>
            <span className="text-slate-300 font-mono">±{itLoadRegression.stdError} MW</span>
          </div>

          <div className="text-[10px] font-mono text-slate-500 truncate" title={itLoadRegression.formula}>
            Formula: {itLoadRegression.formula}
          </div>
        </div>

        {/* Card 4: Next Critical Exhaustion Milestone */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Clock className="w-3.5 h-3.5" /> Next Capacity Milestone
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              {daysToRackWarning90Pct !== null ? `${daysToRackWarning90Pct} Days` : 'Monitored'}
            </span>
          </div>

          <div className="text-lg font-bold font-mono text-white">
            {daysToRackWarning90Pct !== null ? (
              <span>~{daysToRackWarning90Pct} Days to 90%</span>
            ) : (
              <span>Headroom Safe</span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
            <span>Power Cap (3.6 MW):</span>
            <span className="text-rose-300 font-mono">
              {daysToPowerCap3_6Mw !== null ? `~${daysToPowerCap3_6Mw} Days` : '> 90 Days'}
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-500">
            Threshold breach projected in Q4
          </div>
        </div>
      </div>

      {/* Regression Details & Mathematical Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mathematical Model Specs */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              Linear Regression Formulations (OLS)
            </span>
            <span className="text-[10px] text-slate-500">Least Squares Fit: y = mx + b</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-cyan-300">
                <span className="font-semibold">IT Load Model (MW):</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-800">
                  {itLoadRegression.formula}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Slope (m): +{itLoadRegression.slope.toFixed(4)} MW/day</span>
                <span>R²: {itLoadRegression.rSquared.toFixed(4)}</span>
                <span>Intercept: {itLoadRegression.intercept.toFixed(4)} MW</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-amber-300">
                <span className="font-semibold">Rack Space Model (%):</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-200 border border-amber-800">
                  {rackCapacityRegression.formula}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Slope (m): +{rackCapacityRegression.slope.toFixed(4)} %/day</span>
                <span>R²: {rackCapacityRegression.rSquared.toFixed(4)}</span>
                <span>Intercept: {rackCapacityRegression.intercept.toFixed(4)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Runway Timeline */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Projected Capacity Milestones & Threshold Breaches
            </span>
            <span className="text-[10px] text-slate-500">Autonomous Early Warning</span>
          </div>

          <div className="space-y-2">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-colors ${
                  milestone.severity === 'critical'
                    ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    : milestone.severity === 'warning'
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    {milestone.severity === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                    {milestone.severity === 'warning' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                    {milestone.severity === 'info' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    <span>{milestone.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {milestone.metric} • Target: {milestone.targetThreshold}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-xs">
                    {milestone.daysRemaining !== null ? `~${milestone.daysRemaining} Days` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {milestone.projectedDate || 'Beyond 90d'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proactive Engineering Action Advisory */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-950 border border-violet-800/50 flex items-start gap-3 text-xs font-mono">
        <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-300">
          <div className="font-bold text-violet-200 flex items-center gap-2">
            <span>AI Capacity Advisory: Proactive Expansion Timeline</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-900/80 text-violet-300">
              Confidence Interval: 90%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            At the calculated growth velocity of <strong className="text-cyan-300">+{itLoadRegression.monthlyGrowthRate} MW/month</strong> and <strong className="text-amber-300">+{rackCapacityRegression.monthlyGrowthRate}% rack occupancy/month</strong>, 
            the facility will encounter the 90% white space reserve threshold in approximately <strong className="text-white">{daysToRackWarning90Pct} days</strong>. 
            Recommendation: Issue RFP for Hall B mechanical chiller procurement and 33kV switchgear feeder validation within 14 days.
          </p>
        </div>
      </div>
    </div>
  );
};
