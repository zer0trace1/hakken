import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/components/Landing.vue'
import Dashboard from '@/components/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router