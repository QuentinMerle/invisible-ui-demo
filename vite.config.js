import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // WebLLM charge des gros fichiers WASM — on augmente la limite
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['@mlc-ai/web-llm'],
  },
  server: {
    headers: {
      // Requis pour SharedArrayBuffer (WebLLM multi-thread)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
