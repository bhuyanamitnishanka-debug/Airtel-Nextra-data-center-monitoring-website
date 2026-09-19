import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Clock, 
  Filter, 
  ShieldAlert, 
  Wrench, 
  Radio, 
  Activity, 
  Volume2, 
  ChevronRight,
  ExternalLink,
  Users,
  TrendingUp,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FieldTechnician, HandDrawnSubsystemId, NocAlert, WorkOrder } from '../types';
import { HistoricalAlertTrendsTab } from './noc/HistoricalAlertTrendsTab';
import { ProactiveMaintenanceTab } from './noc/ProactiveMaintenanceTab';
import { HandDrawnNotesReferenceTab } from './noc/HandDrawnNotesReferenceTab';

interface NocIncidentCenterProps {
  alerts: NocAlert[];
  technicians: FieldTechnician[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onDispatchTechFromAlert: (alert: NocAlert) => void;
  onSelectRackById: (rackId: string) => void;
  onCreateWorkOrder?: (wo: Omit<WorkOrder, 'id' | 'createdTime'>) => void;
  initialSubSection?: 'matrix' | 'trends' | 'proactive_pm' | 'notes_reference';
}

export const NocIncidentCenter: React.FC<NocIncidentCenterProps> = ({
  alerts,
  technicians,
  onAcknowledgeAlert,
  onResolveAlert,
  onDispatchTechFromAlert,
  onSelectRackById,
  onCreateWorkOrder,
  initialSubSection = 'matrix',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'trends' | 'proactive_pm' | 'notes_reference'>(initialSubSection);
  const [selectedProactiveSubsystem, setSelectedProactiveSubsystem] = useState<string>('all');
  const [highlightedNoteSubsystem, setHighlightedNoteSubsystem] = useState<HandDrawnSubsystemId | undefined>();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSev = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesCat = categoryFilter === 'all' || alert.category === categoryFilter;
    return matchesSev && matchesCat;
  });

  const activeAlerts = filteredAlerts.filter((a) => !a.resolved);
  const resolvedAlerts = filteredAlerts.filter((a) => a.resolved);

