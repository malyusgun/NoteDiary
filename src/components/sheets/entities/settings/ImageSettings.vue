<script setup lang="ts">
import Modal from '@d.malygin/UI_storybook/components/Modal';
import SettingsIcon from '@d.malygin/UI_storybook/icons/Mono/Settings';
import type { IImage } from '@/app/interfaces/entities';
import type { TTheme } from '@/app/interfaces/environment';
import { convertThemeToColorWhiteDefault } from '@/app/helpers';
import { deleteEntity } from '@/app/helpers/entities';
import cookies from '@/app/plugins/Cookie';
import { sendCropImage, updateEntityDataTextOnSave } from '@/app/helpers/images';
import { useElementSize } from '@vueuse/core';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges', 'returnOriginalSize']);
const prevEntityData = computed(() => props.entityData);
const newEntityData = ref({ ...prevEntityData.value });
const isModal = ref<boolean>(false);
const isModalCropImage = ref<boolean>(false);

const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);
const isTitle = ref(!!prevEntityData.value.title);
const isText = ref(!!prevEntityData.value.text);
const isEntityWidthFull = ref(prevEntityData.value.paragraph_size === 'full');
const isModalToDeleteImage = ref<boolean>(false);

const settingsList = ref(null);
const { width: settingsListWidth } = useElementSize(settingsList);
const maxLines = computed(() =>
  isText.value ? Math.floor(newEntityData.value.file_height / +newEntityData.value.font_size) : 0
);

const openSettings = () => {
  isModal.value = true;
  newEntityData.value = { ...prevEntityData.value };
};
const saveChanges = async () => {
  newEntityData.value = updateEntityDataTextOnSave<IImage>(
    newEntityData.value,
    prevEntityData.value,
    isEntityWidthFull.value,
    isTitle.value,
    isText.value
  );
  if (newEntityData.value.image_url !== prevEntityData.value.image_url) {
    await sendCropImage(newEntityData.value.image_url, newEntityData.value);
  }
  if (
    newEntityData.value.image_url === newEntityData.value.image_url_initial &&
    prevEntityData.value.image_url !== prevEntityData.value.image_url_initial
  ) {
    emit('returnOriginalSize');
  }
  if (JSON.stringify(prevEntityData.value) !== JSON.stringify(newEntityData.value)) {
    emit('saveChanges', newEntityData.value);
  }
  isModal.value = false;
};
const cropImage = async (
  newUrl: string,
  newWidth: number,
  newFileWidth: number,
  newFileHeight: number
) => {
  newEntityData.value.image_url = newUrl;
  newEntityData.value.image_width = newWidth;
  newEntityData.value.file_width = newFileWidth;
  newEntityData.value.file_height = newFileHeight;
  isModalCropImage.value = false;
};
const toggleConfirmDeleteImageModal = () => {
  isModalToDeleteImage.value = !isModalToDeleteImage.value;
};
const deleteImage = async () => {
  await deleteEntity(prevEntityData.value.entity_uuid);
  isModalToDeleteImage.value = false;
  isModal.value = false;
};
const openCropImageModal = () => {
  isModalCropImage.value = true;
};
const onCloseModal = () => {
  setTimeout(() => {
    newEntityData.value = { ...prevEntityData.value };
    isTitle.value = !!prevEntityData.value.title;
    isText.value = !!prevEntityData.value.text;
    isEntityWidthFull.value = prevEntityData.value.paragraph_size === 'full';
  }, 300);
};
</script>

<template>
  <button
    :style="`background-color: ${themeColorConverted}`"
    class="settings absolute left-2 top-0 select-none size-10 hover:brightness-75 transition-all cursor-pointer"
    @click.prevent="openSettings"
  >
    <SettingsIcon color="white" size="25" />
  </button>
  <Modal
    v-model:visible="isModal"
    theme="black"
    width="90%"
    height="max-content"
    @onClose="onCloseModal"
    ><template #header><h3 class="w-max mx-auto">Edit image block</h3></template>
    <!--    <CropImageModal-->
    <!--      v-model:isVisible="isModalCropImage"-->
    <!--      v-model:imageInfo="newEntityData"-->
    <!--      @cropImage="cropImage"-->
    <!--    />-->
    <DeleteEntityConfirmModal
      v-model:isModalToDeleteEntity="isModalToDeleteImage"
      @deleteEntity="deleteImage"
      @toggleConfirmDeleteEntityModal="toggleConfirmDeleteImageModal"
    />
    <div class="p-10 flex gap-16 items-center">
      <ImageSettingsList
        ref="settingsList"
        v-model:newEntityData="newEntityData"
        v-model:isTitle="isTitle"
        v-model:isText="isText"
        v-model:isEntityWidthFull="isEntityWidthFull"
        :themeColor="themeColor"
      />
      <ImageSettingsEntityBlock
        :newEntityData="newEntityData"
        :isTitle="isTitle"
        :isText="isText"
        :isEntityWidthFull="isEntityWidthFull"
        :themeColor="themeColor"
        :settingsListWidth="settingsListWidth"
      />
    </div>
    <EntitySettingsModalHeader
      :newEntityData="newEntityData"
      :themeColor="themeColor"
      @saveChanges="saveChanges"
      @toggleConfirmDeleteImageModal="toggleConfirmDeleteImageModal"
      @openCropImageModal="openCropImageModal"
    />
  </Modal>
</template>

<style scoped>
.text {
  --max-lines: v-bind(maxLines);
  overflow: hidden;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--max-lines);
}
.settings {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>
