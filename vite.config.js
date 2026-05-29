import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        /**
         * Vite 8 uses rolldown — manualChunks must be a function (not an object).
         *
         * Chunks:
         *  - "vendor-react"   : React + ReactDOM + React-Router
         *  - "vendor-supabase": Supabase JS client
         *  - "vendor-jspdf"   : jsPDF (PDF export library — large, only needed on dashboard)
         *  - Page chunks are automatically created by React.lazy() in App.jsx
         */
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase'
          }
          if (id.includes('node_modules/jspdf/')) {
            return 'vendor-jspdf'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },

  server: {
    host: true,
    allowedHosts: ['.trycloudflare.com'],
  },

  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  },
})

