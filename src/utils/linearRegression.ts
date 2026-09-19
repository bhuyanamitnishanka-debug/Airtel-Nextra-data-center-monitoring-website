/**
 * Utility for Linear Regression calculations and 30-Day AI Capacity Forecasting.
 * Uses Ordinary Least Squares (OLS) to fit historical telemetry and project future trends.
 */

import { HistoricalDataPoint } from '../types';

export interface LinearRegressionResult {
  slope: number; // m
  intercept: number; // b
  rSquared: number; // R²
  pearsonR: number; // r
  stdError: number; // standard error of estimate
  formula: string; // e.g. "y = 0.0214x + 2.1840"
  dailyGrowthRate: number; // unit per day
  monthlyGrowthRate: number; // unit per 30 days
  predict: (x: number) => number;
  predictBounds: (x: number, confidenceMultiplier?: number) => { lower: number; upper: number };
}

export interface CapacityMilestoneAlert {
  title: string;
  metric: string;
  targetThreshold: string;
  daysRemaining: number | null;
  projectedDate: string | null;
  severity: 'critical' | 'warning' | 'info';
  statusText: string;
}

export interface CapacityProjectionSummary {
  itLoadRegression: LinearRegressionResult;
  rackCapacityRegression: LinearRegressionResult;
  currentItLoadMw: number;
  projectedItLoad30dMw: number;
  itLoadGrowthMw30d: number;
  itLoadGrowthPercent30d: number;
  currentRackPercent: number;
  projectedRackPercent30d: number;
  rackGrowthPercent30d: number;
  projectedOccupiedRacks30d: number;
  daysToPowerCap3_6Mw: number | null;
  daysToRackWarning90Pct: number | null;
  daysToRackFull100Pct: number | null;
  milestones: CapacityMilestoneAlert[];
}

export interface ProjectedDataPoint extends HistoricalDataPoint {
  isProjection?: boolean;
  regressionFitItLoadMw?: number;
  historicalItLoadMw?: number;
  projectedItLoadMw?: number;
  projectedItLoadUpperMw?: number;
  projectedItLoadLowerMw?: number;
  historicalRackCapacityPercent?: number;
  projectedRackCapacityPercent?: number;
}

/**
 * Calculates Ordinary Least Squares (OLS) Linear Regression for given X and Y sets.
 */
