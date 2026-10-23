import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Por defecto se sirve desde la raíz (web de usuario alexxblaro16.github.io).
// Para un repositorio de proyecto se compila con BASE=/nombre-del-repo/
export default defineConfig({
  base: process.env.BASE || '/',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1800,
    // Dos páginas: el juego y la pantalla privada de accesos (/accesos/)
    rollupOptions: { input: { juego: resolve(import.meta.dirname, 'index.html'), accesos: resolve(import.meta.dirname, 'accesos/index.html') } },
  },
})
