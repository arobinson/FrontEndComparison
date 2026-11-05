import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/vue-vapor/',
  build: {
    outDir: '../perf-dist/vue-vapor',
    emptyOutDir: true,
  },
});
