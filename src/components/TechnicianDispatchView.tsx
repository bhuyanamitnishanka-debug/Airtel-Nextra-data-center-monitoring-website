import React, { useState } from 'react';
import { 
  Users, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Radio, 
  MapPin, 
  Sliders, 
  AlertTriangle,
  FileText,
  UserCheck,
  Tv
} from 'lucide-react';
import { FieldTechnician, WorkOrder } from '../types';

interface TechnicianDispatchViewProps {
  technicians: FieldTechnician[];
  workOrders: WorkOrder[];
  onUpdateWorkOrderStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onCreateWorkOrder: (wo: Omit<WorkOrder, 'id' | 'createdTime'>) => void;
  onSelectRackById: (rackId: string) => void;
}

export const TechnicianDispatchView: React.FC<TechnicianDispatchViewProps> = ({
  technicians,
  workOrders,
  onUpdateWorkOrderStatus,
  onCreateWorkOrder,
  onSelectRackById,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRack, setNewRack] = useState('Cabinet B-04');
  const [newPriority, setNewPriority] = useState<WorkOrder['priority']>('p2_high');
  const [newTech, setNewTech] = useState('Rajesh Kumar');
  const [newType, setNewType] = useState<WorkOrder['actionType']>('hardware_swap');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateWorkOrder({
      title: newTitle,
      rackLocation: newRack,
      priority: newPriority,
      assignedTo: newTech,
      status: 'pending',
      actionType: newType,
      description: newDesc || `Routine maintenance dispatch for ${newRack}.`,
    });

    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const getPriorityBadge = (p: WorkOrder['priority']) => {
    if (p === 'p1_urgent') return 'bg-red-950 text-red-300 border-red-700';
    if (p === 'p2_high') return 'bg-amber-950 text-amber-300 border-amber-700';
    if (p === 'p3_medium') return 'bg-blue-950 text-blue-300 border-blue-700';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div id="technician-dispatch-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-950 border border-blue-700 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Field Operations & Crash Cart Technician Dispatch
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                On-Floor Operations
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Directly reflecting field technicians operating mobile diagnostic crash carts in the facility photo.
            </p>
          </div>
        </div>

        <button
          id="btn-open-create-work-order"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create Work Order</span>
        </button>
      </div>

      {/* Technician Roster Cards */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          Active Duty Engineering Staff (NOC & Floor White Space)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-md space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg ${tech.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                    {tech.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{tech.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{tech.badge}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  tech.status === 'active_floor' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  tech.status === 'at_noc' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {tech.status === 'active_floor' ? 'On Floor' : 'At NOC'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[11px] text-slate-300 font-medium">{tech.role}</div>
                <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{tech.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tv className="w-3 h-3 text-cyan-400" />
                  <span className="truncate max-w-[130px]" title={tech.activeCrashCart}>{tech.activeCrashCart}</span>
                </span>
                <span className="text-cyan-300 font-bold">{tech.assignedWorkOrders} WOs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Orders Kanban / Matrix */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Active Facility Work Orders ({workOrders.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Real-time physical asset interventions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">Pending Dispatch</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                {workOrders.filter((w) => w.status === 'pending').length}
              </span>
            </div>

            <div className="space-y-2.5">
              {workOrders.filter((w) => w.status === 'pending').map((wo) => (
                <div key={wo.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{wo.id}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold border ${getPriorityBadge(wo.priority)}`}>
                      {wo.priority.replace('_', ' ')}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-white leading-tight">{wo.title}</h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{wo.description}</p>
                  
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{wo.rackLocation}</span>
                    <button
                      onClick={() => onUpdateWorkOrderStatus(wo.id, 'in_progress')}
                      className="px-2 py-1 rounded bg-blue-900/80 hover:bg-blue-800 text-cyan-300 font-bold transition-colors"
                    >
                      Start Task →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 bg-blue-950/60 p-2.5 rounded-lg border border-blue-800/60">
              <span className="font-bold">In Progress (Crash Cart Attached)</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-900 text-cyan-200 font-bold">
                {workOrders.filter((w) => w.status === 'in_progress').length}
              </span>
            </div>

            <div className="space-y-2.5">
              {workOrders.filter((w) => w.status === 'in_progress').map((wo) => (
                <div key={wo.id} className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-700/60 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{wo.id}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] uppercase font-bold bg-blue-900 text-cyan-300 border border-blue-600 animate-pulse">
                      Active On Floor
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-white leading-tight">{wo.title}</h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{wo.description}</p>
                  
                  {wo.notes && (
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300">
                      <strong>Tech Log:</strong> {wo.notes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Tech: <strong className="text-white">{wo.assignedTo}</strong></span>
                    <button
                      onClick={() => onUpdateWorkOrderStatus(wo.id, 'completed')}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors"
                    >
                      Mark Resolved ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-300 bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-800/60">
              <span className="font-bold">Completed & Certified</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 font-bold">
                {workOrders.filter((w) => w.status === 'completed').length}
              </span>
            </div>

            <div className="space-y-2.5">
              {workOrders.filter((w) => w.status === 'completed').map((wo) => (
                <div key={wo.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-slate-400">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{wo.id}</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  </div>
                  <h5 className="font-semibold text-xs text-slate-200 leading-tight">{wo.title}</h5>
                  {wo.notes && (
                    <div className="text-[10px] font-mono text-slate-400">
                      Log: {wo.notes}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                    Location: {wo.rackLocation} • Certified by {wo.assignedTo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Work Order */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Dispatch New Facility Work Order
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Work Order Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAS SSD Hot-Swap in Array Bay 04"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cabinet Target:</label>
                  <input
                    type="text"
                    value={newRack}
                    onChange={(e) => setNewRack(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority Level:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="p1_urgent">P1 Urgent (SLA Breach Risk)</option>
                    <option value="p2_high">P2 High</option>
                    <option value="p3_medium">P3 Medium</option>
                    <option value="p4_low">P4 Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assign Technician:</label>
                  <select
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.status === 'active_floor' ? 'Floor' : 'NOC'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Intervention Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="hardware_swap">Hardware Component Swap</option>
                    <option value="cable_patch">MPO / Fiber Optical Patching</option>
                    <option value="thermal_inspection">Thermal & Containment Check</option>
                    <option value="preventive">Preventive Maintenance</option>
                    <option value="firmware_update">Out-of-Band Firmware Flash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Technical Instructions:</label>
                <textarea
                  rows={3}
                  placeholder="Detail symptoms, required tools (e.g. Crash Cart #2, OTDR tester, anti-static wrist strap)..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Dispatch to Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
