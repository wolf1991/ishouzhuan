import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'

const app = createApp(App)
app.use(router)

// GitHub Pages SPA 路由处理
// 当用户直接访问 /ishouzhuan/admin/apps 等路由时
// GitHub Pages 会返回 404.html（实际上是 index.html 的副本）
// Vue Router 会根据当前 URL 自动处理路由，无需额外处理

app.mount('#app')

