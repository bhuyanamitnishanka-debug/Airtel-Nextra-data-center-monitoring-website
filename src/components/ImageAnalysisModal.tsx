import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Zap, 
  Thermometer, 
  Users, 
  Layers, 
  Wrench,
  Radio,
  Building2
} from 'lucide-react';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const analysisPoints = [
    {
      id: 'racks',
      title: '1. High-Density 42U Server Aisles & Cold Containment',
      badge: 'Data Hall White Space',
      icon: Cpu,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/30',
      imageObservations: 
        'Massive longitudinal rows of 19" rack cabinets with vertical neon-blue and violet LED status indicators, enclosed cold-aisle containment roofs, and perforated front door mesh for high CFM laminar airflow.',
      dcimFunctionality: 
        'Interactive 2.5D Hall Grid & Deep 42U Rack Elevation Inspector: monitor rack density (up to 38kW/rack for NVIDIA DGX H100 clusters), device temperatures, phase loads, and trigger remote soft-reboots or locator beacon LEDs.',
      tabTarget: 'hall_map',
      tabLabel: 'Open Hall Floorplan & 42U Inspector',
    },
    {
      id: 'noc',
      title: '2. Elevated Glass Mezzanine NOC (Command Bridge)',
      badge: 'Command & Telemetry',
      icon: Eye,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
      bgColor: 'bg-indigo-950/30',
      imageObservations: 
        'Two-level glass-walled command room overlooking the entire server hall with the "nxtra by airtel" emblem. Multi-monitor operator workstations running real-time SCADA, BMS, and network topology maps.',
      dcimFunctionality: 
        'NOC Incident & SCADA Alarm Matrix: live event streaming, automated P1/P2 alarm triage, acoustic alert triggers, and instant technician dispatch from the central command bridge.',
      tabTarget: 'noc_alerts',
      tabLabel: 'Open NOC Alarm Matrix',
    },
    {
      id: 'engineers',
      title: '3. Field Technicians with Mobile Crash Carts',
      badge: 'Physical Operations',
      icon: Users,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-950/30',
      imageObservations: 
        'Field engineers in protective blue technician uniforms stationed at rolling diagnostic crash carts with rugged KVM consoles directly interfacing with rack serial/management ports.',
      dcimFunctionality: 
        'Field Technician Roster & Work Order Dispatch: assign work orders (e.g. SAS SSD hot-swaps, fiber patch testing, containment sealing) to specific technicians and track active crash cart deployments.',
      tabTarget: 'tech_dispatch',
      tabLabel: 'Open Field Technician Dispatch',
    },
    {
      id: 'cooling',
      title: '4. Overhead Piping & Sub-Floor Air Plenum',
      badge: 'Thermal Management',
      icon: Thermometer,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/40',
      bgColor: 'bg-teal-950/30',
      imageObservations: 
        'Heavy-duty overhead chilled water pipes with industrial valves, structural ceiling ladder racks, and perforated floor tiles providing pressurized sub-floor cold air delivery directly to cabinet intakes.',
      dcimFunctionality: 
        'Thermal SCADA & HVAC Management: close-coupled In-Row CRAH units, chilled water loop supply/return delta (12.0°C to 18.5°C), differential pressure sensors (+23.8 Pa), and free-cooling economizer mode.',
      tabTarget: 'cooling_hvac',
      tabLabel: 'Open HVAC & Cooling SCADA',
    },
    {
      id: 'power',
      title: '5. Overhead Busways & 2N Electrical Redundancy',
      badge: 'Critical Power Chain',
      icon: Zap,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/30',
      imageObservations: 
        'Suspended high-amperage electrical busway runs and yellow fiber trays dropping redundant A+B feed whips into cabinet tops, supported by 33kV dual substations and backup rotary/lithium UPS strings.',
      dcimFunctionality: 
        'Single-Line Diagram (SLD) & Power Chain: live 3-phase load balance (L1/L2/L3), PUE calculator (1.18 benchmark), and an interactive Utility Grid Outage simulation showing automated UPS/Genset transfer.',
      tabTarget: 'power_chain',
      tabLabel: 'Open Power Chain SLD',
    },
    {
      id: 'proactive_subsystems',
      title: '6. 8 Critical Subsystems & Proactive Maintenance Playbook',
      badge: 'Failure Prevention & Revision Notes',
      icon: Eye,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/30',
      imageObservations: 
        'Engineering revision schematic defining the 8 pillars of continuous data center operation: Compute Servers, Traffic Networking, Storage SAN/NAS, 2N Power, Hot/Cold Cooling, Layered Security, SCADA Monitoring, and DR Backup.',
      dcimFunctionality: 
        'NOC Historical Alert Trends & Proactive Maintenance Engine: identifies early acoustic, thermal, and optical degradation signatures across all 8 subsystems to generate pre-emptive work orders before downtime occurs.',
      tabTarget: 'noc_alerts',
      tabLabel: 'Open NOC Trends & Proactive PM',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="image-analysis-modal-container"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Facility Image Analysis & Architecture Mapping
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  nxtra by airtel Hyperscale
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Translating physical data center infrastructure from the photo into full DCIM internal software modules.
              </p>
            </div>
          </div>
          <button
            id="btn-close-image-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Top visual reference banner */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 flex flex-col md:flex-row items-center gap-5">
            <div className="relative rounded-lg overflow-hidden border border-slate-700 w-full md:w-72 h-44 shrink-0 bg-slate-900 flex items-center justify-center group shadow-md">
              <img 
                src="image.png" 
                alt="Nxtra Data Center Facility Reference"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback visual illustration if local path isn't directly resolved
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-mono font-medium text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-800/80">
                  Uploaded Facility Reference
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Tier IV Hyperscale Facility Architecture</span>
              </div>
              <p className="text-slate-300">
                The image reveals a state-of-the-art enterprise colocation facility featuring cold-aisle contained server rows, overhead industrial chilled water piping, dual-tier mezzanine operations command center, and on-floor field engineers utilizing mobile diagnostic crash carts.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Cold Aisle Containment
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Overhead Chilled Water & Busways
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Mezzanine 24/7 NOC Bridge
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Crash Cart Field Technicians
                </span>
              </div>
            </div>
          </div>

          {/* 14-Feature Anatomy of a Data Center Discovery Banner */}
          <div className="rounded-xl border border-cyan-600/80 bg-gradient-to-r from-cyan-950/60 to-slate-950 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-900/60 border border-cyan-500 text-cyan-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>The Anatomy of a Data Center (14 Features Blueprint)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold">NEW</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Full 14-point enterprise architectural cutaway: Building Structure, Physical Security, BMS, 2N UPS, Backup Gensets, and Carrier-Neutral Meet-Me Rooms.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectTab('anatomy_14_features');
                onClose();
              }}
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Explore 14 Features</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisPoints.map((pt) => {
              const Icon = pt.icon;
              return (
                <div 
                  key={pt.id}
                  className={`p-4 rounded-xl border ${pt.borderColor} ${pt.bgColor} flex flex-col justify-between space-y-3 transition-all hover:border-slate-500`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 ${pt.color}`} />
                        <h3 className="font-semibold text-sm text-white">{pt.title}</h3>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                        {pt.badge}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wide text-slate-400">
                        Observed in Image:
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {pt.imageObservations}
                      </p>
                    </div>

                    <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wide text-cyan-400">
                        DCIM Software Implementation:
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {pt.dcimFunctionality}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab(pt.tabTarget);
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <span>{pt.tabLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>All modules linked to live simulated telemetry engine</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
          >
            Explore DCIM Portal
          </button>
        </div>
      </div>
    </div>
  );
};
