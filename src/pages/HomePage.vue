<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import EntityItem from '@/modules/EntityItem.vue';
import CreateEntityMenu from '@/components/CreateEntityMenu.vue';
import { setDefaultHomeBackground, uploadFile } from '@/app/helpers';
import { useInterfaceStore } from '@/app/stores/interface';
import type { IEntity } from '@/app/interfaces/environment';
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useWebsocketStore } from '@/app/stores/websocket';

const backgroundImage = ref();
const { height: backgroundImageHeight } = useElementSize(backgroundImage);
const entitiesContainer = ref();
const { height: entitiesHeight } = useElementSize(entitiesContainer);

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();
const authorizationStore = useAuthorizationStore();
const websocketStore = useWebsocketStore();
const entities = computed(() => dataStore.homeEntities);

const backgroundUrl = computed<string>(() => interfaceStore.homeBackgroundUrl);
const defaultBackgroundUrl = computed<string>(() => interfaceStore.defaultHomeBackgroundUrl);

const addEntity = (newEntity: IEntity) => {
  const data = {
    event: 'createHomeEntity',
    body: {
      ...newEntity,
      nickName: authorizationStore.userNickName
    }
  };
  console.log('data.body?.image_data: ', data.body?.image_data);
  websocketStore.sendData(data);
};
</script>

<template>
  <header>
    <h1 class="text-center text-4xl py-4">Home page</h1>
  </header>
  <main class="flex flex-col">
    <Splitter
      :style="`height: calc(${backgroundImageHeight - 3}px + ${entitiesHeight}px + 100px);`"
      layout="vertical"
      stateKey="homeSplitter"
      stateStorage="local"
    >
      <SplitterPanel
        ref="splitterBackground"
        :pt:root:style="`position: relative; background-image: url(${backgroundUrl}); background-size: 100% auto; max-height: ${backgroundImageHeight - 3}px; min-height: 200px;`"
        class="splitterPanelBackground"
      >
        <div
          class="changeImageBlock absolute top-2 right-2 bg-black p-2 rounded-md hover:text-gray-300 transition-all select-none"
        >
          <input
            type="file"
            @change="uploadFile($event)"
            title="Change image"
            accept="image/*"
            class="w-2 pr-[135px] -mr-[135px] py-2 -my-2 pl-2 -ml-2 opacity-0"
          /><span><i class="pi pi-image mr-2"></i>Change image</span>
        </div>
        <button
          @click.prevent="setDefaultHomeBackground"
          v-if="backgroundUrl !== defaultBackgroundUrl"
          class="returnDefaultImageBlock absolute top-16 right-2 bg-blue-600 p-2 transition-all rounded-md border-2 border-solid border-black select-none"
        >
          Return default image
        </button>
      </SplitterPanel>
      <SplitterPanel class="flex items-start justify-center"
        ><div ref="entitiesContainer" class="w-full">
          <EntityItem
            v-for="entitiesItem of entities"
            :entity="entitiesItem"
            :key="entitiesItem.entity_uuid"
          />
          <div class="relative mt-2">
            <CreateEntityMenu @addEntity="addEntity" />
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </main>
  <img
    ref="backgroundImage"
    :src="backgroundUrl"
    alt="background image"
    class="absolute w-full -top-full -left-full"
  />
</template>

<style scoped>
.splitterPanelBackground > .changeImageBlock,
.splitterPanelBackground > .returnDefaultImageBlock {
  opacity: 0;
}
.splitterPanelBackground:hover > .changeImageBlock,
.splitterPanelBackground:hover > .returnDefaultImageBlock {
  opacity: 100;
}
input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button {
  /* chromes and blink button */
  cursor: pointer;
}
</style>
