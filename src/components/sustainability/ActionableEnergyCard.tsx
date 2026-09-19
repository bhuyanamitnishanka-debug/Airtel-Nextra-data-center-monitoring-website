import React, { useState } from 'react';
import { 
  Fan, 
  Zap, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sliders, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { EnergySavingModification } from '../../types';

interface ActionableEnergyCardProps {
  modification: EnergySavingModification;
  isActive: boolean;
  onToggle: (id: string) => void;
  index: number;
}

export const ActionableEnergyCard: React.FC<ActionableEnergyCardProps> = ({
  modification,
  isActive,
  onToggle,
  index,
}) => {
  const [expandedSop, setExpandedSop] = useState<boolean>(false);

  const isCooling = modification.category === 'cooling';
  const Icon = isCooling ? Fan : Zap;

  return (
    <div
      id={`energy-card-${modification.id}`}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isActive
          ? 'bg-slate-900/90 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      {/* Top Banner with Category & Impact Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                isCooling ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              #{index + 1}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide uppercase ${
                isCooling
                  ? 'bg-teal-950/80 text-teal-300 border border-teal-800/80'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
              }`}
            >
              {isCooling ? 'Cooling & HVAC' : 'Power Distribution'}
            </span>
          </div>

          {/* Interactive Simulation Switch */}
          <button
            id={`toggle-sim-${modification.id}`}
            onClick={() => onToggle(modification.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isActive
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
            title="Toggle inclusion of this modification in the simulated PUE line chart"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isActive ? 'Simulating Impact' : 'Simulate Impact'}</span>
          </button>
        </div>

        {/* Title & Subsystem Target */}
        <h3 className="text-base font-bold text-white tracking-tight flex items-start gap-2">
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isCooling ? 'text-teal-400' : 'text-emerald-400'}`} />
          <span>{modification.title}</span>
        </h3>
        <p className="text-xs font-mono text-slate-400 mt-1 pl-7">
          Subsystem Target: <span className="text-slate-300">{modification.subsystemTarget}</span>
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-cyan-400" /> PUE Delta
            </span>
            <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
              {modification.projectedPueDelta} PUE
            </div>
            <span className="text-[9px] text-slate-500">Facility-wide</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Continuous Power
            </span>
            <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
              -{modification.projectedKwReduction} kW
            </div>
            <span className="text-[9px] text-slate-500 font-mono">{(modification.annualKwhSaved / 1000).toLocaleString()} MWh/yr</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Annual Savings
            </span>
            <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
              ${modification.annualCostSavingsUsd.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">@ $0.11/kWh</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Leaf className="w-3 h-3 text-teal-400" /> Carbon Avoidance
            </span>
            <div className="text-sm font-bold font-mono text-teal-300 mt-0.5">
              {modification.annualCarbonAvoidanceMt} MT
            </div>
            <span className="text-[9px] text-slate-500 font-mono">CO₂e / year</span>
          </div>
        </div>

        {/* Data-Driven Observation from 30-Day Telemetry */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>30-Day Operational Telemetry Trigger:</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {modification.currentCondition}
          </p>
        </div>

        {/* Technical Action Proposed */}
        <div className="mt-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Engineering Action & Thermodynamic Rationale:</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            <strong className="text-white font-medium">{modification.actionProposed}</strong>
          </p>
          <p className="text-slate-400 leading-relaxed text-[11px] pt-1 border-t border-slate-800/60">
            {modification.technicalMechanism}
          </p>
        </div>

        {/* Engineering Feasibility Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Payback: <strong className="text-slate-200">{modification.paybackPeriodMonths} mo</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Risk: <strong className="text-emerald-300 capitalize">{modification.implementationRisk}</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span>Complexity: <strong className="text-slate-200 capitalize">{modification.complexity}</strong></span>
          </div>

          <div className="text-[10px] text-slate-500 ml-auto hidden sm:block">
            {modification.ashraeStandardCompliance}
          </div>
        </div>
      </div>

      {/* Expandable SOP / Implementation Plan */}
      <div className="border-t border-slate-800 bg-slate-950/90">
        <button
          onClick={() => setExpandedSop(!expandedSop)}
          className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Standard Operating Procedure (SOP) Protocol ({modification.sopSteps.length} Steps)</span>
          </span>
          {expandedSop ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expandedSop && (
          <div className="px-5 pb-4 pt-1 space-y-2 border-t border-slate-800/60">
            <div className="space-y-1.5">
              {modification.sopSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 font-mono">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80">
              <span>Standard: {modification.ashraeStandardCompliance}</span>
              <span className="text-emerald-400">Zero Critical Downtime Required</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
