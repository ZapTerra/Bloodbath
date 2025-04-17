import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic' // Force React 19's automatic JSX runtime
    })
  ]
})