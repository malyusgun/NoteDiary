import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import type { TEntity } from '@/app/interfaces/environment';
import customFetch from '@/app/helpers/customFetch';
import cookies from '@/app/plugins/Cookie';
import { getUserHandler } from '@/app/helpers/requestHandlers';
import type { IUserDB } from '@/app/interfaces/responses';
import customFetchBuffer from '@/app/helpers/customFetchBuffer';
import { serverErrorHandler } from '@/app/helpers/exceptions';

export const getUser = async () => {
  try {
    const userUuid = cookies.get('user_uuid');
    const userDB: IUserDB = await customFetch(`/users/${userUuid}`, 'GET');
    getUserHandler({ ...userDB, user_sheets: JSON.parse(userDB.user_sheets) });
  } catch (e) {
    serverErrorHandler(e);
  }
};

export const getSheetBackground = async (backgroundPath: string) => {
  const background = await customFetchBuffer(`/sheets/${backgroundPath}/background`, 'GET');
  const blob = new Blob([background], {
    type: `image/jpeg`
  });
  const url = URL.createObjectURL(blob);
  useInterfaceStore().setSheetBackgroundFromDB(url);
};

export const deleteEntity = async (entityUuid: string) => {
  try {
    const entities = useDataStore().entities;
    const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
    const deletedEntity = await customFetch(
      `/sheets/${sheetUuid}/entities/${entityUuid}`,
      'DELETE',
      {
        ...entityToDelete
      }
    );

    let newStateEntities = [...entities.value];
    newStateEntities = newStateEntities.filter(
      (entity: TEntity) => entity.entity_uuid !== deletedEntity.entity_uuid
    );
    useDataStore().editEntities(newStateEntities);
  } catch (e) {
    serverErrorHandler(e);
  }
};

export const convertThemeToColorWhiteDefault = (theme: string | undefined) => {
  if (!theme) return '#ffffff';
  switch (theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#64748b';
    case 'blue':
      return '#3b82f6';
    case 'sky':
      return '#0ea5e9';
    case 'teal':
      return '#14b8a6';
    case 'lime':
      return '#84cc16';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'amber':
      return '#f59e0b';
    case 'orange':
      return '#f97316';
    case 'pink':
      return '#ec4899';
    case 'fuchsia':
      return '#d946ef';
    case 'purple':
      return '#a855f7';
    case 'indigo':
      return '#6366f1';
    case 'rose':
      return '#f43f5e';
    case 'red':
      return '#ef4444';
    case 'black':
      return '#000000';
  }
  return '#ffffff';
};

export const convert800ThemeToColorGrayDefault = (theme: string | undefined) => {
  if (!theme) return '#9294a1';
  switch (theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#1e293b';
    case 'blue':
      return '#1e40af';
    case 'sky':
      return '#075985';
    case 'teal':
      return '#115e59';
    case 'lime':
      return '#3f6212';
    case 'green':
      return '#166534';
    case 'yellow':
      return '#854d0e';
    case 'amber':
      return '#92400e';
    case 'orange':
      return '#9a3412';
    case 'pink':
      return '#9d174d';
    case 'fuchsia':
      return '#86198f';
    case 'purple':
      return '#6b21a8';
    case 'indigo':
      return '#3730a3';
    case 'rose':
      return '#9f1239';
    case 'red':
      return '#991b1b';
    case 'black':
      return '#000000';
  }
  return '#9294a1';
};

export const convertThemeToColorBlackDefault = (theme: string | undefined) => {
  if (!theme) return '#000000';
  switch (theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#64748b';
    case 'blue':
      return '#3b82f6';
    case 'sky':
      return '#0ea5e9';
    case 'teal':
      return '#14b8a6';
    case 'lime':
      return '#84cc16';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'amber':
      return '#f59e0b';
    case 'orange':
      return '#f97316';
    case 'pink':
      return '#ec4899';
    case 'fuchsia':
      return '#d946ef';
    case 'purple':
      return '#a855f7';
    case 'indigo':
      return '#6366f1';
    case 'rose':
      return '#f43f5e';
    case 'red':
      return '#ef4444';
    case 'black':
      return '#000000';
  }
  return '#000000';
};
