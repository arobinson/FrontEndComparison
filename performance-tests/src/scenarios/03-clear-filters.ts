import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';
import { getCountInShadow, waitForSelectorInShadow } from '../utils/shadow-dom-helpers.js';

export const clearFiltersScenario: TestScenario = {
  name: 'clear-filters',
  description: 'Click Reset Filters button and measure table restore time',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to the list page
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for table to appear (shadow-aware)
    await waitForSelectorInShadow(page, 'table', { timeout: 30000 });

    // First apply a filter (use Product Name column - second text input)
    // Playwright locator automatically pierces shadow DOM
    const filterInput = page.locator('input[type="text"]').nth(1);

    // Apply a simple filter
    await filterInput.fill('a');

    // Blur to trigger filter
    await filterInput.blur();
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get memory before clear
    const memoryBefore = await getMemoryMetrics(page);

    // Get row count before clear (filtered state) - shadow-aware
    const rowCountBefore = await getCountInShadow(page, 'tbody tr');

    // Find the Reset Filters button using text content
    // Playwright getByRole pierces shadow DOM
    const resetButton = page.getByRole('button', { name: /reset|clear/i });

    // Mark start of clear operation
    await performanceMark(page, 'clear-start');

    // Click the reset button
    const operationStart = Date.now();
    await resetButton.click();

    // Wait for row count to increase (table restored to full set) - shadow-aware
    await page.waitForFunction(
      (previousCount: number) => {
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
        return currentCount > previousCount;
      },
      rowCountBefore,
      { timeout: 5000 }
    );

    const operationEnd = Date.now();
    await performanceMark(page, 'clear-end');

    // Measure performance
    const clearDuration = await performanceMeasure(page, 'clear-operation', 'clear-start', 'clear-end');
    const totalTime = operationEnd - operationStart;

    measurements.push(
      { name: 'clear_duration', value: clearDuration, unit: 'ms' },
      { name: 'total_clear_time', value: totalTime, unit: 'ms' }
    );

    // Get memory after
    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    // Count rows after clear (should be back to full set) - shadow-aware
    const visibleRows = await getCountInShadow(page, 'tbody tr');
    measurements.push({ name: 'restored_row_count', value: visibleRows, unit: 'count' });

    result = {
      scenarioName: 'clear-filters',
      framework,
      measurements
    };
    return result;
  }
};
