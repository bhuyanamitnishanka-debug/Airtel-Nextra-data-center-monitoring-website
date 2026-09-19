export type DeviceType = 
  | 'compute_server'
  | 'gpu_node'
  | 'spine_switch'
  | 'leaf_switch'
  | 'san_storage'
  | 'patch_panel'
  | 'ats_pdu';

export type DeviceStatus = 'online' | 'warning' | 'critical' | 'maintenance' | 'offline';

export interface ServerDevice {
  id: string;
  rackId: string;
  uPosition: number; // e.g. 1 to 42
  uHeight: number; // 1U, 2U, 4U
  name: string;
  type: DeviceType;
  model: string;
  serialNumber: string;
  ipAddress: string;
  status: DeviceStatus;
  cpuUsage: number; // %
  ramUsage: number; // %
  powerWatts: number;
  tempCelsius: number;
  fanSpeedRpm: number;
  maintenanceMode: boolean;
  beaconLocate: boolean;
  os: string;
  networkInterfaces: { name: string; speedGbps: number; status: 'up' | 'down'; trafficMbps: number }[];
}

export interface Rack {
  id: string;
  name: string;
  aisleId: string; // 'Aisle-A', etc.
  row: number; // 1 to 12
  column: number; // 1 or 2 (left or right side of aisle)
  currentKw: number;
  maxKw: number;
  currentTempC: number;
  targetTempC: number;
  humidityPercent: number;
  uOccupied: number;
  totalU: number; // typically 42
  status: 'optimal' | 'warning' | 'critical' | 'maintenance';
  clientName: string;
  containmentType: 'cold_aisle_contained' | 'hot_aisle_contained';
  devices: ServerDevice[];
  pduAStatus: 'normal' | 'overload' | 'offline';
  pduBStatus: 'normal' | 'overload' | 'offline';
  pduAVolts: number;
  pduBVolts: number;
  pduAAmps: number;
  pduBAmps: number;
}

export interface Aisle {
  id: string;
  name: string;
  code: string;
  containmentType: 'Cold Aisle' | 'Hot Aisle';
  purpose: string;
  rackIds: string[];
  avgTempC: number;
  differentialPressurePa: number;
  crahUnitAssigned: string;
}

export interface PowerComponent {
  id: string;
  name: string;
  code: string;
  category: 'grid' | 'transformer' | 'generator' | 'ups' | 'sts' | 'pdu';
  capacityKw: number;
  currentKw: number;
  voltageV: number;
  currentA: number;
  frequencyHz: number;
  efficiencyPercent: number;
  status: 'online' | 'warning' | 'critical' | 'standby' | 'discharging';
  redundancy: '2N' | 'N+1' | 'N';
  phaseL1Load: number; // %
  phaseL2Load: number; // %
  phaseL3Load: number; // %
  batteryRuntimeMin?: number;
  fuelLevelPercent?: number;
}

export interface CoolingUnit {
  id: string;
  name: string;
  type: 'crah' | 'chiller' | 'cooling_tower';
  zone: string;
  status: 'online' | 'warning' | 'offline' | 'eco' | 'boost';
  fanSpeedPercent: number;
  supplyTempC: number;
  returnTempC: number;
  deltaTempC: number;
  flowRateGpm: number;
  powerDrawKw: number;
  mode: 'auto' | 'boost' | 'eco';
}

export interface NocAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  category: 'thermal' | 'power' | 'hardware' | 'network' | 'security';
  title: string;
  location: string;
  rackId?: string;
  description: string;
  acknowledged: boolean;
  assignedTech?: string;
  resolved: boolean;
}

export interface FieldTechnician {
  id: string;
  name: string;
  badge: string;
  role: string;
  location: string;
  status: 'active_floor' | 'at_noc' | 'on_break';
  activeCrashCart: string;
  avatarColor: string;
  assignedWorkOrders: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  priority: 'p1_urgent' | 'p2_high' | 'p3_medium' | 'p4_low';
  rackLocation: string;
  deviceTarget?: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdTime: string;
  actionType: 'hardware_swap' | 'cable_patch' | 'preventive' | 'firmware_update' | 'thermal_inspection';
  description: string;
  notes?: string;
}

export interface DataCenterMetrics {
  pue: number;
  totalItLoadMw: number;
  coolingLoadMw: number;
  facilityLoadMw: number;
  gridFrequencyHz: number;
  powerFactor: number;
  generatorReady: boolean;
  coldAisleAvgTemp: number;
  hotAisleAvgTemp: number;
  floorPressurePa: number;
  humidityPercent: number;
  carbonIntensityGPerKwh: number;
  renewableEnergyPercent: number;
  waterUsageEffectiveness: number;
}

