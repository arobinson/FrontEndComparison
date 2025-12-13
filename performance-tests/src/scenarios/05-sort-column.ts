import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';

export const sortColumnScenario: TestScenario = {
  name: 'sort-column',
  description: 'Click column header to sort and measure re-render time',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Get the first row's product code before sorting
    const firstRowCodeBefore = await page.evaluate(() => {
      const firstCell = document.querySelector('tbody tr:first-child td:first-child');
      return firstCell?.textContent?.trim() ?? '';
    });

    // Find the product_name column header (first th with click handler)
    const columnHeader = page.locator('thead th').first();

    await performanceMark(page, 'sort-start');
    const operationStart = Date.now();

    await columnHeader.click();

    // Wait for first row's product code to change (sort applied)
    await page.waitForFunction(
      (previousCode: string) => {
        const firstCell = document.querySelector('tbody tr:first-child td:first-child');
        const currentCode = firstCell?.textContent?.trim() ?? '';
        return currentCode !== previousCode;
      },
      firstRowCodeBefore,
      { timeout: 5000 }
    );

    const operationEnd = Date.now();
    await performanceMark(page, 'sort-end');

    const sortDuration = await performanceMeasure(page, 'sort-operation', 'sort-start', 'sort-end');
    const totalTime = operationEnd - operationStart;

    measurements.push(
      { name: 'sort_duration', value: sortDuration, unit: 'ms' },
      { name: 'total_sort_time', value: totalTime, unit: 'ms' }
    );

    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    result = {
      scenarioName: 'sort-column',
      framework,
      measurements
    };
    return result;
  }
};
