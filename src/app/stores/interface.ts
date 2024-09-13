import { defineStore } from 'pinia';
import { useWebsocketStore } from '@/app/stores/websocket';

export const useInterfaceStore = defineStore('interfaceStore', () => {
  const websocketStore = useWebsocketStore();

  const isDarkMode = ref<boolean>(true);
  const defaultPageBackground = ref<string>(
    'https://t3.ftcdn.net/jpg/05/01/28/98/360_F_501289843_4ITbthNCydFQGgJmoZe4IQKchItBubqZ.jpg'
  );
  const pageBackground = ref<string>(defaultPageBackground.value);
  const isFetchedForBackground = ref<boolean>(false);

  function setIsFetchedForBackground() {
    isFetchedForBackground.value = true;
  }
  function resetPageBackground() {
    pageBackground.value = defaultPageBackground.value;
    const data = {
      event: 'deletePageBackground'
    };
    websocketStore.sendData(data);
  }
  function editPageBackground(newUrl: string) {
    pageBackground.value = newUrl;
    const image = new Image();
    image.src = newUrl;
    image.onload = async () => {
      const response = await fetch(newUrl);
      const blob = await response.blob();
      const data = {
        event: 'editPageBackground',
        body: {
          background_url: newUrl,
          extension: blob.type
        }
      };
      websocketStore.sendData(data);
    };
  }
  function setPageBackgroundFromDB(url: string | null) {
    if (!url) {
      return;
    }
    pageBackground.value = url;
  }
  return {
    isDarkMode,
    pageBackground,
    defaultPageBackground,
    isFetchedForBackground,
    setIsFetchedForBackground,
    resetPageBackground,
    editPageBackground,
    setPageBackgroundFromDB
  };
});
