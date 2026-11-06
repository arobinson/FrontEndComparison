import type { RangeValue } from './RangeSlider';

// Page-scoped filter store (useReducer). ProductList owns it and wires each
// filter control to it through props; the controls know nothing about it.

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
