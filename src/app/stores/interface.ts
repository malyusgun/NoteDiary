import { defineStore } from 'pinia';
import customFetch from '@/app/helpers/customFetch';
import cookies from '@/app/plugins/Cookie';
import { serverErrorHandler } from '@/app/helpers/exceptions';

export const useInterfaceStore = defineStore('interfaceStore', () => {
  const isDarkMode = ref<boolean>(true);
  const defaultSheetBackground = ref<string>(
    'https://t3.ftcdn.net/jpg/05/01/28/98/360_F_501289843_4ITbthNCydFQGgJmoZe4IQKchItBubqZ.jpg'
  );
  const sheetBackground = ref<string>(defaultSheetBackground.value);
  const isFetchedForBackground = ref<boolean>(false);

  function setIsFetchedForBackground() {
    isFetchedForBackground.value = true;
  }
  async function resetSheetBackground() {
    try {
      const sheetUuid = cookies.get('current_sheet_uuid');
      await customFetch(`/sheets/${sheetUuid}/background`, 'DELETE', sheetUuid);
      sheetBackground.value = defaultSheetBackground.value;
    } catch (e) {
      serverErrorHandler(e);
    }
  }
  function editSheetBackground(newUrl: string) {
    sheetBackground.value = newUrl;
    const image = new Image();
    image.src = newUrl;
    image.onload = async () => {
      const response = await fetch(newUrl);
      const blob = await response.blob();
      try {
        await customFetch(`/sheets/${sheetUuid}/background`, 'PATCH', {
          background_url: newUrl,
          extension: blob.type
        });
      } catch (e) {
        serverErrorHandler(e);
      }
    };
  }
  function setSheetBackgroundFromDB(url: string | null) {
    if (!url) {
      return;
    }
    sheetBackground.value = url;
  }
  return {
    isDarkMode,
    sheetBackground,
    defaultSheetBackground,
    isFetchedForBackground,
    setIsFetchedForBackground,
    resetSheetBackground,
    editSheetBackground,
    setSheetBackgroundFromDB
  };
});
