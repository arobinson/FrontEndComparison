import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';

export const filterApplicationScenario: TestScenario = {
  name: 'filter-application',
  description: 'Apply text filter to match 2-5 products and measure re-render time',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to the list page
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for table to be visible
    await page.waitForSelector('table', { state: 'visible' });

    // Get initial memory
    const memoryBefore = await getMemoryMetrics(page);

    // Use "Ri" as filter value - known to return 11 matching products
    const filterValue = 'Ri';

    // Find the product_name filter input (second text input - first is Code column)
    const filterInput = page.locator('thead input[type="text"]').nth(1);

    // Mark start of filter operation
    await performanceMark(page, 'filter-start');

    // Type in the filter and blur
    const operationStart = Date.now();
    await filterInput.fill(filterValue);

    // Focus away from input to trigger blur event
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('thead input[type="text"]');
      const productNameInput = inputs[1] as HTMLInputElement; // Second input is Product Name
      if (productNameInput) {
        productNameInput.blur();
      }
    });

    // Wait for table to update using MutationObserver
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const tbody = document.querySelector('tbody');
        if (!tbody) {
          resolve();
          return;
        }

        let timeoutId: NodeJS.Timeout;
        const observer = new MutationObserver(() => {
          // Reset timeout on each mutation
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 50); // Reduced from 100ms - quicker detection after mutations stop
        });

        observer.observe(tbody, { childList: true, subtree: true });

        // Fallback timeout - reduced from 2000ms to 500ms
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 500);
      });
    });

    const operationEnd = Date.now();
    await performanceMark(page, 'filter-end');

    // Measure performance
    const filterDuration = await performanceMeasure(page, 'filter-operation', 'filter-start', 'filter-end');
    const totalTime = operationEnd - operationStart;

    measurements.push(
      { name: 'filter_duration', value: filterDuration, unit: 'ms' },
      { name: 'total_filter_time', value: totalTime, unit: 'ms' }
    );

    // Get memory after
    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    // Count visible rows after filter
    const visibleRows = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    measurements.push({ name: 'filtered_row_count', value: visibleRows, unit: 'count' });

    // Get JavaScript execution time
    const jsExecutionTime = await page.evaluate(() => {
      const entries = performance.getEntriesByType('measure');
      const filterMeasure = entries.find((e) => e.name === 'filter-operation');
      return filterMeasure ? filterMeasure.duration : 0;
    });
    measurements.push({ name: 'js_execution_time', value: jsExecutionTime, unit: 'ms' });

    result = {
      scenarioName: 'filter-application',
      framework,
      measurements
    };
    return result;
  }
};
