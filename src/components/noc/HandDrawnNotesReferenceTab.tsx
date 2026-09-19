import React, { useState } from 'react';
import { 
  BookOpen, 
  Server, 
  Network, 
  HardDrive, 
  Zap, 
  Snowflake, 
  ShieldAlert, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Thermometer,
  Cpu,
  Flame,
  Camera,
  Fingerprint,
  Radio,
  Cloud
} from 'lucide-react';
import { HandDrawnImportantPart, HandDrawnSubsystemId } from '../../types';
import { HAND_DRAWN_IMPORTANT_PARTS } from '../../data/nocAlertTrendsData';

interface HandDrawnNotesReferenceTabProps {
  initialHighlightedSubsystem?: HandDrawnSubsystemId;
  onNavigateToTrends: () => void;
  onNavigateToProactive: (subsystemId?: HandDrawnSubsystemId) => void;
}

export const HandDrawnNotesReferenceTab: React.FC<HandDrawnNotesReferenceTabProps> = ({
  initialHighlightedSubsystem,
  onNavigateToTrends,
  onNavigateToProactive,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<HandDrawnSubsystemId>(
    initialHighlightedSubsystem || 'servers'
  );

  const selectedPart = HAND_DRAWN_IMPORTANT_PARTS.find((p) => p.id === selectedPartId) || HAND_DRAWN_IMPORTANT_PARTS[0];

  const getSubsystemIcon = (id: HandDrawnSubsystemId) => {
    switch (id) {
      case 'servers': return <Server className="w-5 h-5 text-cyan-400" />;
      case 'networking': return <Network className="w-5 h-5 text-indigo-400" />;
      case 'storage': return <HardDrive className="w-5 h-5 text-amber-400" />;
      case 'power': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'cooling': return <Snowflake className="w-5 h-5 text-teal-400" />;
      case 'security': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'monitoring': return <Eye className="w-5 h-5 text-sky-400" />;
      case 'backup_dr': return <RefreshCw className="w-5 h-5 text-purple-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div id="hand-drawn-revision-notes-reference" className="space-y-6">
      {/* Notebook Binder Style Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-600/40 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-500 text-amber-300 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Data Centre Important Parts (Quick Revision Notes)
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                Hand-Drawn &amp; Explained
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Field engineering schematic analysis of the 8 foundational components required for 24/7 uptime, 
              complete with subsystem interactions and proactive failure prevention models.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => onNavigateToProactive()}
            className="px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Proactive Maintenance Tasks</span>
          </button>
        </div>
      </div>

      {/* 8-Part Quick Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {HAND_DRAWN_IMPORTANT_PARTS.map((part) => {
          const isSelected = selectedPartId === part.id;
          return (
            <button
              key={part.id}
              onClick={() => setSelectedPartId(part.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">#{part.number}</span>
                {getSubsystemIcon(part.id)}
              </div>
              <div className="mt-2">
                <div className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {part.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {part.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card for Selected Part */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
              {getSubsystemIcon(selectedPart.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">PART #{selectedPart.number}</span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {selectedPart.title}
                </h2>
                <span className="text-sm text-slate-400 font-mono">({selectedPart.subtitle})</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-amber-300 italic font-semibold">
                  "{selectedPart.uptimeAnnotation}"
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">
                  90-Day Alarms: <strong className="text-slate-200">{selectedPart.historicalAlertCount90d}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateToProactive(selectedPart.id)}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>View PM Tasks for Part #{selectedPart.number}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Subcomponents Illustrated from Hand-Drawn Diagram */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Illustrated Architectural Components in Diagram:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedPart.components.map((comp, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white tracking-tight">{comp.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                    {comp.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{comp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes from Hand-Drawn Notebook & Functional Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Revision Notes (Hand-Written Explanations):</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {selectedPart.bulletNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Predictive Alert Trend &amp; Failure Mode Analysis:</span>
            </h4>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
              <div className="text-[11px] font-mono text-slate-400">
                Recurring Sensor Pattern:
              </div>
              <p className="text-slate-200 leading-relaxed font-sans font-medium">
                {selectedPart.recurrentPattern}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
                <span>Predicted Failure Horizon:</span>
                <span className="text-rose-400 font-bold uppercase">{selectedPart.predictedFailureRisk} Risk Level</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
              <span className="font-mono text-[11px]">Proactive Intervention:</span>
              <span className="font-bold">Avoids critical SLA tripwire outage</span>
            </div>
          </div>
        </div>

        {/* Visual Schematics of All 8 Notebook Parts */}
        <div className="pt-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Complete 8-Part Data Centre Schematic Matrix:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* 1. Servers */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-cyan-400 font-bold">1. SERVERS</span>
                <span className="text-slate-500">Compute</span>
              </div>
              <div className="text-slate-300 font-medium">Rack Servers &amp; Blade Servers</div>
              <div className="text-[11px] text-slate-400">Host apps, CPU/RAM/Storage, Virtualization VMs.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Crucial for uptime!"</div>
            </div>

            {/* 2. Networking */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-indigo-400 font-bold">2. NETWORKING</span>
                <span className="text-slate-500">Traffic</span>
              </div>
              <div className="text-slate-300 font-medium">Routers, Switches &amp; Firewalls</div>
              <div className="text-[11px] text-slate-400">Fiber/Copper interconnect, Spine-leaf topology.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Redundancy is key!"</div>
            </div>

            {/* 3. Storage */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-amber-400 font-bold">3. STORAGE</span>
                <span className="text-slate-500">Repository</span>
              </div>
              <div className="text-slate-300 font-medium">SAN &amp; NAS Arrays</div>
              <div className="text-[11px] text-slate-400">Block-level &amp; file-level, HDD/SSD RAID redundancy.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Massive scalable capacity"</div>
            </div>

            {/* 4. Power */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">4. POWER SYSTEMS</span>
                <span className="text-slate-500">Reliability</span>
              </div>
              <div className="text-slate-300 font-medium">UPS, Generators &amp; PDUs</div>
              <div className="text-[11px] text-slate-400">N+1 or 2N redundancy, clean smooth conditioned power.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Clean, stable power is crucial"</div>
            </div>

            {/* 5. Cooling */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-teal-400 font-bold">5. COOLING</span>
                <span className="text-slate-500">Heat Mgmt</span>
              </div>
              <div className="text-slate-300 font-medium">CRAC, Chillers &amp; Hot/Cold Aisle</div>
              <div className="text-[11px] text-slate-400">Maintain 18-27°C, prevent overheating, liquid cooling.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Keep it cool! Crucial for uptime!"</div>
            </div>

            {/* 6. Security */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-rose-400 font-bold">6. SECURITY</span>
                <span className="text-slate-500">Protection</span>
              </div>
              <div className="text-slate-300 font-medium">Biometric, CCTV &amp; Fire Suppression</div>
              <div className="text-[11px] text-slate-400">Strict layered access control, clean agent gas (FM-200).</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Perimeter security &amp; anti-theft"</div>
            </div>

            {/* 7. Monitoring */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-sky-400 font-bold">7. MONITORING</span>
                <span className="text-slate-500">Operations</span>
              </div>
              <div className="text-slate-300 font-medium">DCIM, Sensors &amp; Alerts</div>
              <div className="text-[11px] text-slate-400">Real-time tracking of all systems, proactive notifications.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Capacity planning &amp; remote tools"</div>
            </div>

            {/* 8. Backup & DR */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-purple-400 font-bold">8. BACKUP &amp; DR</span>
                <span className="text-slate-500">Continuity</span>
              </div>
              <div className="text-slate-300 font-medium">Primary Site, DR Replication &amp; Cloud</div>
              <div className="text-[11px] text-slate-400">RPO (max data loss), RTO (max downtime), testing.</div>
              <div className="text-[10px] text-amber-400 font-mono italic">"Crucial for uptime!"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
