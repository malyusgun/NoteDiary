import { defineStore } from 'pinia';
import type { IUserData } from '@/interfaces/authorization';

export const useAuthorizationStore = defineStore('authorizationStore', () => {
  const userUuid = ref<string>('e786de50-f33c-4ef9-9dfe-329eed32b023');
  const userData = ref<IUserData | null>();
  // const doubleCount = computed(() => count.value * 2);
  // function increment() {
  //   count.value++;
  // }

  return { userUuid, userData };
});
