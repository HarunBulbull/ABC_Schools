import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/GWCore.Web': {
        target: 'https://api-test.k12net.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/GWCore.Web/, ''),
        secure: false,
      },
    },
  },
});