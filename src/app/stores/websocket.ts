import { defineStore } from 'pinia';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';
import { useInterfaceStore } from '@/app/stores/interface';
import { addUrlsToImageEntities } from '@/app/helpers/images';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import { useAuthorizationStore } from '@/app/stores/authorization';
import cookies from '@/app/plugins/Cookie';
import { editEntity } from '@/app/helpers';

export const useWebsocketStore = defineStore('websocketStore', () => {
  const dataStore = useDataStore();
  const authorizationStore = useAuthorizationStore();
  const interfaceStore = useInterfaceStore();
  const filesWebsocketStore = useFilesWebsocketStore();

  const router = useRouter();
  const filesBufferLength = computed(() => filesWebsocketStore.filesBuffer.length);
  const entities = computed(() => dataStore.entities);
  const imageEntitiesCount = computed(
    () => entities.value.filter((entity) => entity?.image_width).length
  );

  const socket = ref();
  const initialDataToSend = ref();
  const isInitialAddUrlsToImageEntitiesFinished = ref<boolean>(false);
  const file = ref();
  const originalUrl = ref();

  onMounted(() => {
    socket.value = new WebSocket('ws://localhost:5000');
    socket.value.onopen = async () => {
      const userUuid = cookies.get('user_uuid');
      // console.log('userUuid', userUuid);
      if (userUuid) {
        const getUserData = {
          event: 'getUser',
          body: {
            user_uuid: userUuid
          }
        };
        sendData(getUserData);
        const pageUuid = cookies.get('current_page_uuid');
        const getPageData = {
          event: 'getPage',
          body: {
            page_uuid: pageUuid
          }
        };
        sendData(getPageData);
      }
      if (initialDataToSend.value) socket.value.send(JSON.stringify(initialDataToSend.value));
    };
    socket.value.onmessage = async (event: any) => {
      const response = JSON.parse(event.data);
      console.log('response: ', response);
      switch (response.event) {
        // create
        case 'createUser': {
          cookies.set('user_uuid', response.data.user_uuid);
          const pagesUuid = response.data.pages_uuid;
          const homePageUuid = pagesUuid[0];
          const userSettings = response.data.settings;
          cookies.set('favorite_color', userSettings.favorite_color);
          cookies.set('home_uuid', homePageUuid);
          const getUserData = {
            event: 'getUser',
            body: {
              user_uuid: response.data.user_uuid
            }
          };
          sendData(getUserData);
          const getPageData = {
            event: 'getPage',
            body: {
              page_uuid: homePageUuid
            }
          };
          sendData(getPageData);
          await router.push(`/${homePageUuid}`);
          break;
        }
        case 'createPage': {
          dataStore.addPageData(response.data);
          break;
        }
        case 'createEntity': {
          const newState = [...entities.value];
          if (response.data?.image_width) {
            response.data.image_url_initial = filesWebsocketStore.image_url;
            response.data.image_url = filesWebsocketStore.image_url;
            filesWebsocketStore.cleanImageUrl();
          }
          newState.push(response.data);
          dataStore.editEntities([...newState]);
          break;
        }
        case 'createImageEntity': {
          if (!file.value) break;
          const page_uuid = cookies.get('current_page_uuid');
          const data = {
            event: 'createEntity',
            body: {
              ...file.value,
              page_uuid
            }
          };
          file.value = null;
          sendData(data);
          break;
        }
        // read
        case 'getUser': {
          authorizationStore.setUserNickName(response.data.nick_name);
          authorizationStore.setUserData(response.data);
          dataStore.setPagesData(response.data.pages_uuid);
          break;
        }
        case 'getPage': {
          dataStore.setCurrentPageUuid(response.data.page_uuid);
          dataStore.setCurrentPageData(response.data);
          break;
        }
        case 'getPageEntities': {
          const newState = response.data;
          if (imageEntitiesCount.value && filesBufferLength.value === imageEntitiesCount.value) {
            const entitiesAddedUrls = addUrlsToImageEntities(newState);
            dataStore.editEntities(entitiesAddedUrls);
          } else {
            dataStore.editEntities(newState);
          }
          break;
        }
        case 'getPageBackground': {
          const blob = new Blob([response.data.setting_value.data], {
            type: `image/jpeg`
          });
          const url = URL.createObjectURL(blob);
          interfaceStore.setPageBackgroundFromDB(url);
          break;
        }
        // update
        case 'editEntity': {
          let newState = [...entities.value];
          newState = newState.map((entity: IEntity) => {
            if (entity.entity_uuid !== response.data.entity_uuid) return entity;
            if (response.data?.image_width) {
              response.data.image_url = filesWebsocketStore.image_url;
              filesWebsocketStore.cleanImageUrl();
            }
            return response.data;
          });
          dataStore.editEntities(newState);
          break;
        }
        case 'returnOriginalSizeImage': {
          let newState = [...entities.value];
          newState = newState.map((entity: IEntity) => {
            if (entity.entity_uuid !== response.data.entity_uuid) return entity;
            const filesBuffer = filesWebsocketStore.filesBuffer;
            filesBuffer[0] = new Blob([filesBuffer[0].data], { type: 'image/jpeg' });
            entity.image_url = URL.createObjectURL(filesBuffer[0]);
            originalUrl.value = entity.image_url;
            // entity.file_width = entity.file_width_initial;
            // entity.file_height = entity.file_height_initial;
            console.log('entity.image_url ', entity.image_url);
            editEntity(entity);
            return entity;
          });
          dataStore.editEntities(newState);
          break;
        }
        case 'changeEntitiesOrder': {
          const mainEntity = response.data.main;
          const mainEntityIndex = entities.value.findIndex(
            (entity) => entity.entity_uuid === mainEntity.entity_uuid
          );
          const newState = [...entities.value];
          if (mainEntity.entity_order > newState[mainEntityIndex].entity_order!) {
            newState[mainEntityIndex + 1].entity_order = newState[mainEntityIndex].entity_order;
          } else {
            newState[mainEntityIndex - 1].entity_order = newState[mainEntityIndex].entity_order;
          }
          newState[mainEntityIndex] = { ...mainEntity };
          dataStore.editEntities(newState);
          break;
        }
        // delete
        case 'deleteEntity': {
          let newState = [...entities.value];
          newState = newState.filter(
            (entity: IEntity) => entity.entity_uuid !== response.data.entity_uuid
          );
          dataStore.editEntities(newState);
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

  watch([filesBufferLength, entities], () => {
    if (
      (entities.value.length &&
        filesBufferLength.value === imageEntitiesCount.value &&
        imageEntitiesCount.value) ||
      (isInitialAddUrlsToImageEntitiesFinished.value && filesBufferLength.value)
    ) {
      const entitiesAddedUrls = addUrlsToImageEntities(entities.value);
      dataStore.editEntities(entitiesAddedUrls);
      isInitialAddUrlsToImageEntitiesFinished.value = true;
    }
  });
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
