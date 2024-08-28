import type { IEntity } from '@/app/interfaces/environment';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import type { IImage } from '@/app/interfaces/entities';
import { useWebsocketStore } from '@/app/stores/websocket';

export const addUrlsToImageEntities = (entities: IEntity[]) => {
  const filesWebsocketStore = useFilesWebsocketStore();
  const filesBuffer = filesWebsocketStore.filesBuffer;
  let index = 0;
  const entitiesToReturn = entities.map((entity: IEntity) => {
    if (!entity.image_width) return entity;
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
  if (!entity.image_width) {
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
