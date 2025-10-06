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
    repetitions: 17,
    discardOutliers: true,
    outputDir: join(process.cwd(), 'results'),
    viewportWidth: 1920,
    viewportHeight: 1080,
  };

  await mkdir(config.outputDir, { recursive: true });

  // Test ONLY initial-page-load scenario
  const testScenarios = [
    scenarios.initialLoadScenario,
  ];

  console.log('='.repeat(80));
  console.log('Testing Initial Page Load Only (17 repetitions)');
  console.log('='.repeat(80));

  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    const allRuns = await runner.runAllFrameworks(testScenarios);

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

    await exportToJSON(fullResults, join(config.outputDir, `initial-only-${timestamp}.json`));
    await exportRawDataToCSV(fullResults.rawRuns, join(config.outputDir, `initial-only-raw-${timestamp}.csv`));
    await exportAggregatedToCSV(aggregated, join(config.outputDir, `initial-only-aggregated-${timestamp}.csv`));

    console.log('\n' + '='.repeat(80));
    console.log('Testing Complete!');
    console.log('='.repeat(80));

    console.log('\n📊 Results Summary:');
    for (const agg of aggregated) {
      console.log(`\n${agg.framework} - ${agg.scenario}:`);
      console.log(`  Runs: ${agg.totalRuns} (discarded: ${agg.discardedRuns.join(', ') || 'none'})`);
      console.log(`  FCP median: ${agg.median.fcp?.toFixed(2)}ms`);
      console.log(`  LCP median: ${agg.median.lcp?.toFixed(2)}ms`);
      console.log(`  Total navigation median: ${agg.median.total_navigation_time?.toFixed(2)}ms`);
      console.log(`  Network duration median: ${agg.median.network_duration?.toFixed(2)}ms`);
    }
  } finally {
    await runner.cleanup();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
