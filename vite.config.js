import { defineConfig } from 'vite'

// Web de usuario de GitHub Pages (alexxblaro16.github.io): se sirve desde la raíz
export default defineConfig({
  base: '/',
  build: { target: 'es2022', chunkSizeWarningLimit: 1600 },
})
