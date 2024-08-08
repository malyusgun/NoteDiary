import { useInterfaceStore } from '@/stores/interface';
import type { IEntity } from '@/interfaces/environment';
import { useDataStore } from '@/stores/data';

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
  const dataStore = useDataStore();
  let prevState = dataStore.homeEntities;
  prevState = prevState.map((entity: IEntity) => {
    if (entity.uuid !== entityUuid) return entity;
    return newState;
  });
  dataStore.editHomeEntities(prevState);
};
