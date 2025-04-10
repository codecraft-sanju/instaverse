import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target:"http://localhost:5000"
        target:"https://instaverse-beru.onrender.com"
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 2000
  }
})
