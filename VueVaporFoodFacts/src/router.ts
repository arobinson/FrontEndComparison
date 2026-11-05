import { createRouter, createWebHistory } from 'vue-router';
import ProductList from './pages/ProductList.vue';
import ProductDetail from './pages/ProductDetail.vue';

// Base comes from Vite's BASE_URL (set via vite config's `base` option, e.g. /vue/ in the perf build)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: ProductList },
    { path: '/detail/:code', component: ProductDetail, props: true },
  ],
});
