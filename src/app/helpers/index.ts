import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import { checkIsImage } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import type { IImage } from '@/app/interfaces/entities';
import cookies from '@/app/plugins/Cookie';

export const setDefaultPageBackground = () => {
  const interfaceStore = useInterfaceStore();
  interfaceStore.resetPageBackground();
};
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

export const deleteEntity = (entityUuid: string) => {
  const dataStore = useDataStore();
  const websocketStore = useWebsocketStore();
  const entities = dataStore.entities;
  const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
  const data = {
    event: 'deleteEntity',
    body: { ...entityToDelete }
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

export const getImageSpeedDialSizeSmallerLabelsToRemove = (entity: IImage) => {
  const elementsLabelsToRemove = [];
  const initialImageWidth = Math.ceil(entity.image_width / +entity.image_scale);
  const initialImageHeight = Math.ceil(entity.image_height / +entity.image_scale);
  if (initialImageWidth <= 400 || initialImageHeight <= 400) {
    elementsLabelsToRemove.push('x0.25');
    if (
      initialImageWidth <= 200 ||
      initialImageHeight <= 200 ||
      (initialImageWidth >= 1600 && entity.text_position)
    ) {
      elementsLabelsToRemove.push('x0.5');
      if (
        initialImageWidth <= 95 ||
        initialImageHeight <= 95 ||
        (initialImageWidth >= 1066 && entity.text_position)
      ) {
        elementsLabelsToRemove.push('x0.75');
      }
    }
  }
  if (
    (initialImageWidth >= 800 && entity.text_position) ||
    entity.image_width < initialImageWidth
  ) {
    elementsLabelsToRemove.push('x1');
  }
  return elementsLabelsToRemove;
};

export const getImageSpeedDialSizeBiggerLabelsToRemove = (entity: IImage) => {
  const elementsLabelsToRemove = [];
  const initialImageWidth = Math.ceil(entity.image_width / +entity.image_scale);
  const initialImageHeight = Math.ceil(entity.image_height / +entity.image_scale);
  if (
    (initialImageWidth >= 800 && entity.text_position) ||
    entity.image_width > initialImageWidth
  ) {
    elementsLabelsToRemove.push('x1');
  }
  if (
    initialImageWidth >= 960 ||
    initialImageHeight >= 560 ||
    (initialImageWidth >= 640 && entity.text_position)
  ) {
    elementsLabelsToRemove.push('x1.25');
    if (
      initialImageWidth >= 800 ||
      initialImageHeight >= 467 ||
      (initialImageWidth >= 533 && entity.text_position)
    ) {
      elementsLabelsToRemove.push('x1.5');
      if (
        initialImageWidth >= 685 ||
        initialImageHeight >= 400 ||
        (initialImageWidth >= 457 && entity.text_position)
      ) {
        elementsLabelsToRemove.push('x1.75');
        if (
          initialImageWidth >= 600 ||
          initialImageHeight >= 350 ||
          (initialImageWidth >= 400 && entity.text_position)
        ) {
          elementsLabelsToRemove.push('x2');
        }
      }
    }
  }
  return elementsLabelsToRemove;
};
