import { useReducer } from 'preact/hooks';
import type { RangeValue } from '../controls/RangeSlider';

// Page-scoped filter drafts (useReducer, Preact core only). ProductList owns
// them and wires each filter control to them through props; the controls know
// nothing about them, and they live and die with the list page.
// A draft is what a control shows while it is being edited; the applied
// filters live in the page URL.

export type FilterValue = string | RangeValue | string[];

export type FilterDrafts = Record<string, FilterValue | undefined>;

export type DraftAction = { type: 'setDraft'; column: string; value: FilterValue } | { type: 'clear' };

export interface FilterActions {
  setDraft: (column: string, value: FilterValue) => void;
  apply: (column: string, value: FilterValue | undefined) => void;
  clear: () => void;
}

export const draftsReducer = (drafts: FilterDrafts, action: DraftAction): FilterDrafts => {
  switch (action.type) {
    case 'setDraft':
      return { ...drafts, [action.column]: action.value };
    case 'clear':
      return {};
  }
};

export const useDraftsReducer = () => useReducer(draftsReducer, {});
