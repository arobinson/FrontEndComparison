import { TestScenario, TestContext, ScenarioResult, Measurement } from '../types.js';
import { performanceMark, performanceMeasure } from '../utils/performance-helpers.js';
import { clickInShadow, waitForSelectorInShadow } from '../utils/shadow-dom-helpers.js';

export const expandCollapseScenario: TestScenario = {
  name: 'expand-collapse-description',
  description: 'Click Show more/less link in truncated description field',

  run: async (context: TestContext): Promise<ScenarioResult> => {
    let result: ScenarioResult;
    const { page, baseUrl, framework } = context;
    const measurements: Measurement[] = [];

    // Navigate to the list page
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for table (shadow-aware)
    await waitForSelectorInShadow(page, 'table', { timeout: 30000 });

    // Find the first "Show more" link in description column (shadow-aware)
    const showMoreLink = await page.evaluate(() => {
      function findInShadow(root: Document | ShadowRoot | Element, predicate: (el: Element) => boolean): Element | null {
        const elements = Array.from(root.querySelectorAll('button, a'));
        for (const el of elements) {
          if (predicate(el)) return el;
        }
        const allElements = Array.from(root.querySelectorAll('*'));
        for (const el of allElements) {
          if (el.shadowRoot) {
            const found = findInShadow(el.shadowRoot, predicate);
            if (found) return found;
          }
        }
        return null;
      }

      const showMore = findInShadow(document, (el) => {
        const text = el.textContent?.trim().toLowerCase() || '';
        return text.includes('show more') || text.includes('more');
      });

      if (!showMore) {
        return null;
      }

      return {
        tag: showMore.tagName,
        text: showMore.textContent?.trim()
      };
    });

    if (!showMoreLink) {
      throw new Error('Could not find "Show more" link in description');
    }

    // Get initial CLS
    const clsBefore = await page.evaluate(() => {
      return (window as any).__webVitals?.cls || 0;
    });

    // Test expand operation
    await performanceMark(page, 'expand-start');
    const expandStart = Date.now();

    // Click show more (shadow-aware)
    await page.evaluate(() => {
      function findInShadow(root: Document | ShadowRoot | Element, predicate: (el: Element) => boolean): Element | null {
        const elements = Array.from(root.querySelectorAll('button, a'));
        for (const el of elements) {
          if (predicate(el)) return el;
        }
        const allElements = Array.from(root.querySelectorAll('*'));
        for (const el of allElements) {
          if (el.shadowRoot) {
            const found = findInShadow(el.shadowRoot, predicate);
            if (found) return found;
          }
        }
        return null;
      }

      const showMore = findInShadow(document, (el) => {
        const text = el.textContent?.trim().toLowerCase() || '';
        return text.includes('show more') || text.includes('more');
      });
      if (showMore) {
        (showMore as HTMLElement).click();
      }
    });

    // Wait for text to expand
    await new Promise((resolve) => setTimeout(resolve, 100));

    const expandEnd = Date.now();
    await performanceMark(page, 'expand-end');

    const expandDuration = await performanceMeasure(page, 'expand-operation', 'expand-start', 'expand-end');
    const expandTotalTime = expandEnd - expandStart;

    measurements.push(
      { name: 'expand_duration', value: expandDuration, unit: 'ms' },
      { name: 'expand_total_time', value: expandTotalTime, unit: 'ms' }
    );

    // Get CLS after expand
    const clsAfterExpand = await page.evaluate(() => {
      return (window as any).__webVitals?.cls || 0;
    });
    const clsDeltaExpand = clsAfterExpand - clsBefore;
    measurements.push({ name: 'expand_cls_delta', value: clsDeltaExpand, unit: 'score' });

    // Now test collapse operation
    await new Promise((resolve) => setTimeout(resolve, 200));

    await performanceMark(page, 'collapse-start');
    const collapseStart = Date.now();

    // Click show less (shadow-aware)
    await page.evaluate(() => {
      function findInShadow(root: Document | ShadowRoot | Element, predicate: (el: Element) => boolean): Element | null {
        const elements = Array.from(root.querySelectorAll('button, a'));
        for (const el of elements) {
          if (predicate(el)) return el;
        }
        const allElements = Array.from(root.querySelectorAll('*'));
        for (const el of allElements) {
          if (el.shadowRoot) {
            const found = findInShadow(el.shadowRoot, predicate);
            if (found) return found;
          }
        }
        return null;
      }

      const showLess = findInShadow(document, (el) => {
        const text = el.textContent?.trim().toLowerCase() || '';
        return text.includes('show less') || text.includes('less');
      });
      if (showLess) {
        (showLess as HTMLElement).click();
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const collapseEnd = Date.now();
    await performanceMark(page, 'collapse-end');

    const collapseDuration = await performanceMeasure(page, 'collapse-operation', 'collapse-start', 'collapse-end');
    const collapseTotalTime = collapseEnd - collapseStart;

    measurements.push(
      { name: 'collapse_duration', value: collapseDuration, unit: 'ms' },
      { name: 'collapse_total_time', value: collapseTotalTime, unit: 'ms' }
    );

    // Get CLS after collapse
    const clsAfterCollapse = await page.evaluate(() => {
      return (window as any).__webVitals?.cls || 0;
    });
    const clsDeltaCollapse = clsAfterCollapse - clsAfterExpand;
    measurements.push({ name: 'collapse_cls_delta', value: clsDeltaCollapse, unit: 'score' });

    result = {
      scenarioName: 'expand-collapse-description',
      framework,
      measurements
    };
    return result;
  }
};
