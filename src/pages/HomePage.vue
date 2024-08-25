<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { setDefaultHomeBackground } from '@/app/helpers';
import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import type { IImageMainInfo } from '@/app/interfaces/index.ts';
import { v4 as uuidv4 } from 'uuid';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';

const backgroundImage = ref();
const { height: backgroundImageHeight } = useElementSize(backgroundImage);
const entitiesContainer = ref();
const { height: entitiesHeight } = useElementSize(entitiesContainer);
const splitterPanelBackground = ref();
const { height: splitterPanelBackgroundHeight } = useElementSize(splitterPanelBackground);

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();
const authorizationStore = useAuthorizationStore();
const websocketStore = useWebsocketStore();
const filesWebsocketStore = useFilesWebsocketStore();
const entities = computed(() => dataStore.homeEntities);
watchEffect(() => {
  console.log('entities', entities.value, entities);
});
const backgroundUrl = computed<string>(() => interfaceStore.homeBackgroundUrl);
const defaultBackgroundUrl = computed<string>(() => interfaceStore.defaultHomeBackgroundUrl);

function addEntity(newEntity: IEntity) {
  if (newEntity.image_blob) {
    websocketStore.setFileData(newEntity);
    return filesWebsocketStore.sendData(newEntity.image_blob);
  }
  const data = {
    event: 'createHomeEntity',
    body: {
      ...newEntity
    }
  };
  websocketStore.sendData(data);
}

const backgroundImageInfo = ref<IImageMainInfo>({
  image_url: backgroundUrl.value,
  image_width: 0,
  image_height: 0
});
const isModalUploadFile = ref<boolean>(false);
function openUploadFileModal() {
  isModalUploadFile.value = true;
}
function uploadFile($event: Event) {
  const target = $event.target as HTMLInputElement;
  if (target && target.files && target.files[0]) {
    let image = new Image();
    const file = target.files[0];
    const url = URL.createObjectURL(file);
    image.src = url;
    image.onload = function () {
      backgroundImageInfo.value.image_url = url;
      backgroundImageInfo.value.image_width = image.width;
      backgroundImageInfo.value.image_height = image.height;
      openUploadFileModal();
    };
  }
}
function saveImage(finalImageUrl: string) {
  const interfaceStore = useInterfaceStore();
  interfaceStore.changeHomeBackgroundUrl(finalImageUrl);
  isModalUploadFile.value = false;
}

const splitterHeight = computed(() => {
  return splitterPanelBackgroundHeight.value + entitiesHeight.value + 100;
});

// function submitImage(e) {
//   console.log('e.target.files[0]: ', e.target.files[0]);
//   fetch('http://localhost:8000', {
//     method: 'post',
//     headers: { 'Content-Type': `multipart/form-data; boundary=8800-5553535` },
//     body: e.target.files[0]
//   });
// }
</script>

<template>
  <header>
    <h1 class="text-center text-4xl py-4">Home page</h1>
  </header>
  <CropImageModal
    v-model:isVisible="isModalUploadFile"
    v-model:imageInfo="backgroundImageInfo"
    @saveImage="saveImage"
  />
  <main class="flex flex-col">
    <Splitter
      :style="`height: ${splitterHeight}px;`"
      layout="vertical"
      stateKey="homeSplitter"
      stateStorage="local"
    >
      <SplitterPanel
        :pt:root:style="`position: relative; background-image: url(${backgroundUrl}); background-size: 100% auto; max-height: ${backgroundImageHeight - 3}px; min-height: 200px;`"
        class="splitterPanelBackground"
      >
        <div ref="splitterPanelBackground" class="w-full h-full"></div>
        <div
          class="changeImageBlock absolute top-2 right-2 bg-black p-2 rounded-md hover:text-gray-300 transition-all select-none"
        >
          <!--          <form method="post" enctype="multipart/form-data">-->
          <!--            <input type="file" name="image" @change="submitImage($event)" />-->
          <!--          </form>-->
          <input
            type="file"
            @change="uploadFile($event)"
            onclick="this.value = null"
            title="Change image"
            accept="image/*"
            class="w-2 pr-[135px] -mr-[135px] py-2 -my-2 pl-2 -ml-2 opacity-0"
          />
          <span><i class="pi pi-image mr-2"></i>Change image</span>
        </div>
        <button
          @click.prevent="setDefaultHomeBackground"
          v-if="backgroundImageInfo.image_url !== defaultBackgroundUrl"
          class="returnDefaultImageBlock absolute top-16 right-2 bg-blue-600 p-2 transition-all rounded-md border-2 border-solid border-black select-none"
        >
          Return default image
        </button>
      </SplitterPanel>
      <SplitterPanel class="flex items-start justify-center"
        ><div ref="entitiesContainer" class="w-full pt-4">
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

<style lang="scss" scoped>
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
