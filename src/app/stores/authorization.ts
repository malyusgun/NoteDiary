import { defineStore } from 'pinia';
import type { IUser, IUserSignForm } from '@/app/interfaces/authorization';
import cookies from '@/app/plugins/Cookie';
import customFetch from '@/app/helpers/customFetch';
import { redirectSignUp } from '@/app/router';

export const useAuthorizationStore = defineStore('authorizationStore', () => {
  const userData = ref<IUser | IUserSignForm | null>();
  const codeMail = ref<string>('');

  function setUserData(data: IUserSignForm | IUser) {
    userData.value = data;
  }
  function setCodeMail(code: string) {
    codeMail.value = code;
  }
  async function logout() {
    await customFetch('/users', 'DELETE', userData.value);

    userData.value = null;
    cookies.remove('user_uuid');
    cookies.remove('current_sheet_uuid');
    cookies.remove('home_uuid');
    cookies.remove('favorite_color');
    await redirectSignUp();
  }
  return { userData, codeMail, setUserData, setCodeMail, logout };
});
