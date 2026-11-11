import type { RangeValue } from '../controls/RangeSlider';

// Page-scoped filter drafts (useReducer). ProductList owns them and wires each
// filter control to them through props; the controls know nothing about them.
// A draft is what a control shows while it is being edited; the applied filters
// live in the page URL.

export type FilterValue = string | RangeValue | string[];

export type FilterDrafts = Record<string, FilterValue>;

export type DraftAction = { type: 'setDraft'; column: string; value: FilterValue } | { type: 'clear' };

export function draftsReducer(drafts: FilterDrafts, action: DraftAction): FilterDrafts {
  switch (action.type) {
    case 'setDraft':
      return { ...drafts, [action.column]: action.value };
    case 'clear':
      return {};
  }
}
