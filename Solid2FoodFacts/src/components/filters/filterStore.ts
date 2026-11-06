import { createContext, createStore, snapshot } from 'solid-js';

export type RangeFilter = { min?: number; max?: number };
export type FilterValue = string | string[] | RangeFilter;

interface FilterState {
  /** What each filter control currently shows (typed text, typed min/max, selected options) */
  draft: Record<string, FilterValue | undefined>;
  /** The committed value per column that the product list is filtered by */
  applied: Record<string, FilterValue | undefined>;
}

// Copy so applied never aliases the draft object/array
const copy = (value: FilterValue | undefined): FilterValue | undefined =>
  Array.isArray(value) ? [...value] : typeof value === 'object' ? { ...value } : value;

/**
 * Page-scoped filter state, created by ProductList and shared with the filter components via context.
 * `onCommit` runs after every apply/clear (ProductList uses it to return to the first page).
 *
 * Solid 2 store setters are draft-first (produce-style). Writes are batched and only become
 * readable after the microtask flush, so a control that changes and applies in one step uses
 * `commit` (one setter for both) instead of `setDraft` + `apply`.
 */
export function createFilterStore(onCommit?: () => void) {
  const [state, setState] = createStore<FilterState>({ draft: {}, applied: {} });

  return {
    state,
    setDraft(column: string, value: FilterValue) {
      setState((s) => {
        s.draft[column] = value;
      });
    },
    apply(column: string) {
      const value = copy(snapshot(state.draft[column]));
      setState((s) => {
        s.applied[column] = value;
      });
      onCommit?.();
    },
    commit(column: string, value: FilterValue) {
      setState((s) => {
        s.draft[column] = value;
        s.applied[column] = copy(value);
      });
      onCommit?.();
    },
    clear() {
      setState((s) => {
        s.draft = {};
        s.applied = {};
      });
      onCommit?.();
    },
  };
}

export type FilterStore = ReturnType<typeof createFilterStore>;

// Default-less context: useContext(FilterStoreContext) is typed FilterStore and throws without a provider
export const FilterStoreContext = createContext<FilterStore>();
