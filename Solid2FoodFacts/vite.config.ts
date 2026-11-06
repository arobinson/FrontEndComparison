import { defineConfig } from 'vite'
import solid from '@solidjs/vite-plugin'

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3010,
  },
  preview: {
    port: 3010,
  },
})
