import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // GitHub Pages 部署需要设置 base 路径
  // 如果仓库名是 ishouzhuan，则 base 为 /ishouzhuan/
  // 本地开发时可以通过环境变量覆盖
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})

