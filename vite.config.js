import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
  },



  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
