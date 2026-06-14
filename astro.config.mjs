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
    },
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/postprocessing/EffectComposer.js', 'three/examples/jsm/postprocessing/ShaderPass.js', 'three/examples/jsm/shaders/CopyShader.js', 'three/examples/jsm/shaders/VignetteShader.js']
    }
  }
});
