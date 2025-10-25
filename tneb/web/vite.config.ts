import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss()
  ],
  assetsInclude: ['**/*.tiff'],
  server: {
    open: true,
    port: 5000,
    proxy: { '/api': 'http://localhost:7070/' },
    host: '0.0.0.0'
  }
})