import { defineStore } from 'pinia';
import { useDataStore } from '@/stores/data';
import type { IEntity } from '@/interfaces/environment';

export const useWebsocketStore = defineStore('websocketStore', () => {
  const socket = ref();
  const dataStore = useDataStore();
  const homeEntities = computed(() => dataStore.homeEntities);

  onMounted(() => {
    socket.value = new WebSocket('ws://localhost:5000');
    socket.value.onopen = () => {
      console.log('Websocket opened');
      const data = {
        event: 'getHomeEntities'
      };
      socket.value.send(JSON.stringify(data));
    };
    socket.value.onmessage = (event: any) => {
      const response = JSON.parse(event.data);
      console.log('response: ', response);
      switch (response.event) {
        case 'getHomeEntities':
          dataStore.editHomeEntities(response.data);
          break;
        case 'createHomeEntity': {
          const entities = [...homeEntities.value];
          entities.push(response.data);
          dataStore.editHomeEntities([...entities]);
          break;
        }
        case 'editHomeEntity': {
          let entities = [...dataStore.homeEntities];
          entities = entities.map((entity: IEntity) => {
            if (entity.entity_uuid !== response.data.entity_uuid) return entity;
            return response.data;
          });
          dataStore.editHomeEntities(entities);
          break;
        }
        case 'deleteHomeEntity': {
          let newState = [...dataStore.homeEntities];
          newState = newState.filter(
            (entity: IEntity) => entity.entity_uuid !== response.data.entity_uuid
          );
          dataStore.editHomeEntities(newState);
          break;
        }
        case 'changeOrderHomeEntity': {
          const newState = dataStore.homeEntities;
          const entityIndex = newState.findIndex(
            (entity: IEntity) => entity.entity_uuid === response.data.entity_uuid
          );
          if (response.data.direction === 'up') {
            [newState[entityIndex], newState[entityIndex - 1]] = [
              newState[entityIndex - 1],
              newState[entityIndex]
            ];
          } else {
            [newState[entityIndex], newState[entityIndex + 1]] = [
              newState[entityIndex + 1],
              newState[entityIndex]
            ];
          }
          dataStore.editHomeEntities(newState);
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
    socket.value.send(JSON.stringify(data));
  }
  return { sendData };
});
