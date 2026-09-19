import React, { useState, useEffect, useRef } from 'react';
import { 
  INITIAL_AISLES, 
  INITIAL_ALERTS, 
  INITIAL_ALERT_RULES,
  INITIAL_ASSETS,
  INITIAL_COOLING_UNITS, 
  INITIAL_METRICS, 
  INITIAL_NOTIFICATION_LOGS,
  INITIAL_POWER_COMPONENTS, 
  INITIAL_RACKS, 
  INITIAL_TECHNICIANS, 
  INITIAL_WORK_ORDERS 
} from './data/datacenterMockData';
import { 
  Aisle, 
  AlertRule,
  Asset,
  CoolingUnit, 
  DataCenterMetrics, 
  FieldTechnician, 
  NocAlert, 
  NotificationLog,
  PowerComponent, 
  Rack, 
  ServerDevice, 
  WorkOrder 
} from './types';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { RealTimeDashboard } from './components/RealTimeDashboard';
import { AlertingNotificationSystem } from './components/AlertingNotificationSystem';
import { AssetManagementView } from './components/AssetManagementView';
import { DataHallMap } from './components/DataHallMap';
import { RackInspectorView } from './components/RackInspectorView';
import { PowerChainView } from './components/PowerChainView';
import { CoolingHvacView } from './components/CoolingHvacView';
import { NocIncidentCenter } from './components/NocIncidentCenter';
import { TechnicianDispatchView } from './components/TechnicianDispatchView';
import { AiDcimAssistant } from './components/AiDcimAssistant';
import { ImageAnalysisModal } from './components/ImageAnalysisModal';
import { DataCenterAnatomyView } from './components/DataCenterAnatomyView';
import { HistoricalCapacityTrendView } from './components/HistoricalCapacityTrendView';
import { EnergySustainabilityView } from './components/EnergySustainabilityView';

