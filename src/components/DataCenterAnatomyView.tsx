import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Thermometer, 
  Activity, 
  Eye, 
  Zap, 
  Sliders, 
  BatteryCharging, 
  Fuel, 
  Network, 
  Grid, 
  Cloud, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Info,
  Maximize2,
  Sparkles,
  Search,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';

interface DataCenterAnatomyViewProps {
  onNavigateToTab: (tabId: string) => void;
  onNavigateToRack?: (rackId: string) => void;
}

export interface AnatomyFeature {
  number: number;
  id: string;
  title: string;
  category: 'structural' | 'security' | 'thermal' | 'power' | 'operations' | 'network' | 'cloud' | 'compliance';
  icon: any;
  color: string;
  accentBg: string;
  borderColor: string;
  quote: string;
  specs: {
    label: string;
    value: string;
  }[];
  dcimLink: {
    tabId: string;
    label: string;
  };
  auditChecklist: string[];
  isometricCoords: { x: number; y: number };
}

export const ANATOMY_FEATURES: AnatomyFeature[] = [
  {
    number: 1,
    id: 'building_structure',
    title: 'Building Structure',
    category: 'structural',
    icon: Building2,
    color: 'text-sky-400',
    accentBg: 'bg-sky-950',
    borderColor: 'border-sky-700',
    quote: 'Every region has its share of natural disasters: hurricanes, floods, earthquakes, tornadoes, and more. The structure of the facility should be reinforced to withstand the worst mother nature can throw at it.',
    specs: [
      { label: 'Wind Resistance', value: '165 mph Category-5 rated' },
      { label: 'Seismic Zone', value: 'Zone IV Reinforced Concrete' },
      { label: 'Flood Plain', value: '500-Year Flood Berm Protection' },
      { label: 'Floor Load Capacity', value: '2,500 kg/m² Heavy Structural' }
    ],
    dcimLink: { tabId: 'hall_map', label: 'Inspect 2.5D Hall Floorplan' },
    auditChecklist: [
      'Reinforced exterior walls and roof ballasting',
      'Exterior drainage channels and sump pump automation',
      'Vibration damping pads under heavy chiller plants'
    ],
    isometricCoords: { x: 500, y: 460 }
  },
  {
    number: 2,
    id: 'physical_security',
    title: 'Physical Security',
    category: 'security',
    icon: Eye,
    color: 'text-indigo-400',
    accentBg: 'bg-indigo-950',
    borderColor: 'border-indigo-700',
    quote: 'Controlling physical access to your resources is a vital component of IT security. Look for access protocols such as controlled access to sensitive areas of the building, use of two-factor authentication, biometrics and video surveillance for every point of ingress and egress (doors and windows).',
    specs: [
      { label: 'Access Control', value: 'Multi-factor Iris & Palm Vein' },
      { label: 'CCTV Surveillance', value: '4K AI PTZ with 90-Day Archival' },
      { label: 'Perimeter Barrier', value: 'K12 Crash-Rated Anti-Ram Fencing' },
      { label: 'Entry Containment', value: 'Anti-Tailgating Mantrap Portals' }
    ],
    dcimLink: { tabId: 'tech_dispatch', label: 'Review Security Badges & Access Logs' },
    auditChecklist: [
      'Dual authentication biometric access on all data hall entrances',
      'No blind spots on ingress/egress camera coverage',
      'Visitor escort policy and automated electronic badge revocation'
    ],
    isometricCoords: { x: 230, y: 530 }
  },
  {
    number: 3,
    id: 'climate_control',
    title: 'Climate Control & Cooling',
    category: 'thermal',
    icon: Thermometer,
    color: 'text-teal-400',
    accentBg: 'bg-teal-950',
    borderColor: 'border-teal-700',
    quote: 'Data center equipment is sensitive to heat, humidity, and static electricity. Your data center should be equipped with redundant environmental systems to enable continuous operations.',
    specs: [
      { label: 'Redundancy', value: 'N+2 In-Row CRAH & Chilled Loop' },
      { label: 'Envelope Target', value: 'ASHRAE TC 9.9 Class A1 (18–22°C)' },
      { label: 'Humidity Control', value: '40% - 60% RH Non-Condensing' },
      { label: 'Plenum Pressure', value: '+23.8 Pa Sub-Floor Positive' }
    ],
    dcimLink: { tabId: 'cooling_hvac', label: 'Open Cooling & HVAC SCADA' },
    auditChecklist: [
      'Cold/hot aisle complete containment isolation',
      'Ultrasonic humidifiers with reverse-osmosis treated water',
      'Continuous differential static pressure monitoring under floor tiles'
    ],
    isometricCoords: { x: 570, y: 190 }
  },
  {
    number: 4,
    id: 'bms_systems',
    title: 'Building Management Systems (BMS)',
    category: 'operations',
    icon: Activity,
    color: 'text-cyan-400',
    accentBg: 'bg-cyan-950',
    borderColor: 'border-cyan-700',
    quote: 'Data center operators utilize building management systems to give them a bird\'s-eye view into the health of the facility: HVAC, power loads, voltage levels, emergency power systems including UPS, generators and more.',
    specs: [
      { label: 'Telemetry Rate', value: '1.2s Real-Time Sensor Polling' },
      { label: 'Protocol Stack', value: 'Modbus TCP, BACnet/IP, SNMPv3' },
      { label: 'Monitored Points', value: '14,800+ Discrete Telemetry Nodes' },
      { label: 'PUE Integration', value: 'Live 1.18 Continuous Tracking' }
    ],
    dcimLink: { tabId: 'realtime_dashboard', label: 'Launch Real-Time BMS Feeds' },
    auditChecklist: [
      'Comprehensive SCADA dashboard with alarm tripwires',
      'Predictive maintenance telemetry on bearing wear & oil quality',
      'Automated load-shedding and transfer coordination'
    ],
    isometricCoords: { x: 880, y: 170 }
  },
  {
    number: 5,
    id: 'onsite_noc',
    title: 'On-site Operations Center (NOC)',
    category: 'operations',
    icon: Eye,
    color: 'text-blue-400',
    accentBg: 'bg-blue-950',
    borderColor: 'border-blue-700',
    quote: 'While touring the facility, remember to ask about on-site operations monitoring. These systems provide data center operators with 24x7x365 visibility into elements such as security threats and critical infrastructure performance.',
    specs: [
      { label: 'Staffing Level', value: '24x7x365 Tier-IV Certified Engineers' },
      { label: 'SLA Response', value: '< 15 Minutes On-Site Hands & Feet' },
      { label: 'Video Wall', value: '32-Screen 4K Command Grid' },
      { label: 'Incident Escalation', value: 'Automated P1 SMS/PagerDuty Engine' }
    ],
    dcimLink: { tabId: 'alerting_notifications', label: 'View NOC Alert Policies & Dispatch' },
    auditChecklist: [
      'Dedicated on-site command mezzanine with visual line of sight',
      'Autonomous network operations center independent of cloud connectivity',
      'Dual-shift rotation and documented runbooks'
    ],
    isometricCoords: { x: 850, y: 240 }
  },
  {
    number: 6,
    id: 'main_power',
    title: 'Main Power Systems',
    category: 'power',
    icon: Zap,
    color: 'text-amber-400',
    accentBg: 'bg-amber-950',
    borderColor: 'border-amber-700',
    quote: 'Server cabinets should be powered by diverse and redundant power sources to reduce the chance of a power outage affecting availability.',
    specs: [
      { label: 'Utility Feed', value: 'Dual 33kV Independent Substations' },
      { label: 'Transformer Tier', value: '2x 5.0 MVA Step-Down Dry-Type' },
      { label: 'Switchgear', value: 'Main-Tie-Main Arc-Resistant' },
      { label: 'Path Diversity', value: 'Physically Separated Conduits' }
    ],
    dcimLink: { tabId: 'power_chain', label: 'Open Power Chain SLD' },
    auditChecklist: [
      'True physical path diversity from separate utility substations',
      'Automatic transfer switch (ATS) with synch check',
      'Transient voltage surge suppression (TVSS) on all main switchboards'
    ],
    isometricCoords: { x: 130, y: 220 }
  },
  {
    number: 7,
    id: 'pdus',
    title: 'Power Distribution Units (PDUs)',
    category: 'power',
    icon: Sliders,
    color: 'text-yellow-400',
    accentBg: 'bg-yellow-950',
    borderColor: 'border-yellow-700',
    quote: 'The PDUs used in a modern data center do far more than deliver power. They can also monitor power consumption and track voltage fluctuations that signal potential equipment issues.',
    specs: [
      { label: 'Capacity', value: '400kVA High-Efficiency Transformers' },
      { label: 'Branch Circuit', value: 'Intelligent BCMS with Harmonic THD' },
      { label: 'Redundancy', value: 'Dual A+B Feed Whip to Every Rack' },
      { label: 'Phase Balancing', value: '< 1.5% Maximum Imbalance' }
    ],
    dcimLink: { tabId: 'power_chain', label: 'Inspect PDU A & B Telemetry' },
    auditChecklist: [
      'Real-time circuit breaker branch monitoring down to individual poles',
      'Color-coded dual feed drops (A-Feed Red / B-Feed Blue)',
      'Isolated grounding and harmonic mitigation'
    ],
    isometricCoords: { x: 600, y: 250 }
  },
  {
    number: 8,
    id: 'ups_systems',
    title: 'UPS Systems',
    category: 'power',
    icon: BatteryCharging,
    color: 'text-emerald-400',
    accentBg: 'bg-emerald-950',
    borderColor: 'border-emerald-700',
    quote: 'Even a short-term drop or spike in power can affect availability, damage equipment, and cause data loss. UPS systems are your first line of defense. For high availability needs, look for redundant UPS systems.',
    specs: [
      { label: 'Architecture', value: '2N Modular Double-Conversion' },
      { label: 'Energy Storage', value: 'Lithium-Ion & Kinetic Flywheel' },
      { label: 'Autonomy Time', value: '18 Minutes @ 100% Megawatt Load' },
      { label: 'Online Efficiency', value: '97.2% Eco-Double Conversion' }
    ],
    dcimLink: { tabId: 'power_chain', label: 'Test 2N UPS Battery Autonomy' },
    auditChecklist: [
      'True 2N (System + System) concurrent maintainability',
      'Automated internal cell impedance testing every 60 seconds',
      'Thermal runaway prevention and FM-200 fire suppression in battery hall'
    ],
    isometricCoords: { x: 380, y: 220 }
  },
  {
    number: 9,
    id: 'backup_generators',
    title: 'Backup Generators',
    category: 'power',
    icon: Fuel,
    color: 'text-orange-400',
    accentBg: 'bg-orange-950',
    borderColor: 'border-orange-700',
    quote: 'Backup generators should provide continuous power to run the data center during utility power outage events. Data centers should also store additional fuel on site for extended generator runtime.',
    specs: [
      { label: 'Genset Fleet', value: '4x 2,500 kW Cummins Diesel' },
      { label: 'Start Time', value: '< 9.5 Seconds to Synchronized Bus' },
      { label: 'Fuel Autonomy', value: '72 Hours On-Site Underground Tanks' },
      { label: 'Refueling SLA', value: 'Guaranteed 4-Hour Priority Supply' }
    ],
    dcimLink: { tabId: 'power_chain', label: 'Simulate Utility Loss & Generator Crank' },
    auditChecklist: [
      'Regular automated load-bank testing with recorded logs',
      'Dual redundant electric and pneumatic starting systems',
      'Continuous fuel polishing and automated day-tank replenishment'
    ],
    isometricCoords: { x: 130, y: 360 }
  },
  {
    number: 10,
    id: 'carrier_neutral',
    title: 'Carrier-Neutral Networking',
    category: 'network',
    icon: Network,
    color: 'text-purple-400',
    accentBg: 'bg-purple-950',
    borderColor: 'border-purple-700',
    quote: 'Facilities offering multiple carriers for connectivity provide for high availability, choice, low latency and better disaster recovery.',
    specs: [
      { label: 'Carriers', value: '18+ Tier-1 Telecoms & Cloud On-Ramps' },
      { label: 'Meet-Me Rooms', value: 'Dual Diverse MMR-A and MMR-B' },
      { label: 'Backbone Fiber', value: '400GbE Ultra-Low Latency DWDM' },
      { label: 'Ingress Conduits', value: 'Dual Zero-Crossing Trench Lines' }
    ],
    dcimLink: { tabId: 'realtime_dashboard', label: 'View Optical Bandwidth Streams' },
    auditChecklist: [
      'Dual physically separated Meet-Me Rooms on opposite sides of the building',
      'Direct cross-connects to AWS Direct Connect, Azure ExpressRoute, GCP',
      'BGP multihoming with automated sub-second route failover'
    ],
    isometricCoords: { x: 760, y: 290 }
  },
  {
    number: 11,
    id: 'space_management',
    title: 'Customizable Space Management',
    category: 'structural',
    icon: Grid,
    color: 'text-violet-400',
    accentBg: 'bg-violet-950',
    borderColor: 'border-violet-700',
    quote: 'Thanks to high-density power and cooling options, you can operate a lot of IT equipment in a small space. Look for space options that are customizable to your needs with tight security controls.',
    specs: [
      { label: 'Rack Density', value: 'Up to 40 kW/Rack (Liquid-Ready)' },
      { label: 'Containment', value: 'Modular Rigid Cold-Aisle Pods' },
      { label: 'Security Caging', value: 'Steel Mesh Suites with Keycard/Biometrics' },
      { label: 'Overhead Raceways', value: 'Dedicated Structured Cable Routing' }
    ],
    dcimLink: { tabId: 'rack_inspector', label: 'Inspect 42U Rack Elevation' },
    auditChecklist: [
      'Variable width cold/hot aisles accommodating standard and OCP racks',
      'Tool-less blanking panel compliance to prevent air recirculation',
      'Isolated private security cages with dedicated CCTV and sub-metering'
    ],
    isometricCoords: { x: 400, y: 200 }
  },
  {
    number: 12,
    id: 'cloud_pod',
    title: 'Multitenant Cloud Pod',
    category: 'cloud',
    icon: Cloud,
    color: 'text-sky-400',
    accentBg: 'bg-sky-950',
    borderColor: 'border-sky-700',
    quote: 'A multitenant cloud pod is space in a data center with dedicated cloud computing architecture that allows customers to share cloud computing resources, while still being isolated from the other tenants. This is a self-sufficient, highly secure infrastructure within the data center.',
    specs: [
      { label: 'Virtualization', value: 'VMware vSphere 8 / OpenStack' },
      { label: 'Tenant Isolation', value: 'Hardware VXLAN & Microsegmentation' },
      { label: 'Storage Fabric', value: 'All-Flash NVMe-oF Low Latency' },
      { label: 'SLA Guarantee', value: '99.999% Compute Availability' }
    ],
    dcimLink: { tabId: 'asset_management', label: 'Explore Cloud Pod Asset Inventory' },
    auditChecklist: [
      'Strict logical and cryptographic tenant isolation',
      'Hardware-enforced TPM 2.0 and encrypted NVMe data at rest',
      'Independent metering and automated cloud burst scaling'
    ],
    isometricCoords: { x: 750, y: 190 }
  },
  {
    number: 13,
    id: 'business_continuity',
    title: 'Business Continuity Workspace',
    category: 'operations',
    icon: Users,
    color: 'text-rose-400',
    accentBg: 'bg-rose-950',
    borderColor: 'border-rose-700',
    quote: 'In the event of a disaster, your employees may need a safe place to work. Business continuity workspace gives them a place to \'set up shop\' during the recovery process. We have sites that can accommodate up to 800 people.',
    specs: [
      { label: 'Seat Capacity', value: 'Up to 800 Disaster Recovery Desks' },
      { label: 'Connectivity', value: 'Dedicated VoIP, LAN & Direct SAN' },
      { label: 'Amenities', value: 'Showers, Cafeteria, Sleep Quarters' },
      { label: 'Power Backup', value: 'Directly Tied to Facility UPS & Genset' }
    ],
    dcimLink: { tabId: 'tech_dispatch', label: 'Manage On-Site Personnel & Work Orders' },
    auditChecklist: [
      'Pre-provisioned workstations with customer software images ready',
      'Secure conference rooms and emergency crisis response communication hubs',
      'Auxiliary water, food, and sanitary reserves for prolonged disaster events'
    ],
    isometricCoords: { x: 820, y: 280 }
  },
  {
    number: 14,
    id: 'compliance',
    title: 'Compliance Certifications',
    category: 'compliance',
    icon: Award,
    color: 'text-emerald-400',
    accentBg: 'bg-emerald-950',
    borderColor: 'border-emerald-700',
    quote: 'Look for certifications that show the data center has been independently audited for compliance with privacy and security best practices such as SSAE 18 SOC 2, HIPAA, and PCI. If you don\'t see what you\'re looking for, ask.',
    specs: [
      { label: 'SOC Audits', value: 'SOC 1 Type II & SOC 2 Type II' },
      { label: 'Healthcare & Finance', value: 'HIPAA / HITECH & PCI-DSS 4.0' },
      { label: 'International', value: 'ISO 27001, ISO 22301, ISO 9001' },
      { label: 'Uptime Institute', value: 'Tier IV Fault-Tolerant Certified' }
    ],
    dcimLink: { tabId: 'asset_management', label: 'Verify Compliance & License Audits' },
    auditChecklist: [
      'Annual independent third-party SOC 2 Type II audit reports available under NDA',
      'Continuous automated compliance scanning and evidence archiving',
      'PCI-DSS physical security controls validated for payment processors'
    ],
    isometricCoords: { x: 280, y: 330 }
  }
];

