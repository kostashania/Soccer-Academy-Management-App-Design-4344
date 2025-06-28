import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          supabase: ['@supabase/supabase-js'],
          animations: ['framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react-icons', 
      '@supabase/supabase-js',
      'framer-motion',
      'react-toastify'
    ]
  },
  server: {
    port: 3000,
    open: true
  }
})