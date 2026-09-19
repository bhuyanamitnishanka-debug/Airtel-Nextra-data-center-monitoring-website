import { EnergySavingModification, PueSustainabilityPoint } from '../types';
import { ENRICHED_DAILY_HISTORICAL_DATA } from './historicalCapacityData';

// Generate 30 days of comprehensive PUE and sustainability telemetry
export const PUE_SUSTAINABILITY_30D_DATA: PueSustainabilityPoint[] = ENRICHED_DAILY_HISTORICAL_DATA.map((d) => {
  const totalFacilityPowerMw = Number((d.itLoadMw * d.pueRatio).toFixed(3));
  // Power distribution loss (UPS double-conversion, STS, transformers, PDU branches)
  const powerLossesMw = Math.max(0.02, Number((totalFacilityPowerMw - d.itLoadMw - d.coolingPowerMw).toFixed(3)));
  const powerLossesKw = Math.round(powerLossesMw * 1000);
  const dailyKwh = Math.round(totalFacilityPowerMw * 24 * 1000);
  // Grid carbon factor: 0.385 kg CO2e/kWh, with 68% renewable clean energy contract credit
  const carbonKg = Math.round(dailyKwh * 0.385 * (1 - 0.68));

  // Baseline UPS efficiency correlates with load
  const upsEfficiencyPercent = Number((93.5 + (d.upsLoadPercent / 100) * 2.8).toFixed(1));

  return {
    day: d.day,
    period: d.period,
    timestamp: d.timestamp,
    pueRatio: d.pueRatio,
    itLoadMw: d.itLoadMw,
    coolingPowerMw: d.coolingPowerMw,
    powerLossesKw,
    totalFacilityPowerMw,
    heatExchangerKw: d.heatExchangerKw,
    upsEfficiencyPercent,
    dailyKwh,
    carbonKg,
  };
});

// Three actionable energy-saving modifications for cooling and power distribution based on the 30-day telemetry
export const THREE_ACTIONABLE_ENERGY_MODIFICATIONS: EnergySavingModification[] = [
  {
    id: 'cooling-sat-reset',
    category: 'cooling',
    title: 'Supply Air Temperature (SAT) Elevation & Economizer Window Extension',
    subsystemTarget: 'Rooftop Heat Exchangers & Chilled Water Loop (Cooling & HVAC)',
    currentCondition:
      '30-day telemetry reveals rooftop heat rejection climbed from 2,040 kW (Day 1) to 2,785 kW (Day 30), pushing cooling power draw from 0.38 MW to 0.53 MW. Cold aisle sensors currently maintain 19.8°C–20.4°C, well below the ASHRAE TC 9.9 A1 recommended upper bound of 27.0°C (80.6°F).',
    actionProposed:
      'Elevate primary CRAH supply air temperature (SAT) setpoint from 20.0°C to 23.5°C and raise chilled water delivery temperature from 8.5°C to 12.0°C across Data Hall Alpha.',
    technicalMechanism:
      'Thermodynamic analysis confirms that each 1°C increase in chilled water temperature yields a 3.2% chiller compressor efficiency improvement. Raising the water setpoint expands the ambient wet-bulb free-cooling economizer envelope by ~1,850 hours per year, running chillers at partial load or dry-cooler bypass.',
    projectedPueDelta: -0.026,
    projectedKwReduction: 74,
    annualKwhSaved: 648240,
    annualCostSavingsUsd: 71306,
    annualCarbonAvoidanceMt: 249.6,
    paybackPeriodMonths: 0.5,
    implementationRisk: 'low',
    complexity: 'low',
    ashraeStandardCompliance: 'ASHRAE Standard 90.4-2022 & TC 9.9 Class A1 Recommended Thermal Envelope (18°C - 27°C)',
    sopSteps: [
      'Inspect cold aisle containment seals and brush grommets across Aisles A through E to prevent air bypass.',
      'Increment CRAH 01 through 06 supply air setpoint by 0.5°C every 24 hours until reaching 23.5°C.',
      'Continuously poll top-of-rack (42U) server intake thermistors to confirm no compute node exceeds 25.0°C.',
      'Modulate 3-way chilled water mixing valves to optimize plate-and-frame rooftop heat exchanger free-cooling.',
    ],
  },
  {
    id: 'cooling-ec-fan-vfd',
    category: 'cooling',
    title: 'Automated CRAH EC Fan Variable Speed Differential Pressure Trimming',
    subsystemTarget: 'Underfloor Plenum & CRAH Variable Speed EC Blowers (Cooling)',
    currentCondition:
      'Sub-floor static pressure hovers at +23.8 to +24.4 Pa while rack occupancy varies between 71.3% and 85.0%. Constant-speed EC fans produce static overpressure in lightly loaded aisles, creating high air bypass velocities and wasted parasitic blower power.',
    actionProposed:
      'Deploy dynamic closed-loop CRAH EC fan speed trim governed by a target differential pressure setpoint of +19.5 Pa, modulated in real-time by rack Delta-T telemetry (11.5°C - 14.3°C).',
    technicalMechanism:
      'In accordance with Fan Affinity Laws (Power ∝ RPM³), reducing blower fan speed by just 14% delivers a ~35% drop in motor electric power consumption. Panning the plenum pressure from +24 Pa to +19.5 Pa eliminates turbulent leakage without starving 42U top servers.',
    projectedPueDelta: -0.018,
    projectedKwReduction: 51,
    annualKwhSaved: 446760,
    annualCostSavingsUsd: 49144,
    annualCarbonAvoidanceMt: 172.0,
    paybackPeriodMonths: 1.8,
    implementationRisk: 'low',
    complexity: 'medium',
    ashraeStandardCompliance: 'ASHRAE TC 9.9 Thermal Guidelines for Airflow Management & Variable Air Volume Operation',
    sopSteps: [
      'Recalibrate 12 sub-floor differential pressure transducer sensors across primary cable tray risers.',
      'Program the BMS PID loop with a setpoint of +19.5 Pa and a 90-second integration time constant to prevent fan hunting.',
      'Establish a 55% minimum fan speed floor to guarantee adequate laminar airflow across low-profile heatsinks.',
      'Run a 48-hour validation test during peak AI batch training periods (14:00 - 18:00 UTC) verifying temperature stability.',
    ],
  },
  {
    id: 'power-ups-eco-mode',
    category: 'power_distribution',
    title: 'Intelligent 2N Modular UPS Eco-Mode & PDU Phase Load Balancing',
    subsystemTarget: 'Dual-Feed 2N Rotary/Static UPS Power Chain & PDUs (Power Distribution)',
    currentCondition:
      '2N UPS power chain telemetry indicates that both Train A and Train B operate at 50.8% - 68.0% capacity in continuous double-conversion mode. At 50% load, double-conversion efficiency drops to ~94.2% due to semiconductor switching losses and transformer magnetizing current.',
    actionProposed:
      'Enable Intelligent Multi-Mode / Advanced Eco-Mode on UPS Train B during off-peak computing windows (00:00 - 06:00 UTC) with seamless sub-2ms static bypass transfer, accompanied by branch circuit phase load balancing on the 208V floor PDUs.',
    technicalMechanism:
      'In High-Efficiency line-interactive mode, critical IT load is fed directly from conditioned utility power with active harmonic filtering and inverter standby, raising operating efficiency from 94.2% to 98.8%. The sub-2ms thyristor static transfer switch comfortably satisfies the 20ms ITIC/CBEMA power supply ride-through curve.',
    projectedPueDelta: -0.016,
    projectedKwReduction: 45,
    annualKwhSaved: 394200,
    annualCostSavingsUsd: 43362,
    annualCarbonAvoidanceMt: 151.8,
    paybackPeriodMonths: 0.2,
    implementationRisk: 'low',
    complexity: 'low',
    ashraeStandardCompliance: 'IEEE Standard 1100 (Emerald Book) & The Green Grid PUE Category 2 (PUE_L2 Standard)',
    sopSteps: [
      'Perform infrared thermography audit and phase current balance check across all 42U rack PDU branch breakers (ensure phase imbalance < 3.0%).',
      'Test static transfer switch (STS) dynamic transfer time under 100% simulated step load to confirm sub-2ms transfer.',
      'Configure automated SCADA schedule to activate High-Efficiency mode on Train B during 00:00 - 06:00 UTC, guarded by utility voltage THD tripwire (< 3.0%).',
      'Maintain Train A in continuous double-conversion mode at all times to preserve 2N fault-tolerant architecture.',
    ],
  },
];

