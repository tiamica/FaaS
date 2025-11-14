import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port:8080,
    host: true,
    open: true // Automatically open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
