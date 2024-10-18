import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import { calcImageWidth, checkIsImage } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import cookies from '@/app/plugins/Cookie';
import { useWindowSize } from '@vueuse/core';

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

export const addImageOnLoad = async (image, url: string) => {
  const filesWebsocketStore = useFilesWebsocketStore();
  filesWebsocketStore.saveImageUrl(url);
  const response = await fetch(url);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const { width: windowWidth } = useWindowSize();
  const maxHeight = 1000;
  const initWidth = image.width;
  if (image.height > maxHeight) {
    const coefficient = maxHeight / image.height;
    image.width *= coefficient;
  }
  const imageWidth = calcImageWidth(image.width, windowWidth.value);
  createEntity({
    entity_type: 'image',
    entity_order: entitiesCount.value + 1,
    image_buffer: buffer,
    entity_position: 'left',
    entity_title_position: 'center',
    font_size: '24',
    text_position: 'right',
    paragraph_size: 'full',
    image_width: imageWidth,
    image_width_initial: imageWidth,
    file_width: initWidth,
    file_height: image.height,
    file_width_initial: initWidth,
    file_height_initial: image.height,
    image_scale: 'x1'
  });
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
