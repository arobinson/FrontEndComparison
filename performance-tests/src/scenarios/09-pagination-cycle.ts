import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';
import { waitForSelectorInShadow, findInShadowFn } from '../utils/shadow-dom-helpers.js';

export const paginationCycleScenario: TestScenario = {
  name: 'pagination-cycle',
  description: 'Navigate pages 1→2→3→2→1 and measure cumulative performance',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for table (shadow-aware)
    await waitForSelectorInShadow(page, 'table', { timeout: 30000 });

    const memoryBefore = await getMemoryMetrics(page);

    // Start network tracking for all pagination operations
    const networkTracker = new NetworkTracker(page);
    networkTracker.start();

    // Define the navigation sequence: Next, Next, Previous, Previous
    // This goes 1→2→3→2→1 using Next/Previous buttons
    const navigationSequence: Array<'next' | 'previous'> = ['next', 'next', 'previous', 'previous'];
    const pageTimes: number[] = [];

    await performanceMark(page, 'pagination-cycle-start');
    const cycleStart = Date.now();

    for (let i = 0; i < navigationSequence.length; i++) {
      const direction = navigationSequence[i];

      // Get the last row's product code before navigation
      // Find the td (may be in shadow DOM), then find the <a> within it
      const lastRowCodeBefore = await page.evaluate(`(function() {
        ${findInShadowFn}
        const td = findInShadow(document, 'tbody tr:last-child td:first-child');
        const el = td ? findInShadow(td, 'a') : null;
        return el?.textContent?.trim() ?? '';
      })()`);

      await performanceMark(page, `page-${i}-start`);
      const pageStart = Date.now();

      // Click the Next or Previous button using Playwright's role-based locator
      const button = page.getByRole('button', { name: new RegExp(direction, 'i') });
      await button.click();

      // Wait for last row's product code to change (page fully loaded)
      await page.waitForFunction(`(function() {
        ${findInShadowFn}
        const td = findInShadow(document, 'tbody tr:last-child td:first-child');
        const el = td ? findInShadow(td, 'a') : null;
        const currentCode = el?.textContent?.trim() ?? '';
        return currentCode !== '${lastRowCodeBefore}';
      })()`, { timeout: 10000 });

      const pageEnd = Date.now();
      await performanceMark(page, `page-${i}-end`);

      const pageDuration = await performanceMeasure(page, `page-${i}`, `page-${i}-start`, `page-${i}-end`);
      const pageTime = pageEnd - pageStart;
      pageTimes.push(pageTime);

      measurements.push({
        name: `page_transition_${i + 1}_${direction}`,
        value: pageTime,
        unit: 'ms'
      });
      measurements.push({
        name: `page_transition_${i + 1}_${direction}_js`,
        value: pageDuration,
        unit: 'ms'
      });
    }

    const cycleEnd = Date.now();
    await performanceMark(page, 'pagination-cycle-end');

    networkTracker.stop();
    const network = networkTracker.getMetrics();

    const cycleDuration = await performanceMeasure(page, 'pagination-cycle', 'pagination-cycle-start', 'pagination-cycle-end');
    const totalTime = cycleEnd - cycleStart;

    // Aggregate measurements
    const avgPageTime = pageTimes.reduce((sum, time) => sum + time, 0) / pageTimes.length;
    const minPageTime = Math.min(...pageTimes);
    const maxPageTime = Math.max(...pageTimes);

    measurements.push(
      { name: 'total_cycle_time', value: totalTime, unit: 'ms' },
      { name: 'total_cycle_js_time', value: cycleDuration, unit: 'ms' },
      { name: 'avg_page_transition', value: avgPageTime, unit: 'ms' },
      { name: 'min_page_transition', value: minPageTime, unit: 'ms' },
      { name: 'max_page_transition', value: maxPageTime, unit: 'ms' }
    );

    // Network metrics
    if (network.apiResponseTimes.length > 0) {
      const avgApiTime = network.apiResponseTimes.reduce((sum, time) => sum + time, 0) / network.apiResponseTimes.length;
      measurements.push({ name: 'avg_api_response_time', value: avgApiTime, unit: 'ms' });
    }

    measurements.push(
      { name: 'total_api_requests', value: network.requestCount, unit: 'count' },
      { name: 'total_network_bytes', value: network.totalBytes, unit: 'bytes' }
    );

    // Memory measurement
    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    result = {
      scenarioName: 'pagination-cycle',
      framework,
      measurements
    };
    return result;
  }
};
