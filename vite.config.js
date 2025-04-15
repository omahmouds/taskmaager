import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/taskmaager",
  server: {
    port: 5173,
    open: true
  },
  optimizeDeps: {
    exclude: ['lucide-react']و
  }
});