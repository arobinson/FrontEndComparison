import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { getWebVitals, getMemoryMetrics } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';

export const navigateToDetailScenario: TestScenario = {
  name: 'navigate-to-detail',
  description: 'Click product link and measure detail page load time',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to list and wait for table to render
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('tbody tr', { timeout: 30000 });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const memoryBefore = await getMemoryMetrics(page);

    // Start network tracking for detail page
    const networkTracker = new NetworkTracker(page);
    networkTracker.start();

    // Click first product link
    const navigationStart = Date.now();

    await page.evaluate(() => {
      const firstProductLink = document.querySelector('tbody tr:first-child td:first-child a');
      if (firstProductLink) {
        (firstProductLink as HTMLElement).click();
      }
    });

    // Wait for detail page content to actually render
    // Look for the product detail container and the product name (h1)
    await page.waitForSelector('.product-detail, .product-detail-container', { timeout: 30000 });
    await page.waitForSelector('.header-section h1', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    const navigationEnd = Date.now();

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Collect metrics
    const webVitals = await getWebVitals(page);
    const memoryAfter = await getMemoryMetrics(page);
    networkTracker.stop();
    const network = networkTracker.getMetrics();

    const totalTime = navigationEnd - navigationStart;
    measurements.push({ name: 'total_navigation_time', value: totalTime, unit: 'ms' });

    measurements.push(
      { name: 'detail_lcp', value: webVitals.lcp ?? 0, unit: 'ms' },
      { name: 'detail_cls', value: webVitals.cls ?? 0, unit: 'score' }
    );

    const memoryDelta = memoryAfter.usedHeapSize - memoryBefore.usedHeapSize;
    measurements.push({ name: 'memory_delta', value: memoryDelta, unit: 'bytes' });

    measurements.push(
      { name: 'detail_request_count', value: network.requestCount, unit: 'count' },
      { name: 'detail_total_bytes', value: network.totalBytes, unit: 'bytes' }
    );

    result = {
      scenarioName: 'navigate-to-detail',
      framework,
      measurements
    };
    return result;
  }
};
