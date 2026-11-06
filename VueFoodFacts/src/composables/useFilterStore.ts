import { reactive, readonly } from 'vue';
import { filterValuesEqual } from 'shared-types';

export interface RangeValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeValue | string[];

export interface FilterStore {
  /** Read-only view: `drafts` is what each control shows, `applied` is what the list filters by. */
  state: {
    readonly drafts: Readonly<Record<string, FilterValue>>;
    readonly applied: Readonly<Record<string, FilterValue>>;
  };
  getDraft<T extends FilterValue>(column: string, fallback: T): T;
  setDraft(column: string, value: FilterValue): void;
  /** Copies the column's draft into the applied filters. */
  apply(column: string): void;
  /** Empties every draft and every applied filter. */
  clear(): void;
}

// Applied range objects only carry the bounds that are set
const snapshot = (value: FilterValue): FilterValue => {
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'object') {
    const result: RangeValue = {};
    if (value.min !== undefined) result.min = value.min;
    if (value.max !== undefined) result.max = value.max;
    return result;
  }
  return value;
};

/**
 * Creates the page-scoped filter store. The owning page wires it into the filter controls.
 * `onChange` runs after every apply/clear (the list uses it to go back to the first page).
 */
export const createFilterStore = (onChange?: () => void): FilterStore => {
  const state = reactive({
    drafts: {} as Record<string, FilterValue>,
    applied: {} as Record<string, FilterValue>,
  });

  const store: FilterStore = {
    state: readonly(state) as FilterStore['state'],
    getDraft: (column, fallback) => (state.drafts[column] as typeof fallback | undefined) ?? fallback,
    setDraft: (column, value) => {
      state.drafts[column] = value;
    },
    apply: (column) => {
      const draft = state.drafts[column];
      // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
      if (filterValuesEqual(draft, state.applied[column])) return;
      if (draft !== undefined) {
        state.applied[column] = snapshot(draft);
      }
      onChange?.();
    },
    clear: () => {
      state.drafts = {};
      state.applied = {};
      onChange?.();
    },
  };

  return store;
};
