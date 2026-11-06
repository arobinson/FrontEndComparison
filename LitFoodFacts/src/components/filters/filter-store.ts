import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type RangeFilterValue = { min?: number; max?: number };
export type FilterValue = string | string[] | RangeFilterValue;

/**
 * Page-scoped filter state, created by <product-list> and passed down to the
 * filter elements as a property. Holds, per column, the draft (what the control
 * shows) and the applied value (what the list filters by).
 */
export class FilterStore {
  private drafts = new Map<string, FilterValue>();
  private listeners = new Set<() => void>();

  /** @param onFiltersChanged called after every apply/clear (the list returns to its first page). */
  constructor(private onFiltersChanged?: () => void) {}

  /** Applied filters. Replaced (never mutated) on change, so identity can be used as a memo key. */
  applied: Readonly<Record<string, FilterValue | undefined>> = {};

  getDraft<T extends FilterValue>(column: string): T | undefined {
    return this.drafts.get(column) as T | undefined;
  }

  setDraft(column: string, value: FilterValue) {
    this.drafts.set(column, value);
    this.notify();
  }

  /** Copies the column's draft into the applied filters. */
  apply(column: string) {
    this.applied = { ...this.applied, [column]: this.drafts.get(column) };
    this.onFiltersChanged?.();
    this.notify();
  }

  /** Empties every draft and every applied filter. */
  clear() {
    this.drafts.clear();
    this.applied = {};
    this.onFiltersChanged?.();
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }
}

/**
 * Re-renders its host whenever the store changes. The store is read through a
 * getter because it arrives as a property (`.store=${...}`) from <product-list>.
 */
export class FilterStoreController implements ReactiveController {
  private subscribed?: FilterStore;
  private unsubscribe?: () => void;

  constructor(
    private host: ReactiveControllerHost,
    private getStore: () => FilterStore | undefined
  ) {
    host.addController(this);
  }

  hostConnected() {
    this.sync();
  }

  hostUpdate() {
    // Follows a replaced `store` property; a no-op when it is unchanged.
    this.sync();
  }

  hostDisconnected() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.subscribed = undefined;
  }

  private sync() {
    const store = this.getStore();
    if (store === this.subscribed) return;
    this.unsubscribe?.();
    this.subscribed = store;
    this.unsubscribe = store?.subscribe(() => this.host.requestUpdate());
  }
}
