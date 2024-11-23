import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import {
  addUrlsToImageEntities,
  calcImageWidth,
  getUrlFromArrayBuffer
} from '@/app/helpers/images';
import cookies from '@/app/plugins/Cookie';
import customFetch from '@/app/helpers/customFetch';
import { createEntityHandler } from '@/app/helpers/requestHandlers';
import customFetchBuffer from '@/app/helpers/customFetchBuffer';
import { serverErrorHandler } from '@/app/helpers/exceptions';
import { useInterfaceStore } from '@/app/stores/interface';

const dataStore = useDataStore();

export const fetchForEntities = async (sheet_uuid: string) => {
  try {
    const entitiesDB = await customFetch(`/sheets/${sheet_uuid}/entities`, 'GET');
    const entities = addUrlsToImageEntities(entitiesDB.entities, entitiesDB.imageEntities);
    dataStore.editEntities(entities);
  } catch (e) {
    serverErrorHandler(e);
  }
};

export const createEntity = async (newEntity: IEntity, buffer?: Buffer) => {
  try {
    const sheet_uuid = cookies.get('current_sheet_uuid');
    if (buffer) {
      await customFetchBuffer(`/sheets/${sheet_uuid}/entities/image`, 'POST', buffer);
    } // create should be called "after" when the image on the backend is already created by the request above
    const newEntityDB = await customFetch(`/sheets/${sheet_uuid}/entities`, 'POST', {
      ...newEntity,
      sheet_uuid
    });
    if (buffer) {
      newEntityDB.image_url = getUrlFromArrayBuffer(buffer);
    }
    createEntityHandler(newEntityDB);
  } catch (e) {
    serverErrorHandler(e);
  }
};

export const addImageOnLoad = async (image, url: string, entitiesCount: number) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const windowWidth = computed(() => useInterfaceStore().windowWidth);
  const maxHeight = 1000;
  const initWidth = image.width;
  if (image.height > maxHeight) {
    const coefficient = maxHeight / image.height;
    image.width *= coefficient;
  }
  const imageWidth = calcImageWidth(image.width, windowWidth.value);
  await createEntity(
    {
      entity_type: 'image',
      entity_order: entitiesCount + 1,
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
    },
    buffer
  );
};

export const editEntity = async (newState: IEntity) => {
  try {
    const sheetUuid = cookies.get('current_sheet_uuid');
    const stateWithoutUrl = { ...newState };
    delete stateWithoutUrl.image_url;
    await customFetch(
      `/sheets/${sheetUuid}/entities/${newState.entity_uuid}`,
      'PATCH',
      stateWithoutUrl
    );
    const entities = dataStore.entities;
    let newStateEntities = [...entities];
    newStateEntities = newStateEntities.map((entity: IEntity) => {
      if (entity.entity_uuid !== newState.entity_uuid) return entity;
      return newState;
    });
    dataStore.editEntities(newStateEntities);
  } catch (e) {
    serverErrorHandler(e);
  }
};

export const deleteEntity = async (entityUuid: string) => {
  try {
    const sheet_uuid = cookies.get('current_sheet_uuid');
    const entities = dataStore.entities;
    const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
    delete entityToDelete.image_url;
    await customFetch(`/sheets/${sheet_uuid}/entities/${entityUuid}`, 'DELETE', {
      ...entityToDelete,
      sheet_uuid
    });

    let newStateEntities = [...entities];
    newStateEntities = newStateEntities.filter(
      (entity: IEntity) => entity.entity_uuid !== entityToDelete.entity_uuid
    );
    dataStore.editEntities(newStateEntities);
  } catch (e) {
    serverErrorHandler(e);
  }
};

export const changeEntitiesOrder = async (entityUuid: string, direction: 'up' | 'down') => {
  const entities = dataStore.entities;
  const sheetUuid = dataStore.currentSheet.sheet_uuid;

  const mainEntity = entities.find((entity: IEntity) => entity.entity_uuid === entityUuid)!;
  const mainEntityIndex = entities.indexOf(mainEntity);
  const targetEntityIndex = direction === 'up' ? mainEntityIndex - 1 : mainEntityIndex + 1;
  const targetEntity = entities[targetEntityIndex];

  try {
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
  } catch (e) {
    serverErrorHandler(e);
  }
};
