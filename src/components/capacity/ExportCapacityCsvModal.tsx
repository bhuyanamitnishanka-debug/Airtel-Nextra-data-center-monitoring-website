import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Table, 
  Calendar, 
  Layers, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Zap, 
  Fan, 
  Network,
  Sparkles,
  Info
} from 'lucide-react';
import { HistoricalDataPoint } from '../../types';

interface ExportCapacityCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyData: HistoricalDataPoint[];
  weeklyData: HistoricalDataPoint[];
  projectedData?: HistoricalDataPoint[];
  currentGranularity: 'daily' | 'weekly';
}

interface ColumnOption {
  id: string;
  label: string;
  category: 'core' | 'working_flow';
  defaultSelected: boolean;
  getValue: (d: any) => string | number;
}

export const ExportCapacityCsvModal: React.FC<ExportCapacityCsvModalProps> = ({
  isOpen,
  onClose,
  dailyData,
  weeklyData,
  projectedData,
  currentGranularity,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<'current' | 'daily' | 'weekly' | 'projection'>('current');
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [exportSuccessToast, setExportSuccessToast] = useState<string | null>(null);

  // Column definitions including Server Rack Working Flow metrics and AI Projection indicators
  const availableColumns: ColumnOption[] = useMemo(
    () => [
      // Core Facility Metrics
      { id: 'period', label: 'Period ID', category: 'core', defaultSelected: true, getValue: (d) => d.period },
      { id: 'timestamp', label: 'Date / Horizon', category: 'core', defaultSelected: true, getValue: (d) => d.timestamp },
      { id: 'recordType', label: 'Data Type (Historical vs AI Projected)', category: 'core', defaultSelected: true, getValue: (d) => d.isProjection ? 'AI Projected' : 'Historical Actual' },
      { id: 'itLoadMw', label: 'IT Load (MW)', category: 'core', defaultSelected: true, getValue: (d) => d.itLoadMw },
      { id: 'projectedItLoadMw', label: 'AI Linear Regression Fit (MW)', category: 'core', defaultSelected: false, getValue: (d) => d.projectedItLoadMw || d.regressionFitItLoadMw || d.itLoadMw },
      { id: 'itLoadPeakMw', label: 'Peak IT Load (MW)', category: 'core', defaultSelected: true, getValue: (d) => d.itLoadPeakMw },
      { id: 'rackCapacityPercent', label: 'Rack Capacity (%)', category: 'core', defaultSelected: true, getValue: (d) => d.rackCapacityPercent },
      { id: 'occupiedRacks', label: 'Occupied Racks (of 240)', category: 'core', defaultSelected: true, getValue: (d) => `${d.occupiedRacks}/${d.totalRacks}` },
      { id: 'pueRatio', label: 'PUE Ratio', category: 'core', defaultSelected: true, getValue: (d) => d.pueRatio },
      { id: 'heatExchangerKw', label: 'Rooftop Rejection (kW)', category: 'core', defaultSelected: false, getValue: (d) => d.heatExchangerKw },
      { id: 'upsLoadPercent', label: '2N UPS Load (%)', category: 'core', defaultSelected: false, getValue: (d) => d.upsLoadPercent },
      { id: 'coolingPowerMw', label: 'Chiller Power (MW)', category: 'core', defaultSelected: false, getValue: (d) => d.coolingPowerMw },

      // Server Rack Working Flow Metrics (from diagram)
      { id: 'clientRequests', label: 'Client Requests (Req/sec)', category: 'working_flow', defaultSelected: true, getValue: (d) => d.clientRequestsPerSec || 165000 },
      { id: 'dataServed', label: 'Data Served to Clients (Gbps)', category: 'working_flow', defaultSelected: true, getValue: (d) => d.dataServedGbps || 88.5 },
      { id: 'cpuProcessing', label: 'CPU Processing Unit (%)', category: 'working_flow', defaultSelected: true, getValue: (d) => d.cpuProcessingPercent || 68.4 },
      { id: 'ramMemory', label: 'RAM System Memory (%)', category: 'working_flow', defaultSelected: true, getValue: (d) => d.ramMemoryPercent || 74.2 },
      { id: 'storageIops', label: 'SSD/NVMe Persistent IOPS', category: 'working_flow', defaultSelected: true, getValue: (d) => d.storageIops || 56400 },
      { id: 'storageThroughput', label: 'Persistent Throughput (MB/s)', category: 'working_flow', defaultSelected: false, getValue: (d) => d.storageThroughputMBs || 920 },
      { id: 'pduBranchAmps', label: 'Base PDU Branch Draw (Amps)', category: 'working_flow', defaultSelected: true, getValue: (d) => d.pduBranchAmps || 27.8 },
      { id: 'airflowCfm', label: 'Cooling System Airflow (CFM)', category: 'working_flow', defaultSelected: true, getValue: (d) => d.airflowCfm || 2650 },
      { id: 'rackDeltaTemp', label: 'Rack Exhaust Delta T (°C)', category: 'working_flow', defaultSelected: false, getValue: (d) => d.rackDeltaTempC || 12.4 },
    ],
    []
  );

  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>(() =>
    availableColumns.filter((c) => c.defaultSelected).map((c) => c.id)
  );

  if (!isOpen) return null;

  // Resolve target dataset
  const targetData = useMemo(() => {
    if (selectedDataset === 'daily') return dailyData;
    if (selectedDataset === 'weekly') return weeklyData;
    if (selectedDataset === 'projection') return projectedData || dailyData;
    return currentGranularity === 'daily' ? dailyData : weeklyData;
  }, [selectedDataset, currentGranularity, dailyData, weeklyData, projectedData]);

  // Generate CSV String
  const generateCsvContent = (): string => {
    const activeCols = availableColumns.filter((c) => selectedColumnIds.includes(c.id));
    const lines: string[] = [];

    if (includeHeaders) {
      const headerLine = activeCols.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(delimiter);
      lines.push(headerLine);
    }

    targetData.forEach((row) => {
      const rowLine = activeCols
        .map((c) => {
          const val = c.getValue(row);
          if (typeof val === 'string' && (val.includes(delimiter) || val.includes('"') || val.includes('\n'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(delimiter);
      lines.push(rowLine);
    });

    return lines.join('\n');
  };

  const csvContent = generateCsvContent();
  const previewLines = csvContent.split('\n').slice(0, 6);

  const handleDownloadCsv = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    const dsName = selectedDataset === 'current' ? currentGranularity : selectedDataset;
    link.href = url;
    link.download = `nxtra_capacity_trends_${dsName}_${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setExportSuccessToast(`CSV exported: ${targetData.length} records downloaded.`);
    setTimeout(() => setExportSuccessToast(null), 4000);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(csvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleColumn = (colId: string) => {
    setSelectedColumnIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumnIds(availableColumns.map((c) => c.id));
  };

  const handleResetDefaultColumns = () => {
    setSelectedColumnIds(availableColumns.filter((c) => c.defaultSelected).map((c) => c.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="export-capacity-csv-modal"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Export Historical Capacity Trends (CSV)
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  RFC-4180 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Download continuous 30-day facility telemetry &amp; server rack working flow metrics for external BI, Excel, or DCIM forecasting.
              </p>
            </div>
          </div>

          <button
            id="btn-close-csv-export-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Dataset Horizon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Select Time Horizon &amp; Granularity:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDataset('current')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDataset === 'current'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Current View</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 uppercase">
                    {currentGranularity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Exports exactly what is shown on screen ({targetData.length} records)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDataset('daily')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDataset === 'daily'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Full 30-Day Daily</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                    30 Records
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  High-fidelity daily data points tracking IT load growth and rack deployments
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDataset('weekly')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDataset === 'weekly'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">5-Week Aggregated</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-400 border border-slate-800">
                    5 Records
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Macro-level weekly capacity rollups and weekly average power metrics
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDataset('projection')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDataset === 'projection'
                    ? 'bg-violet-950/60 border-violet-500 shadow-md ring-1 ring-violet-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span>AI 30-Day Forecast</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-violet-400 border border-slate-800">
                    {projectedData ? projectedData.length : 60} Records
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Historical 30-day baseline + 30-day forward linear regression projection
                </p>
              </button>
            </div>
          </div>

          {/* Column Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Customize Columns to Export ({selectedColumnIds.length} of {availableColumns.length} selected):</span>
              </label>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="text-cyan-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleResetDefaultColumns}
                  className="text-slate-400 hover:text-slate-200 hover:underline"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Core Facility Metrics */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Facility &amp; Capacity Core Metrics:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableColumns
                  .filter((c) => c.category === 'core')
                  .map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center space-x-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 hover:border-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColumnIds.includes(col.id)}
                        onChange={() => handleToggleColumn(col.id)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950"
                      />
                      <span className="truncate">{col.label}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* Server Rack Working Flow Metrics (from uploaded image) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Server Rack Working Flow Metrics (from Diagram Architecture):
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  CPU • RAM • NVMe • PDU • Airflow
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableColumns
                  .filter((c) => c.category === 'working_flow')
                  .map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center space-x-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 hover:border-emerald-700/60"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColumnIds.includes(col.id)}
                        onChange={() => handleToggleColumn(col.id)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
                      />
                      <span className="truncate">{col.label}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* Delimiter & Formatting Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">Delimiter:</span>
              {(
                [
                  { label: 'Comma (,)', value: ',' },
                  { label: 'Semicolon (;)', value: ';' },
                  { label: 'Tab (TSV)', value: '\t' },
                ] as const
              ).map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDelimiter(d.value)}
                  className={`px-2.5 py-1 rounded-md border transition-all ${
                    delimiter === d.value
                      ? 'bg-cyan-600 text-slate-950 border-cyan-500 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950"
                />
                <span className="text-slate-300">Include Header Row</span>
              </label>
            </div>
          </div>

          {/* Live CSV Code Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Live CSV Output Preview (First {previewLines.length} lines shown):
              </span>
              <span>{targetData.length} records total • ~{(csvContent.length / 1024).toFixed(1)} KB</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {previewLines.map((line, idx) => (
                <div key={idx} className={idx === 0 && includeHeaders ? 'text-amber-300 font-bold' : ''}>
                  {line}
                </div>
              ))}
              {csvContent.split('\n').length > 6 && (
                <div className="text-slate-600 italic mt-1">... and {csvContent.split('\n').length - 6} more rows</div>
              )}
            </div>
          </div>

          {/* Success Toast */}
          {exportSuccessToast && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportSuccessToast}</span>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready to import into Excel, PowerBI, Tableau, or Prometheus</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              id="btn-copy-csv-clipboard"
              type="button"
              onClick={handleCopyToClipboard}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              id="btn-download-csv-action"
              type="button"
              onClick={handleDownloadCsv}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV File (.csv)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
