import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  RotateCw, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Thermometer, 
  Fan, 
  Network, 
  ArrowLeft,
  Wrench,
  Activity,
  Sliders,
  Power
} from 'lucide-react';
import { Rack, ServerDevice, WorkOrder } from '../types';

interface RackInspectorViewProps {
  rack: Rack;
  allRacks: Rack[];
  onSelectRack: (rack: Rack) => void;
  onBackToHall: () => void;
  onUpdateDevice: (rackId: string, deviceId: string, updates: Partial<ServerDevice>) => void;
  onCreateWorkOrder: (wo: Omit<WorkOrder, 'id' | 'createdTime'>) => void;
}

export const RackInspectorView: React.FC<RackInspectorViewProps> = ({
  rack,
  allRacks,
  onSelectRack,
  onBackToHall,
  onUpdateDevice,
  onCreateWorkOrder,
}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(rack.devices[0]?.id || '');
  const [doorView, setDoorView] = useState<'front' | 'rear'>('front');
  const [isRebooting, setIsRebooting] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const selectedDevice = rack.devices.find((d) => d.id === selectedDeviceId) || rack.devices[0];

  const handleToggleBeacon = (dev: ServerDevice) => {
    const nextVal = !dev.beaconLocate;
    onUpdateDevice(rack.id, dev.id, { beaconLocate: nextVal });
    showNotice(`Locate Beacon LED ${nextVal ? 'ACTIVATED (Chassis beacon flashing on floor)' : 'DEACTIVATED'}`);
  };

  const handleToggleMaintenance = (dev: ServerDevice) => {
    const nextVal = !dev.maintenanceMode;
    onUpdateDevice(rack.id, dev.id, { 
      maintenanceMode: nextVal,
      status: nextVal ? 'maintenance' : 'online'
    });
    showNotice(`Server ${dev.name} set to ${nextVal ? 'MAINTENANCE MODE' : 'NORMAL PRODUCTION'}`);
  };

  const handleSoftReboot = (dev: ServerDevice) => {
    setIsRebooting(true);
    showNotice(`IPMI/iLO BMC Soft Reboot command dispatched to ${dev.name}...`);
    onUpdateDevice(rack.id, dev.id, { status: 'warning', cpuUsage: 12 });
    
    setTimeout(() => {
      setIsRebooting(false);
      onUpdateDevice(rack.id, dev.id, { status: 'online', cpuUsage: 45 });
      showNotice(`Server ${dev.name} reboot completed successfully. POST OK.`);
    }, 2800);
  };

  const handleDispatchTech = (dev: ServerDevice) => {
    onCreateWorkOrder({
      title: `Inspect & Diagnostic Check: ${dev.name} in ${rack.name}`,
      priority: 'p2_high',
      rackLocation: `${rack.name} (U${dev.uPosition})`,
      deviceTarget: dev.id,
      assignedTo: 'Rajesh Kumar',
      status: 'pending',
      actionType: 'hardware_swap',
      description: `Investigate telemetry indicators on ${dev.model} (S/N: ${dev.serialNumber}). Connect crash cart KVM for local console inspection.`,
    });
    showNotice(`Work Order dispatched to Crash Cart field engineer for ${dev.name}!`);
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Helper to color device bezel based on type
  const getDeviceBezelStyle = (device: ServerDevice) => {
    const isSelected = selectedDeviceId === device.id;
    const isFlashingBeacon = device.beaconLocate;

    let baseBg = 'bg-slate-800 border-slate-700';
    if (device.type === 'gpu_node') baseBg = 'bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-emerald-600/70';
    if (device.type === 'spine_switch' || device.type === 'leaf_switch') baseBg = 'bg-gradient-to-r from-blue-950/90 via-slate-900 to-blue-950/90 border-blue-600/70';
    if (device.type === 'san_storage') baseBg = 'bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 border-purple-600/70';
    if (device.type === 'patch_panel') baseBg = 'bg-slate-900 border-slate-700';

    return `${baseBg} ${isSelected ? 'ring-2 ring-cyan-400 border-cyan-400 z-10' : ''} ${
      isFlashingBeacon ? 'ring-4 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.9)] animate-pulse' : ''
    }`;
  };

  return (
    <div id="rack-elevation-inspector" className="space-y-4">
      {/* Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            id="btn-back-to-hall-map"
            onClick={onBackToHall}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Floorplan</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                42U Cabinet Elevation: <span className="text-cyan-400 font-mono">{rack.name}</span>
              </h2>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                rack.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              }`}>
                {rack.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Aisle: {rack.aisleId} • Row {rack.row} • Client: {rack.clientName} • Containment: Cold Aisle Roof
            </p>
          </div>
        </div>

        {/* Rack Switcher & Door Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              id="btn-toggle-front-door"
              onClick={() => setDoorView('front')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                doorView === 'front' ? 'bg-cyan-600 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Front (Bezel)
            </button>
            <button
              id="btn-toggle-rear-door"
              onClick={() => setDoorView('rear')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                doorView === 'rear' ? 'bg-cyan-600 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Rear (Cables & PSU)
            </button>
          </div>

          <select
            id="select-active-rack"
            value={rack.id}
            onChange={(e) => {
              const found = allRacks.find((r) => r.id === e.target.value);
              if (found) onSelectRack(found);
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {allRacks.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.currentKw}kW - {r.clientName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500 text-cyan-200 text-xs flex items-center justify-between animate-fadeIn shadow-lg">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
            <strong className="text-white">BMC Event:</strong> {actionNotice}
          </span>
          <span className="text-[10px] font-mono text-cyan-400">ACKNOWLEDGED</span>
        </div>
      )}

      {/* Main Grid: Left 42U Rack Frame, Right Device Telemetry & Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Authentic 42U Server Rack Chassis */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          {/* Top of Cabinet Exhaust & Cable Waterfall Indicator */}
          <div className="mb-4 pb-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              OVERHEAD MPO FIBER WATERFALL TRAY
            </span>
            <span>TOP EXHAUST TEMP: {rack.currentTempC + 4}°C</span>
          </div>

          <div className="flex gap-3">
            {/* Left PDU Strip Feed A */}
            <div className="w-14 bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between text-[9px] font-mono text-slate-400 shrink-0 select-none">
              <div className="text-center font-bold text-cyan-400 border-b border-slate-800 pb-1">
                PDU A<br />
                <span className="text-[8px] text-slate-500">{rack.pduAVolts}V</span>
              </div>
              <div className="space-y-1.5 py-2 text-center">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]"></span>
                    <span className="text-[8px] text-slate-400">C19</span>
                  </div>
                ))}
              </div>
              <div className="text-center font-bold text-emerald-400 border-t border-slate-800 pt-1">
                {rack.pduAAmps}A
              </div>
            </div>

            {/* 42U Vertical Chassis Column */}
            <div className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 shadow-inner relative flex flex-col justify-between">
              {/* Outer structural rack posts with screw holes */}
              <div className="space-y-1.5">
                {rack.devices.map((device) => {
                  const isSelected = selectedDeviceId === device.id;
                  const isGpu = device.type === 'gpu_node';
                  const isSwitch = device.type === 'spine_switch' || device.type === 'leaf_switch';
                  const isStorage = device.type === 'san_storage';

                  return (
                    <div
                      key={device.id}
                      id={`device-slot-${device.id}`}
                      onClick={() => setSelectedDeviceId(device.id)}
                      className={`rounded-lg p-2 border transition-all cursor-pointer relative select-none ${getDeviceBezelStyle(
                        device
                      )}`}
                    >
                      {/* U Height indicator */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] text-cyan-400 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                            U{device.uPosition} ({device.uHeight}U)
                          </span>
                          <span className="font-bold text-xs text-white truncate max-w-[180px] sm:max-w-[240px]">
                            {device.name}
                          </span>
                        </div>

                        {/* Status Beacon or Active Pip */}
                        <div className="flex items-center space-x-2">
                          {device.beaconLocate && (
                            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-600 animate-bounce">
                              LOCATE ON
                            </span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${
                            device.status === 'online' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' :
                            device.status === 'warning' ? 'bg-amber-400 animate-ping' :
                            'bg-blue-400'
                          }`}></span>
                        </div>
                      </div>

                      {/* Visual Chassis Hardware Graphic Details */}
                      <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="truncate">{device.model}</span>
                        <span className="text-cyan-300 shrink-0">{device.powerWatts}W • {device.tempCelsius}°C</span>
                      </div>

                      {/* Hardware Front Ports Graphic Representation */}
                      <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-hidden">
                        {isSwitch ? (
                          <div className="flex items-center gap-1 w-full">
                            {Array.from({ length: 16 }).map((_, pi) => (
                              <span 
                                key={pi} 
                                className={`h-2 flex-1 rounded-[1px] ${
                                  pi % 3 === 0 ? 'bg-emerald-400 shadow-[0_0_3px_#34d399]' : 'bg-cyan-500/70'
                                }`}
                              ></span>
                            ))}
                          </div>
                        ) : isGpu ? (
                          <div className="flex items-center justify-between w-full text-[9px] text-emerald-400">
                            <span>8x SXM5 GPU MODULES</span>
                            <span className="text-slate-400">400G NDR INFINIBAND</span>
                          </div>
                        ) : isStorage ? (
                          <div className="flex items-center gap-1 w-full">
                            {Array.from({ length: 12 }).map((_, bi) => (
                              <span key={bi} className="h-2 flex-1 bg-purple-600/60 rounded-[1px] border border-purple-500/40"></span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full text-[9px] text-slate-400">
                            <span>DUAL XEON • 2.5" SAS/NVMe BAYS</span>
                            <span className="text-slate-500">IDRAC / IPMI</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-floor Plenum Delivery */}
              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>SUB-FLOOR AIR INTAKE: {rack.currentTempC - 2}°C</span>
                <span className="text-emerald-400 font-semibold">+23.8 Pa PRESSURE</span>
              </div>
            </div>

            {/* Right PDU Strip Feed B */}
            <div className="w-14 bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between text-[9px] font-mono text-slate-400 shrink-0 select-none">
              <div className="text-center font-bold text-blue-400 border-b border-slate-800 pb-1">
                PDU B<br />
                <span className="text-[8px] text-slate-500">{rack.pduBVolts}V</span>
              </div>
              <div className="space-y-1.5 py-2 text-center">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.8)]"></span>
                    <span className="text-[8px] text-slate-400">C19</span>
                  </div>
                ))}
              </div>
              <div className="text-center font-bold text-cyan-400 border-t border-slate-800 pt-1">
                {rack.pduBAmps}A
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Device Telemetry & Remote Control Console */}
        <div className="lg:col-span-6 space-y-4">
          {selectedDevice ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {selectedDevice.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                      selectedDevice.status === 'online' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                      selectedDevice.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                      'bg-blue-950 text-blue-300 border border-blue-700'
                    }`}>
                      {selectedDevice.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Model: <strong className="text-slate-200">{selectedDevice.model}</strong> • S/N: {selectedDevice.serialNumber}
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{selectedDevice.ipAddress}</span>
                  <div className="text-[10px] text-slate-500">BMC Out-of-Band</div>
                </div>
              </div>

              {/* Real-time Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* CPU Utilization */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      CPU Load
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedDevice.cpuUsage}%
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        selectedDevice.cpuUsage > 85 ? 'bg-amber-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${selectedDevice.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                {/* RAM Utilization */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                      RAM Usage
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedDevice.ramUsage}%
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-purple-400"
                      style={{ width: `${selectedDevice.ramUsage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Power Draw */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Power Draw
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-amber-300">
                    {selectedDevice.powerWatts} <span className="text-xs font-normal text-slate-400">W</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Dual 2400W Platinum PSUs
                  </div>
                </div>

                {/* Thermal Die Temp */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                      Chassis Temp
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-blue-300">
                    {selectedDevice.tempCelsius}° <span className="text-xs font-normal text-slate-400">C</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Fan className="w-3 h-3 text-cyan-400 animate-spin" />
                    {selectedDevice.fanSpeedRpm} RPM
                  </div>
                </div>
              </div>

              {/* Operating System & Fabric Interfaces */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>OS Environment:</span>
                  <strong className="text-white">{selectedDevice.os}</strong>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-cyan-400" />
                    Network Fabrics & Optical Uplinks:
                  </div>
                  {selectedDevice.networkInterfaces.map((nic, idx) => (
                    <div 
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]"></span>
                        <span className="text-slate-200">{nic.name}</span>
                        <span className="text-cyan-400 font-semibold">{nic.speedGbps} Gbps</span>
                      </div>
                      <span className="text-slate-400">
                        {(nic.trafficMbps / 1000).toFixed(2)} Gbps Active Rate
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IPMI / BMC Internal Functionality Actions */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Out-of-Band IPMI & Floor Operations Controls:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Locate Beacon LED */}
                  <button
                    id="btn-toggle-beacon-led"
                    onClick={() => handleToggleBeacon(selectedDevice)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedDevice.beaconLocate
                        ? 'bg-blue-900/80 border-blue-400 text-white shadow-lg shadow-blue-900/50'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Radio className={`w-4 h-4 ${selectedDevice.beaconLocate ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <div>Chassis Locate Beacon</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {selectedDevice.beaconLocate ? 'Flashing blue on physical rack' : 'Turn on LED for field tech'}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold">
                      {selectedDevice.beaconLocate ? 'Active' : 'Off'}
                    </span>
                  </button>

                  {/* Soft Reboot / Power Cycle */}
                  <button
                    id="btn-soft-reboot-device"
                    disabled={isRebooting}
                    onClick={() => handleSoftReboot(selectedDevice)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2">
                      <RotateCw className={`w-4 h-4 text-cyan-400 ${isRebooting ? 'animate-spin' : ''}`} />
                      <div className="text-left">
                        <div>{isRebooting ? 'Rebooting...' : 'BMC Soft Reboot'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Simulate IPMI chassis power cycle</div>
                      </div>
                    </div>
                    <Power className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Toggle Maintenance Mode */}
                  <button
                    id="btn-toggle-maintenance-mode"
                    onClick={() => handleToggleMaintenance(selectedDevice)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedDevice.maintenanceMode
                        ? 'bg-amber-950 border-amber-600 text-amber-200'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className={`w-4 h-4 ${selectedDevice.maintenanceMode ? 'text-amber-400' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <div>Maintenance Mode</div>
                        <div className="text-[10px] text-slate-400 font-normal">Isolate workload routing</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold">
                      {selectedDevice.maintenanceMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </button>

                  {/* Dispatch Crash Cart Tech */}
                  <button
                    id="btn-dispatch-field-tech"
                    onClick={() => handleDispatchTech(selectedDevice)}
                    className="p-3 rounded-xl bg-gradient-to-r from-blue-900/80 to-indigo-900/80 hover:from-blue-800 hover:to-indigo-800 border border-blue-500/60 text-white text-xs font-semibold flex items-center justify-between transition-all shadow-md"
                  >
                    <div className="flex items-center space-x-2">
                      <Wrench className="w-4 h-4 text-cyan-300" />
                      <div className="text-left">
                        <div>Dispatch Crash Cart</div>
                        <div className="text-[10px] text-blue-200 font-normal">Create work order for floor tech</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-300">Dispatch</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm font-mono">
              Select a device chassis in the 42U rack elevation to view hardware telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
