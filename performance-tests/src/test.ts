import { TestRunner } from './test-runner.js';
import { TestConfig, TestScenario, BuildMetrics } from './types.js';
import { aggregateResults } from './utils/statistics.js';
import { runBuildAnalysis } from './utils/build-analyzer.js';
import { exportRawDataToCSV, exportAggregatedToCSV } from './reporters/csv-reporter.js';
import { exportToJSON, FullTestResults } from './reporters/json-reporter.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import * as scenarios from './scenarios/index.js';
import { allFrameworks, defaultTestConfig } from './config/frameworks.js';

const allScenarios: TestScenario[] = [
  scenarios.initialLoadScenario,
  scenarios.filterApplicationScenario,
  scenarios.clearFiltersScenario,
  scenarios.expandCollapseScenario,
  scenarios.navigateToDetailScenario,
  scenarios.navigateBackScenario,
  scenarios.paginationCycleScenario,
  scenarios.detailNavigationCycleScenario
];

function parseArgs(): {
  frameworks: string[];
  scenarios: string[];
  iterations: number;
  skipBuild: boolean;
  skipExport: boolean;
  help: boolean;
} {
  const args = process.argv.slice(2);
  const result = {
    frameworks: [] as string[],
    scenarios: [] as string[],
    iterations: defaultTestConfig.repetitions as number,
    skipBuild: false,
    skipExport: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--framework' || arg === '-f') {
      const value = args[++i];
      if (value) {
        result.frameworks.push(value);
      }
    } else if (arg === '--scenario' || arg === '-s') {
      const value = args[++i];
      if (value) {
        result.scenarios.push(value);
      }
    } else if (arg === '--iterations' || arg === '-i') {
      const value = parseInt(args[++i], 10);
      if (!isNaN(value) && value > 0) {
        result.iterations = value;
      }
    } else if (arg === '--skip-build') {
      result.skipBuild = true;
    } else if (arg === '--skip-export') {
      result.skipExport = true;
    }
  }

  return result;
}

function printHelp(): void {
  const frameworkNames = allFrameworks.map((f) => f.name.toLowerCase()).join(', ');
  const scenarioNames = allScenarios.map((s) => s.name).join(', ');
  console.log(`
Usage: node dist/test.js [options]

Options:
  -f, --framework <name>   Test specific framework (can be used multiple times)
                           Available: ${frameworkNames}
  -s, --scenario <name>    Run specific scenario (can be used multiple times)
                           Available: ${scenarioNames}
  -i, --iterations <n>     Number of iterations per scenario (default: ${defaultTestConfig.repetitions})
  --skip-build             Skip build analysis
  --skip-export            Skip exporting results to files
  -h, --help               Show this help message

Examples:
  node dist/test.js                              # Run all frameworks, all scenarios
  node dist/test.js -f lit                       # Run Lit only
  node dist/test.js -f angular -f react          # Run Angular and React
  node dist/test.js -s initial-page-load         # Run only initial load scenario
  node dist/test.js -f lit -s pagination-cycle   # Run Lit pagination cycle only
  node dist/test.js -i 1                         # Run 1 iteration each
  node dist/test.js -f lit -i 1 --skip-build     # Quick Lit test
`);
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Filter frameworks if specified
  let frameworks = allFrameworks;
  if (args.frameworks.length > 0) {
    frameworks = allFrameworks.filter((f) =>
      args.frameworks.some((name) => f.name.toLowerCase() === name.toLowerCase())
    );

    if (frameworks.length === 0) {
      console.error(`No matching frameworks found for: ${args.frameworks.join(', ')}`);
      console.error(`Available: ${allFrameworks.map((f) => f.name).join(', ')}`);
      process.exit(1);
    }
  }

  const config: TestConfig = {
    frameworks,
    repetitions: args.iterations,
    discardOutliers: defaultTestConfig.discardOutliers,
    outputDir: defaultTestConfig.outputDir,
    viewportWidth: defaultTestConfig.viewportWidth,
    viewportHeight: defaultTestConfig.viewportHeight
  };

  await mkdir(config.outputDir, { recursive: true });

  // Filter scenarios if specified
  let testScenarios = allScenarios;
  if (args.scenarios.length > 0) {
    testScenarios = allScenarios.filter((s) =>
      args.scenarios.some((name) => s.name.toLowerCase().includes(name.toLowerCase()))
    );

    if (testScenarios.length === 0) {
      console.error(`No matching scenarios found for: ${args.scenarios.join(', ')}`);
      console.error(`Available: ${allScenarios.map((s) => s.name).join(', ')}`);
      process.exit(1);
    }
  }

  console.log('='.repeat(80));
  console.log('Frontend Framework Performance Testing');
  console.log('='.repeat(80));
  console.log(`\nConfiguration:`);
  console.log(`  Iterations: ${config.repetitions}`);
  console.log(`  Viewport: ${config.viewportWidth}x${config.viewportHeight}`);
  console.log(`  Frameworks: ${config.frameworks.map((f) => f.name).join(', ')}`);
  console.log(`  Scenarios: ${testScenarios.length}`);
  console.log(`  Output: ${config.outputDir}`);
  console.log('');

  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    const allRuns = await runner.runAllFrameworks(testScenarios);

    // Aggregate results by framework and scenario
    const aggregated = [];
    for (const [, runs] of allRuns.entries()) {
      const byScenario = new Map<string, typeof runs>();
      for (const run of runs) {
        let scenarioRuns = byScenario.get(run.scenario);
        if (!scenarioRuns) {
          scenarioRuns = [];
          byScenario.set(run.scenario, scenarioRuns);
        }
        scenarioRuns.push(run);
      }

      for (const [, scenarioRuns] of byScenario.entries()) {
        const aggregatedResult = aggregateResults(scenarioRuns);
        aggregated.push(aggregatedResult);
      }
    }

    // Build analysis
    const buildMetrics: Record<string, BuildMetrics> = {};
    if (!args.skipBuild) {
      console.log('\n' + '='.repeat(80));
      console.log('Running Build Analysis');
      console.log('='.repeat(80));

      for (const framework of config.frameworks) {
        const frameworkDir = join(process.cwd(), `../${framework.name}FoodFacts`);
        const metrics = await runBuildAnalysis(
          framework.name,
          framework.buildCommand,
          framework.buildOutputDir,
          frameworkDir
        );
        buildMetrics[framework.name] = metrics;
      }
    }

    // Export results
    if (!args.skipExport) {
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

      await exportToJSON(fullResults, join(config.outputDir, `results-${timestamp}.json`));
      await exportRawDataToCSV(fullResults.rawRuns, join(config.outputDir, `raw-data-${timestamp}.csv`));
      await exportAggregatedToCSV(aggregated, join(config.outputDir, `aggregated-${timestamp}.csv`));
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('Results Summary');
    console.log('='.repeat(80));

    for (const [framework, runs] of allRuns.entries()) {
      console.log(`\n${framework}:`);
      for (const run of runs) {
        console.log(`  ${run.scenario}: ${run.measurements.length} measurements`);
      }
    }

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
