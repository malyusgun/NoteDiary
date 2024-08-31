import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import { checkIsImage } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import type { IImage } from '@/app/interfaces/entities';

export const setDefaultHomeBackground = () => {
  const interfaceStore = useInterfaceStore();
  interfaceStore.resetHomeBackground();
};

export const fetchForHomeEntities = () => {
  const dataStore = useDataStore();
  const interfaceStore = useInterfaceStore();
  const websocketStore = useWebsocketStore();
  const filesWebsocketStore = useFilesWebsocketStore();
  const filesBuffer = filesWebsocketStore.filesBuffer;
  if (filesBuffer.length) {
    filesBuffer[0] = new Blob([filesBuffer[0].data], { type: 'image/jpeg' });
    interfaceStore.setHomeBackgroundFromDB(URL.createObjectURL(filesBuffer[0]));
  }
  if (!dataStore.homeEntities.length) {
    const getHomeEntitiesData = {
      event: 'getHomeEntities'
    };
    websocketStore.sendData(getHomeEntitiesData);
  }
  filesWebsocketStore.removeFirstFilesBuffer();
};

export const createHomeEntity = (newEntity: IEntity) => {
  const websocketStore = useWebsocketStore();
  if (newEntity.image_buffer) {
    websocketStore.setFileData(newEntity);
    const filesWebsocketStore = useFilesWebsocketStore();
    return filesWebsocketStore.sendData(newEntity.image_buffer);
  }
  const data = {
    event: 'createHomeEntity',
    body: newEntity
  };
  websocketStore.sendData(data);
};

export const editEntity = (newState: IEntity) => {
  newState = checkIsImage(newState);
  const websocketStore = useWebsocketStore();
  const data = {
    event: 'editHomeEntity',
    body: { ...newState }
  };
  websocketStore.sendData(data);
};

export const deleteEntity = (entityUuid: string) => {
  const dataStore = useDataStore();
  const websocketStore = useWebsocketStore();
  const entities = dataStore.homeEntities;
  const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
  const data = {
    event: 'deleteHomeEntity',
    body: { ...entityToDelete }
  };
  websocketStore.sendData(data);
};

export const changeOrderHomeEntity = (entityUuid: string, direction: 'up' | 'down') => {
  const websocketStore = useWebsocketStore();
  const data = {
    event: 'changeOrderHomeEntity',
    body: {
      entity_uuid: entityUuid,
      direction
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
