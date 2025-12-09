import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import * as scenarios from './scenarios/index.js';

async function main(): Promise<void> {
  const config: TestConfig = {
    frameworks: [
      {
        name: 'Angular',
        baseUrl: 'http://localhost:8888/angular',
        buildCommand: 'pnpm run build:perf',
        buildOutputDir: join(process.cwd(), '../perf-dist/angular')
      },
      {
        name: 'React',
        baseUrl: 'http://localhost:8888/react',
        buildCommand: 'pnpm run build:perf',
        buildOutputDir: join(process.cwd(), '../perf-dist/react')
      }
    ],
    repetitions: 3, // Quick test
    discardOutliers: false,
    outputDir: join(process.cwd(), 'results'),
    viewportWidth: 1920,
    viewportHeight: 1080
  };

  await mkdir(config.outputDir, { recursive: true });

  // Test ONLY navigation scenarios
  const testScenarios = [
    scenarios.navigateToDetailScenario,
    scenarios.navigateBackScenario
  ];

  console.log('='.repeat(80));
  console.log('Testing Navigation Only (3 repetitions)');
  console.log('='.repeat(80));

  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    const allRuns = await runner.runAllFrameworks(testScenarios);

    console.log('\n' + '='.repeat(80));
    console.log('Results Summary');
    console.log('='.repeat(80));

    for (const [framework, runs] of allRuns.entries()) {
      console.log(`\n${framework}:`);
      for (const run of runs) {
        console.log(`  ${run.scenario}:`);
        for (const m of run.measurements) {
          console.log(`    ${m.name}: ${m.value}${m.unit}`);
        }
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
