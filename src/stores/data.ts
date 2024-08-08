import { defineStore } from 'pinia';
import type { ISheet } from '@/interfaces/environment';

export const useDataStore = defineStore('dataStore', () => {
  const sheets = ref([
    {
      key: '0',
      label: 'Личная жизнь',
      data: '/0a49c3f4-57d2-4c82-be20-c7bab0abd623',
      icon: 'pi pi-fw pi-inbox',
      type: 'url',
      children: [
        {
          key: '0-0',
          label: 'Девушка',
          data: '/f22dabd2-029b-46ae-8580-a8291449a051',
          icon: 'pi pi-fw pi-cog',
          type: 'url',
          children: [
            {
              key: '0-0-0',
              label: 'Заморочки и проблемы и всё-всё-всё моей любимой девушки',
              icon: 'pi pi-fw pi-file',
              data: '/83ad3c89-64a2-428d-995c-8008d40cec8a',
              type: 'url'
            },
            {
              key: '0-0-1',
              label: 'Любимые цветы девушки',
              icon: 'pi pi-fw pi-file',
              data: '/(uuid of sheet)',
              type: 'url'
            }
          ]
        },
        {
          key: '0-1',
          label: 'Работа',
          data: '/81d8bc92-57cb-4ab2-89c2-63304bd0e5fb',
          icon: 'pi pi-fw pi-home',
          type: 'url',
          children: [
            {
              key: '0-1-0',
              label: 'Pet-projects',
              icon: 'pi pi-fw pi-file',
              data: '/(uuid of sheet)',
              type: 'url'
            }
          ]
        }
      ]
    }
  ]);

  const homeEntities = ref(JSON.parse(localStorage.getItem('homeEntities') || '[]'));

  function editHomeEntities(newState) {
    homeEntities.value = newState;
    localStorage.setItem('homeEntities', JSON.stringify(newState));
  }
  return { sheets, homeEntities, editHomeEntities };
});
