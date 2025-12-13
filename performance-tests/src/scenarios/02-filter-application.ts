import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';
import { getCountInShadow, waitForSelectorInShadow } from '../utils/shadow-dom-helpers.js';

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

    // Wait for table to be visible (use shadow-aware wait)
    await waitForSelectorInShadow(page, 'table', { timeout: 30000 });

    // Get initial row count before filtering (use shadow-aware count)
    const initialRowCount = await getCountInShadow(page, 'tbody tr');

    // Get initial memory
    const memoryBefore = await getMemoryMetrics(page);

    // Use "Ri" as filter value - known to return 11 matching products
    const filterValue = 'Ri';

    // Find the product_name filter input (second text input - first is Code column)
    // Playwright locator automatically pierces shadow DOM
    const filterInput = page.locator('input[type="text"]').nth(1);

    // Mark start of filter operation
    await performanceMark(page, 'filter-start');

    // Type in the filter and blur
    const operationStart = Date.now();
    await filterInput.fill(filterValue);

    // Blur the input to trigger change
    await filterInput.blur();

    // Wait for row count to change (filter applied) - use shadow-aware function
    await page.waitForFunction(
      (initialCount: number) => {
        function countInShadow(root: Document | ShadowRoot | Element, selector: string): number {
          const found = root.querySelectorAll(selector);
          if (found.length > 0) return found.length;
          const elements = Array.from(root.querySelectorAll('*'));
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.shadowRoot) {
              const count = countInShadow(el.shadowRoot, selector);
              if (count > 0) return count;
            }
          }
          return 0;
        }
        const currentCount = countInShadow(document, 'tbody tr');
        return currentCount !== initialCount;
      },
      initialRowCount,
      { timeout: 5000 }
    );

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

    // Count visible rows after filter (use shadow-aware count)
    const visibleRows = await getCountInShadow(page, 'tbody tr');
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
