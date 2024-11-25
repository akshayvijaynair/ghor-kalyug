import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /**
   * The issue lies in how Vite is configured to expose the client application.
   * By default, Vite serves the development server on localhost only, which doesn't allow external access from the Docker network.
   * You need to adjust Vite's configuration to bind the development server to 0.0.0.0 and expose it properly.
   */
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
})
