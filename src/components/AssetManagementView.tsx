import React, { useState } from 'react';
import { 
  Package, 
  Server, 
  Network, 
  HardDrive, 
  Key, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Download,
  Eye,
  Sliders,
  Cpu,
  Layers,
  MapPin,
  User
} from 'lucide-react';
import { 
  Asset, 
  AssetCategory, 
  NetworkAssetFields, 
  ServerAssetFields, 
  SoftwareLicenseAssetFields, 
  StorageAssetFields 
} from '../types';

interface AssetManagementViewProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onUpdateAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
  onNavigateToRack: (rackId: string) => void;
}

export const AssetManagementView: React.FC<AssetManagementViewProps> = ({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onNavigateToRack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  
  // Modals
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Asset Form State
  const [newCategory, setNewCategory] = useState<AssetCategory>('server');
  const [newName, setNewName] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newStatus, setNewStatus] = useState<Asset['status']>('operational');
  const [newNotes, setNewNotes] = useState('');
  
  // Server-specific
  const [newProcessor, setNewProcessor] = useState('2x Intel Xeon Platinum 8480+');
  const [newRam, setNewRam] = useState(512);
  const [newStorage, setNewStorage] = useState('8x 3.84TB NVMe SSD');
  const [newIp, setNewIp] = useState('10.100.2.25');
  const [newAisle, setNewAisle] = useState('Aisle B (Cloud Compute)');
  const [newRackId, setNewRackId] = useState('B-04');
  const [newUPosition, setNewUPosition] = useState('U20-U21');

  // Network-specific
  const [newSubType, setNewSubType] = useState<'switch' | 'router' | 'firewall'>('switch');
  const [newPortsTotal, setNewPortsTotal] = useState(48);
  const [newPortsActive, setNewPortsActive] = useState(42);
  const [newFirmware, setNewFirmware] = useState('EOS 4.28.3F');

  // Storage-specific
  const [newStorageType, setNewStorageType] = useState<'SAN' | 'NAS' | 'NVMe-oF' | 'Object'>('SAN');
  const [newTotalCapacity, setNewTotalCapacity] = useState(480);
  const [newUsedCapacity, setNewUsedCapacity] = useState(240);
  const [newRaid, setNewRaid] = useState('RAID-DP');

  // Software license-specific
  const [newVendor, setNewVendor] = useState('VMware / Broadcom');
  const [newVersion, setNewVersion] = useState('vSphere 8 Enterprise');
  const [newTotalSeats, setNewTotalSeats] = useState(64);
  const [newUsedSeats, setNewUsedSeats] = useState(48);
  const [newExpiry, setNewExpiry] = useState('2027-12-31');
  const [newLicenseType, setNewLicenseType] = useState<'Per-Core' | 'Per-Socket' | 'Per-User' | 'Enterprise'>('Per-Core');

  // Filter logic
  const filteredAssets = assets.filter((asset) => {
    const matchesCat = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || asset.status === selectedStatus;
    
    let locationStr = '';
    if (asset.category !== 'software_license') {
      locationStr = (asset as any).location?.aisle || '';
    }
    const matchesLoc = selectedLocation === 'all' || locationStr.toLowerCase().includes(selectedLocation.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      asset.name.toLowerCase().includes(q) ||
      asset.assetTag.toLowerCase().includes(q) ||
      ((asset as any).model && (asset as any).model.toLowerCase().includes(q)) ||
      ((asset as any).serialNumber && (asset as any).serialNumber.toLowerCase().includes(q)) ||
      ((asset as any).owner && (asset as any).owner.toLowerCase().includes(q));

    return matchesCat && matchesStat && matchesLoc && matchesQuery;
  });

  const handleOpenAddModal = (cat: AssetCategory = 'server') => {
    setNewCategory(cat);
    setNewName('');
    setNewModel('');
    setNewSerial(`SN-${Math.floor(100000 + Math.random() * 900000)}`);
    setNewOwner('Nxtra Cloud Operations');
    setNewStatus('operational');
    setNewNotes('');
    setShowAddModal(true);
  };

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseId = `AST-${newCategory.slice(0, 3).toUpperCase()}-${Math.floor(500 + Math.random() * 500)}`;
    const baseTag = `DC-${newCategory.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let created: Asset;

    if (newCategory === 'server') {
      created = {
        id: baseId,
        assetTag: baseTag,
        name: newName || `${newModel} Node`,
        category: 'server',
        status: newStatus,
        model: newModel || 'Dell PowerEdge R760 2U',
        serialNumber: newSerial,
        processor: newProcessor,
        ramGb: Number(newRam),
        storageInfo: newStorage,
        ipAddress: newIp,
        location: { aisle: newAisle, rackId: newRackId, uPosition: newUPosition },
        owner: newOwner,
        purchaseDate: '2025-01-15',
        warrantyExpiry: '2028-01-15',
        notes: newNotes,
        lastUpdated: 'Just now',
      };
    } else if (newCategory === 'network_device') {
      created = {
        id: baseId,
        assetTag: baseTag,
        name: newName || `${newModel} Network Appliance`,
        category: 'network_device',
        subType: newSubType,
        status: newStatus,
        model: newModel || 'Arista 7060CX 100G Switch',
        serialNumber: newSerial,
        ipAddress: newIp,
        portsTotal: Number(newPortsTotal),
        portsActive: Number(newPortsActive),
        firmwareVersion: newFirmware,
        location: { aisle: newAisle, rackId: newRackId, uPosition: newUPosition },
        owner: newOwner,
        notes: newNotes,
        lastUpdated: 'Just now',
      };
    } else if (newCategory === 'storage_device') {
      created = {
        id: baseId,
        assetTag: baseTag,
        name: newName || `${newModel} Storage Array`,
        category: 'storage_device',
        storageType: newStorageType,
        status: newStatus,
        model: newModel || 'NetApp AFF A900 All-Flash SAN',
        serialNumber: newSerial,
        totalCapacityTb: Number(newTotalCapacity),
        usedCapacityTb: Number(newUsedCapacity),
        raidType: newRaid,
        ipAddress: newIp,
        location: { aisle: newAisle, rackId: newRackId, uPosition: newUPosition },
        owner: newOwner,
        notes: newNotes,
        lastUpdated: 'Just now',
      };
    } else {
      created = {
        id: baseId,
        assetTag: baseTag,
        name: newName || `${newVendor} License Pool`,
        category: 'software_license',
        status: newStatus,
        vendor: newVendor,
        version: newVersion,
        licenseKeyMasked: 'LIC-KEY-XXXX-XXXX-99A1',
        totalSeats: Number(newTotalSeats),
        usedSeats: Number(newUsedSeats),
        expiryDate: newExpiry,
        assignedAssets: ['Assigned across active hypervisors'],
        licenseType: newLicenseType,
        notes: newNotes,
        lastUpdated: 'Just now',
      };
    }

    onAddAsset(created);
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case 'server':
        return <Server className="w-4 h-4 text-cyan-400" />;
      case 'network_device':
        return <Network className="w-4 h-4 text-indigo-400" />;
      case 'storage_device':
        return <HardDrive className="w-4 h-4 text-purple-400" />;
      case 'software_license':
        return <Key className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusBadge = (st: Asset['status']) => {
    switch (st) {
      case 'operational':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'maintenance':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'degraded':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'offline':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'decommissioned':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div id="asset-management-system" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-700 text-indigo-400 shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Data Center Asset Management (CMDB Inventory)
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                Lifecycle & Physical Tracking
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Comprehensive inventory tracking for Servers, Core Network Switches & Routers, SAN/NAS Storage, and Software Licenses.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-add-new-asset"
            onClick={() => handleOpenAddModal('server')}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Asset</span>
          </button>
        </div>
      </div>

      {/* Category Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedCategory('server')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'server'
              ? 'bg-cyan-950/70 border-cyan-500 shadow-md'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Servers</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {assets.filter((a) => a.category === 'server').length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Compute & GPU nodes</div>
        </button>

        <button
          onClick={() => setSelectedCategory('network_device')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'network_device'
              ? 'bg-indigo-950/70 border-indigo-500 shadow-md'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Network</span>
            <Network className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {assets.filter((a) => a.category === 'network_device').length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Spine/Leaf, Firewalls</div>
        </button>

        <button
          onClick={() => setSelectedCategory('storage_device')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'storage_device'
              ? 'bg-purple-950/70 border-purple-500 shadow-md'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Storage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {assets.filter((a) => a.category === 'storage_device').length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">SAN & NAS Pools (3.48 PB)</div>
        </button>

        <button
          onClick={() => setSelectedCategory('software_license')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'software_license'
              ? 'bg-amber-950/70 border-amber-500 shadow-md'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Licenses</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {assets.filter((a) => a.category === 'software_license').length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">VMware, RHEL, NVIDIA</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            id="input-asset-search"
            type="text"
            placeholder="Search by name, model, serial, asset tag, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 flex-wrap text-xs font-mono">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="server">Servers</option>
              <option value="network_device">Network Devices</option>
              <option value="storage_device">Storage Devices</option>
              <option value="software_license">Software Licenses</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="degraded">Degraded</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Aisle:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-slate-200 focus:outline-none"
            >
              <option value="all">All Aisles</option>
              <option value="Aisle A">Aisle A (AI SuperPOD)</option>
              <option value="Aisle B">Aisle B (Cloud Compute)</option>
              <option value="Aisle C">Aisle C (SAN Storage)</option>
              <option value="Aisle D">Aisle D (Optical Meet-Me)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 font-mono text-xs">
            No assets match current search criteria.
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              {/* Top Row: Tag, Type & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                    {getCategoryIcon(asset.category)}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400">{asset.assetTag}</span>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{asset.category.replace('_', ' ')}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(asset.status)}`}>
                  {asset.status}
                </span>
              </div>

              {/* Title & Model */}
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{asset.name}</h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {(asset as any).model || (asset as any).version}
                </div>
              </div>

              {/* Category-Specific Specifications Box */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
                {asset.category === 'server' && (
                  <>
                    <div className="text-slate-300 truncate">
                      <strong className="text-slate-500">CPU:</strong> {(asset as ServerAssetFields).processor}
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>RAM: <strong className="text-cyan-300">{(asset as ServerAssetFields).ramGb} GB</strong></span>
                      <span>IP: <strong className="text-white">{(asset as ServerAssetFields).ipAddress}</strong></span>
                    </div>
                  </>
                )}

                {asset.category === 'network_device' && (
                  <>
                    <div className="text-slate-300">
                      <strong className="text-slate-500">Type:</strong> {(asset as NetworkAssetFields).subType.toUpperCase()} • {(asset as NetworkAssetFields).firmwareVersion}
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Ports: <strong className="text-indigo-300">{(asset as NetworkAssetFields).portsActive}/{(asset as NetworkAssetFields).portsTotal} Active</strong></span>
                      <span>IP: <strong className="text-white">{(asset as NetworkAssetFields).ipAddress}</strong></span>
                    </div>
                  </>
                )}

                {asset.category === 'storage_device' && (
                  <>
                    <div className="text-slate-300">
                      <strong className="text-slate-500">Pool:</strong> {(asset as StorageAssetFields).storageType} • {(asset as StorageAssetFields).raidType}
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Capacity: <strong className="text-purple-300">{(asset as StorageAssetFields).usedCapacityTb} / {(asset as StorageAssetFields).totalCapacityTb} TB</strong></span>
                      <span className="text-slate-400">{Math.round(((asset as StorageAssetFields).usedCapacityTb / (asset as StorageAssetFields).totalCapacityTb) * 100)}% Used</span>
                    </div>
                  </>
                )}

                {asset.category === 'software_license' && (
                  <>
                    <div className="text-slate-300">
                      <strong className="text-slate-500">Vendor:</strong> {(asset as SoftwareLicenseAssetFields).vendor}
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Seats: <strong className="text-amber-300">{(asset as SoftwareLicenseAssetFields).usedSeats} / {(asset as SoftwareLicenseAssetFields).totalSeats} Used</strong></span>
                      <span>Expires: <strong className="text-slate-200">{(asset as SoftwareLicenseAssetFields).expiryDate}</strong></span>
                    </div>
                  </>
                )}
              </div>

              {/* Location & Owner Footprint */}
              {asset.category !== 'software_license' ? (
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1 text-cyan-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{(asset as any).location?.rackId} ({(asset as any).location?.uPosition})</span>
                  </div>
                  <div className="truncate max-w-[130px]" title={(asset as any).owner}>
                    {(asset as any).owner}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Type: {(asset as SoftwareLicenseAssetFields).licenseType}</span>
                  <span className="text-amber-400">License Valid</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setDetailAsset(asset)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center space-x-1">
                  {asset.category !== 'software_license' && (asset as any).location?.rackId && (
                    <button
                      onClick={() => onNavigateToRack((asset as any).location.rackId)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Inspect in 42U Elevation"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteAsset(asset.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Asset Detail Drawer / Modal */}
      {detailAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800">
                  {getCategoryIcon(detailAsset.category)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{detailAsset.name}</h3>
                  <div className="text-xs font-mono text-cyan-400">{detailAsset.assetTag} • {detailAsset.id}</div>
                </div>
              </div>
              <button
                onClick={() => setDetailAsset(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 uppercase text-[10px]">Operational Status:</span>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(detailAsset.status)}`}>
                      {detailAsset.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px]">Last Audit Sync:</span>
                  <div className="text-slate-200 mt-0.5">{detailAsset.lastUpdated}</div>
                </div>
              </div>

              {/* Full Specs Breakdown */}
              {detailAsset.category === 'server' && (
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Server Architecture Specifications</div>
                  <div>Model: <strong className="text-white">{(detailAsset as ServerAssetFields).model}</strong></div>
                  <div>Serial Number: <strong className="text-cyan-300">{(detailAsset as ServerAssetFields).serialNumber}</strong></div>
                  <div>Processor: <strong className="text-white">{(detailAsset as ServerAssetFields).processor}</strong></div>
                  <div>Installed RAM: <strong className="text-cyan-300">{(detailAsset as ServerAssetFields).ramGb} GB DDR5 ECC</strong></div>
                  <div>Internal Storage: <strong className="text-white">{(detailAsset as ServerAssetFields).storageInfo}</strong></div>
                  <div>Management IP: <strong className="text-emerald-400">{(detailAsset as ServerAssetFields).ipAddress}</strong></div>
                  <div>Physical Location: <strong className="text-white">{(detailAsset as ServerAssetFields).location.aisle} • Cabinet {(detailAsset as ServerAssetFields).location.rackId} ({(detailAsset as ServerAssetFields).location.uPosition})</strong></div>
                  <div>Owner / Tenant: <strong className="text-white">{(detailAsset as ServerAssetFields).owner}</strong></div>
                  <div>Warranty Valid Until: <strong className="text-emerald-400">{(detailAsset as ServerAssetFields).warrantyExpiry}</strong></div>
                </div>
              )}

              {detailAsset.category === 'network_device' && (
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Network Device Hardware</div>
                  <div>Appliance Type: <strong className="text-white">{(detailAsset as NetworkAssetFields).subType.toUpperCase()}</strong></div>
                  <div>Model: <strong className="text-white">{(detailAsset as NetworkAssetFields).model}</strong></div>
                  <div>Serial Number: <strong className="text-cyan-300">{(detailAsset as NetworkAssetFields).serialNumber}</strong></div>
                  <div>Firmware / OS: <strong className="text-indigo-300">{(detailAsset as NetworkAssetFields).firmwareVersion}</strong></div>
                  <div>Port Density: <strong className="text-white">{(detailAsset as NetworkAssetFields).portsActive} active of {(detailAsset as NetworkAssetFields).portsTotal} total</strong></div>
                  <div>Management IP: <strong className="text-emerald-400">{(detailAsset as NetworkAssetFields).ipAddress}</strong></div>
                  <div>Location: <strong className="text-white">Cabinet {(detailAsset as NetworkAssetFields).location.rackId}</strong></div>
                  <div>Owner: <strong className="text-white">{(detailAsset as NetworkAssetFields).owner}</strong></div>
                </div>
              )}

              {detailAsset.category === 'storage_device' && (
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Storage Array Configuration</div>
                  <div>Architecture: <strong className="text-white">{(detailAsset as StorageAssetFields).storageType}</strong></div>
                  <div>Model: <strong className="text-white">{(detailAsset as StorageAssetFields).model}</strong></div>
                  <div>Serial Number: <strong className="text-cyan-300">{(detailAsset as StorageAssetFields).serialNumber}</strong></div>
                  <div>Usable Capacity: <strong className="text-purple-300">{(detailAsset as StorageAssetFields).usedCapacityTb} TB / {(detailAsset as StorageAssetFields).totalCapacityTb} TB</strong></div>
                  <div>RAID & Protection: <strong className="text-white">{(detailAsset as StorageAssetFields).raidType}</strong></div>
                  <div>Storage Controller IP: <strong className="text-emerald-400">{(detailAsset as StorageAssetFields).ipAddress}</strong></div>
                  <div>Rack Location: <strong className="text-white">Cabinet {(detailAsset as StorageAssetFields).location.rackId} ({(detailAsset as StorageAssetFields).location.uPosition})</strong></div>
                  <div>Tenant / Client: <strong className="text-white">{(detailAsset as StorageAssetFields).owner}</strong></div>
                </div>
              )}

              {detailAsset.category === 'software_license' && (
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">License Compliance & Allocation</div>
                  <div>Software Vendor: <strong className="text-white">{(detailAsset as SoftwareLicenseAssetFields).vendor}</strong></div>
                  <div>Version: <strong className="text-white">{(detailAsset as SoftwareLicenseAssetFields).version}</strong></div>
                  <div>License Key: <strong className="text-amber-400">{(detailAsset as SoftwareLicenseAssetFields).licenseKeyMasked}</strong></div>
                  <div>Allocation: <strong className="text-white">{(detailAsset as SoftwareLicenseAssetFields).usedSeats} / {(detailAsset as SoftwareLicenseAssetFields).totalSeats} seats ({(detailAsset as SoftwareLicenseAssetFields).licenseType})</strong></div>
                  <div>Expiration Date: <strong className="text-emerald-400">{(detailAsset as SoftwareLicenseAssetFields).expiryDate}</strong></div>
                  <div>Assigned Assets:</div>
                  <ul className="list-disc list-inside text-slate-300 pl-2">
                    {(detailAsset as SoftwareLicenseAssetFields).assignedAssets.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {detailAsset.notes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-slate-500 block mb-1">Operational Notes:</strong>
                  {detailAsset.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              {detailAsset.category !== 'software_license' && (detailAsset as any).location?.rackId && (
                <button
                  onClick={() => {
                    const rId = (detailAsset as any).location.rackId;
                    setDetailAsset(null);
                    onNavigateToRack(rId);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Cabinet {(detailAsset as any).location.rackId} in Rack Inspector</span>
                </button>
              )}

              <button
                onClick={() => setDetailAsset(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono ml-auto"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Register New Infrastructure Asset
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Asset Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AssetCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="server">Compute / GPU Server</option>
                    <option value="network_device">Network Switch / Router / Firewall</option>
                    <option value="storage_device">SAN / NAS Storage Array</option>
                    <option value="software_license">Enterprise Software License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Asset Display Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dell PowerEdge R760 Hypervisor"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Hardware Model:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PowerEdge R760 2U"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Serial Number:</label>
                  <input
                    type="text"
                    required
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              {/* Dynamic inputs based on Category */}
              {newCategory === 'server' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Processor Specs:</label>
                      <input
                        type="text"
                        value={newProcessor}
                        onChange={(e) => setNewProcessor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">RAM (GB):</label>
                      <input
                        type="number"
                        value={newRam}
                        onChange={(e) => setNewRam(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Internal Disks:</label>
                      <input
                        type="text"
                        value={newStorage}
                        onChange={(e) => setNewStorage(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Management IP Address:</label>
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {newCategory === 'network_device' && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Type:</label>
                    <select
                      value={newSubType}
                      onChange={(e) => setNewSubType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      <option value="switch">Switch (Spine/Leaf)</option>
                      <option value="router">Edge Router</option>
                      <option value="firewall">Next-Gen Firewall</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Total Ports:</label>
                    <input
                      type="number"
                      value={newPortsTotal}
                      onChange={(e) => setNewPortsTotal(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Firmware OS:</label>
                    <input
                      type="text"
                      value={newFirmware}
                      onChange={(e) => setNewFirmware(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {newCategory === 'storage_device' && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Storage Type:</label>
                    <select
                      value={newStorageType}
                      onChange={(e) => setNewStorageType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      <option value="SAN">All-Flash SAN</option>
                      <option value="NAS">Enterprise NAS</option>
                      <option value="NVMe-oF">NVMe-over-Fabrics</option>
                      <option value="Object">Object Storage Pool</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Capacity (TB):</label>
                    <input
                      type="number"
                      value={newTotalCapacity}
                      onChange={(e) => setNewTotalCapacity(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Protection:</label>
                    <input
                      type="text"
                      value={newRaid}
                      onChange={(e) => setNewRaid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {newCategory !== 'software_license' ? (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Aisle Location:</label>
                    <select
                      value={newAisle}
                      onChange={(e) => setNewAisle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      <option value="Aisle A (AI/ML SuperPOD)">Aisle A (AI SuperPOD)</option>
                      <option value="Aisle B (Cloud Compute)">Aisle B (Cloud Compute)</option>
                      <option value="Aisle C (SAN Storage)">Aisle C (SAN Storage)</option>
                      <option value="Aisle D (Optical Meet-Me)">Aisle D (Meet-Me)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Target Cabinet:</label>
                    <input
                      type="text"
                      value={newRackId}
                      onChange={(e) => setNewRackId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Rack U-Slots:</label>
                    <input
                      type="text"
                      value={newUPosition}
                      onChange={(e) => setNewUPosition(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Vendor:</label>
                    <input
                      type="text"
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Total Seats:</label>
                    <input
                      type="number"
                      value={newTotalSeats}
                      onChange={(e) => setNewTotalSeats(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Expiry Date:</label>
                    <input
                      type="date"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Owner / Tenant:</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="degraded">Degraded</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Asset Operational Notes:</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Deployment notes, dual-power cord verification, support contracts..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
