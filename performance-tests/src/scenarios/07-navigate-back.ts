import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { getMemoryMetrics } from '../utils/performance-helpers.js';

export const navigateBackScenario: TestScenario = {
  name: 'navigate-back-to-list',
  description: 'Navigate back from detail page to list view',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to list and wait for table to render
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('tbody tr', { timeout: 30000 });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Navigate to detail
    await page.evaluate(() => {
      const firstProductLink = document.querySelector('tbody tr:first-child td:first-child a');
      if (firstProductLink) {
        (firstProductLink as HTMLElement).click();
      }
    });

    // Wait for detail page to load (look for back button or product detail container)
    await page.waitForSelector('.back-button, .product-detail', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await new Promise((resolve) => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Navigate back and measure until table rows are rendered
    const navigationStart = Date.now();

    // Click back button instead of browser back for more realistic SPA behavior
    await page.click('.back-button');

    // Wait for the table to actually render with data
    await page.waitForSelector('tbody tr', { timeout: 30000 });

    // Also wait for a reasonable number of rows to ensure rendering is complete
    await page.waitForFunction(
      () => document.querySelectorAll('tbody tr').length >= 10,
      { timeout: 30000 }
    );

    const navigationEnd = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const totalTime = navigationEnd - navigationStart;
    measurements.push({ name: 'total_back_navigation_time', value: totalTime, unit: 'ms' });

    // Count actual rendered rows
    const rowCount = await page.evaluate(() => document.querySelectorAll('tbody tr').length);
    measurements.push({ name: 'rendered_row_count', value: rowCount, unit: 'count' });

    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    result = {
      scenarioName: 'navigate-back-to-list',
      framework,
      measurements
    };
    return result;
  }
};
