import type { IEntity } from '@/app/interfaces/environment';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import type { IImage } from '@/app/interfaces/entities';
import { useWebsocketStore } from '@/app/stores/websocket';
import { useInterfaceStore } from '@/app/stores/interface';

export const setDefaultPageBackground = () => {
  const interfaceStore = useInterfaceStore();
  interfaceStore.resetPageBackground();
};

export const addUrlsToImageEntities = (entities: IEntity[]) => {
  const filesWebsocketStore = useFilesWebsocketStore();
  const filesBuffer = filesWebsocketStore.filesBuffer;
  let index = 0;
  const entitiesToReturn = entities.map((entity: IEntity) => {
    if (!entity?.image_width) return entity;
    if (entity.imageUrl) return entity;
    if (filesWebsocketStore.imageUrl) {
      // редактирование сущности изображения
      entity.imageUrl = filesWebsocketStore.imageUrl;
      filesWebsocketStore.cleanImageUrl();
    } else {
      filesBuffer[index] = new Blob([filesBuffer[index].data], { type: 'image/jpeg' });
      entity.imageUrl = URL.createObjectURL(filesBuffer[index]);
      index += 1;
    }
    return entity;
  });
  filesWebsocketStore.cleanFilesBuffer();
  return entitiesToReturn;
};

export const checkIsImage = (entity: IEntity) => {
  if (!entity?.image_width) {
    return entity;
  }
  const entityToReturn = { ...entity };
  const filesWebsocketStore = useFilesWebsocketStore();
  filesWebsocketStore.saveImageUrl(entityToReturn.imageUrl!);
  delete entityToReturn.imageUrl;
  return entityToReturn;
};

export const cropImage = async (newUrl: string, entity: IImage) => {
  const filesWebsocketStore = useFilesWebsocketStore();
  filesWebsocketStore.saveImageUrl(newUrl);
  const websocketStore = useWebsocketStore();
  const response = await fetch(newUrl);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  filesWebsocketStore.sendData(buffer);
  const data = {
    event: 'cropImage',
    body: { ...entity }
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
