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
import { collectEnvironment } from './utils/environment.js';
import { AggregatedResults } from './types.js';

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
  warmup: number;
  seed: number;
  cpuThreshold: number;
  cpuMaxWait: number;
  coldBrowser: boolean;
  help: boolean;
} {
  const args = process.argv.slice(2);
  const result = {
    frameworks: [] as string[],
    scenarios: [] as string[],
    iterations: defaultTestConfig.repetitions as number,
    skipBuild: false,
    skipExport: false,
    warmup: defaultTestConfig.warmupRounds as number,
    // Random by default, always recorded in the results so the order can be replayed with --seed
    seed: Math.floor(Math.random() * 2 ** 31),
    cpuThreshold: defaultTestConfig.cpuThresholdPct as number,
    cpuMaxWait: defaultTestConfig.cpuMaxWaitMs as number,
    coldBrowser: false,
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
    } else if (arg === '--warmup') {
      const value = parseInt(args[++i], 10);
      if (!isNaN(value) && value >= 0) result.warmup = value;
    } else if (arg === '--seed') {
      const value = parseInt(args[++i], 10);
      if (!isNaN(value)) result.seed = value;
    } else if (arg === '--cold-browser') {
      result.coldBrowser = true;
    } else if (arg === '--cpu-threshold') {
      const value = parseFloat(args[++i]);
      if (!isNaN(value) && value > 0) result.cpuThreshold = value;
    } else if (arg === '--cpu-max-wait') {
      const value = parseFloat(args[++i]);
      if (!isNaN(value) && value >= 0) result.cpuMaxWait = value * 1000;
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
  -i, --iterations <n>     Measured rounds per scenario (default: ${defaultTestConfig.repetitions})
  --warmup <n>             Discarded warm-up rounds per scenario (default: ${defaultTestConfig.warmupRounds})
  --seed <n>               Seed for the per-round framework shuffle (default: random, recorded)
  --cpu-threshold <pct>    Idle-CPU gate: start a round at or below this busy % (default: ${defaultTestConfig.cpuThresholdPct})
  --cold-browser           Relaunch the browser before every run (first load in a fresh browser;
                           scenario names get a '-cold-browser' suffix). Default: one browser per scenario
  --cpu-max-wait <sec>     Idle-CPU gate: max wait before proceeding, round flagged (default: ${defaultTestConfig.cpuMaxWaitMs / 1000})
  --skip-build             Skip build analysis
  --skip-export            Skip exporting results to files
  -h, --help               Show this help message

Protocol: for each scenario, every round runs each framework once in a freshly
shuffled order, each run in a fresh browser context (cold cache), and each round
waits for the machine to be idle first. See test-runner.ts.

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
    viewportHeight: defaultTestConfig.viewportHeight,
    warmupRounds: args.warmup,
    seed: args.seed,
    cpuThresholdPct: args.cpuThreshold,
    cpuMaxWaitMs: args.cpuMaxWait,
    coldBrowser: args.coldBrowser
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
  console.log(`  Measured rounds: ${config.repetitions}  (+${config.warmupRounds} warm-up, discarded)`);
  console.log(`  Seed: ${config.seed}`);
  console.log(`  Browser per run: ${config.coldBrowser ? 'fresh browser process (cold-browser)' : 'one browser per scenario, fresh context per run'}`);
  console.log(`  CPU gate: <= ${config.cpuThresholdPct}% busy, max wait ${config.cpuMaxWaitMs / 1000}s`);
  console.log(`  Viewport: ${config.viewportWidth}x${config.viewportHeight}`);
  console.log(`  Frameworks: ${config.frameworks.map((f) => f.name).join(', ')}`);
  console.log(`  Scenarios: ${testScenarios.length}`);
  console.log(`  Output: ${config.outputDir}`);
  console.log('');

  const runner = new TestRunner(config);
  await runner.initialize();
  const environment = collectEnvironment(runner.browserVersion, config.frameworks);
  console.log(`  Browser: ${environment.browser}  Node: ${environment.node}  ${environment.cpuModel} x${environment.cpuCores}`);
  if (environment.gitDirty) {
    console.warn('  ⚠️  Working tree has uncommitted changes - results will not map cleanly to a commit');
  }

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
          viewportHeight: config.viewportHeight,
          warmupRounds: config.warmupRounds,
          seed: config.seed,
          cpuThresholdPct: config.cpuThresholdPct,
          cpuMaxWaitMs: config.cpuMaxWaitMs,
          protocol: `interleaved-shuffled-rounds, ${config.coldBrowser ? 'fresh-browser-per-run' : 'fresh-context-per-run'}, idle-cpu-gate`,
          coldBrowser: config.coldBrowser ?? false
        },
        environment,
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

    printSummary(aggregated, testScenarios);

    const allRunList = Array.from(allRuns.values()).flat();
    const flagged = allRunList.filter((r) => r.cpuGateTimedOut).length;
    if (flagged > 0) {
      console.warn(`\n⚠️  ${flagged}/${allRunList.length} runs started while the CPU gate had timed out (machine busy). Close other apps and re-run before publishing.`);
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

/** CV above this means the spread is too wide to rank frameworks confidently. */
const NOISY_CV = 0.1;

/**
 * Per scenario, frameworks ranked by the median of the scenario's primary
 * (first) metric, with min/max and coefficient of variation.
 */
function printSummary(aggregated: AggregatedResults[], scenarios: TestScenario[]): void {
  // Scenario names may carry a mode suffix (e.g. '-cold-browser'), so list what's actually in the results
  const order = scenarios.map((s) => s.name);
  const names = [...new Set(aggregated.map((a) => a.scenario))].sort(
    (x, y) => order.findIndex((n) => x.startsWith(n)) - order.findIndex((n) => y.startsWith(n))
  );
  for (const name of names) {
    const rows = aggregated.filter((a) => a.scenario === name);
    if (rows.length === 0) continue;
    const metric = Object.keys(rows[0].median)[0];
    rows.sort((a, b) => a.median[metric] - b.median[metric]);

    console.log(`\n${name}  [${metric}]`);
    console.log(`  ${'framework'.padEnd(12)}${'median'.padStart(9)}${'min'.padStart(9)}${'max'.padStart(9)}${'cv'.padStart(8)}`);
    for (const row of rows) {
      const cv = row.cv[metric];
      const noisy = cv > NOISY_CV ? '  ⚠️ noisy' : '';
      console.log(
        `  ${row.framework.padEnd(12)}${row.median[metric].toFixed(0).padStart(9)}${row.min[metric].toFixed(0).padStart(9)}${row.max[metric].toFixed(0).padStart(9)}${(cv * 100).toFixed(1).padStart(7)}%${noisy}`
      );
    }
  }
}
