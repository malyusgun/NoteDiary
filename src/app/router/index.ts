import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:sheetUuid',
      name: 'sheet',
      component: () => import('@/pages/[uuid]/SheetPage.vue')
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: () => import('@/pages/authorization/signUp.vue')
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: () => import('@/pages/authorization/signIn.vue')
    }
  ]
});

export default router;
