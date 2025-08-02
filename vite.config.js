import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://gp-backend-f7dk.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    },
    historyApiFallback: true,
  },
});