import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import { checkIsImage } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import cookies from '@/app/plugins/Cookie';

export const fetchForEntities = (sheet_uuid: string) => {
  const dataStore = useDataStore();
  const interfaceStore = useInterfaceStore();
  const websocketStore = useWebsocketStore();
  const filesWebsocketStore = useFilesWebsocketStore();
  const filesBuffer = filesWebsocketStore.filesBuffer;
  if (filesBuffer.length) {
    filesBuffer[0] = new Blob([filesBuffer[0].data], { type: 'image/jpeg' });
    interfaceStore.setSheetBackgroundFromDB(URL.createObjectURL(filesBuffer[0]));
  }
  if (!dataStore.entities.length) {
    const getEntitiesData = {
      event: 'getSheetEntities',
      body: { sheet_uuid }
    };
    websocketStore.sendData(getEntitiesData);
  }
  filesWebsocketStore.removeFirstFilesBuffer();
};

export const createEntity = (newEntity: IEntity) => {
  const websocketStore = useWebsocketStore();
  const sheet_uuid = cookies.get('current_sheet_uuid');
  if (newEntity.image_buffer) {
    websocketStore.setFileData(newEntity);
    const filesWebsocketStore = useFilesWebsocketStore();
    return filesWebsocketStore.sendData(newEntity.image_buffer);
  }
  const data = {
    event: 'createEntity',
    body: { ...newEntity, sheet_uuid }
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

export const deleteEntity = (entityUuid: string) => {
  const dataStore = useDataStore();
  const websocketStore = useWebsocketStore();
  const sheet_uuid = cookies.get('current_sheet_uuid');
  const entities = dataStore.entities;
  const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
  const data = {
    event: 'deleteEntity',
    body: { ...entityToDelete, sheet_uuid }
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
