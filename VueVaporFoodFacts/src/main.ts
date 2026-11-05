import { createVaporApp, vaporInteropPlugin } from 'vue';
import App from './App.vue';
import { router } from './router';
import './index.css';

// Vapor Mode (Vue 3.6 RC): every SFC uses <script setup vapor>.
// vaporInteropPlugin is required because vue-router's <RouterView> is a VDOM
// component; it is the only VDOM component in the tree.
createVaporApp(App).use(vaporInteropPlugin).use(router).mount('#root');
