import { defineStore } from 'pinia';
import { useWebsocketStore } from '@/app/stores/websocket';

export const useInterfaceStore = defineStore('interfaceStore', () => {
  const websocketStore = useWebsocketStore();

  const defaultHomeBackground = ref<string>(
    'https://t3.ftcdn.net/jpg/05/01/28/98/360_F_501289843_4ITbthNCydFQGgJmoZe4IQKchItBubqZ.jpg'
  );
  const homeBackground = ref<string>(defaultHomeBackground.value);
  const isFetchedForBackground = ref<boolean>(false);

  function setIsFetchedForBackground() {
    isFetchedForBackground.value = true;
    console.log('isFetchedForBackground.value', isFetchedForBackground.value);
  }

  function resetHomeBackground() {
    homeBackground.value = defaultHomeBackground.value;
    const data = {
      event: 'removeHomeBackground'
    };
    websocketStore.sendData(data);
  }
  function changeHomeBackground(newUrl: string) {
    homeBackground.value = newUrl;
    const image = new Image();
    image.src = newUrl;
    image.onload = async () => {
      const response = await fetch(newUrl);
      const blob = await response.blob();
      const data = {
        event: 'changeHomeBackground',
        body: {
          setting_name: 'homeBackground',
          setting_value: newUrl,
          extension: blob.type
        }
      };
      websocketStore.sendData(data);
    };
  }
  function setHomeBackgroundFromDB(url: string | null) {
    if (!url) {
      return;
    }
    homeBackground.value = url;
  }

  return {
    homeBackground,
    defaultHomeBackground,
    isFetchedForBackground,
    setIsFetchedForBackground,
    resetHomeBackground,
    changeHomeBackground,
    setHomeBackgroundFromDB
  };
});
