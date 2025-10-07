import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { exportRawDataToCSV, exportAggregatedToCSV } from './reporters/csv-reporter.js';
import { exportToJSON, FullTestResults } from './reporters/json-reporter.js';
import { aggregateResults } from './utils/statistics.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { paginationCycleScenario } from './scenarios/09-pagination-cycle.js';

async function main(): Promise<void> {
  const config: TestConfig = {
    frameworks: [
      {
        name: 'Angular',
        baseUrl: 'http://localhost:4200',
        buildCommand: 'pnpm exec ng build',
        buildOutputDir: join(process.cwd(), '../AngularFoodFacts/dist/AngularFoodFacts/browser')
      }
    ],
    repetitions: 1,
    discardOutliers: false,
    outputDir: join(process.cwd(), 'results'),
    viewportWidth: 1920,
    viewportHeight: 1080
  };

  await mkdir(config.outputDir, { recursive: true });

  console.log('='.repeat(80));
  console.log('Testing Pagination Cycle Scenario (1 repetition)');
  console.log('='.repeat(80));

  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    const allRuns = await runner.runAllFrameworks([paginationCycleScenario]);

    const aggregated = [];
    for (const [framework, runs] of allRuns.entries()) {
      const aggregatedResult = aggregateResults(runs);
      aggregated.push(aggregatedResult);
    }

    console.log('\n' + '='.repeat(80));
    console.log('Exporting Results');
    console.log('='.repeat(80));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const fullResults: FullTestResults = {
      timestamp: new Date().toISOString(),
      config: {
        repetitions: config.repetitions,
        viewportWidth: config.viewportWidth,
        viewportHeight: config.viewportHeight
      },
      rawRuns: Array.from(allRuns.values()).flat(),
      aggregated,
      buildMetrics: {}
    };

    await exportToJSON(fullResults, join(config.outputDir, `pagination-cycle-${timestamp}.json`));
    await exportRawDataToCSV(fullResults.rawRuns, join(config.outputDir, `pagination-cycle-raw-${timestamp}.csv`));
    await exportAggregatedToCSV(aggregated, join(config.outputDir, `pagination-cycle-aggregated-${timestamp}.csv`));

    console.log('\n' + '='.repeat(80));
    console.log('Pagination Cycle Test Complete!');
    console.log('='.repeat(80));

    // Print results summary
    console.log('\n📊 Results Summary:\n');
    for (const run of fullResults.rawRuns) {
      console.log(`${run.framework} - ${run.scenario}:`);
      for (const measurement of run.measurements) {
        console.log(`  ${measurement.name}: ${measurement.value.toFixed(2)} ${measurement.unit}`);
      }
    }
  } finally {
    await runner.cleanup();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
