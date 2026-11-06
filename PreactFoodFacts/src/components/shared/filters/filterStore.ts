import { createContext } from 'preact';
import { useContext, useReducer } from 'preact/hooks';

// Page-scoped filter store: Context + useReducer ("Scaling Up with Reducer and
// Context"), using Preact core only. ProductList owns the reducer and provides
// it, so the store lives and dies with the list page.

export interface RangeValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeValue | string[];

export interface FilterState {
  // What each control currently shows (typed text, typed min/max, selection).
  drafts: Record<string, FilterValue | undefined>;
  // What the table is filtered by (committed on blur/Enter/toggle).
  applied: Record<string, FilterValue | undefined>;
}

export type FilterAction =
  | { type: 'setDraft'; column: string; value: FilterValue }
  | { type: 'apply'; column: string }
  | { type: 'clear' };

export interface FilterActions {
  setDraft: (column: string, value: FilterValue) => void;
  apply: (column: string) => void;
  clear: () => void;
}

const initialFilterState: FilterState = { drafts: {}, applied: {} };

// A range filter only carries the bounds that are set.
const toApplied = (draft: FilterValue | undefined): FilterValue | undefined => {
  if (draft === undefined || typeof draft === 'string' || Array.isArray(draft)) {
    return draft;
  }
  const result: RangeValue = {};
  if (draft.min !== undefined) {
    result.min = draft.min;
  }
  if (draft.max !== undefined) {
    result.max = draft.max;
  }
  return result;
};

export const filtersReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'setDraft':
      return { ...state, drafts: { ...state.drafts, [action.column]: action.value } };
    case 'apply':
      return {
        ...state,
        applied: { ...state.applied, [action.column]: toApplied(state.drafts[action.column]) },
      };
    case 'clear':
      return { drafts: {}, applied: {} };
  }
};

export const useFiltersReducer = () => useReducer(filtersReducer, initialFilterState);

export const FiltersContext = createContext<FilterState>(initialFilterState);
export const FilterActionsContext = createContext<FilterActions | null>(null);

export const useFilterDraft = <T extends FilterValue>(column: string): T | undefined =>
  useContext(FiltersContext).drafts[column] as T | undefined;

export const useFilterActions = (): FilterActions => {
  const actions = useContext(FilterActionsContext);
  if (!actions) {
    throw new Error('Filter components must be rendered inside the product list filter store');
  }
  return actions;
};
