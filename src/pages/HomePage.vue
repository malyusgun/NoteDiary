<script setup lang="ts">
import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import type { IImageMainInfo } from '@/app/interfaces/index.ts';
import { createHomeEntity, fetchForHomeEntities, setDefaultHomeBackground } from '@/app/helpers';
import TelegramSection from '@/modules/TelegramSection.vue';

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();
const authorizationStore = useAuthorizationStore();
const websocketStore = useWebsocketStore();

const entities = computed(() => dataStore.homeEntities);
const backgroundUrl = computed<string>(() => interfaceStore.homeBackground);
const defaultBackgroundUrl = computed<string>(() => interfaceStore.defaultHomeBackground);
const isFetchedForBackground = computed(() => interfaceStore.isFetchedForBackground);

const isEditMode = ref<boolean>();
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
  <PageHeader v-model:isEditMode="isEditMode" :title="'Home page'" />
  <TelegramSection />
  <CropImageModal
    v-model:isVisible="isModalUploadFile"
    v-model:imageInfo="backgroundImageInfo"
    @saveImage="saveImage"
  />
  <main class="flex flex-col">
    <article style="min-height: 200px" class="backgroundContainer relative">
      <img :src="backgroundUrl" alt="Background image" class="w-full" />
      <PageBackgroundMenu
        :isBackgroundDefault="backgroundUrl !== defaultBackgroundUrl"
        @uploadFile="uploadFile"
        @setDefaultBackground="setDefaultHomeBackground"
      />
    </article>
    <article class="flex items-start justify-center">
      <Suspense>
        <div ref="entitiesContainer" class="w-full pt-4">
          <EntitiesList
            :entities="entities"
            :isEditMode="isEditMode"
            @createEntity="createEntity"
          />
        </div>
        <template #fallback><BaseLoader /></template
      ></Suspense>
    </article>
  </main>
</template>

<style lang="scss">
.backgroundContainer > .changeImageBlock,
.backgroundContainer > .returnDefaultImageBlock {
  opacity: 0;
}
.backgroundContainer:hover > .changeImageBlock,
.backgroundContainer:hover > .returnDefaultImageBlock {
  opacity: 100;
}
.telegramContainer > .telegramText {
  opacity: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.telegramContainer:hover > .telegramText {
  opacity: 100;
  right: 104%;
}
.telegramContainer:hover > a {
  filter: brightness(0.75);
}
input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button {
  cursor: pointer;
}
</style>
