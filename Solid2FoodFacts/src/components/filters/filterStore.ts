import { createStore } from 'solid-js';

export type RangeFilter = { min?: number; max?: number };
export type FilterValue = string | string[] | RangeFilter;

interface FilterState {
  /** What each filter control shows while it is being edited (typed text, typed min/max, selected options) */
  draft: Record<string, FilterValue | undefined>;
}

/**
 * Page-scoped filter drafts, owned by ProductList, which wires each filter control's value/events
 * to them. The applied filters live in the page URL.
 */
export function createFilterStore() {
  const [state, setState] = createStore<FilterState>({ draft: {} });

  return {
    state,
    setDraft(column: string, value: FilterValue) {
      setState((s) => {
        s.draft[column] = value;
      });
    },
    clear() {
      setState((s) => {
        s.draft = {};
      });
    },
  };
}

export type FilterStore = ReturnType<typeof createFilterStore>;
