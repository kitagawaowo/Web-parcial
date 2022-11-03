import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../truck/pages/truck-list.component.vue')
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
      component: () => import('../truck/pages/not-found.component.vue')
    }
  ],
});

export default router;
