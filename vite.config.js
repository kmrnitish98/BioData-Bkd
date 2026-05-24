import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Suppress chunk size warning — jsPDF is large by design
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'react-vendor': ['react', 'react-dom'],
          // Router
          'router': ['react-router-dom'],
          // Animation libraries
          'animation': ['framer-motion'],
          // PDF libraries — loaded dynamically, so this just optimizes caching
          'pdf-libs': ['jspdf', 'html2canvas'],
          // Swiper gallery
          'swiper': ['swiper'],
          // UI utilities
          'ui-utils': ['lucide-react'],
        },
      },
    },
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
