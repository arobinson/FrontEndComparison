import { reactive, readonly } from 'vue';

export interface RangeValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeValue | string[];

export interface FilterStore {
  /** Read-only view: `drafts` is what each control shows while it is being edited. */
  state: {
    readonly drafts: Readonly<Record<string, FilterValue>>;
  };
  setDraft(column: string, value: FilterValue): void;
  /** Empties every draft. */
  clear(): void;
}

/**
 * Creates the page-scoped filter drafts. The owning page wires them into the filter
 * controls; the applied filters live in the page URL.
 */
export const createFilterStore = (): FilterStore => {
  const state = reactive({
    drafts: {} as Record<string, FilterValue>,
  });

  return {
    state: readonly(state) as FilterStore['state'],
    setDraft: (column, value) => {
      state.drafts[column] = value;
    },
    clear: () => {
      state.drafts = {};
    },
  };
};
