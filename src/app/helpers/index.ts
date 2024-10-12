import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity, TTheme } from '@/app/interfaces/environment';
import { checkIsImage } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import cookies from '@/app/plugins/Cookie';

export const fetchForEntities = (page_uuid: string) => {
  const dataStore = useDataStore();
  const interfaceStore = useInterfaceStore();
  const websocketStore = useWebsocketStore();
  const filesWebsocketStore = useFilesWebsocketStore();
  const filesBuffer = filesWebsocketStore.filesBuffer;
  if (filesBuffer.length) {
    filesBuffer[0] = new Blob([filesBuffer[0].data], { type: 'image/jpeg' });
    interfaceStore.setPageBackgroundFromDB(URL.createObjectURL(filesBuffer[0]));
  }
  if (!dataStore.entities.length) {
    const getEntitiesData = {
      event: 'getPageEntities',
      body: { page_uuid }
    };
    websocketStore.sendData(getEntitiesData);
  }
  filesWebsocketStore.removeFirstFilesBuffer();
};

export const createEntity = (newEntity: IEntity) => {
  const websocketStore = useWebsocketStore();
  const page_uuid = cookies.get('current_page_uuid');
  if (newEntity.image_buffer) {
    websocketStore.setFileData(newEntity);
    const filesWebsocketStore = useFilesWebsocketStore();
    return filesWebsocketStore.sendData(newEntity.image_buffer);
  }
  const data = {
    event: 'createEntity',
    body: { ...newEntity, page_uuid }
  };
  websocketStore.sendData(data);
};

export const editEntity = (newState: IEntity) => {
  newState = checkIsImage(newState);
  const websocketStore = useWebsocketStore();
  const data = {
    event: 'editEntity',
    body: { ...newState }
  };
  websocketStore.sendData(data);
};

export const sendReturnOriginalSize = (newState: IEntity) => {
  const websocketStore = useWebsocketStore();
  const data = {
    event: 'returnOriginalImageSize',
    body: { ...newState }
  };
  websocketStore.sendData(data);
};

export const deleteEntity = (entityUuid: string) => {
  const dataStore = useDataStore();
  const websocketStore = useWebsocketStore();
  const page_uuid = cookies.get('current_page_uuid');
  const entities = dataStore.entities;
  const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
  const data = {
    event: 'deleteEntity',
    body: { ...entityToDelete, page_uuid }
  };
  websocketStore.sendData(data);
};

export const changeEntitiesOrder = (entityUuid: string, direction: 'up' | 'down') => {
  const websocketStore = useWebsocketStore();
  const dataStore = useDataStore();
  const entities = dataStore.entities;
  const mainEntity = entities.find((entity: IEntity) => entity.entity_uuid === entityUuid)!;
  const mainEntityIndex = entities.indexOf(mainEntity);
  const targetEntityIndex = direction === 'up' ? mainEntityIndex - 1 : mainEntityIndex + 1;
  const targetEntity = entities[targetEntityIndex];
  const data = {
    event: 'changeEntitiesOrder',
    body: {
      main: mainEntity,
      target: targetEntity
    }
  };
  websocketStore.sendData(data);
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