export const DataCenterAnatomyView: React.FC<DataCenterAnatomyViewProps> = ({
  onNavigateToTab,
  onNavigateToRack
}) => {
  const [selectedFeatureNum, setSelectedFeatureNum] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedAuditItems, setCheckedAuditItems] = useState<Record<string, boolean>>({});

  const activeFeature = ANATOMY_FEATURES.find(f => f.number === selectedFeatureNum) || ANATOMY_FEATURES[0];

  const filteredFeatures = ANATOMY_FEATURES.filter(f => {
    const matchesCat = filterCategory === 'all' || f.category === filterCategory;
    const matchesSearch = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specs.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.value.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleChecklist = (key: string) => {
    setCheckedAuditItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalAuditChecks = ANATOMY_FEATURES.reduce((acc, f) => acc + f.auditChecklist.length, 0);
  const completedAuditChecks = Object.values(checkedAuditItems).filter(Boolean).length;
  const auditProgressPercent = Math.round((completedAuditChecks / totalAuditChecks) * 100);

  return (
    <div id="data-center-anatomy-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ENTERPRISE BLUEPRINT
              </span>
              <span className="text-xs font-mono text-slate-400">Tier-IV Hyperscale Reference</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The Anatomy of an Enterprise Data Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Based on the comprehensive 14-feature architectural standard: from reinforced structural envelopes to 2N UPS power, redundant CRAH cooling, carrier-neutral Meet-Me Rooms, and audited compliance controls.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center font-mono">
              <div className="text-xs text-slate-400">Enterprise Readiness</div>
              <div className="text-xl font-bold text-emerald-400">14 / 14 Compliant</div>
              <div className="text-[10px] text-cyan-400">Tier IV Fault Tolerant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3D Cutaway Isometric Blueprint Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Interactive 3D Cutaway Facility Model (Click Callouts ① to ⑭)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Selected: <strong className="text-cyan-300">#{activeFeature.number} {activeFeature.title}</strong>
          </span>
        </div>

        {/* SVG Isometric Diagram Representation */}
        <div className="relative w-full aspect-[16/9] max-h-[460px] bg-slate-950 rounded-xl border border-slate-800/90 overflow-hidden flex items-center justify-center p-2">
          <svg viewBox="0 0 1000 560" className="w-full h-full select-none">
            <defs>
              <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="floorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="roofAisle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Isometric Ground Grid */}
            <g opacity="0.25" stroke="#334155" strokeWidth="1">
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={`grid1-${i}`} x1={i * 60 - 100} y1="560" x2={i * 60 + 400} y2="0" />
              ))}
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={`grid2-${i}`} x1={i * 60 + 400} y1="560" x2={i * 60 - 100} y2="0" />
              ))}
            </g>

            {/* Exterior Reinforced Foundation (#1 Building Structure) */}
            <polygon
              points="120,400 480,540 920,340 560,200"
              fill="url(#floorGradient)"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Exterior Concrete Wall Cutaway */}
            <polygon
              points="120,400 120,330 480,470 480,540"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <polygon
              points="480,540 480,470 920,270 920,340"
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Rear Power Substation Yard (#6 Main Power, #9 Backup Genset) */}
            <rect x="80" y="200" width="80" height="90" rx="4" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="120" y="245" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">33kV SUBSTATION</text>
            <rect x="70" y="320" width="100" height="70" rx="6" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
            <text x="120" y="360" fill="#4ade80" fontSize="9" fontFamily="monospace" textAnchor="middle">CUMMINS DIESEL</text>

            {/* Data Hall Server Aisles (#11 Customizable Space, #12 Cloud Pod) */}
            <g transform="translate(320, 240)">
              {/* Rack Row 1 */}
              <polygon points="40,90 140,50 160,60 60,100" fill="#0284c7" stroke="#38bdf8" />
              <polygon points="60,100 160,60 160,120 60,160" fill="#0369a1" stroke="#38bdf8" />
              {/* Rack Row 2 */}
              <polygon points="100,120 200,80 220,90 120,130" fill="#4338ca" stroke="#818cf8" />
              <polygon points="120,130 220,90 220,150 120,190" fill="#3730a3" stroke="#818cf8" />
              {/* Rack Row 3 */}
              <polygon points="160,150 260,110 280,120 180,160" fill="#6d28d9" stroke="#a78bfa" />
              <polygon points="180,160 280,120 280,180 180,220" fill="#5b21b6" stroke="#a78bfa" />
              {/* Overhead Chilled Air Containment Duct (#3) */}
              <polygon points="20,70 180,10 280,50 120,110" fill="url(#roofAisle)" stroke="#06b6d4" strokeDasharray="3 3" />
            </g>

            {/* Rooftop HVAC Chiller Plant (#3 Climate Control) */}
            <g transform="translate(560, 100)">
              <rect x="0" y="0" width="180" height="70" rx="6" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
              <circle cx="45" cy="35" r="22" fill="#134e4a" stroke="#2dd4bf" strokeWidth="1.5" />
              <circle cx="135" cy="35" r="22" fill="#134e4a" stroke="#2dd4bf" strokeWidth="1.5" />
              <text x="90" y="65" fill="#2dd4bf" fontSize="9" fontFamily="monospace" textAnchor="middle">CRAH CHILLER BANK</text>
            </g>

            {/* Glass Command NOC Bridge (#5 On-site NOC, #4 BMS) */}
            <g transform="translate(740, 160)">
              <polygon points="0,60 120,10 200,40 80,90" fill="rgba(14, 165, 233, 0.25)" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="0,60 80,90 80,130 0,100" fill="rgba(2, 132, 199, 0.3)" stroke="#38bdf8" />
              <polygon points="80,90 200,40 200,80 80,130" fill="rgba(3, 105, 161, 0.4)" stroke="#38bdf8" />
              <text x="90" y="90" fill="#bae6fd" fontSize="9" fontFamily="monospace" textAnchor="middle">24x7 NOC BRIDGE</text>
            </g>

            {/* Business Continuity Desks (#13) */}
            <g transform="translate(740, 260)">
              <rect x="20" y="20" width="110" height="50" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1" />
              <text x="75" y="48" fill="#fda4af" fontSize="9" fontFamily="monospace" textAnchor="middle">DISASTER RECOVERY SUITE</text>
            </g>

            {/* INTERACTIVE PINS FOR ALL 14 CALLOUTS */}
            {ANATOMY_FEATURES.map((feature) => {
              const isSelected = activeFeature.number === feature.number;
              const { x, y } = feature.isometricCoords;

              return (
                <g
                  key={feature.number}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedFeatureNum(feature.number)}
                  filter={isSelected ? 'url(#neonGlow)' : undefined}
                >
                  {/* Outer Pulsing Ring when selected */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="19"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}

                  {/* Pin Background */}
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill={isSelected ? '#0891b2' : '#0f172a'}
                    stroke={isSelected ? '#22d3ee' : '#64748b'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />

                  {/* Pin Number */}
                  <text
                    x={x}
                    y={y + 4}
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {feature.number}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center space-x-2 flex-wrap text-xs font-mono">
          <span className="text-slate-400">Filter Domain:</span>
          {(['all', 'structural', 'security', 'thermal', 'power', 'operations', 'network', 'cloud', 'compliance'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
          <input
            type="text"
            placeholder="Search anatomy features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Main Two-Column Layout: Feature Cards List & Deep Focus Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 14 Feature Quick Select Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredFeatures.map((f) => {
            const Icon = f.icon;
            const isSelected = activeFeature.number === f.number;

            return (
              <button
                key={f.number}
                onClick={() => setSelectedFeatureNum(f.number)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                  isSelected
                    ? 'bg-slate-850 border-cyan-500/80 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {f.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">{f.title}</h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{f.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{f.quote}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Inspector Details for Selected Feature (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-start space-x-3">
              <div className={`p-3 rounded-xl ${activeFeature.accentBg} border ${activeFeature.borderColor} ${activeFeature.color} shadow-md`}>
                <activeFeature.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    FEATURE #{activeFeature.number} OF 14
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    {activeFeature.category} DOMAIN
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                  {activeFeature.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab(activeFeature.dcimLink.tabId)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 shadow-md"
            >
              <span>{activeFeature.dcimLink.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Original Infographic Text */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-cyan-400" />
              Architectural Standard Definition:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "{activeFeature.quote}"
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              NxtraDCIM Facility Operational Metrics:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {activeFeature.specs.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">{s.label}</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Verification Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Physical Facility Tour Audit Checklist:
              </h4>
              <span className="text-[10px] font-mono text-emerald-400">
                Click to verify
              </span>
            </div>

            <div className="space-y-2">
              {activeFeature.auditChecklist.map((item, idx) => {
                const key = `${activeFeature.id}-${idx}`;
                const isChecked = !!checkedAuditItems[key];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(key)}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center space-x-2.5 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Link Action Banner */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Direct DCIM Telemetry Hook:
            </span>
            <button
              onClick={() => onNavigateToTab(activeFeature.dcimLink.tabId)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>Switch directly to {activeFeature.dcimLink.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
