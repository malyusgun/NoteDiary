import { useAuthorizationStore } from '@/app/stores/authorization';
import { useDataStore } from '@/app/stores/data';
import type { ISignUp, IUser } from '@/app/interfaces/authorization';
import type { IEntity, ISheet } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';

const authorizationStore = useAuthorizationStore();
const dataStore = useDataStore();

export const getUserHandler = (data: IUser) => {
  authorizationStore.setUserNickName(data.nick_name);
  authorizationStore.setUserData(data);
  dataStore.setSheetsData(data.sheets);
};

export const getSheetHandler = (data: ISheet) => {
  dataStore.setCurrentSheetData(data);
  dataStore.setCurrentSheetUuid(data.sheet_uuid);
};

export const createEntityHandler = (data: IEntity) => {
  const newState = [...entities.value];
  // if (data.image_width) {
  //   data.imageUrl = filesWebsocketStore.imageUrl;
  //   filesWebsocketStore.cleanImageUrl();
  // }
  newState.push(data);
  dataStore.editEntities([...newState]);
};

export const signUpUserHandler = (data: ISignUp) => {
  const router = useRouter();
  const userDataDB = data.createdUser;

  cookies.set('home_uuid', userDataDB.sheets[0]);
  cookies.set('user_uuid', userDataDB.user_uuid);
  cookies.set('favorite_color', userDataDB.settings.favorite_color);

  getUserHandler(userDataDB);
  getSheetHandler(data.homeSheet);
  dataStore.addSheetData(data);
  createEntityHandler(data.startEntity);

  await router.push(`/${data.homeSheet.sheet_uuid}`);
};