  const getSeverityBadge = (sev: string) => {
    if (sev === 'critical') return 'bg-red-950 text-red-300 border-red-700 animate-pulse';
    if (sev === 'major') return 'bg-amber-950 text-amber-300 border-amber-700';
    if (sev === 'minor') return 'bg-blue-950 text-blue-300 border-blue-700';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const handleNavigateToProactiveWithSubsystem = (subsystemId: HandDrawnSubsystemId) => {
    setSelectedProactiveSubsystem(subsystemId);
    setActiveSubTab('proactive_pm');
  };

  const handleOpenNotesReference = (subsystemId?: HandDrawnSubsystemId) => {
    if (subsystemId) {
      setHighlightedNoteSubsystem(subsystemId);
    }
    setActiveSubTab('notes_reference');
  };

  return (
    <div id="noc-incident-matrix-view" className="space-y-5">
      {/* Mezzanine NOC Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-700/60 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-900/80 border border-indigo-500 text-indigo-300 shadow-md">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                NOC Command Bridge &amp; Incident Analytics
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                nxtra by airtel • Level 2 Glass Mezzanine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live Alarm Matrix • Historical Alert Trend Engine • Proactive Maintenance Playbook (8 Subsystems)
            </p>
          </div>
        </div>

        {/* NOC On-Duty Engineers & Quick Stats */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Bridge Operators:</span>
          <span className="text-white font-semibold">Sarah Mitchell (Lead) &amp; Elena Rostova</span>
        </div>
      </div>

      {/* Sub-Navigation Bar inside NOC Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex items-center space-x-1.5 flex-wrap">
          {/* Tab 1: Live Matrix */}
          <button
            id="subtab-noc-live-matrix"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Active Incident Matrix</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              activeAlerts.length > 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {activeAlerts.length}
            </span>
          </button>

          {/* Tab 2: Historical Alert Trends */}
          <button
            id="subtab-noc-alert-trends"
            onClick={() => setActiveSubTab('trends')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'trends'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Historical Alert Trends</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700">
              60D Analytics
            </span>
          </button>

          {/* Tab 3: Proactive Maintenance Engine */}
          <button
            id="subtab-noc-proactive-pm"
            onClick={() => {
              setSelectedProactiveSubsystem('all');
              setActiveSubTab('proactive_pm');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'proactive_pm'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Proactive Maintenance</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
              8 Pre-Failure Tasks
            </span>
          </button>

          {/* Tab 4: 8-Part Hand-Drawn Revision Notes Reference */}
          <button
            id="subtab-noc-handdrawn-notes"
            onClick={() => setActiveSubTab('notes_reference')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'notes_reference'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>8 Data Centre Parts</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-700">
              Revision Notes
            </span>
          </button>
        </div>

        {/* Quick Help Hint */}
        <div className="hidden lg:flex items-center space-x-1.5 text-slate-500 font-mono text-[11px] pr-2">
          <span>Targeting zero unplanned downtime</span>
        </div>
      </div>

      {/* Sub-Tab 1: Live Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          {/* Quick Banner Linking to Historical Trends & PM */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-300">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Want to eliminate recurring alarms? Check the <strong className="text-cyan-300">Historical Alert Trends</strong> and <strong className="text-emerald-300">Proactive Maintenance Tasks</strong>.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveSubTab('trends')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all text-xs"
              >
                Inspect Trends &rarr;
              </button>
              <button
                onClick={() => setActiveSubTab('proactive_pm')}
                className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 transition-all text-xs font-bold"
              >
                Proactive PM &rarr;
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Severity:
              </span>
              {['all', 'critical', 'major', 'minor', 'info'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all ${
                    severityFilter === sev
                      ? 'bg-cyan-600 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-slate-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="all">All Categories</option>
                <option value="thermal">Thermal &amp; HVAC</option>
                <option value="power">Critical Power &amp; PDU</option>
                <option value="hardware">Hardware &amp; Storage</option>
                <option value="network">Optical Network</option>
              </select>
            </div>
          </div>

          {/* Incident List */}
          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 font-mono text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                All telemetry metrics within standard nominal thresholds. Zero unacknowledged critical alarms.
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">{alert.id}</span>
                      <span className="text-xs font-mono text-slate-500">• {alert.timestamp}</span>
                      <span className="text-xs font-mono text-slate-400 uppercase px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800">
                        {alert.category}
                      </span>
                    </div>

                    {alert.rackId && (
                      <button
                        onClick={() => onSelectRackById(alert.rackId!)}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <span>Inspect Rack {alert.rackId}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{alert.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.description}</p>
                    <div className="text-[11px] font-mono text-slate-400 mt-1.5">
                      Location: <strong className="text-slate-200">{alert.location}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                      <span>Status:</span>
                      <span className={alert.acknowledged ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                        {alert.acknowledged ? 'Acknowledged' : 'Pending Review'}
                      </span>
                      {alert.assignedTech && (
                        <span className="text-slate-300">
                          • Assigned: <strong className="text-cyan-300">{alert.assignedTech}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
                        >
                          Acknowledge
                        </button>
                      )}

                      <button
                        onClick={() => onDispatchTechFromAlert(alert)}
                        className="px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 font-semibold text-xs transition-colors border border-blue-600 flex items-center gap-1.5 shadow-sm"
                      >
                        <Wrench className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Dispatch Floor Tech</span>
                      </button>

                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-semibold text-xs transition-colors border border-emerald-700"
                      >
                        Resolve Incident
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Resolved Alert History Summary */}
            {resolvedAlerts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Recently Resolved Incident Stream ({resolvedAlerts.length})
                </h4>
                <div className="space-y-2">
                  {resolvedAlerts.map((alert) => (
                    <div key={alert.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-300">{alert.title}</span>
                      </div>
                      <span>Resolved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Historical Alert Trends */}
      {activeSubTab === 'trends' && (
        <HistoricalAlertTrendsTab
          onNavigateToProactiveSubsystem={handleNavigateToProactiveWithSubsystem}
          onOpenNotesReference={handleOpenNotesReference}
        />
      )}

      {/* Sub-Tab 3: Proactive Maintenance Engine */}
      {activeSubTab === 'proactive_pm' && (
        <ProactiveMaintenanceTab
          technicians={technicians}
          selectedSubsystemFilter={selectedProactiveSubsystem}
          onSelectRackById={onSelectRackById}
          onCreateWorkOrder={onCreateWorkOrder}
          onOpenNotesReference={handleOpenNotesReference}
        />
      )}

      {/* Sub-Tab 4: 8 Hand-Drawn Important Parts Reference */}
      {activeSubTab === 'notes_reference' && (
        <HandDrawnNotesReferenceTab
          initialHighlightedSubsystem={highlightedNoteSubsystem}
          onNavigateToTrends={() => setActiveSubTab('trends')}
          onNavigateToProactive={(subId) => {
            if (subId) setSelectedProactiveSubsystem(subId);
            setActiveSubTab('proactive_pm');
          }}
        />
      )}
    </div>
  );
};
