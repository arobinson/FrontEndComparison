import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [solid()],
  base: '/solid-2/',
  build: {
    outDir: '../perf-dist/solid-2',
    emptyOutDir: true
  }
});
