import { createRouter, createWebHistory } from 'vue-router';

// Route components are lazy-loaded (code-split per page), as the Vue Router docs recommend.
// Base comes from Vite's BASE_URL (set via vite config's `base` option, e.g. /vue/ in the perf build)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: () => import('./pages/ProductList.vue') },
    { path: '/detail/:code', component: () => import('./pages/ProductDetail.vue'), props: true },
  ],
});
