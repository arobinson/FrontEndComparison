import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { aggregateResults } from './utils/statistics.js';
import { exportRawDataToCSV, exportAggregatedToCSV } from './reporters/csv-reporter.js';
import { exportToJSON, FullTestResults } from './reporters/json-reporter.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import * as scenarios from './scenarios/index.js';

async function main(): Promise<void> {
  const config: TestConfig = {
    frameworks: [
      {
        name: 'Angular',
        baseUrl: 'http://localhost:4200',
        buildCommand: 'pnpm exec ng build',
        buildOutputDir: join(process.cwd(), '../AngularFoodFacts/dist/angular-food-facts/browser'),
      },
    ],
    repetitions: 1, // DRY RUN - only 1 execution
    discardOutliers: false, // No outlier removal for single run
    outputDir: join(process.cwd(), 'results'),
    viewportWidth: 1920,
    viewportHeight: 1080,
  };

  // Create output directory
  await mkdir(config.outputDir, { recursive: true });

  // Test only first 2 scenarios for quick dry run
  const testScenarios = [
    scenarios.initialLoadScenario,
    scenarios.filterApplicationScenario,
  ];

  console.log('='.repeat(80));
  console.log('DRY RUN - Performance Testing (1 repetition, 2 scenarios)');
  console.log('='.repeat(80));
  console.log(`\nConfiguration:`);
  console.log(`  Repetitions: ${config.repetitions}`);
  console.log(`  Viewport: ${config.viewportWidth}x${config.viewportHeight}`);
  console.log(`  Frameworks: ${config.frameworks.map(f => f.name).join(', ')}`);
  console.log(`  Scenarios: ${testScenarios.length}`);
  console.log(`  Output: ${config.outputDir}`);

  // Initialize test runner
  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    // Run scenarios
    const allRuns = await runner.runAllFrameworks(testScenarios);

    // Aggregate results
    const aggregated = [];
    for (const [framework, runs] of allRuns.entries()) {
      const byScenario = new Map<string, typeof runs>();
      for (const run of runs) {
        let scenarioRuns = byScenario.get(run.scenario);
        if (!scenarioRuns) {
          scenarioRuns = [];
          byScenario.set(run.scenario, scenarioRuns);
        }
        scenarioRuns.push(run);
      }

      for (const [scenario, scenarioRuns] of byScenario.entries()) {
        const aggregatedResult = aggregateResults(scenarioRuns);
        aggregated.push(aggregatedResult);
      }
    }

    // Skip build analysis for dry run (comment out if you want to test it)
    console.log('\n' + '='.repeat(80));
    console.log('Skipping Build Analysis for Dry Run');
    console.log('='.repeat(80));

    // Export results
    console.log('\n' + '='.repeat(80));
    console.log('Exporting Results');
    console.log('='.repeat(80));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const fullResults: FullTestResults = {
      timestamp: new Date().toISOString(),
      config: {
        repetitions: config.repetitions,
        viewportWidth: config.viewportWidth,
        viewportHeight: config.viewportHeight,
      },
      rawRuns: Array.from(allRuns.values()).flat(),
      aggregated,
    };

    // Export to various formats
    await exportToJSON(fullResults, join(config.outputDir, `dry-run-${timestamp}.json`));
    await exportRawDataToCSV(fullResults.rawRuns, join(config.outputDir, `dry-run-raw-${timestamp}.csv`));
    await exportAggregatedToCSV(aggregated, join(config.outputDir, `dry-run-aggregated-${timestamp}.csv`));

    console.log('\n' + '='.repeat(80));
    console.log('Dry Run Complete!');
    console.log('='.repeat(80));
    console.log('\nResults saved to:');
    console.log(`  - ${join(config.outputDir, `dry-run-${timestamp}.json`)}`);
    console.log(`  - ${join(config.outputDir, `dry-run-raw-${timestamp}.csv`)}`);
    console.log(`  - ${join(config.outputDir, `dry-run-aggregated-${timestamp}.csv`)}`);
  } finally {
    await runner.cleanup();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
