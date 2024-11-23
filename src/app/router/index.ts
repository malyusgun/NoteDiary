import { createRouter, createWebHistory } from 'vue-router';
import cookies from '@/app/plugins/Cookie';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:uuid',
      name: 'sheet',
      component: () => import('@/pages/sheets/SheetPage.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/settings/Settings.vue')
    },
    {
      path: '/auth/signUp',
      name: 'signUp',
      component: () => import('@/pages/authorization/SignUp.vue')
    },
    {
      path: '/auth/confirmMail',
      name: 'confirmMail',
      component: () => import('@/pages/authorization/ConfirmMail.vue')
    },
    {
      path: '/auth/signIn',
      name: 'signIn',
      component: () => import('@/pages/authorization/SignIn.vue')
    }
  ]
});

//middleware
router.beforeEach(async (to) => {
  const home_uuid = cookies.get('home_uuid');
  const isAuthPage = ['signUp', 'confirmMail', 'signIn'].find((item) => item === to.name);
  if (!isAuthPage && !home_uuid) {
    await router.push('/auth/signUp');
  }
  if (to.path === '/') {
    await router.push(`/${home_uuid}`);
  }
});

//helpers
const redirectSignIn = async () => {
  await router.push('/auth/signIn');
};
const redirectSignUp = async () => {
  await router.push('/auth/signIn');
};
const goBack = async () => {
  await router.back();
};
export { router, redirectSignIn, redirectSignUp, goBack };
