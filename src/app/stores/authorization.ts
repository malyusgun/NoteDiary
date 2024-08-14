import { defineStore } from 'pinia';
import type { IUserData } from '@/app/interfaces/authorization';

export const useAuthorizationStore = defineStore('authorizationStore', () => {
  const userUuid = ref<string>('e786de50-f33c-4ef9-9dfe-329eed32b023');
  const userNickName = ref<string>('malyusgun');
  const userData = ref<IUserData | null>();

  return { userUuid, userNickName, userData };
});
