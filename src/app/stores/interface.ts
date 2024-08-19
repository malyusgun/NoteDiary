import { defineStore } from 'pinia';
import { useWebsocketStore } from '@/app/stores/websocket';

export const useInterfaceStore = defineStore('interfaceStore', () => {
  const homeBackgroundUrl = ref<string>(
    'https://wallpapers.com/images/featured/minimalist-7xpryajznty61ra3.jpg'
  );
  const defaultHomeBackgroundUrl = ref<string>(
    'https://wallpapers.com/images/featured/minimalist-7xpryajznty61ra3.jpg'
  );
  onMounted(() => {
    homeBackgroundUrl.value =
      localStorage.getItem('homeBackgroundUrl') || defaultHomeBackgroundUrl.value;
  });
  function changeHomeBackgroundUrl(newUrl: string) {
    homeBackgroundUrl.value = newUrl;
    const websocketStore = useWebsocketStore();
    const data = {
      event: 'changeHomeBackgroundUrl',
      body: {
        setting_name: 'homeBackgroundUrl',
        setting_value: newUrl
      }
    };
    websocketStore.sendData(data);
  }
  function setHomeBackgroundUrlFromDB(url: string | null) {
    if (!url) {
      return;
    }
    homeBackgroundUrl.value = url;
  }

  return {
    homeBackgroundUrl,
    defaultHomeBackgroundUrl,
    changeHomeBackgroundUrl,
    setHomeBackgroundUrlFromDB
  };
});
