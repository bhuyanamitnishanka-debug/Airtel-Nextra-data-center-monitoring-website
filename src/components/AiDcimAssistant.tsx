import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Zap, 
  Thermometer, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { DataCenterMetrics, Rack } from '../types';

interface AiDcimAssistantProps {
  metrics: DataCenterMetrics;
  racks: Rack[];
  onOpenRackById: (rackId: string) => void;
}

interface QueryResponse {
  query: string;
  answer: string;
  recommendedAction?: { label: string; action: () => void };
}

export const AiDcimAssistant: React.FC<AiDcimAssistantProps> = ({
  metrics,
  racks,
  onOpenRackById,
}) => {
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<QueryResponse[]>([
    {
      query: 'Analyze current facility PUE and cooling efficiency',
      answer: `**Facility PUE Audit: 1.18** (Hyperscale Benchmark)\n- IT Power Load: ${metrics.totalItLoadMw.toFixed(2)} MW\n- Cooling Infrastructure: ${(metrics.coolingLoadMw * 1000).toFixed(0)} kW\n- Sub-floor static pressure: +${metrics.floorPressurePa} Pa (Sealed cold-aisle containment is preventing hot air recirculation).\n\n**Actionable Optimization:** Switching CRAH-04 (Aisle D Carrier Meet-Me) to Eco mode could reduce auxiliary cooling consumption by 14.2 kW without raising intake air beyond 21.0°C.`,
    },
    {
      query: 'What is the root cause of the warning in Cabinet B-04?',
      answer: `**Root-Cause Diagnosis for Cabinet B-04:**\n- **Symptom:** Exhaust temperature reading 37.8°C (Delta T = +17.4°C over supply).\n- **Telemetry correlation:** PDU-B branch current spiked to 24.1A on Phase L2. Server U28 is drawing peak compute load (94% CPU).\n- **Physical Inspection:** Technician Rajesh Kumar reported that a blanking panel on U30 was dislodged, causing a localized hot air vortex.\n- **Recommendation:** Keep Crash Cart #2 attached until the replacement blanking panel is secured and confirm exhaust drops below 34°C.`,
      recommendedAction: {
        label: 'Open Cabinet B-04 Elevation Inspector',
        action: () => onOpenRackById('B-04'),
      },
    },
  ]);

  const quickPrompts = [
    'How does cold-aisle containment reduce data center PUE?',
    'Perform real-time phase balance health check on UPS String A & B',
    'Calculate potential energy savings from Free Cooling Economizer',
    'Evaluate Tier IV concurrent maintainability compliance',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || userInput;
    if (!q.trim()) return;

    setIsAnalyzing(true);
    setUserInput('');

    setTimeout(() => {
      let ans = '';
      let recAction: QueryResponse['recommendedAction'] = undefined;

      const lower = q.toLowerCase();
      if (lower.includes('containment') || lower.includes('pue')) {
        ans = `**Cold Aisle Containment (CAC) Architecture:**\n- In the facility photo, notice the enclosed ceiling panels over the server rows. CAC isolates the cold supply air (delivered at 20.2°C via perforated floor tiles at +23.8 Pa) from the server exhaust air (32°C to 38°C).\n- **Elimination of Hot Spots:** Prevents hot air from looping back into server front air intakes, allowing cooling supply temperatures to safely be raised from 15°C to 20°C.\n- **PUE Impact:** Lowers chiller compressor workload by ~22%, driving the facility PUE to an industry-leading **1.18**.`;
      } else if (lower.includes('phase') || lower.includes('ups')) {
        ans = `**UPS & Electrical Phase Balancing Audit:**\n- **String A:** L1 (54.2%), L2 (53.8%), L3 (55.0%) -> **0.8% Imbalance** (Ideal < 3.0%)\n- **String B:** L1 (52.8%), L2 (53.1%), L3 (53.4%) -> **0.6% Imbalance**\n- **Power Factor:** ${metrics.powerFactor.toFixed(2)} (Nearly pure unity).\n- **Assessment:** Dual rotary/lithium-ion battery strings are in optimal health with 48+ minutes full-load autonomy in the event of grid failure.`;
      } else if (lower.includes('economizer') || lower.includes('free cooling')) {
        ans = `**Water-Side Economizer Simulation:**\n- When outdoor wet-bulb temperature drops below 16°C, cooling towers can chill water without running energy-intensive centrifugal chiller compressors.\n- **Projected Savings:** Saves approximately 180 kW of electrical power, dropping PUE from 1.18 to **1.13** during cooler night cycles.`;
      } else if (lower.includes('tier iv') || lower.includes('maintainability')) {
        ans = `**Tier IV Fault Tolerance Certification:**\n- **2(N+1) Redundancy:** 2 independent 33kV utility feeds, dual 2500kVA Cummins gensets, and 2N UPS String A/B feeds ensure that ANY power or cooling component can be taken offline for maintenance with **zero disruption** to active IT workloads.`;
      } else {
        ans = `**DCIM Telemetry Analysis for: "${q}"**\n- Hall Alpha is operating normally across 48 cabinets and 4 aisles.\n- Total Active IT Compute: ${metrics.totalItLoadMw.toFixed(2)} MW.\n- High-Density AI Pod (Aisle A) running at 32.4kW/rack nominal without thermal throttle.\n- All systems compliant with ASHRAE TC 9.9 thermal envelopes.`;
      }

      setHistory((prev) => [...prev, { query: q, answer: ans, recommendedAction: recAction }]);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div id="ai-dcim-assistant-view" className="space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-600 text-slate-950 font-bold shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                AI Infrastructure & Telemetry Diagnostic Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                Nxtra Cognitive DCIM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Continuous thermal modeling, predictive equipment health & automated PUE optimization.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Real-time Telemetry Stream Synced</span>
        </div>
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Quick Inquiries:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-mono whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Conversation / Diagnostic Cards */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-3">
              {/* User Query */}
              <div className="flex items-start justify-end">
                <div className="bg-cyan-950/80 border border-cyan-700/80 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xl text-xs font-mono text-cyan-200 shadow-md">
                  {item.query}
                </div>
              </div>

              {/* AI Diagnostic Response */}
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-900 border border-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-200 leading-relaxed shadow-md flex-1 space-y-3">
                  <div className="whitespace-pre-line font-mono text-[12px]">
                    {item.answer}
                  </div>

                  {item.recommendedAction && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={item.recommendedAction.action}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-colors"
                      >
                        {item.recommendedAction.label} →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center space-x-3 text-xs font-mono text-cyan-400 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing thermodynamic CFD model and electrical phase matrix...</span>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
          <input
            id="input-ai-dcim-query"
            type="text"
            placeholder="Ask AI DCIM anything (e.g. thermal modeling, PUE reduction, rack capacity planning)..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />

          <button
            id="btn-send-ai-dcim-query"
            onClick={() => handleSend()}
            disabled={isAnalyzing || !userInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Analyze</span>
          </button>
        </div>
      </div>
    </div>
  );
};
