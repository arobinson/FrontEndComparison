import { Page } from 'playwright';
import { WebVitals, MemoryMetrics, NetworkMetrics } from '../types.js';

/**
 * Inject performance measurement code into the page
 * This allows us to capture Web Vitals using PerformanceObserver API
 */
export async function injectPerformanceObservers(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Store Web Vitals data on window object
    (window as any).__webVitals = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      measurements: []
    };

    // FCP - First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.name === 'first-contentful-paint') {
          (window as any).__webVitals.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // LCP - Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        (window as any).__webVitals.lcp = lastEntry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS - Cumulative Layout Shift
    let clsScore = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value;
        }
      }
      (window as any).__webVitals.cls = clsScore;
    }).observe({ type: 'layout-shift', buffered: true });

    // FID - First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        (window as any).__webVitals.fid = (entry as any).processingStart - entry.startTime;
      }
    }).observe({ type: 'first-input', buffered: true });

    // Long tasks. Chrome does NOT expose these via performance.getEntriesByType('longtask'),
    // only via an observer - reading the timeline directly always returned [] (TBT was always 0).
    (window as any).__longTasks = [] as Array<{ start: number; duration: number }>;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        (window as any).__longTasks.push({ start: entry.startTime, duration: entry.duration });
      }
    }).observe({ type: 'longtask', buffered: true });

    // Time to table: first animation frame in which >= 10 table rows exist (shadow-DOM aware,
    // for Lit). Recorded in-page relative to navigation start, so it measures when the user can
    // actually see data - unlike waitUntil 'networkidle', which fires during a long render task
    // because the network goes quiet while the main thread is blocked.
    (window as any).__timeToTable = 0;
    const MIN_ROWS = 10;
    const countRows = (root: Document | ShadowRoot): number => {
      let count = root.querySelectorAll('tbody tr').length;
      if (count >= MIN_ROWS) return count;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          count += countRows(el.shadowRoot);
          if (count >= MIN_ROWS) break;
        }
      }
      return count;
    };
    const pollStart = performance.now();
    const poll = () => {
      if (countRows(document) >= MIN_ROWS) {
        // Read the clock here, NOT the rAF callback's timestamp argument: that is the frame's
        // scheduled start, which stays stale when a long task delays the callback (it reported
        // ~150ms for a table that rendered at ~1900ms).
        (window as any).__timeToTable = performance.now();
        return;
      }
      if (performance.now() - pollStart < 30_000) requestAnimationFrame(poll);
    };
    requestAnimationFrame(poll);
  });
}

/**
 * Wait until the in-page time-to-table mark has been recorded (see injectPerformanceObservers).
 * Returns the timestamp in ms since navigation start.
 */
export async function waitForTimeToTable(page: Page, timeout: number = 30_000): Promise<number> {
  await page.waitForFunction(() => (window as any).__timeToTable > 0, undefined, { timeout, polling: 50 });
  return page.evaluate(() => (window as any).__timeToTable as number);
}

/**
 * Retrieve Web Vitals from the page
 */
export async function getWebVitals(page: Page): Promise<Partial<WebVitals>> {
  const vitals = await page.evaluate(() => {
    return (window as any).__webVitals || {};
  });

  return {
    fcp: vitals.fcp || 0,
    lcp: vitals.lcp || 0,
    cls: vitals.cls || 0,
    fid: vitals.fid || undefined
  };
}

/**
 * Calculate TTI (Time to Interactive) and TBT (Total Blocking Time)
 * Using performance timeline entries
 */
export async function getInteractivityMetrics(page: Page): Promise<{ tti: number; tbt: number }> {
  const metrics = await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
    // Collected by the observer in injectPerformanceObservers (getEntriesByType('longtask') is always empty)
    const longTasks: Array<{ duration: number }> = (window as any).__longTasks ?? [];

    let tbt = 0;
    for (const task of longTasks) {
      const blockingTime = task.duration - 50; // Tasks over 50ms are blocking
      if (blockingTime > 0) {
        tbt += blockingTime;
      }
    }

    // TTI approximation: domInteractive from navigation timing
    const tti = navigationEntry?.domInteractive || 0;

    return { tti, tbt };
  });

  return metrics;
}

/**
 * Get memory metrics using Chrome DevTools Protocol
 * Note: Chrome rounds memory values to nearest 100KB for security,
 * so small memory changes may not be detectable
 */
export async function getMemoryMetrics(page: Page): Promise<MemoryMetrics> {
  // Small delay to allow any pending GC to complete
  await new Promise((resolve) => setTimeout(resolve, 100));

  const client = await page.context().newCDPSession(page);

  // Get heap statistics from browser
  const heapStats = await page.evaluate(() => {
    if ((performance as any).memory) {
      return {
        usedHeapSize: (performance as any).memory.usedJSHeapSize,
        totalHeapSize: (performance as any).memory.totalJSHeapSize,
        heapLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }
    return null;
  });

  await client.detach();

  let result: MemoryMetrics;
  if (heapStats) {
    result = {
      heapSize: heapStats.totalHeapSize,
      usedHeapSize: heapStats.usedHeapSize,
      heapLimit: heapStats.heapLimit
    };
  } else {
    result = {
      heapSize: 0,
      usedHeapSize: 0,
      heapLimit: 0
    };
  }
  return result;
}

/**
 * Create a performance mark
 */
export async function performanceMark(page: Page, markName: string): Promise<void> {
  await page.evaluate((name) => {
    performance.mark(name);
  }, markName);
}

/**
 * Measure performance between two marks
 */
export async function performanceMeasure(page: Page, measureName: string, startMark: string, endMark: string): Promise<number> {
  const duration: number = await page.evaluate(
    ({ name, start, end }: { name: string; start: string; end: string }) => {
      performance.measure(name, start, end);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      return measure ? measure.duration : 0;
    },
    { name: measureName, start: startMark, end: endMark }
  );

  return duration;
}

/**
 * Wait for a specific condition with timeout
 */
export async function waitForCondition(page: Page, condition: () => Promise<boolean>, timeout: number = 5000): Promise<boolean> {
  let result: boolean;
  const startTime = Date.now();

  const checkCondition = async (): Promise<boolean> => {
    let conditionResult: boolean;
    if (Date.now() - startTime > timeout) {
      conditionResult = false;
    } else {
      const isConditionMet = await condition();
      if (isConditionMet) {
        conditionResult = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
        conditionResult = await checkCondition();
      }
    }
    return conditionResult;
  };

  result = await checkCondition();
  return result;
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}
