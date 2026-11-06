import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { filterValuesEqual } from 'shared-types';

export type RangeFilterValue = { min?: number; max?: number };
export type FilterValue = string | string[] | RangeFilterValue;

/**
 * Page-scoped filter state, owned by <product-list>, which wires it to the generic
 * filter controls. Holds, per column, the draft (what the control shows) and the
 * applied value (what the list filters by).
 */
export class FilterStore {
  private listeners = new Set<() => void>();

  /** @param onFiltersChanged called after every apply/clear (the list returns to its first page). */
  constructor(private onFiltersChanged?: () => void) {}

  /** Drafts. Replaced (never mutated) on change, so identity can be used as a memo key. */
  drafts: Readonly<Record<string, FilterValue | undefined>> = {};

  /** Applied filters. Replaced (never mutated) on change, so identity can be used as a memo key. */
  applied: Readonly<Record<string, FilterValue | undefined>> = {};

  getDraft<T extends FilterValue>(column: string): T | undefined {
    return this.drafts[column] as T | undefined;
  }

  setDraft(column: string, value: FilterValue) {
    this.drafts = { ...this.drafts, [column]: value };
    this.notify();
  }

  /** Copies the column's draft into the applied filters. */
  apply(column: string) {
    // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
    if (filterValuesEqual(this.drafts[column], this.applied[column])) return;
    this.applied = { ...this.applied, [column]: this.drafts[column] };
    this.onFiltersChanged?.();
    this.notify();
  }

  /** Empties every draft and every applied filter. */
  clear() {
    this.drafts = {};
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

/** Re-renders its host (<product-list>) whenever the store changes. */
export class FilterStoreController implements ReactiveController {
  private unsubscribe?: () => void;

  constructor(
    private host: ReactiveControllerHost,
    private store: FilterStore
  ) {
    host.addController(this);
  }

  hostConnected() {
    this.unsubscribe = this.store.subscribe(() => this.host.requestUpdate());
  }

  hostDisconnected() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }
}
