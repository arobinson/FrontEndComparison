// Base path from Vite's BASE_URL (set via vite config's `base` option), without
// the trailing slash: '' in dev, '/preact' in the perf build.
// preact-iso has no `basename` prop, so every route path and link is prefixed
// here, in one place — the equivalent of React Router's `basename`.
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const toPath = (path: string): string => `${BASE}${path}`;
