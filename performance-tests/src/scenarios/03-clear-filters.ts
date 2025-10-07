import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';

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

    // First apply a filter (use Product Name column - second text input)
    const filterInput = page.locator('thead input[type="text"]').nth(1);

    // Apply a simple filter
    await filterInput.fill('a');

    // Focus away from input to trigger blur event
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('thead input[type="text"]');
      const productNameInput = inputs[1] as HTMLInputElement;
      if (productNameInput) {
        productNameInput.blur();
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get memory before clear
    const memoryBefore = await getMemoryMetrics(page);

    // Find the Reset Filters button using text content
    const resetButton = page.getByRole('button', { name: /reset|clear/i });

    // Mark start of clear operation
    await performanceMark(page, 'clear-start');

    // Click the reset button
    const operationStart = Date.now();
    await resetButton.click();

    // Wait for table to restore all rows
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
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
          }, 50);
        });

        observer.observe(tbody, { childList: true, subtree: true });

        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 500);
      });
    });

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

    // Count rows after clear (should be back to full set)
    const visibleRows = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    measurements.push({ name: 'restored_row_count', value: visibleRows, unit: 'count' });

    result = {
      scenarioName: 'clear-filters',
      framework,
      measurements
    };
    return result;
  }
};