// Helper to compute simulated PUE and savings based on active modification IDs
export const computeSimulatedPueDataset = (
  basePoints: PueSustainabilityPoint[],
  activeModificationIds: string[]
): {
  simulatedData: PueSustainabilityPoint[];
  totalPueReduction: number;
  totalKwReduction: number;
  totalAnnualKwhSaved: number;
  totalAnnualCostSavedUsd: number;
  totalAnnualCarbonAvoidedMt: number;
} => {
  const activeMods = THREE_ACTIONABLE_ENERGY_MODIFICATIONS.filter((m) =>
    activeModificationIds.includes(m.id)
  );

  const totalPueReduction = Number(
    activeMods.reduce((acc, m) => acc + Math.abs(m.projectedPueDelta), 0).toFixed(3)
  );
  const totalKwReduction = activeMods.reduce((acc, m) => acc + m.projectedKwReduction, 0);
  const totalAnnualKwhSaved = activeMods.reduce((acc, m) => acc + m.annualKwhSaved, 0);
  const totalAnnualCostSavedUsd = activeMods.reduce((acc, m) => acc + m.annualCostSavingsUsd, 0);
  const totalAnnualCarbonAvoidedMt = Number(
    activeMods.reduce((acc, m) => acc + m.annualCarbonAvoidanceMt, 0).toFixed(1)
  );

  const simulatedData = basePoints.map((point) => {
    // If no mods are active, simulated matches baseline
    if (activeMods.length === 0) {
      return {
        ...point,
        simulatedPueRatio: point.pueRatio,
      };
    }

    const simulatedPueRatio = Number(Math.max(1.06, point.pueRatio - totalPueReduction).toFixed(3));
    return {
      ...point,
      simulatedPueRatio,
    };
  });

  return {
    simulatedData,
    totalPueReduction,
    totalKwReduction,
    totalAnnualKwhSaved,
    totalAnnualCostSavedUsd,
    totalAnnualCarbonAvoidedMt,
  };
};
