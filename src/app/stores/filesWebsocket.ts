import { defineStore } from 'pinia';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import { useInterfaceStore } from '@/app/stores/interface';
import { useWebsocketStore } from '@/app/stores/websocket';

export const useFilesWebsocketStore = defineStore('filesWebsocketStore', () => {
  const socket = ref();
  const dataStore = useDataStore();
  const interfaceStore = useInterfaceStore();
  const homeEntities = computed(() => dataStore.homeEntities);
  const filesBlob = ref([]);

  onMounted(() => {
    socket.value = new WebSocket('ws://localhost:5001');
    socket.value.binaryType = 'arraybuffer';
    socket.value.onmessage = (response: any) => {
      console.log('response: ', response);
      switch (response?.event) {
        case 'changeHomeBackgroundUrl':
          interfaceStore.setHomeBackgroundUrlFromDB(response.data?.setting_value);
          break;
        case 'editImageHomeEntity': {
          let entities = [...dataStore.homeEntities];
          entities = entities.map((entity: IEntity) => {
            if (entity.entity_uuid !== response.data.entity_uuid) return entity;
            return response.data;
          });
          dataStore.editHomeEntities(entities);
          break;
        }
        default: {
          console.log('default');
          filesBlob.value.push(response);
        }
      }
    };
    socket.value.onclose = () => {
      console.log('Websocket connection closed');
    };
    socket.value.onerror = () => {
      console.log('Websocket caught an error');
    };
  });

  function sendData(data: any) {
    socket.value.send(data);
  }
  return { filesBlob, sendData };
});
