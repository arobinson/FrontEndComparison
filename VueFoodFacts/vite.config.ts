import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      // Every component uses <script setup>: drop Options API support from the bundle
      features: { optionsAPI: false },
    }),
  ],
  server: {
    port: 3007,
  },
  preview: {
    port: 3007,
  },
});
