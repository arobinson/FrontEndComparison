import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';

export const paginationScenario: TestScenario = {
  name: 'pagination',
  description: 'Click next page button and measure page load time',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Get the last row's product code before pagination
    const lastRowCodeBefore = await page.evaluate(() => {
      const lastRow = document.querySelector('tbody tr:last-child td:first-child');
      return lastRow?.textContent?.trim() ?? '';
    });

    // Find the next page button
    const nextButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const next = buttons.find((btn) => {
        const text = btn.textContent?.trim().toLowerCase() || '';
        return text.includes('next') || text.includes('>') || text === '2';
      });

      return next ? true : false;
    });

    if (!nextButton) {
      throw new Error('Could not find next page button');
    }

    // Start network tracking
    const networkTracker = new NetworkTracker(page);
    networkTracker.start();

    await performanceMark(page, 'pagination-start');
    const operationStart = Date.now();

    // Click next page
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const next = buttons.find((btn) => {
        const text = btn.textContent?.trim().toLowerCase() || '';
        return text.includes('next') || text.includes('>') || text === '2';
      });

      if (next) {
        (next as HTMLElement).click();
      }
    });

    // Wait for last row's product code to change (page fully loaded)
    await page.waitForFunction(
      (previousCode: string) => {
        const lastRow = document.querySelector('tbody tr:last-child td:first-child');
        const currentCode = lastRow?.textContent?.trim() ?? '';
        return currentCode !== previousCode;
      },
      lastRowCodeBefore,
      { timeout: 5000 }
    );

    const operationEnd = Date.now();
    await performanceMark(page, 'pagination-end');

    networkTracker.stop();
    const network = networkTracker.getMetrics();

    const paginationDuration = await performanceMeasure(page, 'pagination-operation', 'pagination-start', 'pagination-end');
    const totalTime = operationEnd - operationStart;

    measurements.push(
      { name: 'pagination_duration', value: paginationDuration, unit: 'ms' },
      { name: 'total_pagination_time', value: totalTime, unit: 'ms' }
    );

    // Network metrics for API call
    if (network.apiResponseTimes.length > 0) {
      const apiTime = network.apiResponseTimes[network.apiResponseTimes.length - 1];
      measurements.push({ name: 'api_response_time', value: apiTime, unit: 'ms' });
    }

    measurements.push({ name: 'network_bytes', value: network.totalBytes, unit: 'bytes' });

    // Render time (total time - network time)
    const networkTime = network.apiResponseTimes[0] || 0;
    const renderTime = totalTime - networkTime;
    measurements.push({ name: 'render_time', value: renderTime, unit: 'ms' });

    const memoryAfter = await getMemoryMetrics(page);
    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    result = {
      scenarioName: 'pagination',
      framework,
      measurements
    };
    return result;
  }
};
