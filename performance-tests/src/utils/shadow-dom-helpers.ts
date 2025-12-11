import { Page } from 'playwright';

/**
 * JavaScript code that can be injected into page.evaluate() or page.waitForFunction()
 * to find elements that may be inside shadow DOM.
 */
export const shadowDomHelpers = {
  /**
   * Find a single element by selector, traversing shadow DOM if needed.
   * Returns the element or null if not found.
   */
  findInShadow: `
    function findInShadow(root, selector) {
      const found = root.querySelector(selector);
      if (found) return found;
      const elements = Array.from(root.querySelectorAll('*'));
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.shadowRoot) {
          const result = findInShadow(el.shadowRoot, selector);
          if (result) return result;
        }
      }
      return null;
    }
  `,

  /**
   * Count elements matching selector, traversing shadow DOM if needed.
   */
  countInShadow: `
    function countInShadow(root, selector) {
      const found = root.querySelectorAll(selector);
      if (found.length > 0) return found.length;
      const elements = Array.from(root.querySelectorAll('*'));
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.shadowRoot) {
          const count = countInShadow(el.shadowRoot, selector);
          if (count > 0) return count;
        }
      }
      return 0;
    }
  `,

  /**
   * Check if an element exists matching selector, traversing shadow DOM if needed.
   */
  existsInShadow: `
    function existsInShadow(root, selector) {
      if (root.querySelector(selector)) return true;
      const elements = Array.from(root.querySelectorAll('*'));
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.shadowRoot && existsInShadow(el.shadowRoot, selector)) return true;
      }
      return false;
    }
  `
};

/**
 * Click an element by selector, traversing shadow DOM if needed.
 */
export async function clickInShadow(page: Page, selector: string): Promise<void> {
  // First try regular locator (faster for light DOM)
  const locator = page.locator(selector).first();
  if (await locator.count() > 0) {
    await locator.click();
    return;
  }

  // Fallback to shadow DOM traversal
  await page.evaluate((sel) => {
    function findInShadow(root: Document | ShadowRoot | Element, selector: string): Element | null {
      const found = root.querySelector(selector);
      if (found) return found;
      const elements = Array.from(root.querySelectorAll('*'));
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.shadowRoot) {
          const result = findInShadow(el.shadowRoot, selector);
          if (result) return result;
        }
      }
      return null;
    }
    const element = findInShadow(document, sel);
    if (element) {
      (element as HTMLElement).click();
    }
  }, selector);
}

/**
 * Wait for an element to exist, traversing shadow DOM if needed.
 */
export async function waitForSelectorInShadow(
  page: Page,
  selector: string,
  options: { timeout?: number } = {}
): Promise<void> {
  const timeout = options.timeout ?? 30000;

  await page.waitForFunction(
    (sel) => {
      function existsInShadow(root: Document | ShadowRoot | Element, selector: string): boolean {
        if (root.querySelector(selector)) return true;
        const elements = Array.from(root.querySelectorAll('*'));
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.shadowRoot && existsInShadow(el.shadowRoot, selector)) return true;
        }
        return false;
      }
      return existsInShadow(document, sel);
    },
    selector,
    { timeout }
  );
}

/**
 * Wait for a minimum count of elements matching selector, traversing shadow DOM if needed.
 */
export async function waitForCountInShadow(
  page: Page,
  selector: string,
  minCount: number,
  options: { timeout?: number } = {}
): Promise<void> {
  const timeout = options.timeout ?? 30000;

  await page.waitForFunction(
    ({ sel, min }) => {
      function countInShadow(root: Document | ShadowRoot | Element, selector: string): number {
        const found = root.querySelectorAll(selector);
        if (found.length > 0) return found.length;
        const elements = Array.from(root.querySelectorAll('*'));
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.shadowRoot) {
            const count = countInShadow(el.shadowRoot, selector);
            if (count > 0) return count;
          }
        }
        return 0;
      }
      return countInShadow(document, sel) >= min;
    },
    { sel: selector, min: minCount },
    { timeout }
  );
}

/**
 * Get count of elements matching selector, traversing shadow DOM if needed.
 */
export async function getCountInShadow(page: Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    function countInShadow(root: Document | ShadowRoot | Element, selector: string): number {
      const found = root.querySelectorAll(selector);
      if (found.length > 0) return found.length;
      const elements = Array.from(root.querySelectorAll('*'));
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.shadowRoot) {
          const count = countInShadow(el.shadowRoot, selector);
          if (count > 0) return count;
        }
      }
      return 0;
    }
    return countInShadow(document, sel);
  }, selector);
}
