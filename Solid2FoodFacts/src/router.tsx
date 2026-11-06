import { lazy } from 'solid-js';
import { createRouter, useNavigate } from '@solidjs/router';

// Router 2.x has no <Navigate>: navigate during component setup (replace, like the 1.x <Navigate>)
function RedirectToList() {
  useNavigate()(paths.list, { replace: true });
  return null;
}

// Route-level code splitting: each page's chunk loads when its route first renders.
// No `preloadLinks` strategy is configured, so nothing is preloaded on hover/focus/viewport.
export const Router = createRouter({
  // Vite's BASE_URL ('/solid-2/' in the perf build): `paths` and navigate() include it
  base: import.meta.env.BASE_URL,
  routes: [
    { path: '/', component: RedirectToList },
    { path: '/list', component: lazy(() => import('./pages/ProductList')) },
    { path: '/detail/:code', component: lazy(() => import('./pages/ProductDetail')) },
    { path: '*', component: RedirectToList },
  ],
});

export const { paths } = Router;
