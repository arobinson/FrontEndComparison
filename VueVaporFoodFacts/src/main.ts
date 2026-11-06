import { createVaporApp, vaporInteropPlugin, type VaporComponent } from 'vue';
import App from './App.vue';
import { router } from './router';
import { currentFrameworkKey } from './config/framework';
import './index.css';

// Vapor Mode (Vue 3.6 RC): every SFC is compiled as Vapor by @vitejs/plugin-vue's
// `features.vapor` option (vite.config*.ts), so src/ is identical to the Vue app except this file.
// vaporInteropPlugin is required because vue-router has no Vapor components yet: both <RouterView>
// (App.vue) and <RouterLink> (ProductLink.vue, once per row, ~50 per list page) are VDOM components
// rendered through the interop layer, so each is a Vapor<->VDOM boundary.
// Type-only cast: vue-tsc 3.3 types an SFC as a Vapor component only when the file carries the
// `vapor` attribute; it does not know about plugin-vue's `features.vapor`. App.vue is compiled as Vapor.
createVaporApp(App as VaporComponent)
  .provide(currentFrameworkKey, 'vue-vapor')
  .use(vaporInteropPlugin)
  .use(router)
  .mount('#root');
