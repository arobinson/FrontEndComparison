import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { aggregateResults } from './utils/statistics.js';
import { runBuildAnalysis } from './utils/build-analyzer.js';
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
        buildOutputDir: join(process.cwd(), '../AngularFoodFacts/dist/AngularFoodFacts/browser')
      }
    ],
    repetitions: 5, // Reduced from 17 to prevent resource exhaustion
    discardOutliers: false, // No outlier trimming with only 5 runs
    outputDir: join(process.cwd(), 'results'),
    viewportWidth: 1920,
    viewportHeight: 1080
  };

  // Create output directory
  await mkdir(config.outputDir, { recursive: true });

  // Test scenarios to run
  const testScenarios = [
    scenarios.initialLoadScenario,
    scenarios.filterApplicationScenario,
    scenarios.clearFiltersScenario,
    scenarios.expandCollapseScenario,
    scenarios.sortColumnScenario,
    scenarios.navigateToDetailScenario,
    scenarios.navigateBackScenario,
    scenarios.paginationScenario,
    scenarios.paginationCycleScenario
  ];

  console.log('='.repeat(80));
  console.log('Frontend Framework Performance Testing');
  console.log('='.repeat(80));
  console.log(`\nConfiguration:`);
  console.log(`  Repetitions: ${config.repetitions}`);
  console.log(`  Viewport: ${config.viewportWidth}x${config.viewportHeight}`);
  console.log(`  Frameworks: ${config.frameworks.map((f) => f.name).join(', ')}`);
  console.log(`  Scenarios: ${testScenarios.length}`);
  console.log(`  Output: ${config.outputDir}`);

  // Initialize test runner
  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    // Run all scenarios for all frameworks
    const allRuns = await runner.runAllFrameworks(testScenarios);

    // Aggregate results by framework and scenario
    const aggregated = [];
    for (const [framework, runs] of allRuns.entries()) {
      // Group by scenario
      const byScenario = new Map<string, typeof runs>();
      for (const run of runs) {
        let scenarioRuns = byScenario.get(run.scenario);
        if (!scenarioRuns) {
          scenarioRuns = [];
          byScenario.set(run.scenario, scenarioRuns);
        }
        scenarioRuns.push(run);
      }

      // Aggregate each scenario
      for (const [scenario, scenarioRuns] of byScenario.entries()) {
        const aggregatedResult = aggregateResults(scenarioRuns);
        aggregated.push(aggregatedResult);
      }
    }

    // Run build analysis for each framework
    console.log('\n' + '='.repeat(80));
    console.log('Running Build Analysis');
    console.log('='.repeat(80));

    const buildMetrics: Record<string, any> = {};
    for (const framework of config.frameworks) {
      const frameworkDir = join(process.cwd(), `../${framework.name}FoodFacts`);
      const metrics = await runBuildAnalysis(framework.name, framework.buildCommand, framework.buildOutputDir, frameworkDir);
      buildMetrics[framework.name] = metrics;
    }

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
        viewportHeight: config.viewportHeight
      },
      rawRuns: Array.from(allRuns.values()).flat(),
      aggregated,
      buildMetrics
    };

    // Export to various formats
    await exportToJSON(fullResults, join(config.outputDir, `results-${timestamp}.json`));
    await exportRawDataToCSV(fullResults.rawRuns, join(config.outputDir, `raw-data-${timestamp}.csv`));
    await exportAggregatedToCSV(aggregated, join(config.outputDir, `aggregated-${timestamp}.csv`));

    console.log('\n' + '='.repeat(80));
    console.log('Testing Complete!');
    console.log('='.repeat(80));
  } finally {
    await runner.cleanup();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
