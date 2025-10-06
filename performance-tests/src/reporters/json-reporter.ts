import { writeFile } from 'fs/promises';
import { TestRun, AggregatedResults, BuildMetrics } from '../types.js';

export interface FullTestResults {
  timestamp: string;
  config: {
    repetitions: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  rawRuns: TestRun[];
  aggregated: AggregatedResults[];
  buildMetrics?: Record<string, BuildMetrics>;
}

export async function exportToJSON(
  data: FullTestResults,
  outputPath: string
): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await writeFile(outputPath, json, 'utf-8');
  console.log(`\nFull results exported to: ${outputPath}`);
}

export async function exportAggregatedToJSON(
  aggregated: AggregatedResults[],
  outputPath: string
): Promise<void> {
  const json = JSON.stringify(aggregated, null, 2);
  await writeFile(outputPath, json, 'utf-8');
  console.log(`Aggregated results exported to: ${outputPath}`);
}