// ---------------- Alerting & Notification System ----------------

export type AlertMetricType = 
  | 'high_server_temperature'
  | 'power_supply_failure'
  | 'network_connectivity_loss'
  | 'disk_space_threshold';

export type NotificationChannel = 'email' | 'sms' | 'webhook';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface AlertRule {
  id: string;
  name: string;
  metricType: AlertMetricType;
  description: string;
  thresholdValue: number;
  thresholdUnit: string;
  comparison: '>' | '<' | '=' | '!=';
  severity: AlertSeverity;
  enabled: boolean;
  channels: NotificationChannel[];
  emailRecipients: string[];
  smsRecipients: string[];
  webhookUrl?: string;
  cooldownMinutes: number;
  lastTriggered?: string;
}

export interface NotificationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  metricType: AlertMetricType;
  severity: AlertSeverity;
  channel: NotificationChannel;
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'delivered' | 'simulated' | 'failed';
}

// ---------------- Asset Management System ----------------

export type AssetCategory = 'server' | 'network_device' | 'storage_device' | 'software_license';

export interface BaseAsset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  status: 'operational' | 'maintenance' | 'degraded' | 'offline' | 'decommissioned';
  notes?: string;
  lastUpdated: string;
}

export interface ServerAssetFields {
  category: 'server';
  model: string;
  serialNumber: string;
  processor: string;
  ramGb: number;
  storageInfo: string;
  ipAddress: string;
  location: { aisle: string; rackId: string; uPosition: string };
  owner: string;
  purchaseDate: string;
  warrantyExpiry: string;
}

export interface NetworkAssetFields {
  category: 'network_device';
  subType: 'switch' | 'router' | 'firewall';
  model: string;
  serialNumber: string;
  ipAddress: string;
  portsTotal: number;
  portsActive: number;
  firmwareVersion: string;
  location: { aisle: string; rackId: string; uPosition: string };
  owner: string;
}

export interface StorageAssetFields {
  category: 'storage_device';
  storageType: 'SAN' | 'NAS' | 'NVMe-oF' | 'Object';
  model: string;
  serialNumber: string;
  totalCapacityTb: number;
  usedCapacityTb: number;
  raidType: string;
  ipAddress: string;
  location: { aisle: string; rackId: string; uPosition: string };
  owner: string;
}

export interface SoftwareLicenseAssetFields {
  category: 'software_license';
  vendor: string;
  version: string;
  licenseKeyMasked: string;
  totalSeats: number;
  usedSeats: number;
  expiryDate: string;
  assignedAssets: string[];
  licenseType: 'Per-Core' | 'Per-Socket' | 'Per-User' | 'Enterprise';
}

export type Asset = BaseAsset & (ServerAssetFields | NetworkAssetFields | StorageAssetFields | SoftwareLicenseAssetFields);

// ---------------- Real-time Dashboard Telemetry Feeds ----------------

export interface ServerStatusFeed {
  totalServers: number;
  upCount: number;
  downCount: number;
  warningCount: number;
  maintenanceCount: number;
  loadAvg1m: number;
  loadAvg5m: number;
  loadAvg15m: number;
  cpuAvgPercent: number;
  ramAvgPercent: number;
}

export interface EnvironmentalFeed {
  supplyTempC: number;
  returnTempC: number;
  deltaTempC: number;
  humidityPercent: number;
  subfloorPressurePa: number;
  cfmAirflow: number;
  outdoorTempC: number;
}

export interface PowerFeed {
  itLoadMw: number;
  facilityLoadMw: number;
  pue: number;
  pduAStatus: 'normal' | 'warning' | 'critical';
  pduBStatus: 'normal' | 'warning' | 'critical';
  pduAVolts: number;
  pduBVolts: number;
  pduAAmps: number;
  pduBAmps: number;
  phaseImbalancePercent: number;
  upsBatteryMin: number;
}

export interface NetworkTrafficFeed {
  bandwidthInGbps: number;
  bandwidthOutGbps: number;
  peakBandwidthGbps: number;
  torSaturationPercent: number;
  packetLossPercent: number;
  latencyMs: number;
  activeFiberPorts: number;
}

export interface TimeSeriesPoint {
  time: string;
  v1: number;
  v2?: number;
}

// ---------------- 30-Day Historical Capacity & Subsystem Telemetry ----------------

