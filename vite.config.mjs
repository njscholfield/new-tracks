// vite.config.js
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [
    vue()
  ],
  build: {
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
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
      '/soundcloud': 'http://localhost:8000/',
    }
  }
};