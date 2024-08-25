import { defineStore } from 'pinia';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import { useInterfaceStore } from '@/app/stores/interface';
import { addUrlsToImageEntities } from '@/app/helpers';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';

export const useWebsocketStore = defineStore('websocketStore', () => {
  const socket = ref();
  const dataStore = useDataStore();
  const interfaceStore = useInterfaceStore();
  const filesWebsocketStore = useFilesWebsocketStore();
  const homeEntities = computed(() => dataStore.homeEntities);
  const file = ref();
  const filesBlobLength = computed(() => filesWebsocketStore.filesBlob.length);
  function setFileData(data: any) {
    file.value = data;
  }
  onMounted(() => {
    socket.value = new WebSocket('ws://localhost:5000');
    socket.value.onopen = () => {
      const getHomeEntitiesData = {
        event: 'getHomeEntities'
      };
      socket.value.send(JSON.stringify(getHomeEntitiesData));
      const getHomeBackgroundUrlData = {
        event: 'getHomeBackgroundUrl'
      };
      socket.value.send(JSON.stringify(getHomeBackgroundUrlData));
    };
    socket.value.onmessage = (event: any) => {
      console.log('event: ', event);
      const response = JSON.parse(event.data);
      console.log('response: ', response);
      switch (response.event) {
        case 'getHomeEntities': {
          const entities = response.data;
          if (filesBlobLength.value) {
            const entitiesAddedUrls = addUrlsToImageEntities(entities);
            dataStore.editHomeEntities(entitiesAddedUrls);
          } else {
            dataStore.editHomeEntities(entities);
          }
          break;
        }
        case 'getHomeBackgroundUrl':
          interfaceStore.setHomeBackgroundUrlFromDB(response.data?.setting_value);
          break;
        case 'createHomeEntity': {
          const entities = [...homeEntities.value];
          entities.push(response.data);
          dataStore.editHomeEntities([...entities]);
          break;
        }
        case 'createImageHomeEntity': {
          const data = {
            event: 'createHomeEntity',
            body: {
              ...file.value
            }
          };
          console.log('send now:');
          sendData(data);
          console.log('sent!');
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

  watch(filesBlobLength, () => {
    console.log('watch');
    const entitiesAddedUrls = addUrlsToImageEntities(homeEntities.value);
    console.log('entitiesAddedUrls', entitiesAddedUrls);
    dataStore.setHomeEntities(entitiesAddedUrls);
  });

  function sendData(data: any) {
    socket.value.send(JSON.stringify(data));
  }
  return { sendData, setFileData };
});
