import { 
  AlertTrendWeeklyPoint, 
  HandDrawnImportantPart, 
  ProactiveMaintenanceTask 
} from '../types';

// 8-Week Historical Alert Trends Across the 8 Core Subsystems
export const HISTORICAL_ALERT_TRENDS_WEEKLY: AlertTrendWeeklyPoint[] = [
  {
    week: 'W1',
    label: 'Jul 24 - Jul 30',
    servers: 5,
    networking: 3,
    storage: 4,
    power: 4,
    cooling: 7,
    security: 2,
    monitoring: 3,
    backup_dr: 1,
    totalAlerts: 29,
    criticalSpikes: 2,
    meanTimeToResolveMinutes: 44,
  },
  {
    week: 'W2',
    label: 'Jul 31 - Aug 06',
    servers: 4,
    networking: 4,
    storage: 3,
    power: 5,
    cooling: 8,
    security: 3,
    monitoring: 2,
    backup_dr: 2,
    totalAlerts: 31,
    criticalSpikes: 3,
    meanTimeToResolveMinutes: 48,
  },
  {
    week: 'W3',
    label: 'Aug 07 - Aug 13',
    servers: 6,
    networking: 3,
    storage: 5,
    power: 4,
    cooling: 6,
    security: 2,
    monitoring: 4,
    backup_dr: 2,
    totalAlerts: 32,
    criticalSpikes: 1,
    meanTimeToResolveMinutes: 38,
  },
  {
    week: 'W4',
    label: 'Aug 14 - Aug 20',
    servers: 7,
    networking: 5,
    storage: 4,
    power: 6,
    cooling: 9,
    security: 3,
    monitoring: 3,
    backup_dr: 3,
    totalAlerts: 40,
    criticalSpikes: 4,
    meanTimeToResolveMinutes: 52,
  },
  {
    week: 'W5',
    label: 'Aug 21 - Aug 27',
    servers: 5,
    networking: 4,
    storage: 5,
    power: 5,
    cooling: 7,
    security: 2,
    monitoring: 3,
    backup_dr: 2,
    totalAlerts: 33,
    criticalSpikes: 2,
    meanTimeToResolveMinutes: 41,
  },
  {
    week: 'W6',
    label: 'Aug 28 - Sep 03',
    servers: 8,
    networking: 4,
    storage: 4,
    power: 6,
    cooling: 8,
    security: 3,
    monitoring: 4,
    backup_dr: 2,
    totalAlerts: 39,
    criticalSpikes: 3,
    meanTimeToResolveMinutes: 46,
  },
  {
    week: 'W7',
    label: 'Sep 04 - Sep 10',
    servers: 9,
    networking: 6,
    storage: 6,
    power: 7,
    cooling: 11,
    security: 4,
    monitoring: 4,
    backup_dr: 3,
    totalAlerts: 50,
    criticalSpikes: 6,
    meanTimeToResolveMinutes: 62,
  },
  {
    week: 'W8 (Current)',
    label: 'Sep 11 - Sep 19',
    servers: 7,
    networking: 5,
    storage: 5,
    power: 6,
    cooling: 9,
    security: 2,
    monitoring: 3,
    backup_dr: 2,
    totalAlerts: 39,
    criticalSpikes: 4,
    meanTimeToResolveMinutes: 43,
  }
];

