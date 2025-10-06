import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { getMemoryMetrics } from '../utils/performance-helpers.js';

export const navigateBackScenario: TestScenario = {
  name: 'navigate-back-to-list',
  description: 'Navigate back from detail page to list view',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to list
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Navigate to detail
    await page.evaluate(() => {
      const firstProductLink = document.querySelector('tbody tr:first-child td:first-child a');
      if (firstProductLink) {
        (firstProductLink as HTMLElement).click();
      }
    });

    await page.waitForLoadState('networkidle');
    await new Promise(resolve => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Navigate back
    const navigationStart = Date.now();

    await page.goBack({ waitUntil: 'networkidle' });

    const navigationEnd = Date.now();
    await new Promise(resolve => setTimeout(resolve, 500));

    const totalTime = navigationEnd - navigationStart;
    measurements.push({ name: 'total_back_navigation_time', value: totalTime, unit: 'ms' });

    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    result = {
      scenarioName: 'navigate-back-to-list',
      framework,
      measurements,
    };
    return result;
  },
};
