import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// SvelteKit 3: config moved here from svelte.config.js (no longer supported).
export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: 'index.html', // SPA mode - all routes handled client-side
        precompress: false,
        strict: true
      }),
      paths: {
        base: process.env.NODE_ENV === 'production' ? '/svelte' : ''
      }
    })
  ],
  server: {
    port: 3003,
  },
  preview: {
    port: 3003,
  },
});
