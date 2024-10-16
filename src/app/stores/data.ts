import { defineStore } from 'pinia';
import type { IEntity, ISheetInfo } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';

export const useDataStore = defineStore('dataStore', () => {
  const sheets = ref([
    {
      text: 'Личная жизнь',
      link: '/0a49c3f4-57d2-4c82-be20-c7bab0abd623',
      children: [
        {
          text: 'Девушка',
          link: '/f22dabd2-029b-46ae-8580-a8291449a051',
          children: [
            {
              text: 'Заморочки и проблемы и всё-всё-всё моей любимой девушки',
              link: '/83ad3c89-64a2-428d-995c-8008d40cec8a'
            },
            {
              text: 'Любимые цветы девушки',
              link: '/(uuid of sheet)'
            }
          ]
        },
        {
          text: 'Работа',
          link: '/81d8bc92-57cb-4ab2-89c2-63304bd0e5fb',
          children: [
            {
              text: 'Pet-projects',
              link: '/(uuid of sheet)'
            }
          ]
        }
      ]
    }
  ]);

  const sheetsData = ref<ISheetInfo[]>([]);
  const currentSheet = computed<ISheetInfo>(() =>
    sheetsData.value.find((sheet) => sheet.sheet_uuid === cookies.get('current_sheet_uuid'))
  );
  const entities = ref<IEntity[]>([]);
  function setCurrentSheetUuid(uuid: string) {
    cookies.set('current_sheet_uuid', uuid);
  }
  function setCurrentSheetData(data: ISheetInfo) {
    // currentSheet.value = data;
  }
  function setSheetsData(data: ISheetInfo[]) {
    sheetsData.value = data;
  }
  function addSheetData(data: ISheetInfo) {
    sheetsData.value.push(data);
  }
  function editEntities(newState: IEntity[]) {
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
    setCurrentSheetData,
    setSheetsData,
    addSheetData,
    editEntities
  };
});
