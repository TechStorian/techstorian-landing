import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Each page is its own HTML entry, so /close-reader/ is a plain static folder on any host.
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        closeReader: fileURLToPath(new URL('./close-reader/index.html', import.meta.url)),
      },
    },
  },
})
