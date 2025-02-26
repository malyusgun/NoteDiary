import { defineStore } from 'pinia';
import type { TEntity, ISheet } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';

export const useDataStore = defineStore('dataStore', () => {
  const sheets = ref([
    {
      label: 'Settings',
      iconBefore: 'settings',
      iconColor: 'white',
      children: []
    }
  ]);

  const sheetsData = ref<ISheet[]>([]);
  const currentSheet = computed<ISheet>(() =>
    sheetsData.value.find((sheet) => sheet.sheet_uuid === cookies.get('current_sheet_uuid'))
  );
  const entities = ref<TEntity[]>([]);
  function setCurrentSheetUuid(uuid: string) {
    cookies.set('current_sheet_uuid', uuid);
  }
  function setSheetsData(data: ISheet[]) {
    sheetsData.value = data;
  }
  function addSheetData(data: ISheet) {
    sheetsData.value.push(data);
  }
  function editEntities(newState: TEntity[]) {
    console.log('entities.value: ', entities.value);
    console.log('newState: ', newState);
    entities.value = newState.sort(
      (entity, prevEntity) => +entity?.entity_order - +prevEntity?.entity_order
    );
  }
  return {
    sheets,
    entities,
    sheetsData,
    currentSheet,
    setCurrentSheetUuid,
    setSheetsData,
    addSheetData,
    editEntities
  };
});
