import React, { useState } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Zap,
  Fan,
  Network,
  ShieldCheck,
  Mail,
  Send,
  ArrowRight,
  TrendingUp,
  Download,
  Info,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { 
  SERVER_RACK_ANATOMY_PARTS, 
  SERVER_RACK_WORKING_FLOW_STEPS, 
  ServerRackAnatomyPart, 
  ServerRackWorkingFlowStep 
} from '../../data/historicalCapacityData';
import { HistoricalDataPoint } from '../../types';

interface ServerRackWorkingFlowCardProps {
  currentPoint: HistoricalDataPoint;
  onOpenExportCsv?: () => void;
  onNavigateToRack?: (rackId: string) => void;
}

export const ServerRackWorkingFlowCard: React.FC<ServerRackWorkingFlowCardProps> = ({
  currentPoint,
  onOpenExportCsv,
  onNavigateToRack,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>('cpu_processing');
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'working_flow' | 'rack_anatomy'>('working_flow');

  const selectedPart = SERVER_RACK_ANATOMY_PARTS.find((p) => p.id === selectedPartId) || SERVER_RACK_ANATOMY_PARTS[0];
  const activeStep = SERVER_RACK_WORKING_FLOW_STEPS.find((s) => s.stepNumber === activeStepNumber) || SERVER_RACK_WORKING_FLOW_STEPS[0];

  return (
    <div id="server-rack-working-flow-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/80 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              ARCHITECTURAL ANATOMY BLUEPRINT
            </span>
            <span className="text-xs font-mono text-slate-400">
              How a Server Rack Works &amp; Working Flow Lifecycle
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Server Rack Internal Subsystems &amp; Request Flow</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Correlating continuous 30-day capacity trends with the internal mechanics of high-density rack cabinets: from client ingress requests and CPU/RAM processing to NVMe persistent storage, PDU power delivery, and top exhaust airflow.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              id="btn-switch-working-flow"
              onClick={() => setViewMode('working_flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'working_flow'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Working Flow (6 Steps)</span>
            </button>
            <button
              id="btn-switch-rack-anatomy"
              onClick={() => setViewMode('rack_anatomy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'rack_anatomy'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Rack Anatomy (7 Subsystems)</span>
            </button>
          </div>

          {onOpenExportCsv && (
            <button
              id="btn-open-export-csv-from-rack-flow"
              onClick={onOpenExportCsv}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Export capacity & rack flow data to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV with Rack Metrics</span>
            </button>
          )}
        </div>
      </div>

      {/* High-Level Topology Ribbon (Internet -> Gateway -> Server Rack -> Clients) */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase">
            <Network className="w-3.5 h-3.5" />
            End-to-End Data Pipeline Architecture:
          </span>
          <span className="text-slate-400">Ingress: HTTP/HTTPS • Egress: Processed Data Stream</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {/* Node 1 */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 mb-1.5">
              <Network className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Internet / Network Core</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">Carrier Backbones &amp; WAN</span>
            <span className="text-[10px] text-cyan-400 font-mono mt-1">168.4k Req/sec</span>
          </div>

          {/* Node 2 */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 mb-1.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Gateway / Firewall</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">Packet Inspection &amp; L3/L4 Security</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1">0.12ms Inspection Delay</span>
          </div>

          {/* Node 3 */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-indigo-700/60 ring-1 ring-indigo-500/40 flex flex-col items-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-16 h-16 bg-indigo-500/10 rounded-full blur-sm pointer-events-none" />
            <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-600 text-indigo-300 mb-1.5">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-200">Server Rack Cabinet</span>
            <span className="text-[10px] text-indigo-300 font-mono mt-0.5">ToR Switch • Blades • NVMe • PDU</span>
            <span className="text-[10px] text-amber-400 font-mono mt-1">
              {currentPoint.itLoadMw} MW • {currentPoint.rackCapacityPercent}% Occ.
            </span>
          </div>

          {/* Node 4 */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-purple-950 border border-purple-800 text-purple-400 mb-1.5">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Clients / Users</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">Desktops, Laptops &amp; Mobile Devices</span>
            <span className="text-[10px] text-purple-400 font-mono mt-1">{currentPoint.dataServedGbps || 88.5} Gbps Egress</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Section: Mode = working_flow */}
      {viewMode === 'working_flow' ? (
        <div className="space-y-6">
          {/* Step Selector Horizontal Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                Working Flow Lifecycle (Step 1 to 6):
              </span>
              <span>Click any step to inspect hardware role &amp; metrics</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {SERVER_RACK_WORKING_FLOW_STEPS.map((step) => {
                const isSelected = step.stepNumber === activeStepNumber;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepNumber(step.stepNumber)}
                    className={`p-3 rounded-xl border text-left transition-all relative select-none ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {step.stepNumber}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                    </div>
                    <div className="mt-2 text-xs font-bold text-white line-clamp-2 leading-tight">
                      {step.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Detailed Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-400 font-bold font-mono">
                  {activeStep.stepNumber}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Step {activeStep.stepNumber}: {activeStep.title}
                  </h3>
                  <p className="text-xs text-indigo-300 font-mono mt-0.5">
                    Actor: {activeStep.actor}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-300">
                {activeStep.protocolMetric}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  Detailed Operational Action:
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                  {activeStep.action}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="font-semibold text-slate-300">Hardware Involved:</span>
                  <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60">
                    {activeStep.hardwareInvolved}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
                  Correlated Telemetry Value:
                </span>
                {activeStep.stepNumber === 1 && (
                  <div>
                    <div className="text-2xl font-bold font-mono text-cyan-400">
                      {(currentPoint.clientRequestsPerSec || 165000).toLocaleString()} <span className="text-xs text-slate-400">Req/sec</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Peak Ingress Rate into ToR Port</span>
                  </div>
                )}
                {activeStep.stepNumber === 2 && (
                  <div>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      100% <span className="text-xs text-slate-400">Filtered</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Zero dropouts or malformed packets</span>
                  </div>
                )}
                {activeStep.stepNumber === 3 && (
                  <div>
                    <div className="text-2xl font-bold font-mono text-indigo-400">
                      400 <span className="text-xs text-slate-400">Gbps Backplane</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Sub-microsecond inter-blade latency</span>
                  </div>
                )}
                {activeStep.stepNumber === 4 && (
                  <div>
                    <div className="text-2xl font-bold font-mono text-indigo-300">
                      {currentPoint.cpuProcessingPercent || 68.4}% <span className="text-xs text-slate-400">CPU</span> / {currentPoint.ramMemoryPercent || 74.2}% <span className="text-xs text-slate-400">RAM</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Dual AMD EPYC 96-core processors</span>
                  </div>
                )}
                {activeStep.stepNumber === 5 && (
                  <div>
                    <div className="text-2xl font-bold font-mono text-amber-400">
                      {(currentPoint.storageIops || 56400).toLocaleString()} <span className="text-xs text-slate-400">IOPS</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {currentPoint.pduBranchAmps || 27.8} A PDU Branch Draw
                    </span>
                  </div>
                )}
                {activeStep.stepNumber === 6 && (
                  <div>
                    <div className="text-2xl font-bold font-mono text-purple-400">
                      {currentPoint.dataServedGbps || 88.5} <span className="text-xs text-slate-400">Gbps Egress</span>
                    </div>
                    <span className="text-[11px] text-teal-400 mt-1 block">
                      {currentPoint.airflowCfm || 2650} CFM Top Exhaust Airflow
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* View Mode: rack_anatomy */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subsystem List (Left Col) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
              Rack Cabinet Subsystems (Click to Inspect):
            </span>
            {SERVER_RACK_ANATOMY_PARTS.map((part) => {
              const isSelected = part.id === selectedPartId;
              return (
                <button
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? `bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50`
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${part.badgeBg} border ${part.borderColor} ${part.color}`}>
                      {part.category === 'cooling' && <Fan className="w-4 h-4" />}
                      {part.category === 'network' && <Network className="w-4 h-4" />}
                      {part.category === 'compute' && <Cpu className="w-4 h-4" />}
                      {part.category === 'storage' && <HardDrive className="w-4 h-4" />}
                      {part.category === 'power' && <Zap className="w-4 h-4" />}
                      {part.category === 'flow' && <Send className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{part.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{part.labelFromImage}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold ${part.color}`}>
                      {part.typicalValue}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      {part.diagramLocation}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Subsystem Detail Card (Right Col) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${selectedPart.badgeBg} border ${selectedPart.borderColor} ${selectedPart.color}`}>
                  {selectedPart.category === 'cooling' && <Fan className="w-6 h-6" />}
                  {selectedPart.category === 'network' && <Network className="w-6 h-6" />}
                  {selectedPart.category === 'compute' && <Cpu className="w-6 h-6" />}
                  {selectedPart.category === 'storage' && <HardDrive className="w-6 h-6" />}
                  {selectedPart.category === 'power' && <Zap className="w-6 h-6" />}
                  {selectedPart.category === 'flow' && <Send className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedPart.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    From Illustrated Diagram: &quot;{selectedPart.labelFromImage}&quot;
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${selectedPart.badgeBg} ${selectedPart.color} border ${selectedPart.borderColor}`}>
                Location: {selectedPart.diagramLocation}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                  Architectural Description:
                </span>
                <p className="leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {selectedPart.description}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                  Role in Working Flow:
                </span>
                <p className="leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-cyan-300">
                  {selectedPart.workingFlowRole}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Hardware Specification:
                  </span>
                  <span className="text-xs text-slate-200 font-medium block mt-1">
                    {selectedPart.hardwareSpec}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    {selectedPart.telemetryMetricName}:
                  </span>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    {selectedPart.typicalValue}
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono">
                    Peak: {selectedPart.peakValue}
                  </span>
                </div>
              </div>
            </div>

            {onNavigateToRack && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToRack('RACK-A01')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in 42U Rack Elevation View (RACK-A01)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
