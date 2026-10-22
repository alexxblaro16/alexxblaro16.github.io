import { defineConfig } from 'vite'

// Por defecto se sirve desde la raíz (web de usuario alexxblaro16.github.io).
// Para un repositorio de proyecto se compila con BASE=/nombre-del-repo/
export default defineConfig({
  base: process.env.BASE || '/',
  build: { target: 'es2022', chunkSizeWarningLimit: 1600 },
})
