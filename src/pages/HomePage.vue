<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import type { IImageMainInfo } from '@/app/interfaces/index.ts';
import { createHomeEntity, fetchForHomeEntities, setDefaultHomeBackground } from '@/app/helpers';

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();
const authorizationStore = useAuthorizationStore();
const websocketStore = useWebsocketStore();

const backgroundImage = ref();
const { width: backgroundImageWidth, height: backgroundImageHeight } =
  useElementSize(backgroundImage);
const backgroundSize = computed(() => {
  if (backgroundImageWidth.value > backgroundImageHeight.value) {
    return 'auto 100%';
  } else {
    return '100% auto';
  }
});
const entitiesContainer = ref();
const { height: entitiesHeight } = useElementSize(entitiesContainer);
const splitterPanelBackground = ref();
const { height: splitterPanelBackgroundHeight } = useElementSize(splitterPanelBackground);

const entities = computed(() => dataStore.homeEntities);
const backgroundUrl = computed<string>(() => interfaceStore.homeBackground);
const defaultBackgroundUrl = computed<string>(() => interfaceStore.defaultHomeBackground);
const isFetchedForBackground = computed(() => interfaceStore.isFetchedForBackground);
const splitterHeight = computed(() => {
  return splitterPanelBackgroundHeight.value + entitiesHeight.value + 100;
});

const isModalUploadFile = ref<boolean>(false);
const backgroundImageInfo = ref<IImageMainInfo>({
  imageUrl: backgroundUrl.value,
  image_width: 0,
  image_height: 0
});

onMounted(() => {
  const getHomeBackgroundData = {
    event: 'getHomeBackground'
  };
  websocketStore.setInitialDataToSend(getHomeBackgroundData);
});

const unwatchBackground = watch([isFetchedForBackground], () => {
  if (isFetchedForBackground.value) {
    fetchForHomeEntities();
    unwatchBackground();
  }
});

const createEntity = (newEntity: IEntity) => {
  createHomeEntity(newEntity);
};
const uploadFile = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  if (target && target.files && target.files?.[0]) {
    const image = new Image();
    const file = target.files![0];
    const url = URL.createObjectURL(file);
    image.src = url;
    image.onload = function () {
      backgroundImageInfo.value.imageUrl = url;
      backgroundImageInfo.value.image_width = image.width;
      backgroundImageInfo.value.image_height = image.height;
      isModalUploadFile.value = true;
    };
  }
};
const saveImage = (finalImageUrl: string) => {
  interfaceStore.changeHomeBackground(finalImageUrl);
  isModalUploadFile.value = false;
};
</script>

<template>
  <header>
    <h1 class="text-center text-5xl font-bold py-4">Home page</h1>
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
      gutterSize="10"
    >
      <SplitterPanel
        :pt:root:style="`position: relative; background-image: url(${backgroundUrl});
         background-size: 100% auto; max-height: ${backgroundImageHeight - 3}px; min-height: 200px;`"
        class="splitterPanelBackground"
      >
        <div ref="splitterPanelBackground" class="w-full h-full"></div>
        <PageBackgroundMenu
          :isBackgroundDefault="backgroundUrl !== defaultBackgroundUrl"
          @uploadFile="uploadFile"
          @setDefaultBackground="setDefaultHomeBackground"
        />
      </SplitterPanel>
      <SplitterPanel class="flex items-start justify-center">
        <Suspense>
          <div ref="entitiesContainer" class="w-full pt-4">
            <EntitiesList :entities="entities" @createEntity="createEntity" />
          </div>
          <template #fallback><BaseLoader /></template
        ></Suspense>
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

<style lang="scss">
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
  cursor: pointer;
}
</style>
