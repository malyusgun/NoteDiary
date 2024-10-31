import { defineStore } from 'pinia';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
// import { addUrlsToImageEntities } from '@/app/helpers/images';
// import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';

export const useWebsocketStore = defineStore('websocketStore', () => {
  const dataStore = useDataStore();
  // const filesWebsocketStore = useFilesWebsocketStore();

  // const filesBufferLength = computed(() => filesWebsocketStore.filesBuffer.length);
  // const entities = computed(() => dataStore.entities);
  // const imageEntitiesCount = computed(
  //   () => entities.value.filter((entity) => entity?.image_width).length
  // );

  const socket = ref();
  const initialDataToSend = ref();
  // const isInitialAddUrlsToImageEntitiesFinished = ref<boolean>(false);
  const file = ref();

  onMounted(() => {
    // socket.value = new WebSocket('ws://localhost:5000');
    // socket.value.onopen = async () => {
    //   const userUuid = cookies.get('user_uuid');
    //   console.log('userUuid', userUuid);
    //   if (userUuid) {
    //     const getUserData = {
    //       event: 'getUser',
    //       body: {
    //         user_uuid: userUuid
    //       }
    //     };
    //     sendData(getUserData);
    //     const sheetUuid = cookies.get('current_sheet_uuid');
    //     const getSheetData = {
    //       event: 'getSheet',
    //       body: {
    //         sheet_uuid: sheetUuid
    //       }
    //     };
    //     sendData(getSheetData);
    //   }
    //   if (initialDataToSend.value) socket.value.send(JSON.stringify(initialDataToSend.value));
    // };
    // socket.value.onmessage = async (event: any) => {
    //   const response = JSON.parse(event.data);
    //   console.log('response: ', response);
    // switch (response.event) {
    // create
    // case 'createUser': {
    //   cookies.set('user_uuid', response.data.user_uuid);
    //   const sheetsUuid = response.data.sheets;
    //   const homeSheetUuid = sheetsUuid[0];
    //   const userSettings = response.data.settings;
    //   cookies.set('favorite_color', userSettings.favorite_color);
    //   cookies.set('home_uuid', homeSheetUuid);
    //   const getUserData = {
    //     event: 'getUser',
    //     body: {
    //       user_uuid: response.data.user_uuid
    //     }
    //   };
    //   sendData(getUserData);
    //   const getSheetData = {
    //     event: 'getSheet',
    //     body: {
    //       sheet_uuid: homeSheetUuid
    //     }
    //   };
    //   sendData(getSheetData);
    //   await router.push(`/${homeSheetUuid}`);
    //   break;
    // }
    // case 'createSheet': {
    //   dataStore.addSheetData(response.data);
    //   break;
    // }
    // case 'createEntity': {
    //   const newState = [...entities.value];
    //   if (response.data?.image_width) {
    //     response.data.imageUrl = filesWebsocketStore.imageUrl;
    //     filesWebsocketStore.cleanImageUrl();
    //   }
    //   newState.push(response.data);
    //   dataStore.editEntities([...newState]);
    //   break;
    // }
    // case 'createImageEntity': {
    //   if (!file.value) break;
    //   const sheet_uuid = cookies.get('current_sheet_uuid');
    //   const data = {
    //     event: 'createEntity',
    //     body: {
    //       ...file.value,
    //       sheet_uuid
    //     }
    //   };
    //   file.value = null;
    //   sendData(data);
    //   break;
    // }
    // read
    // case 'getUser': {
    //   authorizationStore.setUserNickName(response.data.nick_name);
    //   authorizationStore.setUserData(response.data);
    //   dataStore.setSheetsData(response.data.sheets);
    //   console.log('getUser response.data: ', response.data);
    //   break;
    // }
    // case 'getSheet': {
    //   dataStore.setCurrentSheetUuid(response.data.sheet_uuid);
    //   dataStore.setCurrentSheetData(response.data);
    //   console.log('getSheet response.data: ', response.data);
    //   break;
    // }
    // case 'getSheetEntities': {
    //   const newState = response.data;
    //   if (imageEntitiesCount.value && filesBufferLength.value === imageEntitiesCount.value) {
    //     const entitiesAddedUrls = addUrlsToImageEntities(newState);
    //     dataStore.editEntities(entitiesAddedUrls);
    //   } else {
    //     dataStore.editEntities(newState);
    //   }
    //   break;
    // }
    // case 'getSheetBackground': {
    //   const blob = new Blob([response.data.setting_value.data], {
    //     type: `image/jpeg`
    //   });
    //   const url = URL.createObjectURL(blob);
    //   interfaceStore.setSheetBackgroundFromDB(url);
    //   break;
    // }
    // update
    // case 'editEntity': {
    //   let newState = [...entities.value];
    //   newState = newState.map((entity: IEntity) => {
    //     if (entity.entity_uuid !== response.data.entity_uuid) return entity;
    //     if (response.data?.image_width) {
    //       response.data.imageUrl = filesWebsocketStore.imageUrl;
    //       filesWebsocketStore.cleanImageUrl();
    //     }
    //     return response.data;
    //   });
    //   dataStore.editEntities(newState);
    //   break;
    // }
    // case 'changeEntitiesOrder': {
    //   const mainEntity = response.data.main;
    //   const mainEntityIndex = entities.value.findIndex(
    //     (entity) => entity.entity_uuid === mainEntity.entity_uuid
    //   );
    //   const newState = [...entities.value];
    //   if (mainEntity.entity_order > newState[mainEntityIndex].entity_order!) {
    //     newState[mainEntityIndex + 1].entity_order = newState[mainEntityIndex].entity_order;
    //   } else {
    //     newState[mainEntityIndex - 1].entity_order = newState[mainEntityIndex].entity_order;
    //   }
    //   newState[mainEntityIndex] = { ...mainEntity };
    //   dataStore.editEntities(newState);
    //   break;
    // }
    // delete
    // case 'deleteEntity': {
    //   let newState = [...entities.value];
    //   newState = newState.filter(
    //     (entity: IEntity) => entity.entity_uuid !== response.data.entity_uuid
    //   );
    //   dataStore.editEntities(newState);
    //   break;
    // }
    // }
    // };
    socket.value.onclose = () => {
      console.log('Websocket connection closed');
    };
    socket.value.onerror = () => {
      console.log('Websocket caught an error');
    };
  });

  // watch([filesBufferLength, entities], () => {
  //   if (
  //     (entities.value.length &&
  //       filesBufferLength.value === imageEntitiesCount.value &&
  //       imageEntitiesCount.value) ||
  //     (isInitialAddUrlsToImageEntitiesFinished.value && filesBufferLength.value)
  //   ) {
  //     const entitiesAddedUrls = addUrlsToImageEntities(entities.value);
  //     dataStore.editEntities(entitiesAddedUrls);
  //     isInitialAddUrlsToImageEntitiesFinished.value = true;
  //   }
  // });
  function setFileData(data: IEntity) {
    file.value = data;
  }
  function setInitialDataToSend(data) {
    initialDataToSend.value = data;
  }
  function sendData(data) {
    socket.value.send(JSON.stringify(data));
  }
  return {
    setInitialDataToSend,
    sendData,
    setFileData
  };
});
