import { TestRun, AggregatedResults, Measurement } from '../types.js';

export function aggregateResults(runs: TestRun[]): AggregatedResults {
  let result: AggregatedResults;
  if (runs.length === 0) {
    throw new Error('No test runs to aggregate');
  }

  const framework = runs[0].framework;
  const scenario = runs[0].scenario;

  // Group measurements by metric name
  const metricGroups = new Map<string, number[]>();

  for (const run of runs) {
    for (const measurement of run.measurements) {
      let values = metricGroups.get(measurement.name);
      if (!values) {
        values = [];
        metricGroups.set(measurement.name, values);
      }
      values.push(measurement.value);
    }
  }

  // For each metric, calculate statistics
  const median: Record<string, number> = {};
  const mean: Record<string, number> = {};
  const min: Record<string, number> = {};
  const max: Record<string, number> = {};
  const stdDev: Record<string, number> = {};

  let discardedRuns: number[] = [];
  if (runs.length >= 17) {
    // Discard highest and lowest runs based on first metric (typically total time)
    const firstMetricName = Array.from(metricGroups.keys())[0];
    const firstMetricValues = metricGroups.get(firstMetricName) ?? [];
    discardedRuns = getOutlierIndices(firstMetricValues);
  }

  for (const [metricName, values] of metricGroups.entries()) {
    // Filter out discarded runs
    const filteredValues = values.filter((_, index) => {
      const isDiscarded = discardedRuns.includes(index);
      return !isDiscarded;
    });

    median[metricName] = calculateMedian(filteredValues);
    mean[metricName] = calculateMean(filteredValues);
    min[metricName] = Math.min(...filteredValues);
    max[metricName] = Math.max(...filteredValues);
    stdDev[metricName] = calculateStdDev(filteredValues);
  }

  result = {
    framework,
    scenario,
    totalRuns: runs.length,
    discardedRuns,
    median,
    mean,
    min,
    max,
    stdDev
  };
  return result;
}

function getOutlierIndices(values: number[]): number[] {
  let result: number[];
  if (values.length < 2) {
    result = [];
  } else {
    const indexed = values.map((value, index) => ({ value, index }));
    indexed.sort((a, b) => a.value - b.value);

    const highestIndex = indexed[indexed.length - 1].index;
    const lowestIndex = indexed[0].index;

    result = [lowestIndex, highestIndex];
  }
  return result;
}

function calculateMedian(values: number[]): number {
  let result: number;
  if (values.length === 0) {
    result = 0;
  } else {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      result = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      result = sorted[mid];
    }
  }
  return result;
}

function calculateMean(values: number[]): number {
  let result: number;
  if (values.length === 0) {
    result = 0;
  } else {
    const sum = values.reduce((acc, val) => acc + val, 0);
    result = sum / values.length;
  }
  return result;
}

function calculateStdDev(values: number[]): number {
  let result: number;
  if (values.length === 0) {
    result = 0;
  } else {
    const avg = calculateMean(values);
    const squaredDiffs = values.map((value) => Math.pow(value - avg, 2));
    const variance = calculateMean(squaredDiffs);
    result = Math.sqrt(variance);
  }
  return result;
}
