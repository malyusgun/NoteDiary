<script setup lang="ts">
import { useInterfaceStore } from '@/app/stores/interface';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useWebsocketStore } from '@/app/stores/websocket';
import type { IImageMainInfo } from '@/app/interfaces';
import { fetchForEntities } from '@/app/helpers/entities';
import { backgroundImageOnLoad, uploadImage } from '@/app/helpers/images';
import cookies from '@/app/plugins/Cookie';
import { useDataStore } from '@/app/stores/data';

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();
const authorizationStore = useAuthorizationStore();
const websocketStore = useWebsocketStore();

const currentSheetUuid = computed(() => cookies.get('current_sheet_uuid'));
const backgroundUrl = computed<string>(() => interfaceStore.sheetBackground);
const isFetchedForBackground = computed(() => interfaceStore.isFetchedForBackground);
// const sheetTitle = computed(() => dataStore.currentSheet.sheet_title);

const isMenuVisible = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const isModalUploadFile = ref<boolean>(false);
const backgroundImageInfo = ref<IImageMainInfo>({
  image_url: backgroundUrl.value,
  image_width: 0,
  image_height: 0
});
const windowWidth = computed(() => dataStore.windowWidth);

onMounted(() => {
  const onKeydown = (event) => {
    if (event.ctrlKey && event.altKey) isEditMode.value = !isEditMode.value;
    if (event.ctrlKey && event.shiftKey) isMenuVisible.value = !isMenuVisible.value;
  };
  document.addEventListener('keydown', onKeydown);
  const getSheetBackgroundData = {
    event: 'getSheetBackground',
    body: {
      sheet_uuid: ''
    }
  };
  websocketStore.setInitialDataToSend(getSheetBackgroundData);
});

const unwatchBackground = watch([isFetchedForBackground], () => {
  if (isFetchedForBackground.value) {
    fetchForEntities(currentSheetUuid.value);
    unwatchBackground();
  }
});

const uploadFile = ($event: Event) => {
  const image = uploadImage($event);
  image.onload = function () {
    backgroundImageInfo.value = backgroundImageOnLoad(image, windowWidth.value);
    isModalUploadFile.value = true;
  };
};
const saveImage = (finalImageUrl: string) => {
  interfaceStore.editSheetBackground(finalImageUrl);
  isModalUploadFile.value = false;
};
const openMenu = () => (isMenuVisible.value = true);
</script>

<template>
  <SheetHeader v-model:isEditMode="isEditMode" :title="'Home page'" />
  <SidebarMenuButton @openMenu="openMenu" />
  <SidebarMenu v-model:isMenuVisible="isMenuVisible" />
  <SheetTelegramSection />
  <CropImageModal
    v-model:isVisible="isModalUploadFile"
    v-model:imageInfo="backgroundImageInfo"
    @cropImage="saveImage"
  />
  <SheetPageContent
    :isEditMode="isEditMode"
    :backgroundUrl="backgroundUrl"
    @uploadFile="uploadFile"
  />
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
</style>
