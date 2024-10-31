import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import { calcImageWidth, checkIsImage } from '@/app/helpers/images';
import cookies from '@/app/plugins/Cookie';
import customFetch from '@/app/helpers/customFetch';

const dataStore = useDataStore();

export const fetchForEntities = async (sheet_uuid: string) => {
  const entities = await customFetch(`sheets/${sheet_uuid}/entities`, 'GET');
  dataStore.editEntities(entities);
};

export const createEntity = async (newEntity: IEntity) => {
  const sheet_uuid = cookies.get('current_sheet_uuid');
  const newEntityDB = await customFetch(`sheets/${sheet_uuid}/entities`, 'POST', {
    ...newEntity,
    sheet_uuid
  });

  const entities = dataStore.entities;
  const newStateEntities = [...entities];

  newStateEntities.push(newEntityDB);
  dataStore.editEntities(newStateEntities);
};

export const addImageOnLoad = async (image, url: string, entitiesCount: number) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const windowWidth = computed(() => dataStore.windowWidth);
  const maxHeight = 1000;
  const initWidth = image.width;
  if (image.height > maxHeight) {
    const coefficient = maxHeight / image.height;
    image.width *= coefficient;
  }
  const imageWidth = calcImageWidth(image.width, windowWidth.value);
  await createEntity({
    entity_type: 'image',
    entity_order: entitiesCount + 1,
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

export const editEntity = async (newState: IEntity) => {
  newState = checkIsImage(newState);
  const sheetUuid = cookies.get('current_sheet_uuid');
  const newStateDB = await customFetch(
    `/sheets/${sheetUuid}/entities/${newState.entity_uuid}`,
    'PATCH',
    newState
  );

  const entities = dataStore.entities;
  let newStateEntities = [...entities];
  newStateEntities = newStateEntities.map((entity: IEntity) => {
    if (entity.entity_uuid !== newStateDB.entity_uuid) return entity;
    return newStateDB;
  });
  dataStore.editEntities(newStateEntities);
};

export const deleteEntity = async (entityUuid: string) => {
  const sheet_uuid = cookies.get('current_sheet_uuid');
  const entities = dataStore.entities;
  const entityToDelete = entities.find((entity) => entity.entity_uuid === entityUuid);
  await customFetch(`/sheets/${sheet_uuid}/entities/${entityUuid}`, 'DELETE', {
    ...entityToDelete,
    sheet_uuid
  });

  let newStateEntities = [...entities];
  newStateEntities = newStateEntities.filter(
    (entity: IEntity) => entity.entity_uuid !== entityToDelete.entity_uuid
  );
  dataStore.editEntities(newStateEntities);
};

export const changeEntitiesOrder = (entityUuid: string, direction: 'up' | 'down') => {
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
};
