import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import AppsAdmin from '@/pages/AppsAdmin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/admin/apps', name: 'AppsAdmin', component: AppsAdmin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

