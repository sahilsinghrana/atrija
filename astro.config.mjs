import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        input: {
          scene: resolve(__dirname, 'src/js/scene/scene-bootstrap.js')
        },
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});
