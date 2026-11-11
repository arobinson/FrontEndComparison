export type RangeFilterValue = { min?: number; max?: number };
export type FilterValue = string | RangeFilterValue | string[];

/**
 * Page-scoped filter drafts for the product list: what each filter control shows
 * while it is being edited. The applied filters live in the page URL.
 */
export class FilterStore {
  drafts = $state<Record<string, FilterValue>>({});

  setDraft(column: string, value: FilterValue) {
    this.drafts[column] = value;
  }

  clear() {
    this.drafts = {};
  }
}
