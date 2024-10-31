import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import { checkIsImage } from '@/app/helpers/images';
import cookies from '@/app/plugins/Cookie';
import customFetch from '@/app/helpers/customFetch';
import { createEntityHandler } from '@/app/helpers/requestHandlers';

const interfaceStore = useInterfaceStore();
const dataStore = useDataStore();

export const getSheetBackground = (backgroundPath: string) => {
  const background = await customFetch(`/sheets/${backgroundPath}/background`, 'GET');
  const blob = new Blob([background], {
    type: `image/jpeg`
  });
  const url = URL.createObjectURL(blob);
  interfaceStore.setSheetBackgroundFromDB(url);
};

export const createEntity = (newEntity: IEntity) => {
  // const websocketStore = useWebsocketStore();
  const sheet_uuid = cookies.get('current_sheet_uuid');
  // if (newEntity.image_buffer) {
  //   websocketStore.setFileData(newEntity);
  //   const filesWebsocketStore = useFilesWebsocketStore();
  //   return filesWebsocketStore.sendData(newEntity.image_buffer);
  // }
  const newEntityDB = customFetch(`/sheets/${sheet_uuid}/entities`, 'POST', {
    ...newEntity,
    sheet_uuid
  });
  createEntityHandler(newEntityDB);
};

export const editEntity = (newState: IEntity) => {
  newState = checkIsImage(newState);
  const sheetUuid = dataStore.currentSheet.sheet_uuid;
  const newStateDB = await customFetch(
    `/sheets/${sheetUuid}/entities/${newState.entity_uuid}`,
    'PATCH',
    newState
  );
  let entitiesStore = [...entities.value];
  entitiesStore = entitiesStore.map((entity: IEntity) => {
    if (entity.entity_uuid !== newStateDB.entity_uuid) return entity;
    if (newStateDB?.image_width) {
      newStateDB.imageUrl = filesWebsocketStore.imageUrl;
      filesWebsocketStore.cleanImageUrl();
    }
    return newStateDB;
  });
  dataStore.editEntities(entitiesStore);
};

export const deleteEntity = (entityUuid: string) => {
  const entities = dataStore.entities;
  const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
  const deletedEntity = await customFetch(`/sheets/${sheetUuid}/entities/${entityUuid}`, 'DELETE', {
    ...entityToDelete
  });

  let newStateEntities = [...entities.value];
  newStateEntities = newStateEntities.filter(
    (entity: IEntity) => entity.entity_uuid !== deletedEntity.entity_uuid
  );
  dataStore.editEntities(newStateEntities);
};

export const changeEntitiesOrder = async (entityUuid: string, direction: 'up' | 'down') => {
  const entities = dataStore.entities;
  const sheetUuid = dataStore.currentSheet.sheet_uuid;

  const mainEntity = entities.find((entity: IEntity) => entity.entity_uuid === entityUuid)!;
  const mainEntityIndex = entities.indexOf(mainEntity);
  const targetEntityIndex = direction === 'up' ? mainEntityIndex - 1 : mainEntityIndex + 1;
  const targetEntity = entities[targetEntityIndex];

  await customFetch(`/sheets/${sheetUuid}/entities`, 'PATCH', {
    main: mainEntity,
    target: targetEntity
  });

  const newStateEntities = [...entities];
  if (mainEntity.entity_order > newStateEntities[mainEntityIndex].entity_order!) {
    newStateEntities[mainEntityIndex + 1].entity_order =
      newStateEntities[mainEntityIndex].entity_order;
  } else {
    newState[mainEntityIndex - 1].entity_order = newStateEntities[mainEntityIndex].entity_order;
  }
  newStateEntities[mainEntityIndex] = { ...mainEntity };
  dataStore.editEntities(newStateEntities);
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
