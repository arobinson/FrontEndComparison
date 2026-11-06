import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { getWebVitals, getInteractivityMetrics, getMemoryMetrics, waitForTimeToTable } from '../utils/performance-helpers.js';
import { NetworkTracker } from '../utils/network-tracker.js';

export const initialLoadScenario: TestScenario = {
  name: 'initial-page-load',
  description: 'Navigate to application root and measure cold start performance',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Start network tracking
    const networkTracker = new NetworkTracker(page);
    networkTracker.start();

    // Navigate to the application
    const navigationStart = Date.now();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    // Legacy metric (kept for comparison with 2025-12): 'networkidle' can fire while a long
    // render task is still blocking the main thread, so it under-reports slow renders.
    const navigationEnd = Date.now();

    // Primary metric: when the data table is actually on screen
    const timeToTable = await waitForTimeToTable(page);
    measurements.push({ name: 'time_to_table', value: timeToTable, unit: 'ms' });

    // Let paints/observers settle after the table renders before reading LCP/TBT
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Collect Web Vitals
    const webVitals = await getWebVitals(page);
    measurements.push(
      { name: 'fcp', value: webVitals.fcp ?? 0, unit: 'ms' },
      { name: 'lcp', value: webVitals.lcp ?? 0, unit: 'ms' },
      { name: 'cls', value: webVitals.cls ?? 0, unit: 'score' }
    );

    if (webVitals.fid !== undefined) {
      measurements.push({ name: 'fid', value: webVitals.fid, unit: 'ms' });
    }

    // Collect interactivity metrics
    const interactivity = await getInteractivityMetrics(page);
    measurements.push({ name: 'tti', value: interactivity.tti, unit: 'ms' }, { name: 'tbt', value: interactivity.tbt, unit: 'ms' });

    // Collect memory metrics
    const memory = await getMemoryMetrics(page);
    measurements.push(
      { name: 'initial_heap_size', value: memory.heapSize, unit: 'bytes' },
      { name: 'initial_used_heap', value: memory.usedHeapSize, unit: 'bytes' }
    );

    // Collect network metrics
    networkTracker.stop();
    const network = networkTracker.getMetrics();
    measurements.push(
      { name: 'request_count', value: network.requestCount, unit: 'count' },
      { name: 'total_bytes', value: network.totalBytes, unit: 'bytes' },
      { name: 'network_duration', value: network.totalDuration, unit: 'ms' },
      { name: 'largest_request', value: network.largestRequestSize, unit: 'bytes' }
    );

    if (network.apiResponseTimes.length > 0) {
      const avgApiTime = network.apiResponseTimes.reduce((sum, time) => sum + time, 0) / network.apiResponseTimes.length;
      measurements.push({ name: 'avg_api_response_time', value: avgApiTime, unit: 'ms' });
    }

    // Total navigation time
    const totalNavigationTime = navigationEnd - navigationStart;
    measurements.push({ name: 'total_navigation_time', value: totalNavigationTime, unit: 'ms' });

    result = {
      scenarioName: 'initial-page-load',
      framework,
      measurements
    };
    return result;
  }
};
