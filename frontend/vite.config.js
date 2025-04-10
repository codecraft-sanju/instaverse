import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://instaverse-i93f.onrender.com',
        // target:"https://instaverse-beru.onrender.com"
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
