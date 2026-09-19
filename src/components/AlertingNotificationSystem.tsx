import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Mail, 
  Smartphone, 
  Webhook, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send, 
  Settings2, 
  Filter, 
  Thermometer, 
  Zap, 
  Network, 
  HardDrive,
  Radio,
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { AlertMetricType, AlertRule, AlertSeverity, NotificationChannel, NotificationLog } from '../types';

interface AlertingNotificationSystemProps {
  alertRules: AlertRule[];
  notificationLogs: NotificationLog[];
  onToggleRule: (ruleId: string) => void;
  onSaveRule: (rule: AlertRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onSimulateAlert: (rule: AlertRule) => void;
}

export const AlertingNotificationSystem: React.FC<AlertingNotificationSystemProps> = ({
  alertRules,
  notificationLogs,
  onToggleRule,
  onSaveRule,
  onDeleteRule,
  onSimulateAlert,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'logs' | 'dispatch_test'>('rules');
  const [testSimulatedToast, setTestSimulatedToast] = useState<{ visible: boolean; log?: NotificationLog }>({ visible: false });

  // Form State for Create/Edit Modal
  const [formName, setFormName] = useState('');
  const [formMetric, setFormMetric] = useState<AlertMetricType>('high_server_temperature');
  const [formDesc, setFormDesc] = useState('');
  const [formThreshold, setFormThreshold] = useState<number>(75);
  const [formUnit, setFormUnit] = useState('°C');
  const [formSeverity, setFormSeverity] = useState<AlertSeverity>('critical');
  const [formChannels, setFormChannels] = useState<NotificationChannel[]>(['email', 'sms']);
  const [formEmails, setFormEmails] = useState('noc-alerts@nxtradc.com, oncall-lead@nxtradc.com');
  const [formSms, setFormSms] = useState('+91 98765 43210 (Rajesh K.), +91 98111 22334 (Sarah M.)');
  const [formWebhook, setFormWebhook] = useState('https://pagerduty.api.internal/v2/enqueue/dcim');
  const [formCooldown, setFormCooldown] = useState<number>(10);

  const openEditModal = (rule: AlertRule) => {
    setEditingRule(rule);
    setIsCreatingNew(false);
    setFormName(rule.name);
    setFormMetric(rule.metricType);
    setFormDesc(rule.description);
    setFormThreshold(rule.thresholdValue);
    setFormUnit(rule.thresholdUnit);
    setFormSeverity(rule.severity);
    setFormChannels([...rule.channels]);
    setFormEmails(rule.emailRecipients.join(', '));
    setFormSms(rule.smsRecipients.join(', '));
    setFormWebhook(rule.webhookUrl || '');
    setFormCooldown(rule.cooldownMinutes);
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setIsCreatingNew(true);
    setFormName('Storage Pool Low Free Space Rule');
    setFormMetric('disk_space_threshold');
    setFormDesc('Dispatches urgent warning when SAN LUN free capacity falls below threshold.');
    setFormThreshold(15);
    setFormUnit('% free space');
    setFormSeverity('high');
    setFormChannels(['email', 'sms']);
    setFormEmails('storage-team@nxtradc.com');
    setFormSms('+91 98765 43210');
    setFormWebhook('');
    setFormCooldown(30);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRule: AlertRule = {
      id: editingRule ? editingRule.id : `RULE-0${alertRules.length + 1}`,
      name: formName,
      metricType: formMetric,
      description: formDesc,
      thresholdValue: Number(formThreshold),
      thresholdUnit: formUnit,
      comparison: formMetric === 'disk_space_threshold' ? '<' : '>',
      severity: formSeverity,
      enabled: editingRule ? editingRule.enabled : true,
      channels: formChannels,
      emailRecipients: formEmails.split(',').map((s) => s.trim()).filter(Boolean),
      smsRecipients: formSms.split(',').map((s) => s.trim()).filter(Boolean),
      webhookUrl: formWebhook.trim() || undefined,
      cooldownMinutes: Number(formCooldown),
      lastTriggered: editingRule?.lastTriggered || 'Never',
    };

    onSaveRule(updatedRule);
    setEditingRule(null);
    setIsCreatingNew(false);
  };

  const toggleChannel = (ch: NotificationChannel) => {
    if (formChannels.includes(ch)) {
      if (formChannels.length > 1) {
        setFormChannels(formChannels.filter((c) => c !== ch));
      }
    } else {
      setFormChannels([...formChannels, ch]);
    }
  };

  const triggerSimulation = (rule: AlertRule) => {
    onSimulateAlert(rule);
    const mockLog: NotificationLog = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      metricType: rule.metricType,
      severity: rule.severity,
      channel: rule.channels[0] || 'sms',
      recipient: rule.channels[0] === 'sms' ? (rule.smsRecipients[0] || '+91 98765 43210') : (rule.emailRecipients[0] || 'noc@nxtradc.com'),
      title: `[TEST TRIGGER] ${rule.name}`,
      message: `Simulated trigger for ${rule.metricType.replace(/_/g, ' ')}. Threshold breached: ${rule.comparison} ${rule.thresholdValue}${rule.thresholdUnit}. Dispatched via ${rule.channels.join(' + ').toUpperCase()}.`,
      timestamp: 'Just now',
      status: 'simulated',
    };
    setTestSimulatedToast({ visible: true, log: mockLog });
    setTimeout(() => {
      setTestSimulatedToast({ visible: false });
    }, 5500);
  };

  const filteredRules = alertRules.filter((r) => {
    if (selectedCategoryFilter === 'all') return true;
    return r.metricType === selectedCategoryFilter;
  });

  const getMetricIcon = (metric: AlertMetricType) => {
    switch (metric) {
      case 'high_server_temperature':
        return <Thermometer className="w-4 h-4 text-rose-400" />;
      case 'power_supply_failure':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'network_connectivity_loss':
        return <Network className="w-4 h-4 text-cyan-400" />;
      case 'disk_space_threshold':
        return <HardDrive className="w-4 h-4 text-purple-400" />;
    }
  };

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-950 text-red-300 border-red-700/80';
      case 'high':
        return 'bg-amber-950 text-amber-300 border-amber-700/80';
      case 'medium':
        return 'bg-blue-950 text-blue-300 border-blue-700/80';
      case 'low':
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div id="alerting-notification-system" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-rose-950 border border-rose-700 text-rose-400 shadow-md">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Alerting & Multi-Channel Notification Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                Tier-IV NOC Dispatch
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Automated tripwire policies for High Server Temperature, PSU Failures, Network Drops, and Low Storage Disk Thresholds.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="btn-create-alert-rule"
            onClick={openCreateModal}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Configure New Rule</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Toast Preview */}
      {testSimulatedToast.visible && testSimulatedToast.log && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 border border-rose-500/80 shadow-2xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-rose-900 text-rose-200 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-300 uppercase">
                  SIMULATED {testSimulatedToast.log.channel.toUpperCase()} DISPATCH
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  To: {testSimulatedToast.log.recipient}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{testSimulatedToast.log.title}</h4>
              <p className="text-xs text-slate-300 font-mono mt-1">{testSimulatedToast.log.message}</p>
            </div>
          </div>
          <button
            onClick={() => setTestSimulatedToast({ visible: false })}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'rules'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Configured Alert Rules ({alertRules.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Notification Dispatch Logs ({notificationLogs.length})
          </button>
        </div>

        {activeTab === 'rules' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Filter Event:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none font-mono"
            >
              <option value="all">All Critical Events</option>
              <option value="high_server_temperature">Server Temperature</option>
              <option value="power_supply_failure">Power Supply Failures</option>
              <option value="network_connectivity_loss">Network Connectivity</option>
              <option value="disk_space_threshold">Disk Space Threshold</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab: Alert Rules List */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all shadow-md space-y-3 ${
                rule.enabled
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-slate-950 border border-slate-800">
                    {getMetricIcon(rule.metricType)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{rule.name}</h3>
                    <div className="text-[11px] font-mono text-slate-400">
                      ID: {rule.id} • Cooldown: {rule.cooldownMinutes}m
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(rule.severity)}`}>
                    {rule.severity}
                  </span>

                  {/* Toggle On/Off Switch */}
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      rule.enabled ? 'bg-cyan-600' : 'bg-slate-800'
                    }`}
                    title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>

              {/* Threshold & Trigger Condition Bar */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Tripwire:</span>
                  <strong className="text-cyan-300">
                    {rule.comparison} {rule.thresholdValue} {rule.thresholdUnit}
                  </strong>
                </div>
                <div className="text-slate-400">
                  Last Triggered: <span className="text-slate-200">{rule.lastTriggered || 'None'}</span>
                </div>
              </div>

              {/* Configured Notification Methods */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Send className="w-3 h-3 text-cyan-400" />
                  Active Notification Delivery Channels:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {rule.channels.includes('email') && (
                    <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 text-[10px] font-mono flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-400" />
                      Email ({rule.emailRecipients.length} recipients)
                    </span>
                  )}
                  {rule.channels.includes('sms') && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-emerald-400" />
                      SMS ({rule.smsRecipients.length} phones)
                    </span>
                  )}
                  {rule.channels.includes('webhook') && (
                    <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 text-[10px] font-mono flex items-center gap-1">
                      <Webhook className="w-3 h-3 text-purple-400" />
                      PagerDuty / Webhook
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit, Delete, Simulate */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => triggerSimulation(rule)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                  title="Simulate this event and test SMS/Email dispatch"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>Test Dispatch Drill</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(rule)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Rule & Threshold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Notification Logs Table */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              Automated Notification Delivery Audit Log
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              100% SLA Delivery Success Rate
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Event / Rule</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {notificationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-cyan-400 font-semibold">{log.id}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getSeverityBadge(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-200">{log.ruleName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{log.title}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] uppercase font-bold text-slate-300">
                        {log.channel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{log.recipient}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit ${
                        log.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        log.status === 'simulated' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create or Edit Alert Rule */}
      {(editingRule || isCreatingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-cyan-400" />
                {isCreatingNew ? 'Configure Critical Event Alert Rule' : `Edit Alert Rule: ${formName}`}
              </h3>
              <button
                onClick={() => {
                  setEditingRule(null);
                  setIsCreatingNew(false);
                }}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Rule Name:</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Critical Event Trigger:</label>
                  <select
                    value={formMetric}
                    onChange={(e) => {
                      const val = e.target.value as AlertMetricType;
                      setFormMetric(val);
                      if (val === 'high_server_temperature') {
                        setFormThreshold(75);
                        setFormUnit('°C');
                      } else if (val === 'power_supply_failure') {
                        setFormThreshold(1);
                        setFormUnit('failed PSU');
                      } else if (val === 'network_connectivity_loss') {
                        setFormThreshold(2.0);
                        setFormUnit('% packet loss');
                      } else if (val === 'disk_space_threshold') {
                        setFormThreshold(15);
                        setFormUnit('% free space');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="high_server_temperature">High Server Temperatures</option>
                    <option value="power_supply_failure">Power Supply Failures</option>
                    <option value="network_connectivity_loss">Network Connectivity Loss</option>
                    <option value="disk_space_threshold">Disk Space Below Threshold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Severity Level:</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as AlertSeverity)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="critical">Critical (P1 Escalation)</option>
                    <option value="high">High (P2 On-Call)</option>
                    <option value="medium">Medium (P3 NOC)</option>
                    <option value="low">Low (P4 Info)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Threshold Value ({formMetric === 'disk_space_threshold' ? 'Less than' : 'Greater than'}):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cooldown (Minutes):</label>
                  <input
                    type="number"
                    min="1"
                    value={formCooldown}
                    onChange={(e) => setFormCooldown(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              {/* Notification Channels Selection */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">
                  Notification Methods Enabled:
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <input
                      type="checkbox"
                      checked={formChannels.includes('email')}
                      onChange={() => toggleChannel('email')}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-200">Email</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <input
                      type="checkbox"
                      checked={formChannels.includes('sms')}
                      onChange={() => toggleChannel('sms')}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-200">SMS Mobile</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <input
                      type="checkbox"
                      checked={formChannels.includes('webhook')}
                      onChange={() => toggleChannel('webhook')}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-200">Webhook / PagerDuty</span>
                  </label>
                </div>
              </div>

              {/* Notification Targets */}
              {formChannels.includes('email') && (
                <div>
                  <label className="block text-slate-400 mb-1">Email Recipients (comma separated):</label>
                  <input
                    type="text"
                    value={formEmails}
                    onChange={(e) => setFormEmails(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              )}

              {formChannels.includes('sms') && (
                <div>
                  <label className="block text-slate-400 mb-1">SMS Mobile Phone Numbers (comma separated):</label>
                  <input
                    type="text"
                    value={formSms}
                    onChange={(e) => setFormSms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              )}

              {formChannels.includes('webhook') && (
                <div>
                  <label className="block text-slate-400 mb-1">Webhook URL (Slack, Teams, PagerDuty):</label>
                  <input
                    type="text"
                    value={formWebhook}
                    onChange={(e) => setFormWebhook(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Rule Operational Description:</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRule(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Alert Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
