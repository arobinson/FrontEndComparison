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
    await new Promise(resolve => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Find the product_name column header (first th with click handler)
    const columnHeader = page.locator('thead th').first();

    await performanceMark(page, 'sort-start');
    const operationStart = Date.now();

    await columnHeader.click();

    // Wait for table to re-render
    await page.evaluate(() => {
      return new Promise<void>(resolve => {
        const tbody = document.querySelector('tbody');
        if (!tbody) {
          resolve();
          return;
        }

        let timeoutId: NodeJS.Timeout;
        const observer = new MutationObserver(() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 100);
        });

        observer.observe(tbody, { childList: true, subtree: true, attributes: true });

        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 500);
      });
    });

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
      measurements,
    };
    return result;
  },
};
