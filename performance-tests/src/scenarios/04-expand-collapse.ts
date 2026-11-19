import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure } from '../utils/performance-helpers.js';
import { waitForSelectorInShadow } from '../utils/shadow-dom-helpers.js';

/**
 * A single toggle takes ~5-30 ms and lands on frame boundaries, so its median is
 * two-valued and flips bins between runs (A31). The scenario therefore measures
 * TOGGLE_CYCLES expand/collapse cycles across that many DIFFERENT rows (not the
 * same row repeatedly, which would measure a warm path) and reports the total,
 * which is large and unimodal. Each action still waits for its own paint
 * (rAF-polled), so every toggle remains a real settled interaction.
 */
const TOGGLE_CYCLES = 20;

/**
 * Resolve on the first animation frame in which a "Show less" toggle is present (expand) or
 * absent (collapse). Shadow-DOM aware, for Lit. Ends the expand/collapse timing when the change
 * has rendered. Rows are toggled one at a time, so a global presence check is row-accurate:
 * at most one row shows "Show less" at any point in the cycle.
 */
async function waitForShowLess(page: any, present: boolean): Promise<void> {
  await page.waitForFunction(
    (wantPresent: boolean) => {
      function has(root: Document | ShadowRoot): boolean {
        for (const el of Array.from(root.querySelectorAll('button, a'))) {
          if ((((el.textContent?.trim() || (el.getRootNode() as any).host?.textContent) ?? '').trim().toLowerCase()).includes('show less')) return true;
        }
        for (const el of Array.from(root.querySelectorAll('*'))) {
          if (el.shadowRoot && has(el.shadowRoot)) return true;
        }
        return false;
      }
      return has(document) === wantPresent;
    },
    present,
    { polling: 'raf', timeout: 10_000 }
  );
}

/**
 * Find the toggle ("Show more"/"Show less") of the ordinal-th row that has one and stash it on
 * window, so the costlier shadow-aware DOM walk (Lit) stays OUTSIDE the timed window. Rows keep
 * their toggle in both states, so the ordinal is stable across a cycle. Returns the number of
 * toggle rows found (the stash stays empty when ordinal or label has no match).
 */
async function prepareToggle(page: any, ordinal: number, label: 'show more' | 'show less'): Promise<number> {
  return page.evaluate(
    (args: { ordinal: number; label: string }) => {
      function* walk(root: Document | ShadowRoot | Element): Generator<Element> {
        for (const el of Array.from(root.querySelectorAll('*'))) {
          yield el;
          if (el.shadowRoot) yield* walk(el.shadowRoot);
        }
      }
      const toggleText = (el: Element) =>
        (((el.textContent?.trim() || (el.getRootNode() as any).host?.textContent) ?? '').trim().toLowerCase());
      function toggleIn(row: Element, wanted?: string): HTMLElement | null {
        for (const el of walk(row)) {
          if (!el.matches('button, a')) continue;
          const text = toggleText(el);
          if (text.includes('show more') || text.includes('show less')) {
            if (!wanted || text.includes(wanted)) return el as HTMLElement;
          }
        }
        return null;
      }
      const toggleRows: Element[] = [];
      for (const el of walk(document)) {
        if (el.matches('tbody tr') && toggleIn(el)) toggleRows.push(el);
      }
      (window as any).__preparedToggle =
        (toggleRows[args.ordinal] && toggleIn(toggleRows[args.ordinal], args.label)) || null;
      return toggleRows.length;
    },
    { ordinal, label }
  );
}

/** Click the stashed toggle; the timed window contains only this click and the paint wait. */
async function clickPreparedToggle(page: any): Promise<void> {
  const clicked = await page.evaluate(() => {
    const el = (window as any).__preparedToggle as HTMLElement | null;
    (window as any).__preparedToggle = null;
    if (el) el.click();
    return !!el;
  });
  if (!clicked) {
    throw new Error('No prepared toggle to click (ordinal or label did not match)');
  }
}

export const expandCollapseScenario: TestScenario = {
  name: 'expand-collapse-description',
  description: `${TOGGLE_CYCLES} expand/collapse cycles across ${TOGGLE_CYCLES} different truncated rows; total duration`,

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to the list page
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for table (shadow-aware)
    await waitForSelectorInShadow(page, 'table', { timeout: 30000 });

    // The mock data must provide enough truncated rows (27 of the default 50 qualify)
    const toggleRowCount = await prepareToggle(page, -1, 'show more');
    if (toggleRowCount < TOGGLE_CYCLES) {
      throw new Error(`Only ${toggleRowCount} rows have a Show more toggle; need ${TOGGLE_CYCLES}`);
    }

    // Get initial CLS
    const clsBefore = await page.evaluate(() => {
      return (window as any).__webVitals?.cls || 0;
    });

    const cycleDurations: number[] = [];
    let totalWallTime = 0;

    const cycleStart = Date.now();
    for (let k = 0; k < TOGGLE_CYCLES; k++) {
      // Expand the k-th truncated row; the clock stops on the frame the toggle has rendered
      await prepareToggle(page, k, 'show more');
      await performanceMark(page, `toggle-${k}-expand-start`);
      const expandWallStart = Date.now();
      await clickPreparedToggle(page);
      await waitForShowLess(page, true);
      await performanceMark(page, `toggle-${k}-expand-end`);
      const expandDuration = await performanceMeasure(page, `toggle-${k}-expand`, `toggle-${k}-expand-start`, `toggle-${k}-expand-end`);
      totalWallTime += Date.now() - expandWallStart;

      // Collapse the same row again before moving on, so one row is open at a time
      await prepareToggle(page, k, 'show less');
      await performanceMark(page, `toggle-${k}-collapse-start`);
      const collapseWallStart = Date.now();
      await clickPreparedToggle(page);
      await waitForShowLess(page, false);
      await performanceMark(page, `toggle-${k}-collapse-end`);
      const collapseDuration = await performanceMeasure(page, `toggle-${k}-collapse`, `toggle-${k}-collapse-start`, `toggle-${k}-collapse-end`);
      totalWallTime += Date.now() - collapseWallStart;

      cycleDurations.push(expandDuration + collapseDuration);
    }
    const totalElapsed = Date.now() - cycleStart;

    const totalDuration = cycleDurations.reduce((sum, d) => sum + d, 0);

    measurements.push(
      { name: 'total_toggle_duration', value: totalDuration, unit: 'ms' },
      { name: 'total_toggle_wall_time', value: totalWallTime, unit: 'ms' },
      { name: 'total_elapsed_time', value: totalElapsed, unit: 'ms' },
      { name: 'avg_cycle_duration', value: totalDuration / TOGGLE_CYCLES, unit: 'ms' },
      { name: 'max_cycle_duration', value: Math.max(...cycleDurations), unit: 'ms' }
    );

    // Per-cycle sub-timings for the raw data
    cycleDurations.forEach((duration, k) => {
      measurements.push({ name: `cycle_${k + 1}_duration`, value: duration, unit: 'ms' });
    });

    // CLS across all cycles (every expand is undone, so the net shift should stay ~0)
    const clsAfter = await page.evaluate(() => {
      return (window as any).__webVitals?.cls || 0;
    });
    measurements.push({ name: 'cls_delta', value: clsAfter - clsBefore, unit: 'score' });

    result = {
      scenarioName: 'expand-collapse-description',
      framework,
      measurements
    };
    return result;
  }
};
