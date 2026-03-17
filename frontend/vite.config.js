import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sdapi': 'http://localhost:7861',
      '/internal': 'http://localhost:7861',
      '/sd_extra_networks': 'http://localhost:7861',
    },
  },
})
