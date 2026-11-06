import { inject, provide, reactive, readonly, type InjectionKey } from 'vue';

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

const filterStoreKey: InjectionKey<FilterStore> = Symbol('filterStore');

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
 * Creates the page-scoped filter store and provides it to descendant filter components.
 * `onChange` runs after every apply/clear (the list uses it to go back to the first page).
 */
export const provideFilterStore = (onChange?: () => void): FilterStore => {
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

  provide(filterStoreKey, store);
  return store;
};

export const useFilterStore = (): FilterStore => {
  const store = inject(filterStoreKey);
  if (!store) {
    throw new Error('useFilterStore() must be used inside a component that called provideFilterStore()');
  }
  return store;
};
