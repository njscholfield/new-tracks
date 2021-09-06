// vite.config.js
import { createVuePlugin } from 'vite-plugin-vue2';

export default {
  plugins: [
    createVuePlugin(/*options*/)
  ],
  build: {
    sourcemap: true
  },
  server: {
    proxy: {
      '/auth/verify': 'http://localhost:8000/',
      '/api': 'http://localhost:8000/',
      '/register': 'http://localhost:8000/',
      '/login': 'http://localhost:8000/',
      '/auth': 'http://localhost:8000/',
      '/deauth': 'http://localhost:8000/',
      '/settings': 'http://localhost:8000/',
      '/logout': 'http://localhost:8000/',
    }
  }
};