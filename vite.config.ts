import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
      '~me': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
