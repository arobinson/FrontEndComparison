import { filterValuesEqual } from 'shared-types';

export type RangeFilterValue = { min?: number; max?: number };
export type FilterValue = string | RangeFilterValue | string[];

/**
 * Page-scoped filter state for the product list.
 * `drafts` is what each filter control currently shows; `applied` is what the list filters by.
 * `onCommit` runs after every apply/clear (the list page uses it to return to the first page).
 */
export class FilterStore {
  drafts = $state<Record<string, FilterValue>>({});
  // Replaced (never mutated) on every apply/clear, so derived rows recompute once per change.
  applied = $state.raw<Record<string, FilterValue>>({});

  #onCommit: () => void;

  constructor(onCommit: () => void = () => {}) {
    this.#onCommit = onCommit;
  }

  setDraft(column: string, value: FilterValue) {
    this.drafts[column] = value;
  }

  apply(column: string) {
    // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
    if (filterValuesEqual(this.drafts[column], this.applied[column])) return;
    this.applied = { ...this.applied, [column]: $state.snapshot(this.drafts[column]) as FilterValue };
    this.#onCommit();
  }

  clear() {
    this.drafts = {};
    this.applied = {};
    this.#onCommit();
  }
}
