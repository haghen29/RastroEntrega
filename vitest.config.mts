import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Vitest no lee el alias "@/" de tsconfig.json: hay que repetirlo aca.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
