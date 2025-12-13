import { TestRunner } from './test-runner.js';
import { TestConfig } from './types.js';
import { mkdir } from 'fs/promises';
import * as scenarios from './scenarios/index.js';
import { allFrameworks, defaultTestConfig } from './config/frameworks.js';

async function main(): Promise<void> {
  // Get only Lit framework
  const litFramework = allFrameworks.find(f => f.name === 'Lit');
  if (!litFramework) {
    console.error('Lit framework not found');
    process.exit(1);
  }

  const config: TestConfig = {
    frameworks: [litFramework],
    ...defaultTestConfig,
    repetitions: 1
  };

  await mkdir(config.outputDir, { recursive: true });

  const testScenarios = [
    scenarios.initialLoadScenario,
    scenarios.filterApplicationScenario,
    scenarios.clearFiltersScenario,
    scenarios.expandCollapseScenario,
    scenarios.navigateToDetailScenario,
    scenarios.navigateBackScenario,
    scenarios.paginationScenario,
    scenarios.paginationCycleScenario,
    scenarios.detailNavigationCycleScenario
  ];

  console.log('='.repeat(80));
  console.log('Testing ALL Scenarios on Lit (1 iteration each)');
  console.log('='.repeat(80));
  console.log(`\nScenarios to run: ${testScenarios.length}`);
  console.log('  1. Initial Load');
  console.log('  2. Filter Application');
  console.log('  3. Clear Filters');
  console.log('  4. Expand/Collapse');
  console.log('  5. Navigate to Detail');
  console.log('  6. Navigate Back');
  console.log('  7. Pagination');
  console.log('  8. Pagination Cycle');
  console.log('  9. Detail Navigation Cycle');
  console.log('');

  const runner = new TestRunner(config);
  await runner.initialize();

  try {
    const allRuns = await runner.runAllFrameworks(testScenarios);

    console.log('\n' + '='.repeat(80));
    console.log('All Lit Tests Complete!');
    console.log('='.repeat(80));

    // Print results summary
    console.log('\n📊 Results Summary:\n');
    let passedCount = 0;

    for (const [, runs] of allRuns.entries()) {
      for (const run of runs) {
        passedCount++;
        console.log(`✅ ${run.scenario}: PASSED`);
        for (const measurement of run.measurements) {
          console.log(`   ${measurement.name}: ${measurement.value.toFixed(2)} ${measurement.unit}`);
        }
        console.log('');
      }
    }

    console.log('='.repeat(80));
    console.log(`Results: ${passedCount} scenarios completed`);
    console.log('='.repeat(80));
  } finally {
    await runner.cleanup();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
