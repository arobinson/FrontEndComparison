import { Service, signal } from '@angular/core';

export interface RangeFilterValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeFilterValue | string[];

export type FilterMap = Record<string, FilterValue | undefined>;

/**
 * Page-scoped filter state. Provide it in the page component's `providers`
 * so it lives and dies with that page. The page wires the (generic) filter
 * controls to it; controls never reference it.
 *
 * - draft: what each filter control currently shows
 * - applied: what the rows are filtered by (draft is committed via `apply`)
 */
@Service({ autoProvided: false })
export class FilterStore {
  readonly #drafts = signal<FilterMap>({});
  readonly #applied = signal<FilterMap>({});

  readonly drafts = this.#drafts.asReadonly();
  readonly applied = this.#applied.asReadonly();

  draft(column: string): FilterValue | undefined {
    return this.#drafts()[column];
  }

  setDraft(column: string, value: FilterValue): void {
    this.#drafts.update((drafts) => ({ ...drafts, [column]: value }));
  }

  apply(column: string): void {
    const value = this.#drafts()[column];
    this.#applied.update((applied) => ({ ...applied, [column]: value }));
  }

  clear(): void {
    this.#drafts.set({});
    this.#applied.set({});
  }
}
