import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
      vue(),
      ui({
          ui: {
              colors: {
                  primary: 'green',
                  neutral: 'zinc'
              }
          }
      })
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
