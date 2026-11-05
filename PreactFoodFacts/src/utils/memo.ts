import { h, type Component, type FunctionComponent } from 'preact';

/**
 * Core-Preact equivalent of React.memo (Preact core has no `memo`; it lives in
 * preact/compat, which this app deliberately does not use).
 *
 * Wraps a function component in one that implements shouldComponentUpdate with
 * a shallow props comparison — the same semantics as React.memo's default
 * comparer, so the port skips exactly the same re-renders the React app skips.
 */
const shallowDiffers = (a: Record<string, unknown>, b: Record<string, unknown>): boolean => {
  for (const key in a) if (a[key] !== b[key]) return true;
  for (const key in b) if (!(key in a)) return true;
  return false;
};

export function memo<P extends object>(component: FunctionComponent<P>): FunctionComponent<P> {
  function shouldUpdate(this: Component<P>, nextProps: P): boolean {
    return shallowDiffers(this.props as Record<string, unknown>, nextProps as Record<string, unknown>);
  }

  function Memoed(this: Component<P>, props: P) {
    this.shouldComponentUpdate = shouldUpdate;
    return h(component, props);
  }
  Memoed.displayName = `Memo(${component.displayName || component.name})`;

  return Memoed as FunctionComponent<P>;
}
