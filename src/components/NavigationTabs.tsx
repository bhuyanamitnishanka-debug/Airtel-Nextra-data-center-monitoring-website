import React from 'react';
import { 
  Layers, 
  Server, 
  Zap, 
  Thermometer, 
  AlertTriangle, 
  Wrench, 
  Bot,
  Activity,
  Bell,
  Package,
  Building2,
  TrendingUp,
  ShieldAlert,
  Leaf
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  alertCount: number;
  activeWorkOrdersCount: number;
  assetsCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  alertCount,
  activeWorkOrdersCount,
  assetsCount,
}) => {
  const tabs = [
    {
      id: 'anatomy_14_features',
      label: 'Facility Anatomy',
      icon: Building2,
      badge: '14 Core',
      badgeColor: 'bg-cyan-600 text-slate-950 font-bold',
      description: '14-Feature Enterprise Blueprint',
    },
    {
      id: 'realtime_dashboard',
      label: 'Real-Time Feeds',
      icon: Activity,
      description: 'Live Servers, Environment, Power & Traffic',
    },
    {
      id: 'capacity_trends',
      label: '30-Day Trends',
      icon: TrendingUp,
      badge: 'Recharts',
      badgeColor: 'bg-emerald-600 text-slate-950 font-bold',
      description: '30-Day IT Load MW & Rack Capacity %',
    },
    {
      id: 'energy_sustainability',
      label: 'Energy & PUE',
      icon: Leaf,
      badge: '1.18 PUE',
      badgeColor: 'bg-teal-600 text-slate-950 font-bold',
      description: '30-Day PUE Trends & 3 Actionable Energy-Saving Modifications',
    },
    {
      id: 'alerting_notifications',
      label: 'Alerts & Policies',
      icon: Bell,
      badge: alertCount > 0 ? alertCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      description: 'Tripwires & Multi-Channel SMS/Email',
    },
    {
      id: 'noc_alerts',
      label: 'NOC Bridge & Trends',
      icon: ShieldAlert,
      badge: 'Proactive PM',
      badgeColor: 'bg-emerald-600 text-slate-950 font-bold',
      description: 'Historical Trends, 8 DC Parts & PM Tasks',
    },
    {
      id: 'asset_management',
      label: 'Asset Inventory',
      icon: Package,
      badge: assetsCount ? assetsCount : undefined,
      badgeColor: 'bg-indigo-600 text-white',
      description: 'Servers, Network, Storage & Licenses',
    },
    {
      id: 'hall_map',
      label: 'Hall 2.5D Floorplan',
      icon: Layers,
      description: 'Aisles, Containment & Heatmap',
    },
    {
      id: 'rack_inspector',
      label: '42U Rack Elevation',
      icon: Server,
      description: 'Chassis, PDU & Beacon Diagnostics',
    },
    {
      id: 'power_chain',
      label: 'Power Chain SLD',
      icon: Zap,
      description: 'Grid, UPS 2N & Genset',
    },
    {
      id: 'cooling_hvac',
      label: 'Cooling & HVAC SCADA',
      icon: Thermometer,
      description: 'CRAH Units, Chiller & Plenum Pa',
    },
    {
      id: 'tech_dispatch',
      label: 'Field Techs & WOs',
      icon: Wrench,
      badge: activeWorkOrdersCount > 0 ? activeWorkOrdersCount : undefined,
      badgeColor: 'bg-blue-500 text-white',
      description: 'Crash Carts & Operations',
    },
    {
      id: 'ai_optimizer',
      label: 'AI DCIM Engine',
      icon: Bot,
      description: 'Smart PUE & Anomaly Engine',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 sticky top-[89px] z-30 shadow-md">
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-500/80 text-cyan-300 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-850 hover:bg-slate-800/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
