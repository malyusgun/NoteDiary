import type { IEntity } from '@/app/interfaces/environment';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import type { IImage } from '@/app/interfaces/entities';
import { useWebsocketStore } from '@/app/stores/websocket';
import { useInterfaceStore } from '@/app/stores/interface';
import { imageScaleOptions } from '@/components/sheets/entities/settings/lists/constants/options';

export const calcImageWidth = (fileWidth: number, windowWidth: number) => {
  let imageWidth = Math.ceil((fileWidth / (windowWidth - 128)) * 100);
  if (imageWidth > 100) {
    imageWidth = 100;
  }
  if (imageWidth < 5) {
    imageWidth = 5;
  }
  return imageWidth;
};

export const sendReturnOriginalSize = (newState: IEntity) => {
  const websocketStore = useWebsocketStore();
  const data = {
    event: 'returnOriginalImageSize',
    body: { ...newState }
  };
  websocketStore.sendData(data);
};

export const uploadImage = ($event) => {
  const target = $event.target as HTMLInputElement;
  const image = new Image();
  const file = target.files![0];
  image.src = URL.createObjectURL(file);
  return image;
};

export const backgroundImageOnLoad = (image, windowWidth: number) => {
  const backgroundImageInfo = {
    image_url: '',
    image_width: 0,
    file_width: 0,
    file_height: 0
  };
  const imageWidth = calcImageWidth(image.width, windowWidth);
  backgroundImageInfo.image_url = image.src;
  backgroundImageInfo.image_width = imageWidth;
  backgroundImageInfo.file_width = image.width;
  backgroundImageInfo.file_height = image.height;
  return backgroundImageInfo;
};

export const setDefaultSheetBackground = () => {
  const interfaceStore = useInterfaceStore();
  interfaceStore.resetSheetBackground();
};

export const addUrlsToImageEntities = (entities: IEntity[]) => {
  const filesWebsocketStore = useFilesWebsocketStore();
  const filesBuffer = filesWebsocketStore.filesBuffer;
  let index = 0;
  const entitiesToReturn = entities.map((entity: IEntity) => {
    if (!entity?.image_width) return entity;
    if (entity.image_url) return entity;
    if (filesWebsocketStore.image_url) {
      // редактирование сущности изображения
      entity.image_url = filesWebsocketStore.image_url;
      filesWebsocketStore.cleanImageUrl();
    } else {
      filesBuffer[index] = new Blob([filesBuffer[index].data], { type: 'image/jpeg' });
      entity.image_url = URL.createObjectURL(filesBuffer[index]);
      index += 1;
      filesBuffer[index] = new Blob([filesBuffer[index].data], { type: 'image/jpeg' });
      entity.image_url_initial = URL.createObjectURL(filesBuffer[index]);
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
  filesWebsocketStore.saveImageUrl(entityToReturn.image_url!);
  delete entityToReturn.image_url;
  return entityToReturn;
};

export const sendCropImage = async (newUrl: string, entity: IImage) => {
  const filesWebsocketStore = useFilesWebsocketStore();
  filesWebsocketStore.saveImageUrl(newUrl);
  const websocketStore = useWebsocketStore();
  const response = await fetch(newUrl);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const dataSetCropNow = {
    event: 'setCropNow'
  };
  websocketStore.sendData(dataSetCropNow);
  filesWebsocketStore.sendData(buffer);
  const data = {
    event: 'cropImage',
    body: { ...entity }
  };
  websocketStore.sendData(data);
};

export const getImageScalesToRemove = (
  entity: IImage,
  isText?: boolean,
  isEntityWidthFull: boolean
) => {
  const valuesToRemove = [];
  let scale = entity.image_scale;
  if (scale[0] === 'x') scale = scale.slice(1);
  const initialImageWidth = Math.ceil(+entity.image_width / +scale);
  const initialImageHeight = +entity.file_height_initial;
  if (initialImageWidth <= 20) {
    valuesToRemove.push('x0.25');
    if (initialImageWidth <= 10) {
      valuesToRemove.push('x0.5');
    }
  }
  if (initialImageWidth <= 7 || (!isEntityWidthFull && isText && initialImageWidth > 66)) {
    valuesToRemove.push('x0.75');
  }
  if (initialImageWidth > 75 && isText) {
    valuesToRemove.push('x1');
  }
  if (
    initialImageWidth > 80 ||
    (initialImageWidth > 60 && isText) ||
    (!isEntityWidthFull && isText && initialImageWidth > 40) ||
    initialImageHeight * 1.25 > 1000
  ) {
    valuesToRemove.push('x1.25');
  }
  if (
    initialImageWidth > 66 ||
    (initialImageWidth > 50 && isText) ||
    (!isEntityWidthFull && isText && initialImageWidth > 33) ||
    initialImageHeight * 1.5 > 1000
  ) {
    valuesToRemove.push('x1.5');
  }
  if (
    initialImageWidth > 57 ||
    (initialImageWidth > 42 && isText) ||
    (!isEntityWidthFull && isText && initialImageWidth > 28) ||
    initialImageHeight * 1.75 > 1000
  ) {
    valuesToRemove.push('x1.75');
  }
  if (
    initialImageWidth > 57 ||
    (initialImageWidth > 42 && isText) ||
    (!isEntityWidthFull && isText && initialImageWidth > 28) ||
    initialImageHeight * 1.75 > 1000
  ) {
    valuesToRemove.push('x1.75');
  }
  if (
    initialImageWidth > 50 ||
    (initialImageWidth > 37 && isText) ||
    (!isEntityWidthFull && isText && initialImageWidth > 25) ||
    initialImageHeight * 2 > 1000
  ) {
    valuesToRemove.push('x2');
  }
  return valuesToRemove;
};

export const filterImageScaleOptions = (
  entityData: IImage,
  isText: boolean,
  isEntityWidthFull: boolean
) => {
  const scalesToRemove = getImageScalesToRemove(entityData, isText, isEntityWidthFull);
  let initialScales = imageScaleOptions;

  if (!scalesToRemove.length) return imageScaleOptions;

  initialScales = initialScales.filter((item) => !~scalesToRemove.indexOf(item.label));

  for (let i = 0; i < initialScales.length; i++) {
    initialScales[i].value = i;
  }

  return initialScales;
};

export const scaleImage = (entityData: IImage, prevScale: string) => {
  let scale = entityData.image_scale;
  if (scale[0] === 'x') scale = scale.slice(1);
  if (prevScale[0] === 'x') prevScale = prevScale.slice(1);
  const initialWidth = Math.ceil(+entityData.image_width / +prevScale);
  entityData.image_width = Math.ceil(initialWidth * +scale);
  return entityData;
};

export const updateEntityDataTextOnSave = <T>(
  newEntityData: T,
  prevEntityData: IEntity,
  isEntityWidthFull: boolean,
  isTitle: boolean,
  isText?: boolean
) => {
  const paragraphSize = isEntityWidthFull ? 'full' : 'half';
  if (paragraphSize !== prevEntityData.paragraph_size) {
    newEntityData.paragraph_size = paragraphSize;
  }
  if (isTitle !== !!prevEntityData.title) {
    if (isTitle) {
      newEntityData.title = 'Title';
    } else {
      newEntityData.title = null;
    }
  }
  if (isText !== !!prevEntityData.text) {
    if (isText) {
      newEntityData.text = 'Text';
    } else {
      newEntityData.text = null;
    }
  }
  return newEntityData;
};
