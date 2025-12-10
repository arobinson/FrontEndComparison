import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { mkdir } from 'fs/promises';
import * as scenarios from './scenarios/index.js';
import { allFrameworks, defaultTestConfig } from './config/frameworks.js';

async function main(): Promise<void> {
  const config: TestConfig = {
    frameworks: allFrameworks,
    ...defaultTestConfig,
    repetitions: 3 // Quick test
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
