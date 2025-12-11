import { defineConfig } from 'vite';

export default defineConfig({
  base: '/lit/',
  build: {
    outDir: '../perf-dist/lit',
  },
});
