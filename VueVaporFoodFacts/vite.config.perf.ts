import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      features: {
        // Compile every <script setup> SFC in Vapor mode (no per-file `vapor` attribute needed)
        vapor: true,
        // Every component uses <script setup>: drop Options API support from the bundle
        optionsAPI: false,
      },
    }),
  ],
  base: '/vue-vapor/',
  build: {
    outDir: '../perf-dist/vue-vapor',
    emptyOutDir: true,
  },
});
