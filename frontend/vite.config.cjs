import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow connections from all network interfaces
    port: 3000,
    cors: true,
    watch: {
      usePolling: true // Enable for better performance in Docker
    },
    hmr: {
      clientPort: 3000 // Ensure HMR works in Docker
    }
  }
});