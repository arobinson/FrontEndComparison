import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { exportRawDataToCSV, exportAggregatedToCSV } from './reporters/csv-reporter.js';
import { exportToJSON, FullTestResults } from './reporters/json-reporter.js';
import { aggregateResults } from './utils/statistics.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { detailNavigationCycleScenario } from './scenarios/10-detail-navigation-cycle.js';
import { allFrameworks, defaultTestConfig } from './config/frameworks.js';

async function main(): Promise<void> {
  const config: TestConfig = {
    frameworks: allFrameworks,
    ...defaultTestConfig,
    repetitions: 1
  };

  await mkdir(config.outputDir, { recursive: true });

  console.log('='.repeat(80));
  console.log('Testing Detail Navigation Cycle Scenario (1 repetition)');
  console.log('='.repeat(80));
  console.log('');
  console.log('This test measures component UPDATE speed (not creation):');
  console.log('  1. Load detail page for product 1 (initial load)');
  console.log('  2. Click Next → navigate to product 2 (measures change detection)');
  console.log('  3. Click Previous → navigate back to product 1 (warm state)');
  console.log('');

  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    const allRuns = await runner.runAllFrameworks([detailNavigationCycleScenario]);

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

    await exportToJSON(fullResults, join(config.outputDir, `detail-navigation-cycle-${timestamp}.json`));
    await exportRawDataToCSV(fullResults.rawRuns, join(config.outputDir, `detail-navigation-cycle-raw-${timestamp}.csv`));
    await exportAggregatedToCSV(aggregated, join(config.outputDir, `detail-navigation-cycle-aggregated-${timestamp}.csv`));

    console.log('\n' + '='.repeat(80));
    console.log('Detail Navigation Cycle Test Complete!');
    console.log('='.repeat(80));

    // Print results summary
    console.log('\n📊 Results Summary:\n');
    for (const run of fullResults.rawRuns) {
      console.log(`${run.framework} - ${run.scenario}:`);
      for (const measurement of run.measurements) {
        console.log(`  ${measurement.name}: ${measurement.value.toFixed(2)} ${measurement.unit}`);
      }
      console.log('');
    }
  } finally {
    await runner.cleanup();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
