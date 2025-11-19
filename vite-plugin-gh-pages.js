// Vite 插件：为 GitHub Pages 创建 404.html
// GitHub Pages 在找不到文件时会返回 404.html
// 我们将 index.html 复制为 404.html，这样 Vue Router 可以正确处理路由
import fs from 'fs'
import path from 'path'

export default function ghPages404() {
  let outDir = 'dist'
  
  return {
    name: 'gh-pages-404',
    configResolved(config) {
      // 获取输出目录
      outDir = config.build.outDir || 'dist'
    },
    closeBundle() {
      // 在构建完全结束后，复制 index.html 为 404.html
      const indexPath = path.resolve(outDir, 'index.html')
      const notFoundPath = path.resolve(outDir, '404.html')
      
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath)
        console.log('✓ Created 404.html for GitHub Pages SPA routing')
      } else {
        console.warn('⚠ index.html not found, skipping 404.html creation')
      }
    }
  }
}