export function calculateLinearRegression(x: number[], y: number[]): LinearRegressionResult {
  const n = x.length;
  if (n < 2) {
    return {
      slope: 0,
      intercept: y[0] || 0,
      rSquared: 0,
      pearsonR: 0,
      stdError: 0,
      formula: 'y = 0',
      dailyGrowthRate: 0,
      monthlyGrowthRate: 0,
      predict: () => y[0] || 0,
      predictBounds: () => ({ lower: y[0] || 0, upper: y[0] || 0 }),
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² and Standard Error
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;

  for (let i = 0; i < n; i++) {
    const yHat = slope * x[i] + intercept;
    ssTot += Math.pow(y[i] - meanY, 2);
    ssRes += Math.pow(y[i] - yHat, 2);
  }

  const rSquared = ssTot !== 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1;
  const stdError = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

  const numXVar = Math.sqrt(Math.max(0, n * sumX2 - sumX * sumX));
  const numYVar = Math.sqrt(Math.max(0, n * sumY2 - sumY * sumY));
  const pearsonR = numXVar * numYVar !== 0 ? (n * sumXY - sumX * sumY) / (numXVar * numYVar) : 0;

  const predict = (xi: number) => slope * xi + intercept;
  const predictBounds = (xi: number, confidenceMultiplier = 1.96) => {
    const pred = predict(xi);
    // Leverage-adjusted standard error for prediction interval
    const meanX = sumX / n;
    const ssX = sumX2 - (sumX * sumX) / n;
    const leverage = ssX !== 0 ? 1 + 1 / n + Math.pow(xi - meanX, 2) / ssX : 1;
    const margin = confidenceMultiplier * stdError * Math.sqrt(leverage);
    return {
      lower: Number((pred - margin).toFixed(2)),
      upper: Number((pred + margin).toFixed(2)),
    };
  };

  const formula = `y = ${slope >= 0 ? '' : '-'}${Math.abs(slope).toFixed(4)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(4)}`;

  return {
    slope,
    intercept,
    rSquared: Number(rSquared.toFixed(4)),
    pearsonR: Number(pearsonR.toFixed(4)),
    stdError: Number(stdError.toFixed(4)),
    formula,
    dailyGrowthRate: Number(slope.toFixed(4)),
    monthlyGrowthRate: Number((slope * 30).toFixed(4)),
    predict,
    predictBounds,
  };
}

/**
 * Generates an extended dataset containing historical data points fitted with the regression curve
 * and an appended 30-day future projection window.
 */
export function generateCapacityProjections(
  historicalData: HistoricalDataPoint[],
  projectionDays: number = 30
): {
  projectedData: ProjectedDataPoint[];
  summary: CapacityProjectionSummary;
} {
  const xValues = historicalData.map((d) => d.day);
  const itLoadY = historicalData.map((d) => d.itLoadMw);
  const rackCapY = historicalData.map((d) => d.rackCapacityPercent);

  const itLoadRegression = calculateLinearRegression(xValues, itLoadY);
  const rackCapRegression = calculateLinearRegression(xValues, rackCapY);

  const lastPoint = historicalData[historicalData.length - 1];
  const lastDay = lastPoint.day;

  // Format date helper for projected points
  const baseDate = new Date(); // anchor to current timestamp

  // 1. Enrich historical data with linear fit values
  const historicalWithFit: ProjectedDataPoint[] = historicalData.map((d) => {
    const fitVal = Number(itLoadRegression.predict(d.day).toFixed(2));
    return {
      ...d,
      isProjection: false,
      regressionFitItLoadMw: fitVal,
      historicalItLoadMw: d.itLoadMw,
      historicalRackCapacityPercent: d.rackCapacityPercent,
      // For chart continuity, bridge the last historical point with the projection series
      projectedItLoadMw: d.day === lastDay ? d.itLoadMw : undefined,
      projectedRackCapacityPercent: d.day === lastDay ? d.rackCapacityPercent : undefined,
    };
  });

  // 2. Generate future 30-day projection points
  const futurePoints: ProjectedDataPoint[] = [];

  for (let i = 1; i <= projectionDays; i++) {
    const futureDay = lastDay + i;
    const futureDate = new Date(baseDate);
    futureDate.setDate(baseDate.getDate() + i);

    const itLoadPred = Number(itLoadRegression.predict(futureDay).toFixed(2));
    const bounds = itLoadRegression.predictBounds(futureDay, 1.65); // 90% confidence interval
    const rackPred = Number(Math.min(100, Math.max(0, rackCapRegression.predict(futureDay))).toFixed(1));
    const occupiedRacksPred = Math.min(240, Math.round((rackPred / 100) * 240));

    // Correlated future metrics
    const correlatedHeatKw = Math.round(itLoadPred * 645);
    const correlatedUpsLoad = Number(Math.min(100, (itLoadPred / 4.2) * 100).toFixed(1));
    const correlatedFiberGbps = Number((itLoadPred * 41.5).toFixed(1));
    const pueEstimated = Number((1.17 + (itLoadPred - 2.5) * 0.015).toFixed(2));

    futurePoints.push({
      period: `Day +${i}`,
      day: futureDay,
      timestamp: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      itLoadMw: itLoadPred, // set for general reader
      itLoadPeakMw: Number((itLoadPred * 1.14).toFixed(2)),
      rackCapacityPercent: rackPred,
      occupiedRacks: occupiedRacksPred,
      totalRacks: 240,
      heatExchangerKw: correlatedHeatKw,
      upsLoadPercent: correlatedUpsLoad,
      networkFiberGbps: correlatedFiberGbps,
      coolingPowerMw: Number((itLoadPred * 0.17).toFixed(2)),
      pueRatio: pueEstimated,
      isProjection: true,
      historicalItLoadMw: undefined,
      historicalRackCapacityPercent: undefined,
      regressionFitItLoadMw: itLoadPred,
      projectedItLoadMw: itLoadPred,
      projectedItLoadUpperMw: Math.max(itLoadPred, bounds.upper),
      projectedItLoadLowerMw: Math.max(1.5, bounds.lower),
      projectedRackCapacityPercent: rackPred,
      // Working flow projected telemetry
      clientRequestsPerSec: Math.round(155000 * (itLoadPred / 2.5)),
      dataServedGbps: Number((correlatedFiberGbps * 0.92).toFixed(1)),
      cpuProcessingPercent: Number(Math.min(96, 62 * (itLoadPred / 2.5)).toFixed(1)),
      ramMemoryPercent: Number(Math.min(97, 68 * (itLoadPred / 2.5)).toFixed(1)),
      storageIops: Math.round(52000 * (itLoadPred / 2.5)),
      pduBranchAmps: Number((26.4 * (itLoadPred / 2.45)).toFixed(1)),
      airflowCfm: Math.round(2550 * (itLoadPred / 2.5)),
      rackDeltaTempC: Number((11.5 + (itLoadPred * 1.14 - 2.1) * 2.8).toFixed(1)),
    });
  }

  // 3. Compute Milestones & Days to Threshold
  // Power Cap 3.60 MW
  let daysToPowerCap3_6Mw: number | null = null;
  if (itLoadRegression.slope > 0) {
    const targetDay = (3.60 - itLoadRegression.intercept) / itLoadRegression.slope;
    const remaining = Math.ceil(targetDay - lastDay);
    daysToPowerCap3_6Mw = remaining > 0 ? remaining : 0;
  }

  // 90% Rack Space Warning
  let daysToRackWarning90Pct: number | null = null;
  if (rackCapRegression.slope > 0) {
    const targetDay = (90.0 - rackCapRegression.intercept) / rackCapRegression.slope;
    const remaining = Math.ceil(targetDay - lastDay);
    daysToRackWarning90Pct = remaining > 0 ? remaining : 0;
  }

  // 100% Full Rack Space
  let daysToRackFull100Pct: number | null = null;
  if (rackCapRegression.slope > 0) {
    const targetDay = (100.0 - rackCapRegression.intercept) / rackCapRegression.slope;
    const remaining = Math.ceil(targetDay - lastDay);
    daysToRackFull100Pct = remaining > 0 ? remaining : 0;
  }

  const projected30dPoint = futurePoints[futurePoints.length - 1];
  const itLoadGrowthMw30d = Number((projected30dPoint.itLoadMw - lastPoint.itLoadMw).toFixed(2));
  const itLoadGrowthPercent30d = Number(((itLoadGrowthMw30d / lastPoint.itLoadMw) * 100).toFixed(1));
  const rackGrowthPercent30d = Number((projected30dPoint.rackCapacityPercent - lastPoint.rackCapacityPercent).toFixed(1));

  // Build Milestone alerts
  const milestones: CapacityMilestoneAlert[] = [
    {
      title: '90% Critical Rack Capacity Threshold',
      metric: 'Rack Space Occupancy',
      targetThreshold: '90.0% (216 / 240 Racks)',
      daysRemaining: daysToRackWarning90Pct,
      projectedDate: daysToRackWarning90Pct !== null
        ? new Date(Date.now() + daysToRackWarning90Pct * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null,
      severity: daysToRackWarning90Pct !== null && daysToRackWarning90Pct <= 45 ? 'warning' : 'info',
      statusText: daysToRackWarning90Pct !== null
        ? `Projected to breach in ~${daysToRackWarning90Pct} days based on current rack provisioning velocity (+${rackCapRegression.dailyGrowthRate}%/day).`
        : 'Velocity stable, threshold breach not projected in near term.',
    },
    {
      title: '3.60 MW Facility IT Power Ceiling',
      metric: 'Total IT Electrical Load',
      targetThreshold: '3.60 MW (UPS Bus Limit)',
      daysRemaining: daysToPowerCap3_6Mw,
      projectedDate: daysToPowerCap3_6Mw !== null
        ? new Date(Date.now() + daysToPowerCap3_6Mw * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null,
      severity: daysToPowerCap3_6Mw !== null && daysToPowerCap3_6Mw <= 60 ? 'critical' : 'warning',
      statusText: daysToPowerCap3_6Mw !== null
        ? `Projected to reach maximum electrical headroom in ~${daysToPowerCap3_6Mw} days (+${itLoadRegression.monthlyGrowthRate} MW/month rate).`
        : 'Power growth within contractual utility transformer limits.',
    },
    {
      title: '100% Floor Space Saturation',
      metric: 'White Space Capacity',
      targetThreshold: '240 / 240 Racks Deployed',
      daysRemaining: daysToRackFull100Pct,
      projectedDate: daysToRackFull100Pct !== null
        ? new Date(Date.now() + daysToRackFull100Pct * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null,
      severity: 'info',
      statusText: daysToRackFull100Pct !== null
        ? `Zero unreserved footprint remaining in ~${daysToRackFull100Pct} days. Requires Hall B expansion planning.`
        : 'Sufficient rack space reserve available.',
    },
  ];

  return {
    projectedData: [...historicalWithFit, ...futurePoints],
    summary: {
      itLoadRegression,
      rackCapacityRegression: rackCapRegression,
      currentItLoadMw: lastPoint.itLoadMw,
      projectedItLoad30dMw: projected30dPoint.itLoadMw,
      itLoadGrowthMw30d,
      itLoadGrowthPercent30d,
      currentRackPercent: lastPoint.rackCapacityPercent,
      projectedRackPercent30d: projected30dPoint.rackCapacityPercent,
      rackGrowthPercent30d,
      projectedOccupiedRacks30d: projected30dPoint.occupiedRacks,
      daysToPowerCap3_6Mw,
      daysToRackWarning90Pct,
      daysToRackFull100Pct,
      milestones,
    },
  };
}