export interface HistoricalDataPoint {
  day: number;
  period: string; // e.g. "Day 01" or "W1"
  timestamp: string; // e.g. "May 01"
  itLoadMw: number; // IT load in MW (e.g. 2.45)
  itLoadPeakMw: number; // Daily/weekly peak spike in MW
  rackCapacityPercent: number; // Rack capacity utilization percentage (e.g. 74.2%)
  occupiedRacks: number; // Number of racks occupied
  totalRacks: number; // Total rack capacity (240)
  heatExchangerKw: number; // Rooftop thermal heat exchanger load in kW
  upsLoadPercent: number; // UPS 2N load utilization %
  networkFiberGbps: number; // Outside carrier & ISP fiber traffic in Gbps
  coolingPowerMw: number; // Air conditioning & chiller power
  pueRatio: number; // Power Usage Effectiveness
  // Server Rack Working Flow Telemetry (from the anatomy diagram)
  clientRequestsPerSec?: number; // Ingress Client Requests (e.g. HTTP)
  dataServedGbps?: number; // Egress Data Served to Clients
  cpuProcessingPercent?: number; // CPU Processing Unit utilization %
  ramMemoryPercent?: number; // RAM System Memory usage %
  storageIops?: number; // OS & Data Store SSD/NVMe IOPS
  storageThroughputMBs?: number; // Storage Persistent Data rate in MB/s
  pduBranchAmps?: number; // In-Rack PDU Current draw in Amperes
  airflowCfm?: number; // Top Exhaust Cooling System CFM
  rackDeltaTempC?: number; // Temperature delta across rack exhaust
}

export interface FacilitySubsystemInfo {
  id: string;
  name: string;
  imageLabel: string;
  iconName: string;
  color: string;
  accentBg: string;
  borderColor: string;
  diagramQuote: string;
  relationshipToTrend: string;
  currentMetric: string;
  capacityImpact: string;
  status: 'optimal' | 'nominal' | 'elevated';
}

// ---------------- NOC Historical Alert Trends & Proactive Maintenance (8 Hand-Drawn Parts) ----------------

export type HandDrawnSubsystemId = 
  | 'servers'
  | 'networking'
  | 'storage'
  | 'power'
  | 'cooling'
  | 'security'
  | 'monitoring'
  | 'backup_dr';

export interface AlertTrendWeeklyPoint {
  week: string; // e.g. "W1", "W2"
  label: string; // "Jul 15 - 21"
  servers: number;
  networking: number;
  storage: number;
  power: number;
  cooling: number;
  security: number;
  monitoring: number;
  backup_dr: number;
  totalAlerts: number;
  criticalSpikes: number;
  meanTimeToResolveMinutes: number;
}

export interface ProactiveMaintenanceTask {
  id: string;
  subsystemId: HandDrawnSubsystemId;
  subsystemNumber: number; // 1 to 8
  subsystemName: string;
  title: string;
  component: string;
  location: string;
  rackId?: string;
  predictedFailureWindow: string; // e.g. "Within 48 - 72 Hours"
  failureProbabilityPercent: number; // e.g. 89%
  urgency: 'critical' | 'high' | 'medium';
  historicalTrigger: string; // Alert signature that led to this PM prediction
  failureModePrevented: string;
  costAvoidanceUsd: number;
  downtimeAvoidedHours: number;
  sopSteps: string[];
  recommendedParts: string[];
  assignedTech?: string;
  status: 'recommended' | 'scheduled' | 'dispatched' | 'completed';
  workOrderId?: string;
}

export interface HandDrawnImportantPart {
  number: number;
  id: HandDrawnSubsystemId;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  components: Array<{
    name: string;
    description: string;
    type: string;
  }>;
  bulletNotes: string[];
  uptimeAnnotation: string;
  historicalAlertCount90d: number;
  recurrentPattern: string;
  predictedFailureRisk: 'low' | 'moderate' | 'elevated' | 'high';
  activeProactiveTasksCount: number;
}

export interface EnergySavingModification {
  id: string;
  category: 'cooling' | 'power_distribution';
  title: string;
  subsystemTarget: string;
  currentCondition: string;
  actionProposed: string;
  technicalMechanism: string;
  projectedPueDelta: number; // e.g. -0.026
  projectedKwReduction: number; // e.g. 74 kW
  annualKwhSaved: number; // e.g. 648000 kWh
  annualCostSavingsUsd: number; // @ $0.11/kWh
  annualCarbonAvoidanceMt: number; // MT CO2e
  paybackPeriodMonths: number;
  implementationRisk: 'low' | 'moderate';
  complexity: 'low' | 'medium' | 'high';
  ashraeStandardCompliance: string;
  sopSteps: string[];
}

export interface PueSustainabilityPoint {
  day: number;
  period: string;
  timestamp: string;
  pueRatio: number;
  itLoadMw: number;
  coolingPowerMw: number;
  powerLossesKw: number;
  totalFacilityPowerMw: number;
  heatExchangerKw: number;
  upsEfficiencyPercent: number;
  dailyKwh: number;
  carbonKg: number;
  simulatedPueRatio?: number;
}

