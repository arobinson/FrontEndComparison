import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure, getMemoryMetrics } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';
import { waitForSelectorInShadow } from '../utils/shadow-dom-helpers.js';

/**
 * Helper function to get h1 text from page (traverses shadow DOM)
 */
async function getH1Text(page: any): Promise<string> {
  return page.evaluate(() => {
    function findH1Text(root: Document | ShadowRoot | Element): string | null {
      const h1 = root.querySelector('h1');
      if (h1 && h1.textContent && h1.textContent.trim().length > 0) {
        return h1.textContent.trim();
      }
      const elements = Array.from(root.querySelectorAll('*'));
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.shadowRoot) {
          const result = findH1Text(el.shadowRoot);
          if (result) return result;
        }
      }
      return null;
    }
    return findH1Text(document) || '';
  });
}

/**
 * Wait for h1 text to change from a previous value
 */
async function waitForH1Change(page: any, previousText: string, timeout: number = 10000): Promise<void> {
  await page.waitForFunction(
    (prevText: string) => {
      function findH1Text(root: Document | ShadowRoot | Element): string | null {
        const h1 = root.querySelector('h1');
        if (h1 && h1.textContent && h1.textContent.trim().length > 0) {
          return h1.textContent.trim();
        }
        const elements = Array.from(root.querySelectorAll('*'));
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.shadowRoot) {
            const result = findH1Text(el.shadowRoot);
            if (result) return result;
          }
        }
        return null;
      }
      const currentText = findH1Text(document);
      return currentText !== null && currentText !== prevText;
    },
    previousText,
    { timeout }
  );
}

export const detailNavigationCycleScenario: TestScenario = {
  name: 'detail-navigation-cycle',
  description: 'Load detail page, click next, click prev - measures component update speed (not creation)',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate directly to first product detail page
    const detailUrl = `${baseUrl}/detail/1`;
    const initialLoadStart = Date.now();
    await page.goto(detailUrl, { waitUntil: 'networkidle' });

    // Wait for detail page content to render
    await waitForSelectorInShadow(page, '.product-detail, .product-detail-container, product-detail', { timeout: 30000 });

    // Wait for h1 to appear with content (indicating data loaded)
    await page.waitForFunction(() => {
      function checkForH1(root: Document | ShadowRoot | Element): boolean {
        const h1 = root.querySelector('h1');
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

    const initialLoadEnd = Date.now();

    // Capture the initial h1 text (product 1: "Adjustable Stand for Tablets and Smartphones")
    const product1Title = await getH1Text(page);

    await new Promise((resolve) => setTimeout(resolve, 300));

    measurements.push({
      name: 'initial_detail_load',
      value: initialLoadEnd - initialLoadStart,
      unit: 'ms'
    });

    const memoryBefore = await getMemoryMetrics(page);

    // Start network tracking for navigation operations
    const networkTracker = new NetworkTracker(page);
    networkTracker.start();

    await performanceMark(page, 'detail-cycle-start');
    const cycleStart = Date.now();

    // Click "Next" button to go to product 2
    await performanceMark(page, 'next-start');
    const nextStart = Date.now();

    // Click the Next button (look for .nav-button, .aff-button, or button containing "Next" or "→")
    await page.evaluate(() => {
      function findNextButton(root: Document | ShadowRoot | Element): HTMLElement | null {
        // Search for buttons with nav-button or aff-button class, or any button
        const buttons = root.querySelectorAll('.nav-button, .aff-button, .product-navigation button');
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i] as HTMLElement;
          const text = btn.textContent || '';
          if (text.includes('Next') || text.includes('→')) {
            if (!btn.hasAttribute('disabled')) {
              return btn;
            }
          }
        }
        const elements = Array.from(root.querySelectorAll('*'));
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.shadowRoot) {
            const result = findNextButton(el.shadowRoot);
            if (result) return result;
          }
        }
        return null;
      }
      const nextBtn = findNextButton(document);
      if (nextBtn) {
        nextBtn.click();
      }
    });

    // Wait for h1 text to change from product 1 title to product 2 title
    // Product 2 should be "Californian Raisins"
    await waitForH1Change(page, product1Title, 10000);

    await page.waitForLoadState('networkidle');
    const nextEnd = Date.now();
    await performanceMark(page, 'next-end');

    const nextDuration = await performanceMeasure(page, 'next-navigation', 'next-start', 'next-end');
    const nextTime = nextEnd - nextStart;

    // Capture the product 2 title
    const product2Title = await getH1Text(page);

    measurements.push(
      { name: 'next_navigation_time', value: nextTime, unit: 'ms' },
      { name: 'next_navigation_js', value: nextDuration, unit: 'ms' }
    );

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Click "Previous" button to go back to product 1 (warm state)
    await performanceMark(page, 'prev-start');
    const prevStart = Date.now();

    // Find and click the Previous button (look for .nav-button, .aff-button, or button containing "Previous" or "←")
    await page.evaluate(() => {
      function findPrevButton(root: Document | ShadowRoot | Element): HTMLElement | null {
        // Search for buttons with nav-button or aff-button class, or any button
        const buttons = root.querySelectorAll('.nav-button, .aff-button, .product-navigation button');
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i] as HTMLElement;
          const text = btn.textContent || '';
          if (text.includes('Previous') || text.includes('←')) {
            if (!btn.hasAttribute('disabled')) {
              return btn;
            }
          }
        }
        const elements = Array.from(root.querySelectorAll('*'));
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.shadowRoot) {
            const result = findPrevButton(el.shadowRoot);
            if (result) return result;
          }
        }
        return null;
      }
      const prevBtn = findPrevButton(document);
      if (prevBtn) {
        prevBtn.click();
      }
    });

    // Wait for h1 text to change from product 2 title back to product 1 title
    await waitForH1Change(page, product2Title, 10000);

    await page.waitForLoadState('networkidle');
    const prevEnd = Date.now();
    await performanceMark(page, 'prev-end');

    const prevDuration = await performanceMeasure(page, 'prev-navigation', 'prev-start', 'prev-end');
    const prevTime = prevEnd - prevStart;

    measurements.push(
      { name: 'prev_navigation_time', value: prevTime, unit: 'ms' },
      { name: 'prev_navigation_js', value: prevDuration, unit: 'ms' }
    );

    const cycleEnd = Date.now();
    await performanceMark(page, 'detail-cycle-end');

    networkTracker.stop();
    const network = networkTracker.getMetrics();

    const cycleDuration = await performanceMeasure(page, 'detail-cycle', 'detail-cycle-start', 'detail-cycle-end');
    const totalCycleTime = cycleEnd - cycleStart;

    // Aggregate measurements
    const avgNavTime = (nextTime + prevTime) / 2;

    measurements.push(
      { name: 'total_cycle_time', value: totalCycleTime, unit: 'ms' },
      { name: 'total_cycle_js_time', value: cycleDuration, unit: 'ms' },
      { name: 'avg_navigation_time', value: avgNavTime, unit: 'ms' }
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

    return {
      scenarioName: 'detail-navigation-cycle',
      framework,
      measurements
    };
  }
};
