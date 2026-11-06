import { createContext, useContext } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

export type RangeFilter = { min?: number; max?: number };
export type FilterValue = string | string[] | RangeFilter;

interface FilterState {
  /** What each filter control currently shows (typed text, typed min/max, selected options) */
  draft: Record<string, FilterValue | undefined>;
  /** The committed value per column that the product list is filtered by */
  applied: Record<string, FilterValue | undefined>;
}

/**
 * Page-scoped filter state, created by ProductList and shared with the filter components via context.
 * `onCommit` runs after every apply/clear (ProductList uses it to return to the first page).
 */
export function createFilterStore(onCommit?: () => void) {
  const [state, setState] = createStore<FilterState>({ draft: {}, applied: {} });

  return {
    state,
    setDraft(column: string, value: FilterValue) {
      // Merging { [column]: value } into `draft` replaces that column's value outright
      // (a nested path setter would merge range objects and keep a cleared bound).
      setState('draft', { [column]: value });
    },
    apply(column: string) {
      // Copy so applied never aliases the draft object/array
      const value = unwrap(state.draft[column]);
      setState('applied', {
        [column]: Array.isArray(value) ? [...value] : typeof value === 'object' ? { ...value } : value,
      });
      onCommit?.();
    },
    clear() {
      setState({ draft: {}, applied: {} });
      onCommit?.();
    },
  };
}

export type FilterStore = ReturnType<typeof createFilterStore>;

export const FilterStoreContext = createContext<FilterStore>();

export function useFilterStore(): FilterStore {
  const store = useContext(FilterStoreContext);
  if (!store) throw new Error('useFilterStore must be used inside <FilterStoreContext.Provider>');
  return store;
}
