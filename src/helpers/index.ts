import { useInterfaceStore } from '@/stores/interface';
import type { IEntity } from '@/interfaces/environment';
import { useDataStore } from '@/stores/data';
import { useWebsocketStore } from '@/stores/websocket';

export async function uploadFile($event: Event) {
  const target = $event.target as HTMLInputElement;
  if (target && target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      const url = reader.result;
      const interfaceStore = useInterfaceStore();
      interfaceStore.changeHomeBackgroundUrl(url);
      localStorage.setItem('homeBackgroundUrl', url);
    });
  }
}

export function setDefaultHomeBackground() {
  const interfaceStore = useInterfaceStore();
  interfaceStore.changeHomeBackgroundUrl(
    'https://wallpapers.com/images/featured/minimalist-7xpryajznty61ra3.jpg'
  );
  localStorage.removeItem('homeBackgroundUrl');
}

export const editEntity = (newState: IEntity, entityUuid: string) => {
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
