import { writeFile } from 'fs/promises';
import { TestRun, AggregatedResults } from '../types.js';

export async function exportRawDataToCSV(runs: TestRun[], outputPath: string): Promise<void> {
  const headers = ['run_number', 'framework', 'scenario', 'timestamp', 'metric_name', 'value', 'unit'];
  const rows: string[] = [headers.join(',')];

  for (const run of runs) {
    for (const measurement of run.measurements) {
      const row = [
        run.runNumber.toString(),
        escapeCSV(run.framework),
        escapeCSV(run.scenario),
        escapeCSV(run.timestamp),
        escapeCSV(measurement.name),
        measurement.value.toString(),
        escapeCSV(measurement.unit)
      ];
      rows.push(row.join(','));
    }
  }

  const csv = rows.join('\n');
  await writeFile(outputPath, csv, 'utf-8');
  console.log(`\nRaw data exported to: ${outputPath}`);
}

export async function exportAggregatedToCSV(aggregated: AggregatedResults[], outputPath: string): Promise<void> {
  const headers = ['framework', 'scenario', 'metric_name', 'median', 'mean', 'min', 'max', 'std_dev', 'total_runs', 'discarded_runs'];
  const rows: string[] = [headers.join(',')];

  for (const result of aggregated) {
    const metricNames = Object.keys(result.median);

    for (const metricName of metricNames) {
      const row = [
        escapeCSV(result.framework),
        escapeCSV(result.scenario),
        escapeCSV(metricName),
        result.median[metricName].toString(),
        result.mean[metricName].toString(),
        result.min[metricName].toString(),
        result.max[metricName].toString(),
        result.stdDev[metricName].toString(),
        result.totalRuns.toString(),
        result.discardedRuns.join(';')
      ];
      rows.push(row.join(','));
    }
  }

  const csv = rows.join('\n');
  await writeFile(outputPath, csv, 'utf-8');
  console.log(`Aggregated results exported to: ${outputPath}`);
}

function escapeCSV(value: string): string {
  let result: string;
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    result = `"${value.replace(/"/g, '""')}"`;
  } else {
    result = value;
  }
  return result;
}
