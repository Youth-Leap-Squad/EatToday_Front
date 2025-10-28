import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {

      // 게이트웨이 우회 (임시): 바로 백엔드 8080으로
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // (필요시) 포토리뷰도 8080으로
      '/photoReview': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // ✅ 술BTI
      '/albti': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // ✅ 월드컵게임
      '/worldcup': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
