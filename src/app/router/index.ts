import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/:sheetUuid',
      name: 'sheet',
      component: () => import('../../pages/[uuid]/SheetPage.vue')
    }
  ]
});

export default router;
