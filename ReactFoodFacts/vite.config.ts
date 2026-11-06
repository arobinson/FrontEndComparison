import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

export default defineConfig({
  // React Compiler 1.0 (stable, via Babel): automatic memoization, the recommended React setup
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    port: 3002,
  },
  preview: {
    port: 3002,
  },
})
