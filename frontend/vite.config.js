import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // Ensure relative paths for Electron compatibility
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false, // Prevent browser auto-open in development
  },
  build: {
    outDir: 'dist', // Output directory for production build
    assetsDir: 'assets', // Directory for static assets
    sourcemap: true, // Generate sourcemaps for debugging (optional)
  },
});