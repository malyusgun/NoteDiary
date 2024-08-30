import { defineStore } from 'pinia';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import { useInterfaceStore } from '@/app/stores/interface';
import { addUrlsToImageEntities } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';

export const useWebsocketStore = defineStore('websocketStore', () => {
  const dataStore = useDataStore();
  const interfaceStore = useInterfaceStore();
  const filesWebsocketStore = useFilesWebsocketStore();

  const filesBufferLength = computed(() => filesWebsocketStore.filesBuffer.length);
  const homeEntities = computed(() => dataStore.homeEntities);
  const imageEntitiesCount = computed(
    () => homeEntities.value.filter((entity) => entity?.image_width).length
  );

  const socket = ref();
  const initialDataToSend = ref();
  const isInitialAddUrlsToImageEntitiesFinished = ref<boolean>(false);
  const file = ref();

  onMounted(() => {
    socket.value = new WebSocket('ws://localhost:5000');
    socket.value.onopen = async () => {
      socket.value.send(JSON.stringify(initialDataToSend.value));
    };
    socket.value.onmessage = async (event: any) => {
      const response = JSON.parse(event.data);
      console.log('response: ', response);
      switch (response.event) {
        case 'getHomeEntities': {
          const entities = response.data;
          if (imageEntitiesCount.value && filesBufferLength.value === imageEntitiesCount.value) {
            const entitiesAddedUrls = addUrlsToImageEntities(entities);
            dataStore.editHomeEntities(entitiesAddedUrls);
          } else {
            dataStore.editHomeEntities(entities);
          }
          break;
        }
        case 'getHomeBackground': {
          const blob = new Blob([response.data.setting_value.data], {
            type: `image/jpeg`
          });
          const url = URL.createObjectURL(blob);
          interfaceStore.setHomeBackgroundFromDB(url);
          break;
        }
        case 'createHomeEntity': {
          const entities = [...homeEntities.value];
          if (response.data?.image_width) {
            response.data.imageUrl = filesWebsocketStore.imageUrl;
            filesWebsocketStore.cleanImageUrl();
          }
          entities.push(response.data);
          dataStore.editHomeEntities([...entities]);
          break;
        }
        case 'createImageHomeEntity': {
          if (!file.value) break;
          const data = {
            event: 'createHomeEntity',
            body: {
              ...file.value
            }
          };
          file.value = null;
          sendData(data);
          break;
        }
        case 'editHomeEntity': {
          let entities = [...homeEntities.value];
          entities = entities.map((entity: IEntity) => {
            if (entity.entity_uuid !== response.data.entity_uuid) return entity;
            if (response.data?.image_width) {
              response.data.imageUrl = filesWebsocketStore.imageUrl;
              filesWebsocketStore.cleanImageUrl();
            }
            return response.data;
          });
          dataStore.editHomeEntities(entities);
          break;
        }
        case 'deleteHomeEntity': {
          let newState = [...homeEntities.value];
          newState = newState.filter(
            (entity: IEntity) => entity.entity_uuid !== response.data.entity_uuid
          );
          dataStore.editHomeEntities(newState);
          break;
        }
        case 'changeOrderHomeEntity': {
          const newState = [...homeEntities.value];
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
          break;
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

  watch([filesBufferLength, homeEntities], () => {
    if (
      (homeEntities.value.length && filesBufferLength.value === imageEntitiesCount.value) ||
      (isInitialAddUrlsToImageEntitiesFinished.value && filesBufferLength.value)
    ) {
      const entitiesAddedUrls = addUrlsToImageEntities(homeEntities.value);
      dataStore.setHomeEntities(entitiesAddedUrls);
      isInitialAddUrlsToImageEntitiesFinished.value = true;
    }
  });
  function setFileData(data: any) {
    file.value = data;
  }
  function setInitialDataToSend(data: any) {
    initialDataToSend.value = data;
  }
  function sendData(data: any) {
    socket.value.send(JSON.stringify(data));
  }
  return {
    setInitialDataToSend,
    sendData,
    setFileData
  };
});
