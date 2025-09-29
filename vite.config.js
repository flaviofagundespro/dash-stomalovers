import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://dyvjgxpomqkbxhgcznyw.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dmpneHBvbXFrYnhoZ2N6bnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM1MTAsImV4cCI6MjA1ODczOTUxMH0.G8QLXKXQQVTW-QuIHhnRnImCrrms5ex8hjqazaInstw')
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 3000,
    host: true
  },
  esbuild: {
    jsx: 'automatic'
  }
})