import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'http://localhost:8080',
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});
