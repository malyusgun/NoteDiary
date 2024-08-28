import { defineStore } from 'pinia';
import { useInterfaceStore } from '@/app/stores/interface';

export const useFilesWebsocketStore = defineStore('filesWebsocketStore', () => {
  const interfaceStore = useInterfaceStore();

  const socket = ref();
  const filesBuffer = ref([]);
  const imageUrl = ref();

  onMounted(() => {
    socket.value = new WebSocket('ws://localhost:5001');
    socket.value.binaryType = 'arraybuffer';
    socket.value.onmessage = (response) => {
      console.log('response: ', response);
      if (response?.data?.byteLength) {
        filesBuffer.value.push(response);
      }
      interfaceStore.setIsFetchedForBackground();
    };
  });

  function removeFirstFilesBuffer() {
    filesBuffer.value.shift();
  }
  function cleanFilesBuffer() {
    filesBuffer.value = [];
  }
  function saveImageUrl(url: string) {
    imageUrl.value = url;
  }
  function cleanImageUrl() {
    imageUrl.value = '';
  }
  function sendData(data: unknown) {
    socket.value.send(data);
  }
  return {
    filesBuffer,
    imageUrl,
    cleanFilesBuffer,
    removeFirstFilesBuffer,
    saveImageUrl,
    cleanImageUrl,
    sendData
  };
});
