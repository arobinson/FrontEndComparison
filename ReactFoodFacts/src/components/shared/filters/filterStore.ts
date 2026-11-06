import { createContext, useContext, type Dispatch } from 'react';

// Page-scoped filter store: Context + useReducer, per react.dev
// "Scaling Up with Reducer and Context". ProductList owns the reducer and
// provides both contexts; the filter components read their draft and dispatch.

export interface RangeValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeValue | string[];

export interface FilterState {
  /** What each control currently shows (typed text, typed min/max, selected options). */
  drafts: Record<string, FilterValue>;
  /** The committed value per column that the list is filtered by. */
  applied: Record<string, FilterValue>;
}

export type FilterAction =
  | { type: 'setDraft'; column: string; value: FilterValue }
  | { type: 'apply'; column: string }
  | { type: 'clear' };

export const initialFilterState: FilterState = { drafts: {}, applied: {} };

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'setDraft':
      return { ...state, drafts: { ...state.drafts, [action.column]: action.value } };
    case 'apply':
      return { ...state, applied: { ...state.applied, [action.column]: state.drafts[action.column] } };
    case 'clear':
      return initialFilterState;
  }
}

export const FilterContext = createContext<FilterState>(initialFilterState);
export const FilterDispatchContext = createContext<Dispatch<FilterAction>>(() => {});

export function useFilterDraft<T extends FilterValue>(column: string): T | undefined {
  return useContext(FilterContext).drafts[column] as T | undefined;
}

export function useFilterDispatch(): Dispatch<FilterAction> {
  return useContext(FilterDispatchContext);
}
