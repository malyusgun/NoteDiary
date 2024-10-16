import { defineStore } from 'pinia';
import { useWebsocketStore } from '@/app/stores/websocket';

export const useInterfaceStore = defineStore('interfaceStore', () => {
  const websocketStore = useWebsocketStore();

  const isDarkMode = ref<boolean>(true);
  const defaultSheetBackground = ref<string>(
    'https://t3.ftcdn.net/jpg/05/01/28/98/360_F_501289843_4ITbthNCydFQGgJmoZe4IQKchItBubqZ.jpg'
  );
  const sheetBackground = ref<string>(defaultSheetBackground.value);
  const isFetchedForBackground = ref<boolean>(false);

  function setIsFetchedForBackground() {
    isFetchedForBackground.value = true;
  }
  function resetSheetBackground() {
    sheetBackground.value = defaultSheetBackground.value;
    const data = {
      event: 'deleteSheetBackground'
    };
    websocketStore.sendData(data);
  }
  function editSheetBackground(newUrl: string) {
    sheetBackground.value = newUrl;
    const image = new Image();
    image.src = newUrl;
    image.onload = async () => {
      const response = await fetch(newUrl);
      const blob = await response.blob();
      const data = {
        event: 'editSheetBackground',
        body: {
          background_url: newUrl,
          extension: blob.type
        }
      };
      websocketStore.sendData(data);
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
