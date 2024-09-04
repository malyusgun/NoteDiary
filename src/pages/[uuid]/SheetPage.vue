<script setup lang="ts">
import { useInterfaceStore } from '@/app/stores/interface';
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IEntity } from '@/app/interfaces/environment';
import type { IImageMainInfo } from '@/app/interfaces';
import { createEntity, fetchForEntities, setDefaultPageBackground } from '@/app/helpers';
import TelegramSection from '@/modules/TelegramSection.vue';
import cookies from '@/app/plugins/Cookie';

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();
const authorizationStore = useAuthorizationStore();
const websocketStore = useWebsocketStore();

const currentPageUuid = computed(() => cookies.get('current_page_uuid'));
const entities = computed(() => dataStore.entities);
const backgroundUrl = computed<string>(() => interfaceStore.pageBackground);
const defaultBackgroundUrl = computed<string>(() => interfaceStore.defaultPageBackground);
const isFetchedForBackground = computed(() => interfaceStore.isFetchedForBackground);
// const pageTitle = computed(() => dataStore.currentPage.page_title);

const isMenuVisible = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const isModalUploadFile = ref<boolean>(false);
const backgroundImageInfo = ref<IImageMainInfo>({
  imageUrl: backgroundUrl.value,
  image_width: 0,
  image_height: 0
});

onMounted(() => {
  const onKeydown = (event) => {
    if (event.key === 'Alt') isEditMode.value = !isEditMode.value;
    if (event.key === 'Control') isMenuVisible.value = !isMenuVisible.value;
  };
  document.addEventListener('keydown', onKeydown);
  const getPageBackgroundData = {
    event: 'getPageBackground',
    body: {
      page_uuid: ''
    }
  };
  websocketStore.setInitialDataToSend(getPageBackgroundData);
});

const unwatchBackground = watch([isFetchedForBackground], () => {
  if (isFetchedForBackground.value) {
    fetchForEntities(currentPageUuid.value);
    unwatchBackground();
  }
});

const createNewEntity = (newEntity: IEntity) => {
  createEntity(newEntity);
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
  interfaceStore.editPageBackground(finalImageUrl);
  isModalUploadFile.value = false;
};
</script>

<template>
  <PageHeader v-model:isEditMode="isEditMode" :title="'Home page'" />
  <div class="fixed top-0 left-0 z-50">
    <Button
      label="Menu"
      iconPos="top"
      icon="pi pi-bars"
      severity="contrast"
      size="small"
      @click.prevent="isMenuVisible = !isMenuVisible"
    />
  </div>
  <Drawer v-model:visible="isMenuVisible">
    <template #container="{ closeCallback }">
      <BaseSidebarMenu class="relative z-50" @closeMenu="closeCallback" />
    </template>
  </Drawer>
  <TelegramSection />
  <CropImageModal
    v-model:isVisible="isModalUploadFile"
    v-model:imageInfo="backgroundImageInfo"
    @saveImage="saveImage"
  />
  <main id="pageContainer" class="flex flex-col">
    <article style="min-height: 200px" class="backgroundContainer relative">
      <img
        :src="backgroundUrl"
        alt="Background image"
        class="w-full pointer-events-none select-none"
      />
      <PageBackgroundMenu
        :isBackgroundDefault="backgroundUrl !== defaultBackgroundUrl"
        @uploadFile="uploadFile"
        @setDefaultBackground="setDefaultPageBackground"
      />
    </article>
    <article class="flex items-start justify-center">
      <Suspense>
        <div ref="entitiesContainer" class="w-full pt-4">
          <EntitiesList
            :entities="entities"
            :isEditMode="isEditMode"
            @createEntity="createNewEntity"
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
