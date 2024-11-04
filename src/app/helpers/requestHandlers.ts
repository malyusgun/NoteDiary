import { useAuthorizationStore } from '@/app/stores/authorization';
import { useDataStore } from '@/app/stores/data';
import type { IUser } from '@/app/interfaces/authorization';
import type { IEntity, ISheet } from '@/app/interfaces/environment';

const authorizationStore = useAuthorizationStore();
const dataStore = useDataStore();

export const getUserHandler = (data: IUser) => {
  authorizationStore.setUserNickName(data.nick_name);
  authorizationStore.setUserData(data);
  dataStore.setSheetsData(data.user_sheets);
};

export const getSheetHandler = (data: ISheet) => {
  dataStore.setCurrentSheetData(data);
  dataStore.setCurrentSheetUuid(data.sheet_uuid);
};

export const createEntityHandler = (data: IEntity) => {
  const newState = [...dataStore.entities];
  newState.push(data);
  dataStore.editEntities([...newState]);
};
