import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true, // Enable network access for Codespace
    strictPort: false,
  },
  preview: {
    port: 3000,
    host: true
  }
})