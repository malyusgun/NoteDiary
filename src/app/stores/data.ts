import { defineStore } from 'pinia';
import type { IEntity, IPageInfo } from '@/app/interfaces/environment';
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

  const pagesData = ref<IPageInfo[]>([]);
  const currentPage = computed<IPageInfo>(() =>
    pagesData.value.find((page) => page.page_uuid === cookies.get('current_page_uuid'))
  );
  const entities = ref<IEntity[]>([]);
  function setCurrentPageUuid(uuid: string) {
    cookies.set('current_page_uuid', uuid);
  }
  function setCurrentPageData(data: IPageInfo) {
    currentPage.value = data;
  }
  function setPagesData(data: IPageInfo[]) {
    pagesData.value = data;
  }
  function addPageData(data: IPageInfo) {
    pagesData.value.push(data);
  }
  function editEntities(newState: IEntity[]) {
    entities.value = newState.sort(
      (entity, prevEntity) => +entity?.entity_order - +prevEntity?.entity_order
    );
  }
  return {
    sheets,
    entities,
    pagesData,
    currentPage,
    setCurrentPageUuid,
    setCurrentPageData,
    setPagesData,
    addPageData,
    editEntities
  };
});
