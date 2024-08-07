import { defineStore } from 'pinia';

export const useInterfaceStore = defineStore('interfaceStore', () => {
  const homeBackgroundUrl = ref<string>(
    'https://wallpapers.com/images/featured/minimalist-7xpryajznty61ra3.jpg'
  );
  onMounted(() => {
    homeBackgroundUrl.value =
      localStorage.getItem('homeBackgroundUrl') ||
      'https://wallpapers.com/images/featured/minimalist-7xpryajznty61ra3.jpg';
  });
  function changeHomeBackgroundUrl(newUrl: string) {
    homeBackgroundUrl.value = newUrl;
  }

  return { homeBackgroundUrl, changeHomeBackgroundUrl };
});
