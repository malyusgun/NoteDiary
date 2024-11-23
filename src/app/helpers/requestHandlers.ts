import { useAuthorizationStore } from '@/app/stores/authorization';
import { useDataStore } from '@/app/stores/data';
import type { IUser } from '@/app/interfaces/authorization';
import type { IEntity, ISheet } from '@/app/interfaces/environment';

export const getUserHandler = (data: IUser) => {
  useAuthorizationStore().setUserData(data);
  useDataStore().setSheetsData(data.user_sheets);
};

export const getSheetHandler = (data: ISheet) => {
  useDataStore().setCurrentSheetUuid(data.sheet_uuid);
};

export const createEntityHandler = (data: IEntity) => {
  const newState = [...useDataStore().entities];
  newState.push(data);
  useDataStore().editEntities([...newState]);
};