// The 8 Important Data Centre Parts Analyzed From the Hand-Drawn Notebook Notes
export const HAND_DRAWN_IMPORTANT_PARTS: HandDrawnImportantPart[] = [
  {
    number: 1,
    id: 'servers',
    title: 'SERVERS',
    subtitle: 'Compute Power',
    iconName: 'Server',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    borderColor: 'border-cyan-700',
    components: [
      {
        name: 'Rack Servers',
        description: 'Standard, scalable rackmount form-factor in 1U/2U/4U footprints.',
        type: 'Standard Compute'
      },
      {
        name: 'Blade Servers',
        description: 'High density, shared power/cooling/backplane resources in centralized chassis.',
        type: 'High-Density Compute'
      }
    ],
    bulletNotes: [
      'Host applications, process data, handle client requests',
      'CPU, RAM, Storage (local NVMe/SAS tiers)',
      'Virtualization (VMs) and multi-tenant container clusters common'
    ],
    uptimeAnnotation: 'Crucial for uptime!',
    historicalAlertCount90d: 51,
    recurrentPattern: 'Cluster memory ECC single-bit threshold escalation and chassis blower fan vibration anomalies prior to thermal throttling.',
    predictedFailureRisk: 'elevated',
    activeProactiveTasksCount: 2,
  },
  {
    number: 2,
    id: 'networking',
    title: 'NETWORKING',
    subtitle: 'Connectivity & Traffic Flow',
    iconName: 'Network',
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-700',
    borderColor: 'border-indigo-700',
    components: [
      {
        name: 'Routers',
        description: 'Connect disparate external networks, direct traffic, multi-homed WAN gateway.',
        type: 'Border Gateway'
      },
      {
        name: 'Switches',
        description: 'Connect internal devices within LAN, ultra-low latency packet forwarding.',
        type: 'Spine-Leaf Fabric'
      },
      {
        name: 'Firewalls',
        description: 'Stateful security barrier, traffic filtering, packet inspection, access control.',
        type: 'Perimeter Defense'
      }
    ],
    bulletNotes: [
      'High-speed interconnect (Fiber optic MPO/LC and shielded Copper twinax)',
      'Redundancy (dual failover paths, VRRP/BGP Anycast)',
      'Modern network topology: Spine-leaf folded Clos architecture'
    ],
    uptimeAnnotation: 'Redundancy is key!',
    historicalAlertCount90d: 33,
    recurrentPattern: 'Optical power degradation (dBm drift on 100G QSFP28 transceivers) causing intermittent CRC packet drops on East-West leaf uplinks.',
    predictedFailureRisk: 'moderate',
    activeProactiveTasksCount: 1,
  },
  {
    number: 3,
    id: 'storage',
    title: 'STORAGE SYSTEMS',
    subtitle: 'Data Repository',
    iconName: 'HardDrive',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700',
    borderColor: 'border-amber-700',
    components: [
      {
        name: 'SAN (Storage Area Network)',
        description: 'Dedicated high-speed Fibre Channel/iSCSI network, block-level raw access, highest IOPS.',
        type: 'Block-Level High Perf'
      },
      {
        name: 'NAS (Network Attached Storage)',
        description: 'File-level access (NFS/SMB), shared enterprise storage pools over standard LAN.',
        type: 'File-Level Shared'
      }
    ],
    bulletNotes: [
      'Store massive data volumes across enterprise HDD and NVMe SSD tiers',
      'Hardware RAID (RAID 6 / RAID 10) for parity redundancy and fault tolerance',
      'Scalable elastic capacity with inline data deduplication'
    ],
    uptimeAnnotation: 'Reliability is crucial!',
    historicalAlertCount90d: 35,
    recurrentPattern: 'SAS/NVMe drive SMART reallocated sector spikes and RAID consistency scrub parity latency during nightly snapshots.',
    predictedFailureRisk: 'elevated',
    activeProactiveTasksCount: 1,
  },
  {
    number: 4,
    id: 'power',
    title: 'POWER SYSTEMS',
    subtitle: 'Reliability & Uptime',
    iconName: 'Zap',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
    borderColor: 'border-emerald-700',
    components: [
      {
        name: 'UPS (Uninterruptible Power Supply)',
        description: 'Double-conversion battery backup, immediate zero-transfer bridge, cleans & smooths dirty utility power.',
        type: '2N Power Conditioning'
      },
      {
        name: 'Generators',
        description: 'Heavy-duty diesel emergency engines, automatic transfer switch kicks in during grid outage.',
        type: 'Emergency Prime Power'
      },
      {
        name: 'PDUs (Power Distribution Units)',
        description: 'Distribute conditioned bus power to rack equipment with per-outlet metering.',
        type: 'In-Row Distribution'
      }
    ],
    bulletNotes: [
      'N+1 or 2N true physical redundancy from utility substation to dual A/B server power supplies',
      'Clean, harmonic-filtered stable power is crucial for microelectronics longevity',
      'Continuous power monitoring of kW, kVA, power factor, and phase balancing'
    ],
    uptimeAnnotation: 'Crucial for uptime!',
    historicalAlertCount90d: 41,
    recurrentPattern: 'UPS battery jar internal impedance drift (VRLA conductance loss) and harmonic distortion on PDU secondary phase feeds.',
    predictedFailureRisk: 'high',
    activeProactiveTasksCount: 2,
  },
  {
    number: 5,
    id: 'cooling',
    title: 'COOLING SYSTEMS',
    subtitle: 'Heat Management',
    iconName: 'Snowflake',
    color: 'text-teal-400',
    badgeBg: 'bg-teal-950/80 text-teal-300 border-teal-700',
    borderColor: 'border-teal-700',
    components: [
      {
        name: 'CRAC (Computer Room Air Conditioning)',
        description: 'Precise thermal control, variable blower fans, tight ±2% relative humidity regulation.',
        type: 'Whitespace Conditioning'
      },
      {
        name: 'Chillers',
        description: 'Centrifugal/screw compressors that remove heat from water/glycol coolant loop.',
        type: 'Primary Heat Rejection'
      },
      {
        name: 'Cold Aisle / Hot Aisle Containment',
        description: 'Physical separation: Cool air injected into server fronts, hot exhaust confined and vented.',
        type: 'Airflow Optimization'
      }
    ],
    bulletNotes: [
      'Maintain optimal ASHRAE TC 9.9 thermal range (e.g. 18°C – 27°C / 64.4°F – 80.6°F)',
      'Prevent hotspot thermal runaway and costly equipment micro-cracking',
      'Direct-to-chip liquid cooling & immersion cooling emerging for high-TDP AI racks'
    ],
    uptimeAnnotation: 'Keep it cool! Crucial for uptime!',
    historicalAlertCount90d: 65,
    recurrentPattern: 'Hot aisle containment brush-seal leakage causing recirculation pockets, and CRAC fan belt micro-slippage degrading Delta-T.',
    predictedFailureRisk: 'high',
    activeProactiveTasksCount: 2,
  },
  {
    number: 6,
    id: 'security',
    title: 'SECURITY',
    subtitle: 'Physical & Digital Protection',
    iconName: 'ShieldAlert',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-700',
    borderColor: 'border-rose-700',
    components: [
      {
        name: 'Biometric Access',
        description: 'Palm vein, fingerprint, and retina multi-factor scanners across mantrap turnstiles.',
        type: 'Identity Verification'
      },
      {
        name: 'CCTV Surveillance',
        description: '360° AI-monitored PTZ optical cameras with 90-day redundant NVR archival.',
        type: 'Perimeter & Hall Monitoring'
      },
      {
        name: 'Fire Suppression',
        description: 'Clean agent gaseous suppression (FM-200 / Novec 1230), VESDA early detection, pre-action water mist.',
        type: 'Hazard Suppression'
      }
    ],
    bulletNotes: [
      'Strict multi-layered physical access control (perimeter fence, biometric airlock, cage keycards)',
      'Perimeter security with anti-tailgating radar sensors and tamper alarms',
      'Protect critical infrastructure against unauthorized intrusion, physical tampering, and fire'
    ],
    uptimeAnnotation: 'Strict defense in depth!',
    historicalAlertCount90d: 21,
    recurrentPattern: 'Airlock mantrap false rejection spikes during high-traffic shift handover, and optical dust accumulation in VESDA sampling pipes.',
    predictedFailureRisk: 'low',
    activeProactiveTasksCount: 1,
  },
  {
    number: 7,
    id: 'monitoring',
    title: 'MONITORING & MANAGEMENT',
    subtitle: 'Operations & Visibility',
    iconName: 'Eye',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-700',
    borderColor: 'border-sky-700',
    components: [
      {
        name: 'DCIM Platform',
        description: 'Centralized Single-Pane-of-Glass for telemetry, asset lifecycle, capacity, and SCADA.',
        type: 'Operations Control Center'
      },
      {
        name: 'Environmental Sensors',
        description: 'Real-time telemetry measuring temperature, relative humidity, pressure Pa, and power draw.',
        type: 'IoT Telemetry Mesh'
      },
      {
        name: 'Alert Engine',
        description: 'Proactive multi-channel notification engine (SMS, Email, Webhook, On-Call Pager).',
        type: 'Predictive Tripwires'
      }
    ],
    bulletNotes: [
      'Real-time automated tracking of every component across the entire facility',
      'Capacity planning (kW power headroom, cooling tonnage, rack space U occupancy)',
      'Remote out-of-band management tools (IPMI, iLO/iDRAC, Redfish, SNMP v3)'
    ],
    uptimeAnnotation: 'Visibility prevents downtime!',
    historicalAlertCount90d: 26,
    recurrentPattern: 'Telemetry polling timeouts on edge Modbus IoT daisy-chains and threshold boundary flapping creating alert noise.',
    predictedFailureRisk: 'moderate',
    activeProactiveTasksCount: 1,
  },
  {
    number: 8,
    id: 'backup_dr',
    title: 'BACKUP & DISASTER RECOVERY',
    subtitle: 'Business Continuity',
    iconName: 'RefreshCw',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-700',
    borderColor: 'border-purple-700',
    components: [
      {
        name: 'Primary Site & DR Replication',
        description: 'Continuous asynchronous data replication between primary data hall and secondary geo-site.',
        type: 'Cross-Site Sync'
      },
      {
        name: 'Offsite Cloud Backup',
        description: 'Air-gapped immutable backup repositories with automated retention policies.',
        type: 'Ransomware-Proof Vault'
      },
      {
        name: 'RPO / RTO Metrics',
        description: 'Recovery Point Objective (max acceptable data loss) & Recovery Time Objective (max downtime).',
        type: 'SLA Governance'
      }
    ],
    bulletNotes: [
      'RPO (Recovery Point Objective): Governs allowable transaction loss interval (< 15 mins)',
      'RTO (Recovery Time Objective): Governs maximum time to bring secondary site live (< 30 mins)',
      'Regular automated non-disruptive DR failover testing is crucial for business survival'
    ],
    uptimeAnnotation: 'Crucial for uptime!',
    historicalAlertCount90d: 19,
    recurrentPattern: 'Replication lag delta exceeding 15-minute RPO SLA during nightly batch snapshots due to WAN QoS bandwidth congestion.',
    predictedFailureRisk: 'moderate',
    activeProactiveTasksCount: 1,
  }
];

