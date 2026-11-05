import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: '/preact/',
  build: {
    outDir: '../perf-dist/preact',
    emptyOutDir: true,
  },
});
