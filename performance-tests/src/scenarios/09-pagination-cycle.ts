import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';

export const paginationCycleScenario: TestScenario = {
  name: 'pagination-cycle',
  description: 'Navigate pages 1→2→3→2→1 and measure cumulative performance',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise(resolve => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Start network tracking for all pagination operations
    const networkTracker = new NetworkTracker(page);
    networkTracker.start();

    // Define the page sequence: 1→2→3→2→1
    const pageSequence = [2, 3, 2, 1];
    const pageTimes: number[] = [];

    await performanceMark(page, 'pagination-cycle-start');
    const cycleStart = Date.now();

    for (let i = 0; i < pageSequence.length; i++) {
      const targetPage = pageSequence[i];

      await performanceMark(page, `page-${i}-start`);
      const pageStart = Date.now();

      // Click the page number button
      await page.evaluate((pageNum: number) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const pageButton = buttons.find(btn => {
          const text = btn.textContent?.trim() || '';
          return text === String(pageNum);
        });

        if (pageButton) {
          (pageButton as HTMLElement).click();
        }
      }, targetPage);

      // Wait for table to update
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
            }, 200);
          });

          observer.observe(tbody, { childList: true, subtree: true });

          // Increased timeout to 10 seconds to ensure we capture full transition times
          setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 10000);
        });
      });

      const pageEnd = Date.now();
      await performanceMark(page, `page-${i}-end`);

      const pageDuration = await performanceMeasure(page, `page-${i}`, `page-${i}-start`, `page-${i}-end`);
      const pageTime = pageEnd - pageStart;
      pageTimes.push(pageTime);

      measurements.push({
        name: `page_transition_${i + 1}_to_${targetPage}`,
        value: pageTime,
        unit: 'ms'
      });
      measurements.push({
        name: `page_transition_${i + 1}_to_${targetPage}_js`,
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
      measurements,
    };
    return result;
  },
};
