import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Sparkles, 
  ExternalLink, 
  Filter, 
  Search, 
  Layers, 
  Zap, 
  Snowflake, 
  Server, 
  HardDrive, 
  Network, 
  Eye, 
  RefreshCw,
  PlusCircle,
  FileText
} from 'lucide-react';
import { 
  FieldTechnician, 
  HandDrawnSubsystemId, 
  ProactiveMaintenanceTask, 
  WorkOrder 
} from '../../types';
import { INITIAL_PROACTIVE_MAINTENANCE_TASKS, HAND_DRAWN_IMPORTANT_PARTS } from '../../data/nocAlertTrendsData';

interface ProactiveMaintenanceTabProps {
  technicians: FieldTechnician[];
  selectedSubsystemFilter?: string;
  onSelectRackById?: (rackId: string) => void;
  onCreateWorkOrder?: (wo: Omit<WorkOrder, 'id' | 'createdTime'>) => void;
  onOpenNotesReference?: (subsystemId?: HandDrawnSubsystemId) => void;
}

export const ProactiveMaintenanceTab: React.FC<ProactiveMaintenanceTabProps> = ({
  technicians,
  selectedSubsystemFilter = 'all',
  onSelectRackById,
  onCreateWorkOrder,
  onOpenNotesReference,
}) => {
  const [tasks, setTasks] = useState<ProactiveMaintenanceTask[]>(INITIAL_PROACTIVE_MAINTENANCE_TASKS);
  const [subsystemFilter, setSubsystemFilter] = useState<string>(selectedSubsystemFilter);
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(INITIAL_PROACTIVE_MAINTENANCE_TASKS[0].id);
  const [dispatchedSuccessMessage, setDispatchedSuccessMessage] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSubsystem = subsystemFilter === 'all' || task.subsystemId === subsystemFilter;
    const matchesUrgency = urgencyFilter === 'all' || task.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = 
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.failureModePrevented.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubsystem && matchesUrgency && matchesStatus && matchesSearch;
  });

  // Calculate aggregated proactive metrics
  const totalCostAvoidance = tasks.reduce((acc, t) => acc + t.costAvoidanceUsd, 0);
  const totalDowntimeAvoided = tasks.reduce((acc, t) => acc + t.downtimeAvoidedHours, 0);
  const criticalPendingCount = tasks.filter((t) => t.urgency === 'critical' && t.status === 'recommended').length;

  const handleDispatchTask = (task: ProactiveMaintenanceTask) => {
    const assignedTechName = task.assignedTech || 'Rajesh Kumar';
    const newWoId = `WO-PM-${Math.floor(7000 + Math.random() * 2000)}`;

    if (onCreateWorkOrder) {
      onCreateWorkOrder({
        title: `Proactive PM: ${task.title}`,
        priority: task.urgency === 'critical' ? 'p1_urgent' : task.urgency === 'high' ? 'p2_high' : 'p3_medium',
        rackLocation: task.location,
        assignedTo: assignedTechName,
        status: 'in_progress',
        actionType: 'preventive',
        description: `[PREDICTIVE PM] ${task.failureModePrevented}. SOP Checklist: ${task.sopSteps.join(' | ')}. Parts: ${task.recommendedParts.join(', ')}`,
      });
    }

    // Update local task state to dispatched
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: 'dispatched',
              workOrderId: newWoId,
            }
          : t
      )
    );

    setDispatchedSuccessMessage(
      `Dispatched Proactive Maintenance #${task.id} to ${assignedTechName}. Work Order ${newWoId} generated!`
    );
    setTimeout(() => setDispatchedSuccessMessage(null), 6000);
  };

  const handleUpdateAssignedTech = (taskId: string, techName: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedTech: techName } : t))
    );
  };

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

  return (
    <div id="proactive-maintenance-playbook" className="space-y-5">
      {/* Banner / Value Metrics */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-600/50 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-900/80 border border-emerald-500 text-emerald-300 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Predictive Proactive Maintenance Playbook
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                8 Core Subsystems
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Machine-correlated preventive tasks triggered by historical alert signatures to intercept critical failures before they trigger an SLA outage.
            </p>
          </div>
        </div>

        {/* Aggregated KPI Badges */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] uppercase text-slate-400">Avoided Downtime</div>
            <div className="text-sm font-bold text-emerald-300 leading-tight">{totalDowntimeAvoided} Hours</div>
          </div>
          <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] uppercase text-slate-400">Total SLA Savings</div>
            <div className="text-sm font-bold text-cyan-300 leading-tight">${(totalCostAvoidance / 1000).toFixed(0)}k USD</div>
          </div>
        </div>
      </div>

      {/* Dispatched Notification Toast */}
      {dispatchedSuccessMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/80 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-200 font-mono shadow-md animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{dispatchedSuccessMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">Auto-Logged to Field Techs</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Subsystem Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Subsystem:
            </span>
            <select
              value={subsystemFilter}
              onChange={(e) => setSubsystemFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono flex-1 md:flex-initial"
            >
              <option value="all">All 8 Data Centre Parts</option>
              {HAND_DRAWN_IMPORTANT_PARTS.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.title} ({p.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <span className="text-slate-400 uppercase text-[10px] mr-1">Urgency:</span>
            {['all', 'critical', 'high', 'medium'].map((u) => (
              <button
                key={u}
                onClick={() => setUrgencyFilter(u)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  urgencyFilter === u
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search component, rack, failure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No proactive maintenance tasks matching selected filters. All systems operate within nominal wear horizons.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const urgencyColor =
              task.urgency === 'critical' ? 'bg-red-950 text-red-300 border-red-700 animate-pulse' :
              task.urgency === 'high' ? 'bg-amber-950 text-amber-300 border-amber-700' :
              'bg-blue-950 text-blue-300 border-blue-700';

            const statusBadge =
              task.status === 'dispatched' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' :
              task.status === 'scheduled' ? 'bg-blue-950 text-blue-300 border-blue-700' :
              task.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
              'bg-amber-950 text-amber-300 border-amber-800';

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all shadow-md ${
                  task.urgency === 'critical' && task.status === 'recommended'
                    ? 'bg-slate-900/95 border-red-800/80 hover:border-red-700'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Task Header Row */}
                <div className="p-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="p-1 rounded bg-slate-950 border border-slate-800">
                        {getSubsystemIcon(task.subsystemId)}
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        PART #{task.subsystemNumber}: {task.subsystemName.split(' ')[0]}
                      </span>
                      <span className="text-xs font-mono text-slate-500">•</span>
                      <span className="text-xs font-mono text-slate-300 font-semibold">{task.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${urgencyColor}`}>
                        {task.urgency} Urgency
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${statusBadge}`}>
                        {task.status === 'dispatched' && task.workOrderId 
                          ? `Dispatched (${task.workOrderId})` 
                          : task.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-900/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Fail Window: <strong>{task.predictedFailureWindow}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{task.title}</h4>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>Target: <strong className="text-slate-200">{task.component}</strong></span>
                      <span>Location: <strong className="text-slate-200">{task.location}</strong></span>
                      {task.rackId && onSelectRackById && (
                        <button
                          onClick={() => onSelectRackById(task.rackId!)}
                          className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          <span>Inspect {task.rackId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Historical Trigger and Failure Mode Prevented Callout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Historical Alert Pattern Trigger:
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{task.historicalTrigger}</p>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-rose-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        Critical Failure Mode Prevented:
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{task.failureModePrevented}</p>
                    </div>
                  </div>

                  {/* Impact Summary & Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-4 text-xs font-mono">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-400">Failure Prob:</span>
                        <span className="font-bold text-amber-400">{task.failureProbabilityPercent}%</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-400">SLA Protected:</span>
                        <span className="font-bold text-emerald-400">${(task.costAvoidanceUsd / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-400">Downtime Saved:</span>
                        <span className="font-bold text-cyan-400">{task.downtimeAvoidedHours} hrs</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700"
                      >
                        <span>{isExpanded ? 'Hide SOP & Parts' : 'View SOP & Parts'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {task.status === 'recommended' && (
                        <button
                          onClick={() => handleDispatchTask(task)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dispatch Floor Tech &amp; Create WO</span>
                        </button>
                      )}

                      {task.status === 'dispatched' && (
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700 text-indigo-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Dispatched ({task.workOrderId})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable SOP Checklist & Parts Box */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-slate-950/60 border-t border-slate-800/80 rounded-b-xl space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Standard Operating Procedure (SOP) */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Proactive SOP Resolution Protocol:</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300 font-mono">
                          {task.sopSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-slate-900/90 p-2 rounded border border-slate-800">
                              <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                              <span className="leading-snug">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Replacement Parts & Tech Assignment */}
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Recommended Replacement Hardware &amp; Tools:</span>
                          </div>
                          <ul className="space-y-1 text-xs text-slate-300 font-mono">
                            {task.recommendedParts.map((part, idx) => (
                              <li key={idx} className="flex items-center gap-2 bg-slate-900/90 p-2 rounded border border-slate-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                <span>{part}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Assignee Control */}
                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                          <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Assign Field Technician:</span>
                          </div>
                          <select
                            value={task.assignedTech || 'Rajesh Kumar'}
                            onChange={(e) => handleUpdateAssignedTech(task.id, e.target.value)}
                            disabled={task.status !== 'recommended'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                          >
                            {technicians.map((tech) => (
                              <option key={tech.id} value={tech.name}>
                                {tech.name} ({tech.role} • {tech.status.replace('_', ' ')})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
