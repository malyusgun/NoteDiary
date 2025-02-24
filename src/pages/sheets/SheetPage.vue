<script setup lang="ts">
import { useInterfaceStore } from '@/app/stores/interface';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useDataStore } from '@/app/stores/data';
import type { IImageMainInfo } from '@/app/interfaces';
import { backgroundImageOnLoad, uploadImage } from '@/app/helpers/images';
import { getSheetBackground, getUser } from '@/app/helpers';
import { fetchForEntities } from '@/app/helpers/entities';

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();

const currentSheet = computed(() => dataStore.currentSheet);
const backgroundUrl = computed<string>(() => interfaceStore.sheetBackground);

const isMenuVisible = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const isModalUploadFile = ref<boolean>(false);
const backgroundImageInfo = ref<IImageMainInfo>({
  image_url: backgroundUrl.value,
  image_width: 0,
  image_height: 0
});
const windowWidth = computed(() => interfaceStore.windowWidth);

onMounted(async () => {
  const onKeydown = (event) => {
    if (event.ctrlKey && event.altKey) isEditMode.value = !isEditMode.value;
    if (event.ctrlKey && event.shiftKey) isMenuVisible.value = !isMenuVisible.value;
  };
  document.addEventListener('keydown', onKeydown);
  await getUser();
  if (currentSheet.value?.background_path) {
    await getSheetBackground(currentSheet.value.background_path);
  }
  if (currentSheet.value?.sheet_uuid) {
    await fetchForEntities(currentSheet.value.sheet_uuid);
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
  <SheetHeader
    v-model:isEditMode="isEditMode"
    :title="currentSheet?.sheet_title ?? ''"
    :isMenuVisible="isMenuVisible"
  />
  <SidebarMenuButton @openMenu="openMenu" />
  <SidebarMenu v-model:isMenuVisible="isMenuVisible" />
  <SheetTelegramSection :isMenuVisible="isMenuVisible" />
  <!--  <CropImageModal-->
  <!--    v-model:isVisible="isModalUploadFile"-->
  <!--    v-model:imageInfo="backgroundImageInfo"-->
  <!--    @cropImage="saveImage"-->
  <!--  />-->
  <SheetPageContent
    :isEditMode="isEditMode"
    :isMenuVisible="isMenuVisible"
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
