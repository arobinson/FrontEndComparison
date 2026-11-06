import { Injectable, signal } from '@angular/core';

export interface RangeFilterValue {
  min?: number;
  max?: number;
}

export type FilterValue = string | RangeFilterValue | string[];

type FilterMap = Record<string, FilterValue | undefined>;

/**
 * Page-scoped filter state. Provide it in the page component's `providers`
 * so it lives and dies with that page; filter components `inject()` it.
 *
 * - draft: what each filter control currently shows
 * - applied: what the rows are filtered by (draft is committed via `apply`)
 */
@Injectable()
export class FilterStore {
  readonly #drafts = signal<FilterMap>({});
  readonly #applied = signal<FilterMap>({});

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
