import { defineStore } from 'pinia';
import type { IEntity, ISheet } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';
import { useWindowSize } from '@vueuse/core';

export const useDataStore = defineStore('dataStore', () => {
  const sheets = ref([
    {
      label: 'Settings',
      iconBefore: 'settings',
      iconColor: 'white'
    }
  ]);

  const sheetsData = ref<ISheet[]>([]);
  const currentSheet = computed<ISheet>(() =>
    sheetsData.value.find((sheet) => sheet.sheet_uuid === cookies.get('current_sheet_uuid'))
  );
  const entities = ref<IEntity[]>([]);
  function setCurrentSheetUuid(uuid: string) {
    cookies.set('current_sheet_uuid', uuid);
  }

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  function setCurrentSheetData(data: ISheet) {
    // currentSheet.value = data;
  }
  function setSheetsData(data: ISheet[]) {
    sheetsData.value = data;
  }
  function addSheetData(data: ISheet) {
    sheetsData.value.push(data);
  }
  function editEntities(newState: IEntity[]) {
    entities.value = newState.sort(
      (entity, prevEntity) => +entity?.entity_order - +prevEntity?.entity_order
    );
  }
  return {
    windowWidth,
    windowHeight,
    sheets,
    entities,
    sheetsData,
    currentSheet,
    setCurrentSheetUuid,
    setCurrentSheetData,
    setSheetsData,
    addSheetData,
    editEntities
  };
});
