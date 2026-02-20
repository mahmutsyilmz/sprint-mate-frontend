import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy OAuth2 authorization requests
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy OAuth2 callback (from GitHub)
      '/login/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy logout
      '/logout': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy WebSocket for chat (same-origin so session cookie is sent)
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
