import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    allowedHosts: ['localhost', '.ngrok-free.app', '.ngrok.io', '.loca.lt', 'learning.loca.lt', '.devtunnels.ms']
  }
}) 