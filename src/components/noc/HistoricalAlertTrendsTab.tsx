import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ComposedChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  Layers, 
  Zap, 
  Snowflake, 
  Server, 
  HardDrive, 
  Network, 
  Eye, 
  RefreshCw,
  ArrowRight,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AlertTrendWeeklyPoint, HandDrawnImportantPart, HandDrawnSubsystemId } from '../../types';
import { HISTORICAL_ALERT_TRENDS_WEEKLY, HAND_DRAWN_IMPORTANT_PARTS } from '../../data/nocAlertTrendsData';

interface HistoricalAlertTrendsTabProps {
  onNavigateToProactiveSubsystem: (subsystemId: HandDrawnSubsystemId) => void;
  onOpenNotesReference: (subsystemId?: HandDrawnSubsystemId) => void;
}

export const HistoricalAlertTrendsTab: React.FC<HistoricalAlertTrendsTabProps> = ({
  onNavigateToProactiveSubsystem,
  onOpenNotesReference,
}) => {
  const [selectedSubsystemFilter, setSelectedSubsystemFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'stacked_categories' | 'failure_correlation' | 'mttr_trends'>('stacked_categories');

  // Compute summary statistics
  const totalAlertsLast8Weeks = HISTORICAL_ALERT_TRENDS_WEEKLY.reduce((acc, curr) => acc + curr.totalAlerts, 0);
  const totalCriticalSpikes = HISTORICAL_ALERT_TRENDS_WEEKLY.reduce((acc, curr) => acc + curr.criticalSpikes, 0);
  const avgMttr = Math.round(
    HISTORICAL_ALERT_TRENDS_WEEKLY.reduce((acc, curr) => acc + curr.meanTimeToResolveMinutes, 0) / HISTORICAL_ALERT_TRENDS_WEEKLY.length
  );

  const getSubsystemIcon = (id: HandDrawnSubsystemId) => {
    switch (id) {
      case 'servers': return <Server className="w-4 h-4 text-cyan-400" />;
      case 'networking': return <Network className="w-4 h-4 text-indigo-400" />;
      case 'storage': return <HardDrive className="w-4 h-4 text-amber-400" />;
      case 'power': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'cooling': return <Snowflake className="w-4 h-4 text-teal-400" />;
      case 'security': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'monitoring': return <Eye className="w-4 h-4 text-sky-400" />;
      case 'backup_dr': return <RefreshCw className="w-4 h-4 text-purple-400" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredParts = selectedSubsystemFilter === 'all' 
    ? HAND_DRAWN_IMPORTANT_PARTS 
    : HAND_DRAWN_IMPORTANT_PARTS.filter((p) => p.id === selectedSubsystemFilter);

  return (
    <div id="historical-alert-trends-section" className="space-y-6">
      {/* Executive KPI Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Analyzed Alarms</span>
            <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{totalAlertsLast8Weeks}</span>
            <span className="text-xs text-slate-400 font-mono">Past 60 Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 8 Core Data Center Subsystems</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Critical Outage Spikes</span>
            <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-300">{totalCriticalSpikes}</span>
            <span className="text-xs text-rose-400/80 font-mono font-semibold">Pre-Trip Events</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Highest frequency in Cooling & Power</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Mean Time to Resolve</span>
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-300">{avgMttr}</span>
            <span className="text-xs text-slate-400 font-mono">minutes avg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target MTTR SLA is &lt; 60 mins</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Proactive Prevention Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-300">89.4%</span>
            <span className="text-xs text-emerald-400/80 font-mono">Predicted Ahead</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Failures intercepted before tripwire</p>
        </div>
      </div>

      {/* Chart Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Historical Alert Analysis:
            </span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                id="btn-viewmode-stacked"
                onClick={() => setViewMode('stacked_categories')}
                className={`px-3 py-1 rounded font-mono transition-all ${
                  viewMode === 'stacked_categories'
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Subsystem Distribution (8 Parts)
              </button>
              <button
                id="btn-viewmode-correlation"
                onClick={() => setViewMode('failure_correlation')}
                className={`px-3 py-1 rounded font-mono transition-all ${
                  viewMode === 'failure_correlation'
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Critical Spikes vs Total
              </button>
              <button
                id="btn-viewmode-mttr"
                onClick={() => setViewMode('mttr_trends')}
                className={`px-3 py-1 rounded font-mono transition-all ${
                  viewMode === 'mttr_trends'
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Resolution Latency (MTTR)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Filter Subsystem:</span>
            <select
              value={selectedSubsystemFilter}
              onChange={(e) => setSelectedSubsystemFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All 8 Hand-Drawn Parts</option>
              {HAND_DRAWN_IMPORTANT_PARTS.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.number}. {part.title} ({part.subtitle})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recharts Visualization */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'stacked_categories' ? (
              <BarChart data={HISTORICAL_ALERT_TRENDS_WEEKLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="cooling" name="5. Cooling" stackId="a" fill="#14b8a6" />
                <Bar dataKey="power" name="4. Power" stackId="a" fill="#10b981" />
                <Bar dataKey="servers" name="1. Servers" stackId="a" fill="#06b6d4" />
                <Bar dataKey="storage" name="3. Storage" stackId="a" fill="#f59e0b" />
                <Bar dataKey="networking" name="2. Network" stackId="a" fill="#6366f1" />
                <Bar dataKey="monitoring" name="7. Monitor" stackId="a" fill="#38bdf8" />
                <Bar dataKey="security" name="6. Security" stackId="a" fill="#f43f5e" />
                <Bar dataKey="backup_dr" name="8. Backup/DR" stackId="a" fill="#a855f7" />
              </BarChart>
            ) : viewMode === 'failure_correlation' ? (
              <ComposedChart data={HISTORICAL_ALERT_TRENDS_WEEKLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="totalAlerts" name="Total Warning Alerts" fill="#1e293b" stroke="#38bdf8" fillOpacity={0.6} />
                <Bar dataKey="criticalSpikes" name="Critical Outage Spikes" fill="#ef4444" barSize={18} />
                <Line type="monotone" dataKey="criticalSpikes" name="Critical Trajectory" stroke="#f87171" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            ) : (
              <LineChart data={HISTORICAL_ALERT_TRENDS_WEEKLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" min" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="meanTimeToResolveMinutes" name="Mean Time to Resolve (Minutes)" stroke="#fbbf24" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subsystem Anomaly Pattern Breakdown (8 Parts Analysis) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>8-Part Subsystem Failure Pattern Recognition</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                (Mapped to Notebook Revision Notes)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Recurring micro-anomalies detected across the 8 data center parts prior to threshold breaches.
            </p>
          </div>
          <button
            onClick={() => onOpenNotesReference()}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View Hand-Drawn Blueprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredParts.map((part) => {
            const riskBadge = 
              part.predictedFailureRisk === 'high' ? 'bg-rose-950 text-rose-300 border-rose-700' :
              part.predictedFailureRisk === 'elevated' ? 'bg-amber-950 text-amber-300 border-amber-700' :
              part.predictedFailureRisk === 'moderate' ? 'bg-blue-950 text-blue-300 border-blue-700' :
              'bg-emerald-950 text-emerald-300 border-emerald-700';

            return (
              <div 
                key={part.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        {getSubsystemIcon(part.id)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500 font-bold">PART #{part.number}</span>
                          <span className="text-sm font-bold text-white">{part.title}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{part.subtitle}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${riskBadge}`}>
                      {part.predictedFailureRisk} Risk
                    </span>
                  </div>

                  <div className="mt-3 bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Historical 90-Day Alarms:</span>
                      <span className="text-white font-bold">{part.historicalAlertCount90d} events</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      <strong className="text-slate-400 font-mono text-[11px]">Recurring Signature: </strong>
                      {part.recurrentPattern}
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="italic text-cyan-400/90 font-medium">"{part.uptimeAnnotation}"</span>
                    <span className="text-slate-400">
                      Active Tasks: <strong className="text-amber-400">{part.activeProactiveTasksCount} Pending</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onOpenNotesReference(part.id)}
                    className="text-xs font-mono text-slate-400 hover:text-slate-200"
                  >
                    View Part Specs
                  </button>

                  <button
                    onClick={() => onNavigateToProactiveSubsystem(part.id)}
                    className="px-3 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>Inspect Proactive Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Failure Progression Model */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Failure Progression Lifecycle: From Symptom to Catastrophe</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Historical post-incident analysis shows that 94% of datacenter critical outages were preceded by 
          gradual mechanical or electrical symptoms. By resolving these in Phase 1 or 2, equipment damage and service interruption are avoided entirely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono pt-1">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold uppercase text-[11px]">Phase 1: Micro-Anomaly</div>
            <div className="text-slate-300 font-sans text-xs">Vibration shift, harmonic noise, optical dBm attenuation.</div>
            <div className="text-[10px] text-slate-500 pt-1">Window: 14 - 30 days prior</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="text-blue-400 font-bold uppercase text-[11px]">Phase 2: Warning Drift</div>
            <div className="text-slate-300 font-sans text-xs">Intermittent CRC drops, thermal Delta-T compression, battery impedance.</div>
            <div className="text-[10px] text-slate-500 pt-1">Window: 3 - 7 days prior</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-amber-800/60 space-y-1">
            <div className="text-amber-400 font-bold uppercase text-[11px]">Phase 3: Pre-Trip Alarm</div>
            <div className="text-slate-300 font-sans text-xs">CPU thermal throttling, inverter alarm, RPO replication lag &gt; 15m.</div>
            <div className="text-[10px] text-amber-500 pt-1">Window: 24 - 48 hours prior</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-rose-800 space-y-1">
            <div className="text-rose-400 font-bold uppercase text-[11px]">Phase 4: Critical Failure</div>
            <div className="text-slate-300 font-sans text-xs">Unplanned node shutdown, dual RAID disk loss, UPS bus collapse.</div>
            <div className="text-[10px] text-rose-500 pt-1">Cost: $100k+ / hr downtime</div>
          </div>
        </div>
      </div>
    </div>
  );
};
