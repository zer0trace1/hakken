import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/components/Landing.vue'
import Dashboard from '@/components/Dashboard.vue'
import AuthCallback from "@/components/AuthCallback.vue";
import { getUser, signIn } from "@/auth/oidc";

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true}
  },
  {
    path: "/auth/callback",
    component: AuthCallback
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;

  const user = await getUser();
  if (!user || user.expired) {
    await signIn(to.fullPath); // al volver, te manda donde estabas
    return false;
  }
  return true;
});

export default router