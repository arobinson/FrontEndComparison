import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type RangeFilterValue = { min?: number; max?: number };
export type FilterValue = string | string[] | RangeFilterValue;

/**
 * Page-scoped filter drafts, owned by <product-list>, which wires them to the generic
 * filter controls. A draft is what a control shows while it is being edited; the
 * applied filters live in the page URL.
 */
export class FilterStore {
  private listeners = new Set<() => void>();

  /** Drafts. Replaced (never mutated) on change, so identity can be used as a memo key. */
  drafts: Readonly<Record<string, FilterValue | undefined>> = {};

  setDraft(column: string, value: FilterValue) {
    this.drafts = { ...this.drafts, [column]: value };
    this.notify();
  }

  /** Empties every draft. */
  clear() {
    this.drafts = {};
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
