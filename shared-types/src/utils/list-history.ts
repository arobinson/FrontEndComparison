/**
 * "Back to list" from a product page: returns to the list entry in this tab's history,
 * so the list comes back on the page and with the filters it was left on (they are in
 * its URL), skipping any product-to-product steps in between. Uses the Navigation API.
 *
 * Returns false when the product page was opened without the list before it in history
 * (a direct link, a reload of the product page); the caller then opens the list instead.
 */
export function traverseBackToList(): boolean {
  if (typeof navigation === 'undefined' || !navigation.currentEntry) {
    return false;
  }
  // /react/detail/123 -> /react/list
  const listPath = location.pathname.replace(/\/detail\/[^/]*$/, '/list');
  const entries = navigation.entries();
  for (let index = navigation.currentEntry.index - 1; index >= 0; index--) {
    const url = entries[index].url;
    if (url && new URL(url).pathname === listPath) {
      navigation.traverseTo(entries[index].key);
      return true;
    }
  }
  return false;
}

// Products expanded on the list view whose URL query is `search`. Kept in memory so they
// are still open after a visit to a product, but cleared whenever the list itself
// navigates (page, page size, filters): a page shown again starts collapsed.
let expanded: { search: string; codes: readonly string[] } = { search: '', codes: [] };

/** The product codes expanded the last time the list showed this query ([] if it showed another since). */
export function rememberedExpanded(search: string): readonly string[] {
  return expanded.search === search ? expanded.codes : [];
}

/** Records the expanded products for the list view with this query. */
export function rememberExpanded(search: string, codes: readonly string[]): void {
  expanded = { search, codes };
}
