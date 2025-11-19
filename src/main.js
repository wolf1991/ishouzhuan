import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'

const app = createApp(App)
app.use(router)

// 处理从 404.html 重定向过来的情况
// 当 GitHub Pages 返回 404 时，404.html 会重定向到 index.html
// 并保存原始路径到 sessionStorage
const savedPath = sessionStorage.getItem('redirect')
if (savedPath) {
  sessionStorage.removeItem('redirect')
  // 如果保存的路径与当前路径不同，导航到保存的路径
  if (savedPath !== window.location.pathname + window.location.search + window.location.hash) {
    router.replace(savedPath)
  }
}

app.mount('#app')

