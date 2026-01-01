/* global process */

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    port: 5002,
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ['socket.io-client'],
    },
    define: {
      'import.meta.env.VITE_ROLLBAR_CLIENT_TOKEN': JSON.stringify(env.ROLLBAR_CLIENT_TOKEN),
      'import.meta.env.VITE_ROLLBAR_ENVIRONMENT': JSON.stringify(env.ROLLBAR_ENVIRONMENT || 'production'),
    },
  }
})