export default function App() {
  const [metrics, setMetrics] = useState<DataCenterMetrics>(INITIAL_METRICS);
  const [aisles, setAisles] = useState<Aisle[]>(INITIAL_AISLES);
  const [racks, setRacks] = useState<Rack[]>(INITIAL_RACKS);
  const [powerComponents, setPowerComponents] = useState<PowerComponent[]>(INITIAL_POWER_COMPONENTS);
  const [coolingUnits, setCoolingUnits] = useState<CoolingUnit[]>(INITIAL_COOLING_UNITS);
  const [alerts, setAlerts] = useState<NocAlert[]>(INITIAL_ALERTS);
  const [technicians, setTechnicians] = useState<FieldTechnician[]>(INITIAL_TECHNICIANS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(INITIAL_ALERT_RULES);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(INITIAL_NOTIFICATION_LOGS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  const [activeTab, setActiveTab] = useState<string>('realtime_dashboard');
  const [selectedRack, setSelectedRack] = useState<Rack>(INITIAL_RACKS.find((r) => r.id === 'B-04') || INITIAL_RACKS[0]);
  const [liveTicking, setLiveTicking] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [powerFailureActive, setPowerFailureActive] = useState<boolean>(false);

  // Play synthetic audio chime for alerts
  const playChime = (freq: number = 880) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.36);
    } catch {
      // AudioContext unavailable or restricted by browser policy
    }
  };

  // Live sensor telemetry stream ticker
  useEffect(() => {
    if (!liveTicking) return;

    const interval = setInterval(() => {
      // Small realistic fluctuations
      setMetrics((prev) => {
        const tempDelta = (Math.random() - 0.5) * 0.15;
        const kwDelta = (Math.random() - 0.5) * 0.02;
        const nextTemp = Number((prev.coldAisleAvgTemp + tempDelta).toFixed(1));
        const nextKw = Number((prev.totalItLoadMw + kwDelta).toFixed(2));
        return {
          ...prev,
          coldAisleAvgTemp: nextTemp < 19.5 ? 19.8 : nextTemp > 21.5 ? 20.4 : nextTemp,
          totalItLoadMw: nextKw < 3.2 ? 3.38 : nextKw > 3.6 ? 3.45 : nextKw,
          gridFrequencyHz: Number((50.0 + (Math.random() - 0.5) * 0.02).toFixed(2)),
          floorPressurePa: Number((23.8 + (Math.random() - 0.5) * 0.4).toFixed(1)),
        };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [liveTicking]);

  // Handle simulated utility power failure
  const handleTogglePowerFailure = () => {
    const nextState = !powerFailureActive;
    setPowerFailureActive(nextState);

    if (nextState) {
      playChime(440);
      // Inject alert
      const outageAlert: NocAlert = {
        id: `ALT-${Math.floor(1050 + Math.random() * 50)}`,
        timestamp: 'Just now',
        severity: 'critical',
        category: 'power',
        title: 'Utility 33kV Substation Loss - 2N UPS Battery Active',
        location: 'High Voltage Ingress Feed A & B',
        description: 'Automatic Transfer Switch (ATS) disconnected grid feeds. Rotary & Lithium-Ion UPS Strings discharging. Cummins Gensets auto-cranked.',
        acknowledged: false,
        assignedTech: 'Sarah Mitchell (NOC Lead)',
        resolved: false,
      };
      setAlerts((prev) => [outageAlert, ...prev]);
    } else {
      playChime(660);
    }
  };

  const handleUpdateDevice = (rackId: string, deviceId: string, updates: Partial<ServerDevice>) => {
    setRacks((prev) =>
      prev.map((r) => {
        if (r.id !== rackId) return r;
        const updatedDevices = r.devices.map((d) => (d.id === deviceId ? { ...d, ...updates } : d));
        return { ...r, devices: updatedDevices };
      })
    );

    // Also update selectedRack if currently viewing it
    setSelectedRack((prev) => {
      if (prev.id !== rackId) return prev;
      const updatedDevices = prev.devices.map((d) => (d.id === deviceId ? { ...d, ...updates } : d));
      return { ...prev, devices: updatedDevices };
    });
  };

  const handleCreateWorkOrder = (wo: Omit<WorkOrder, 'id' | 'createdTime'>) => {
    const newWo: WorkOrder = {
      ...wo,
      id: `WO-${Math.floor(8830 + Math.random() * 50)}`,
      createdTime: 'Just now',
    };
    setWorkOrders((prev) => [newWo, ...prev]);
    playChime(587);
  };

  const handleUpdateWorkOrderStatus = (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    setWorkOrders((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status } : w))
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true, acknowledged: true } : a))
    );
  };

  const handleDispatchTechFromAlert = (alert: NocAlert) => {
    handleCreateWorkOrder({
      title: `Dispatch: Investigate ${alert.title}`,
      priority: alert.severity === 'critical' ? 'p1_urgent' : 'p2_high',
      rackLocation: alert.location,
      assignedTo: alert.assignedTech || 'Rajesh Kumar',
      status: 'pending',
      actionType: alert.category === 'thermal' ? 'thermal_inspection' : 'hardware_swap',
      description: alert.description,
    });
    handleAcknowledgeAlert(alert.id);
  };

  const handleSelectRackAndNavigate = (rack: Rack) => {
    setSelectedRack(rack);
    setActiveTab('rack_inspector');
  };

  const handleSelectRackById = (rackId: string) => {
    const found = racks.find((r) => r.id === rackId);
    if (found) {
      setSelectedRack(found);
      setActiveTab('rack_inspector');
    }
  };

  const handleUpdateCoolingMode = (unitId: string, mode: 'auto' | 'boost' | 'eco') => {
    setCoolingUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, mode } : u))
    );
  };

  const handleAdjustSetpoint = (newTemp: number) => {
    setMetrics((prev) => ({
      ...prev,
      coldAisleAvgTemp: Number(newTemp.toFixed(1)),
    }));
  };

  // Alert Rules & Notifications Handlers
  const handleToggleRule = (ruleId: string) => {
    setAlertRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSaveRule = (rule: AlertRule) => {
    setAlertRules((prev) => {
      const exists = prev.some((r) => r.id === rule.id);
      if (exists) {
        return prev.map((r) => (r.id === rule.id ? rule : r));
      }
      return [rule, ...prev];
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    setAlertRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleSimulateAlert = (rule: AlertRule) => {
    playChime(rule.severity === 'critical' ? 440 : 660);
    const newLog: NotificationLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      metricType: rule.metricType,
      severity: rule.severity,
      channel: rule.channels[0] || 'sms',
      recipient: rule.channels[0] === 'sms' ? (rule.smsRecipients[0] || '+91 98765 43210') : (rule.emailRecipients[0] || 'noc@nxtradc.com'),
      title: `[TRIPWIRE DISPATCH] ${rule.name}`,
      message: `Automatic alert generated for ${rule.metricType.replace(/_/g, ' ')}. Triggered ${rule.comparison} ${rule.thresholdValue}${rule.thresholdUnit}.`,
      timestamp: 'Just now',
      status: 'simulated',
    };
    setNotificationLogs((prev) => [newLog, ...prev]);

    // Also inject into active NOC alerts
    const newAlert: NocAlert = {
      id: `ALT-${Math.floor(2000 + Math.random() * 500)}`,
      timestamp: 'Just now',
      severity: rule.severity === 'critical' ? 'critical' : rule.severity === 'high' ? 'major' : 'minor',
      category: rule.metricType === 'high_server_temperature' ? 'thermal' : rule.metricType === 'power_supply_failure' ? 'power' : 'network',
      title: rule.name,
      location: 'Data Hall Alpha - Fleet Monitoring',
      description: rule.description,
      acknowledged: false,
      assignedTech: 'Sarah Mitchell (NOC Lead)',
      resolved: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Asset Management Handlers
  const handleAddAsset = (asset: Asset) => {
    setAssets((prev) => [asset, ...prev]);
    playChime(523);
  };

  const handleUpdateAsset = (asset: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
  const activeWorkOrdersCount = workOrders.filter((w) => w.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header with live KPIs, PUE & Simulation controls */}
      <Header
        metrics={metrics}
        liveTicking={liveTicking}
        onToggleLiveTicking={() => setLiveTicking(!liveTicking)}
        onOpenImageAnalysis={() => setImageModalOpen(true)}
        onNavigateToAnatomy={() => setActiveTab('anatomy_14_features')}
        onNavigateToCapacityTrends={() => setActiveTab('capacity_trends')}
        onNavigateToNocAlerts={() => setActiveTab('noc_alerts')}
        onNavigateToSustainability={() => setActiveTab('energy_sustainability')}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeAlertCount={activeAlertsCount}
        onTriggerSimulatedAlert={() => {
          const fakeAlert: NocAlert = {
            id: `ALT-${Math.floor(1060 + Math.random() * 50)}`,
            timestamp: 'Just now',
            severity: 'major',
            category: 'thermal',
            title: 'Sub-floor Plenum Pressure Fluctuation Detected',
            location: 'Aisle C Storage Zone',
            description: 'Perforated tile displacement or seal leak causing static pressure delta to drop to +19.1 Pa.',
            acknowledged: false,
            assignedTech: 'Arjun Verma',
            resolved: false,
          };
          setAlerts((prev) => [fakeAlert, ...prev]);
          playChime(784);
        }}
        onSimulatePowerFailure={handleTogglePowerFailure}
        powerFailureActive={powerFailureActive}
      />

      {/* Navigation Sub-header Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        alertCount={activeAlertsCount}
        activeWorkOrdersCount={activeWorkOrdersCount}
        assetsCount={assets.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'anatomy_14_features' && (
          <DataCenterAnatomyView
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onNavigateToRack={handleSelectRackById}
          />
        )}

        {activeTab === 'realtime_dashboard' && (
          <RealTimeDashboard
            metrics={metrics}
            racks={racks}
            liveTicking={liveTicking}
            onToggleLiveTicking={() => setLiveTicking(!liveTicking)}
            onNavigateToRack={handleSelectRackById}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'capacity_trends' && (
          <HistoricalCapacityTrendView
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onNavigateToRack={handleSelectRackById}
          />
        )}

        {activeTab === 'energy_sustainability' && (
          <EnergySustainabilityView
            metrics={metrics}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'alerting_notifications' && (
          <AlertingNotificationSystem
            alertRules={alertRules}
            notificationLogs={notificationLogs}
            onToggleRule={handleToggleRule}
            onSaveRule={handleSaveRule}
            onDeleteRule={handleDeleteRule}
            onSimulateAlert={handleSimulateAlert}
          />
        )}

        {activeTab === 'asset_management' && (
          <AssetManagementView
            assets={assets}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onNavigateToRack={handleSelectRackById}
          />
        )}
        {activeTab === 'hall_map' && (
          <DataHallMap
            aisles={aisles}
            racks={racks}
            technicians={technicians}
            selectedRack={selectedRack}
            onSelectRack={handleSelectRackAndNavigate}
            onOpenNocConsole={() => setActiveTab('noc_alerts')}
          />
        )}

        {activeTab === 'rack_inspector' && (
          <RackInspectorView
            rack={selectedRack}
            allRacks={racks}
            onSelectRack={setSelectedRack}
            onBackToHall={() => setActiveTab('hall_map')}
            onUpdateDevice={handleUpdateDevice}
            onCreateWorkOrder={handleCreateWorkOrder}
          />
        )}

        {activeTab === 'power_chain' && (
          <PowerChainView
            powerComponents={powerComponents}
            metrics={metrics}
            powerFailureActive={powerFailureActive}
            onSimulatePowerFailure={handleTogglePowerFailure}
          />
        )}

        {activeTab === 'cooling_hvac' && (
          <CoolingHvacView
            coolingUnits={coolingUnits}
            metrics={metrics}
            onUpdateUnitMode={handleUpdateCoolingMode}
            onAdjustSetpoint={handleAdjustSetpoint}
          />
        )}

        {activeTab === 'noc_alerts' && (
          <NocIncidentCenter
            alerts={alerts}
            technicians={technicians}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onDispatchTechFromAlert={handleDispatchTechFromAlert}
            onSelectRackById={handleSelectRackById}
            onCreateWorkOrder={handleCreateWorkOrder}
          />
        )}

        {activeTab === 'tech_dispatch' && (
          <TechnicianDispatchView
            technicians={technicians}
            workOrders={workOrders}
            onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
            onCreateWorkOrder={handleCreateWorkOrder}
            onSelectRackById={handleSelectRackById}
          />
        )}

        {activeTab === 'ai_optimizer' && (
          <AiDcimAssistant
            metrics={metrics}
            racks={racks}
            onOpenRackById={handleSelectRackById}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-3 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-semibold">Nxtra DCIM Enterprise Portal</span>
            <span>•</span>
            <span>Facility BLR-01 Hyperscale Hall Alpha</span>
            <span>•</span>
            <span className="text-emerald-400">PUE 1.18 Benchmark</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <button
              onClick={() => setImageModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              Inspect Facility Photo Analysis
            </button>
            <span>|</span>
            <span>Mezzanine NOC 24/7 Telemetry Active</span>
          </div>
        </div>
      </footer>

      {/* Facility Image Analysis Breakdown Modal */}
      <ImageAnalysisModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelectTab={(t) => setActiveTab(t)}
      />
    </div>
  );
}
