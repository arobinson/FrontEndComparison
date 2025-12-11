import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { getWebVitals, getMemoryMetrics } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';
import { clickInShadow, waitForSelectorInShadow } from '../utils/shadow-dom-helpers.js';

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

    // Click first product link (handles both light DOM and shadow DOM)
    const navigationStart = Date.now();
    await clickInShadow(page, 'tbody tr:first-child td:first-child a');

    // Wait for detail page content to render (handles shadow DOM)
    await waitForSelectorInShadow(page, '.product-detail, .product-detail-container, product-detail', { timeout: 30000 });

    // Wait for h1 to appear with content (indicating data loaded)
    await page.waitForFunction(() => {
      function checkForH1(root: Document | ShadowRoot | Element): boolean {
        const h1 = root.querySelector('.header-section h1, h1');
        if (h1 && h1.textContent && h1.textContent.trim().length > 0) return true;
        const elements = Array.from(root.querySelectorAll('*'));
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.shadowRoot && checkForH1(el.shadowRoot)) return true;
        }
        return false;
      }
      return checkForH1(document);
    }, { timeout: 30000 });
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
