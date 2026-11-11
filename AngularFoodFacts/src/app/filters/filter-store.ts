import { Service, signal } from '@angular/core';

export interface RangeFilterValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeFilterValue | string[];

export type FilterMap = Record<string, FilterValue | undefined>;

/**
 * Page-scoped filter drafts. Provide it in the page component's `providers`
 * so it lives and dies with that page. The page wires the (generic) filter
 * controls to it; controls never reference it.
 *
 * A draft is what a filter control shows while it is being edited. The applied
 * filters live in the page URL; a control with no draft shows its applied value.
 */
@Service({ autoProvided: false })
export class FilterStore {
  readonly #drafts = signal<FilterMap>({});

  readonly drafts = this.#drafts.asReadonly();

  setDraft(column: string, value: FilterValue): void {
    this.#drafts.update((drafts) => ({ ...drafts, [column]: value }));
  }

  clear(): void {
    this.#drafts.set({});
  }
}
