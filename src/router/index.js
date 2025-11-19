import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import AppsAdmin from '@/pages/AppsAdmin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/admin/apps', name: 'AppsAdmin', component: AppsAdmin }
]

// 支持 GitHub Pages 的 base 路径
// 如果部署到 GitHub Pages，base 会是 /ishouzhuan/
const base = import.meta.env.BASE_URL || '/'

const router = createRouter({
  history: createWebHistory(base),
  routes
})

export default router