// Predictive Proactive Maintenance Tasks Generated From Historical Alert Pattern Recognition
export const INITIAL_PROACTIVE_MAINTENANCE_TASKS: ProactiveMaintenanceTask[] = [
  {
    id: 'PM-CLG-01',
    subsystemId: 'cooling',
    subsystemNumber: 5,
    subsystemName: 'Cooling Systems (Heat Management)',
    title: 'CRAC-04 VFD Hunting Oscillation & Fan Belt Tension Recalibration',
    component: 'CRAH-04 Supply Blower & Inverter Drive',
    location: 'Whitespace Hall Alpha • Zone 4 Cold Aisle',
    predictedFailureWindow: 'Within 24 - 48 Hours',
    failureProbabilityPercent: 91,
    urgency: 'critical',
    historicalTrigger: 'CRAC-04 generated 9 thermal supply delta-T alarms in 14 days; motor bearing vibration frequency increased by 310% with supply temp variance fluctuating between 18.2°C and 25.1°C.',
    failureModePrevented: 'Catastrophic fan belt snap causing immediate shutdown of CRAH-04, leading to cold aisle hotspot blowout (>31°C) and cascade emergency throttling of 18 High-Density GPU servers.',
    costAvoidanceUsd: 142000,
    downtimeAvoidedHours: 3.5,
    sopSteps: [
      'Lock-Out / Tag-Out (LOTO) breaker on CRAH-04 motor starter panel.',
      'Inspect dual V-belts for glazing, longitudinal cracking, and tension deflection.',
      'Replace with Kevlar-reinforced matched belt pair (Gates Quad-Power 4).',
      'Verify static pressure sensor transducer tubing for condensation blockage.',
      'Perform 10-minute dynamic balancing run on VFD inverter at 60 Hz.'
    ],
    recommendedParts: [
      'Matched V-Belt Pair (SKU: GAT-QP4-920)',
      'SKF Deep-Groove Sealed Bearings (6208-2RS1)',
      'Aeroshell Grade 7 Synthetic Bearing Grease'
    ],
    assignedTech: 'Elena Rostova',
    status: 'recommended',
  },
  {
    id: 'PM-PWR-02',
    subsystemId: 'power',
    subsystemNumber: 4,
    subsystemName: 'Power Systems (Reliability & Uptime)',
    title: 'UPS-2N String 2B Cell Conductance Degradation & Terminal Retorquing',
    component: 'UPS System Alpha • Battery Bay 2B (Jars 14–18)',
    location: 'Ground Floor Electrical Suite • Room E-102',
    predictedFailureWindow: 'Within 72 - 96 Hours',
    failureProbabilityPercent: 88,
    urgency: 'critical',
    historicalTrigger: 'DC bus monitoring recorded 6 micro-voltage drops during routine weekly battery discharge test; internal cell impedance on Jars 14-18 drifted +22.4% above IEEE 1188 baseline.',
    failureModePrevented: 'Premature battery string collapse during commercial grid interruption, leaving Critical Bus B without battery bridging time and risking instantaneous compute drop.',
    costAvoidanceUsd: 290000,
    downtimeAvoidedHours: 5.0,
    sopSteps: [
      'Switch UPS System Alpha String 2B to offline maintenance bypass.',
      'Perform Midtronics micro-ohm conductance scan across all 40 jars.',
      'Isolate and replace degraded 12V 150Ah VRLA mono-blocks #14, #16, and #18.',
      'Torque all inter-cell bus bars to 11.3 N·m using calibrated insulated wrench.',
      'Apply anti-oxidant grease (No-Ox-ID) to terminals and run equalization charge.'
    ],
    recommendedParts: [
      '3x CSB HRL 12500W High-Rate VRLA Batteries',
      'Solid Copper Lead-Plated Inter-Cell Straps',
      'Insulated 11.3 N·m Torque Wrench Kit'
    ],
    assignedTech: 'Rajesh Kumar',
    status: 'recommended',
  },
  {
    id: 'PM-SRV-03',
    subsystemId: 'servers',
    subsystemNumber: 1,
    subsystemName: 'Servers (Compute Power)',
    title: 'Row C Blade Server Chassis #4 Thermal Paste Depletion & Filter Refresh',
    component: 'HPE Synergy 12000 Blade Enclosure #4',
    location: 'Row C • Rack 09 • U18 - U28',
    rackId: 'RACK-09',
    predictedFailureWindow: 'Within 3 - 5 Days',
    failureProbabilityPercent: 84,
    urgency: 'high',
    historicalTrigger: 'Chassis temperature sensors logged 12 CPU thermal throttling events during nightly AI training batch runs; Blade 04 CPU1 junction temp reached 87°C (Tjunction max 92°C).',
    failureModePrevented: 'Hardware thermal emergency shutdown of 8 compute blades hosting 320 customer container pods, triggering ungraceful database failovers and latency penalties.',
    costAvoidanceUsd: 85000,
    downtimeAvoidedHours: 2.0,
    sopSteps: [
      'Drain Kubernetes compute workloads from Blade 04 to spare node in Hall Beta.',
      'Gracefully power down Blade 04 and slide compute module onto antistatic crash cart.',
      'Unseat heatsinks, clean oxidized thermal interface material using 99% isopropanol.',
      'Re-apply Shin-Etsu high-performance thermal compound with 0.1mm stencil.',
      'Vacuum and wash enclosure front bezel dust particulate filters.'
    ],
    recommendedParts: [
      'Shin-Etsu 7921 Phase-Change Thermal Paste',
      'HPE Synergy High-Airflow Bezel Filter Sponge Kit',
      'ESD Dissipative Grounding Strap'
    ],
    assignedTech: 'Marcus Vance',
    status: 'recommended',
  },
  {
    id: 'PM-STO-04',
    subsystemId: 'storage',
    subsystemNumber: 3,
    subsystemName: 'Storage Systems (Data Repository)',
    title: 'SAN Array B Pre-Failure SAS SSD Replacement & Hot Spare Scrub',
    component: 'Pure Storage / NetApp All-Flash SAN Shelf 2',
    location: 'Storage Cage 2 • Rack 04 • U14',
    rackId: 'RACK-04',
    predictedFailureWindow: 'Within 4 - 6 Days',
    failureProbabilityPercent: 79,
    urgency: 'high',
    historicalTrigger: 'Drive SMART predictive failure flags logged 46 reallocated flash blocks in 7 days on Disk 14; read error rate exponential curve matched historical NAND gate dielectric breakdown.',
    failureModePrevented: 'Sudden read failure of Disk 14 during scheduled parity consistency scrub, causing array rebuild degradation and possible dual-disk loss in RAID 6 parity group.',
    costAvoidanceUsd: 110000,
    downtimeAvoidedHours: 4.0,
    sopSteps: [
      'Verify SAN hot spare drive #24 is online, scrubbed, and in ready state.',
      'Trigger proactive background copy of Disk #14 data directly to hot spare #24.',
      'Confirm data mirror parity check reaches 100% completion.',
      'Hot-swap physical Disk #14 using enterprise latch release.',
      'Insert new 7.68TB 12G SAS Enterprise SSD and designate as new hot spare.'
    ],
    recommendedParts: [
      'Enterprise 7.68TB SAS SSD 12Gbps 2.5" Hot-Plug',
      'Drive Caddy Assembly with Anti-Vibration Grommets'
    ],
    assignedTech: 'Sarah Mitchell',
    status: 'recommended',
  },
  {
    id: 'PM-NET-05',
    subsystemId: 'networking',
    subsystemNumber: 2,
    subsystemName: 'Networking (Connectivity & Traffic Flow)',
    title: 'Spine-Leaf Fabric Optical Transceiver dBm Loss & Fiber Cleaning',
    component: 'Arista 7060X 100G Spine Switch #2 • Port 24',
    location: 'Meet-Me Room A • Network Rack N-02 • U40',
    predictedFailureWindow: 'Within 5 - 7 Days',
    failureProbabilityPercent: 76,
    urgency: 'medium',
    historicalTrigger: 'Optical transceiver telemetry logged progressive RX power degradation from -3.4 dBm to -11.9 dBm (near -14.0 dBm sensitivity threshold); 18,400 CRC alignment errors in 10 days.',
    failureModePrevented: 'Intermittent optical link flapping triggering BGP EVPN spine route recalculations, introducing packet drops and 400ms micro-burst latency spikes across Hall East-West fabric.',
    costAvoidanceUsd: 65000,
    downtimeAvoidedHours: 1.5,
    sopSteps: [
      'Administratively set maintenance cost on Spine #2 Port 24 to divert ECMP paths.',
      'Unseat LC duplex fiber patch and inspect ferrule with 400x fiber scope.',
      'Clean bulkhead adapter and fiber end-face with IBC brand dry-cleaner click pen.',
      'Test optical power with calibrated power meter; if RX still < -8 dBm, replace QSFP28 transceiver.',
      'Re-seat optic, clear interface counters, and verify zero CRC drops over 30 minutes.'
    ],
    recommendedParts: [
      '100G QSFP28 LR4 1310nm Single-Mode Optical Transceiver',
      'One-Click LC Fiber Cleaning Pen',
      'Corning ClearCurve LC-LC Duplex Patch Cord 5m'
    ],
    assignedTech: 'Vikram Joshi',
    status: 'recommended',
  },
  {
    id: 'PM-CLG-06',
    subsystemId: 'cooling',
    subsystemNumber: 5,
    subsystemName: 'Cooling Systems (Heat Management)',
    title: 'Row B Hot Aisle Containment Roof Silicone Brush Seal Restoration',
    component: 'Row B Hot Aisle Containment Ceiling Panels',
    location: 'Whitespace Hall Alpha • Row B Aisles 5–8',
    predictedFailureWindow: 'Within 5 - 7 Days',
    failureProbabilityPercent: 74,
    urgency: 'medium',
    historicalTrigger: 'Air velocity differential sensors detected 0.85 m/s hot exhaust air escaping through unsealed ceiling gaps into Cold Aisle Row B, raising cold aisle inlet temperature by +2.3°C.',
    failureModePrevented: 'Progressive cooling efficiency loss forcing chillers to run 14% higher compressor boost, increasing facility PUE from 1.18 to 1.25 and wasting 38,000 kWh monthly.',
    costAvoidanceUsd: 32000,
    downtimeAvoidedHours: 0.0,
    sopSteps: [
      'Erect non-conductive fiberglass mobile scaffold along Row B aisle corridor.',
      'Inspect magnetic drop-ceiling panels and thermal break silicone gasket joints.',
      'Replace torn brush strip seals along cable penetration openings.',
      'Seal unused 1U/2U rack gaps with toolless blanking panels.',
      'Validate containment pressure differential with handheld micro-manometer (target > 5 Pa).'
    ],
    recommendedParts: [
      'Polypropylene Flexible Brush Strip Seals (2-meter length)',
      '1U/2U Toolless Polycarbonate Blanking Panels (Pack of 50)',
      'High-Temperature Silicone Gasket Tape'
    ],
    assignedTech: 'Elena Rostova',
    status: 'recommended',
  },
  {
    id: 'PM-BCDR-07',
    subsystemId: 'backup_dr',
    subsystemNumber: 8,
    subsystemName: 'Backup & Disaster Recovery (Business Continuity)',
    title: 'Secondary Site Storage Async Replication Lag & WAN QoS Tuning',
    component: 'Disaster Recovery WAN Gateway & Snapshot Engine',
    location: 'Disaster Recovery WAN Router R-01 & Cloud Vault',
    predictedFailureWindow: 'Within 48 - 72 Hours',
    failureProbabilityPercent: 82,
    urgency: 'high',
    historicalTrigger: 'Cross-site async storage replication delta exceeded 15-minute RPO threshold on 4 successive nights, reaching 39 minutes during peak transactional volume.',
    failureModePrevented: 'Violating enterprise SLA of 15-minute maximum data loss (RPO) and 30-minute recovery time (RTO) during unexpected municipal grid power disruption.',
    costAvoidanceUsd: 195000,
    downtimeAvoidedHours: 6.0,
    sopSteps: [
      'Analyze NetFlow telemetry on the dedicated 10Gbps inter-datacenter link.',
      'Reconfigure WAN Edge router shaping policy: elevate Storage Replication QoS queue to Expedited Forwarding (EF).',
      'Optimize snapshot schedule to staggered 10-minute micro-increments.',
      'Execute non-disruptive DR failover test on isolated sandbox VLAN to verify RTO under 18 minutes.',
      'Verify cryptographic checksum on secondary site immutable backup targets.'
    ],
    recommendedParts: [
      'No physical parts required (Software QoS and routing reconfiguration)',
      'Firmware update patch for WAN Optimizer appliance'
    ],
    assignedTech: 'Sarah Mitchell',
    status: 'recommended',
  },
  {
    id: 'PM-SEC-08',
    subsystemId: 'security',
    subsystemNumber: 6,
    subsystemName: 'Security (Physical & Digital Protection)',
    title: 'VESDA Laser Chamber Optical Purge & Biometric Reader Prism Polish',
    component: 'VESDA LaserPLUS Smoke Detector Zone 3 & Mantrap Palm Vein Unit',
    location: 'Whitespace Hall Alpha • Security Airlock & Ceiling Zone 3',
    predictedFailureWindow: 'Within 7 - 10 Days',
    failureProbabilityPercent: 68,
    urgency: 'medium',
    historicalTrigger: 'VESDA optical chamber laser obscuration drift warning recorded 0.048% obscuration/m in dust-free whitespace; palm vein reader logged 18 false rejects during morning shift change.',
    failureModePrevented: 'False emergency clean-agent gas suppression discharge or emergency door interlocking lockout trapping personnel and stalling critical maintenance response.',
    costAvoidanceUsd: 78000,
    downtimeAvoidedHours: 1.0,
    sopSteps: [
      'Notify local Fire Department and put VESDA Zone 3 into Maintenance Test Mode.',
      'Use clean dry nitrogen canister to purge sampling pipe manifold and optical chamber.',
      'Replace internal aspirator cartridge filter element.',
      'Clean biometric palm vein scanner optical glass with anti-static prism cleaner.',
      'Perform optical verification test and restore system to active armed state.'
    ],
    recommendedParts: [
      'VESDA Replacement Aspirator Filter Cartridge (VSP-005)',
      'Dry Nitrogen Canister with Precision Nozzle',
      'Optical Grade Anti-Static Cleaning Wipes'
    ],
    assignedTech: 'Rajesh Kumar',
    status: 'recommended',
  }
];
