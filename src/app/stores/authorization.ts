import { defineStore } from 'pinia';
import type { IUserData } from '@/app/interfaces/authorization';
import cookies from '@/app/plugins/Cookie';

export const useAuthorizationStore = defineStore('authorizationStore', () => {
  const router = useRouter();

  const userUuid = ref<string>('');
  const userNickName = ref<string>('malyusgunDmitriyMalyugin');
  const userData = ref<IUserData | null>();

  function setUserUuid(uuid: string) {
    userUuid.value = uuid;
  }
  function setUserNickName(nickName: string) {
    userNickName.value = nickName;
  }
  function setUserData(data: IUserData) {
    userData.value = data;
  }
  function logout() {
    userUuid.value = '';
    userNickName.value = '';
    userData.value = null;
    cookies.remove('user_uuid');
    cookies.remove('current_page_uuid');
    cookies.remove('home_uuid');
    cookies.remove('favorite_color');
    router.push('/signUp');
  }
  return { userUuid, userNickName, userData, setUserUuid, setUserNickName, setUserData, logout };
});
