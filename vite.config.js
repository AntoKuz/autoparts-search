import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxy = {
  '/api': {
    target: 'http://api.favorit-parts.ru',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/hs/hsprice'),
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
