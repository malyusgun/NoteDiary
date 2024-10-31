import { defineStore } from 'pinia';
import type { IUser } from '@/app/interfaces/authorization';
import cookies from '@/app/plugins/Cookie';

export const useAuthorizationStore = defineStore('authorizationStore', () => {
  const router = useRouter();

  const userUuid = ref<string>('');
  const userNickName = ref<string>('malyusgun');
  const userData = ref<IUser | null>();

  function setUserUuid(uuid: string) {
    userUuid.value = uuid;
  }
  function setUserNickName(nickName: string) {
    userNickName.value = nickName;
  }
  function setUserData(data: IUser) {
    userData.value = data;
  }
  function logout() {
    userUuid.value = '';
    userNickName.value = '';
    userData.value = null;
    cookies.remove('user_uuid');
    cookies.remove('current_sheet_uuid');
    cookies.remove('home_uuid');
    cookies.remove('favorite_color');
    router.push('/signUp');
  }
  return { userUuid, userNickName, userData, setUserUuid, setUserNickName, setUserData, logout };
});
