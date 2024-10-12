<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { convertThemeToColorWhiteDefault, deleteEntity, editEntity } from '@/app/helpers';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';
import { sendCropImage } from '@/app/helpers/images';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges', 'returnOriginalSize']);
const prevEntityData = computed(() => props.entityData);
const newEntityData = ref({ ...prevEntityData.value });
const isModal = ref<boolean>(false);
const isModalCropImage = ref<boolean>(false);

const changeFontSize = (newSize: '16' | '20' | '24' | '40' | '64') => {
  prevEntityData.value.font_size = newSize;
  editEntity({ ...prevEntityData.value, font_size: newSize });
};
const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);
const isTitle = ref(!!prevEntityData.value.title);
const isText = ref(!!prevEntityData.value.text);
const isEntityWidthFull = ref(prevEntityData.value.paragraph_size === 'full');
const isModalToDeleteImage = ref<boolean>(false);

const textContainerWidth = computed(() => {
  if (!isEntityWidthFull.value) return (100 - newEntityData.value.image_width) / 2;
  return 100 - newEntityData.value.image_width;
});
const maxLines = computed(() => {
  if (isText.value) {
    return Math.floor(newEntityData.value.file_height / +newEntityData.value.font_size);
  } else {
    return 0;
  }
});
const openSettings = () => {
  isModal.value = true;
  newEntityData.value = { ...prevEntityData.value };
};
const saveChanges = async () => {
  const paragraphSize = isEntityWidthFull.value ? 'full' : 'half';
  if (paragraphSize !== prevEntityData.value.paragraph_size) {
    newEntityData.value.paragraph_size = paragraphSize;
  }
  if (isTitle.value !== !!prevEntityData.value.title) {
    if (isTitle.value) {
      newEntityData.value.title = 'Title';
    } else {
      newEntityData.value.title = null;
    }
  }
  if (isText.value !== !!prevEntityData.value.text) {
    if (isText.value) {
      newEntityData.value.text = 'Text';
    } else {
      newEntityData.value.text = null;
    }
  }
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
const returnOriginalSize = () => {
  const newState = { ...newEntityData.value };
  newState.image_url = newState.image_url_initial;
  newState.file_width = newState.file_width_initial;
  newState.file_height = newState.file_height_initial;
  newState.image_width = newState.image_width_initial;
  newState.image_scale = 'x1';
  newEntityData.value = { ...newState };
};
const deleteImage = () => {
  deleteEntity(prevEntityData.value.entity_uuid);
  isModalToDeleteImage.value = false;
  isModal.value = false;
};
const openCropImageModal = () => (isModalCropImage.value = true);
</script>

<template>
  <button
    :style="`background-color: ${themeColorConverted}`"
    class="settings absolute left-2 top-0 select-none size-10 hover:brightness-75 transition-all cursor-pointer"
    @click.prevent="openSettings"
  >
    <SettingsIcon color="white" size="25" />
  </button>
  <Modal v-model:isVisible="isModal" theme="black" width="90%"
    ><template #header><h3 class="w-max mx-auto">Edit image block</h3></template>
    <CropImageModal
      v-model:isVisible="isModalCropImage"
      v-model:imageInfo="newEntityData"
      @cropImage="cropImage"
    />
    <ConfirmDeleteEntityModal
      v-model:isModalToDeleteEntity="isModalToDeleteImage"
      @deleteEntity="deleteImage"
      @toggleConfirmDeleteEntityModal="toggleConfirmDeleteImageModal"
    />
    <div class="p-10 flex gap-16 items-center">
      <ImageSettingsList
        v-model:newEntityData="newEntityData"
        v-model:isTitle="isTitle"
        v-model:isText="isText"
        v-model:isEntityWidthFull="isEntityWidthFull"
        :themeColor="themeColor"
      />
      <section
        :style="`border-color: var(--${themeColor}-200); align-items: ${
          newEntityData.entity_position === 'right'
            ? 'end'
            : newEntityData.entity_position === 'left'
              ? 'start'
              : newEntityData.entity_position
        }`"
        class="flex grow flex-col gap-4 p-4 w-full min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
      >
        <div
          v-show="isTitle"
          :style="`border-color: var(--${themeColor}-800);
            justify-content: ${newEntityData.entity_title_position}; width: ${isEntityWidthFull ? '100%' : '50%'};
            font-size: ${newEntityData.font_size / 2 + 5}px`"
          class="flex text-2xl font-bold text-center px-2 py-4 border-2 border-dashed rounded-2xl"
        >
          <h3 class="w-max overflow-ellipsis overflow-hidden whitespace-nowrap">
            {{ newEntityData.title ?? 'Title' }}
          </h3>
        </div>
        <div
          :style="`gap: 32px; justify-content: ${
            newEntityData.entity_position === 'right'
              ? 'end'
              : newEntityData.entity_position === 'left'
                ? 'start'
                : 'center'
          };`"
          class="flex w-full"
        >
          <div
            :class="[
              'relative leading-none',
              {
                'order-3': newEntityData.text_position === 'left'
              }
            ]"
            :style="`width: ${newEntityData.image_width}%`"
          >
            <img
              :src="newEntityData?.image_url"
              :alt="`Image ${newEntityData?.title}` || 'Image'"
              style="max-height: 600px"
              class="object-contain order-1"
            />
          </div>
          <div
            v-show="isText"
            class="textContainer relative leading-none border-2 border-dashed rounded-2xl indent-5 order-2 p-1 overflow-hidden contain-inline-size text"
            :style="`border-color: var(--${themeColor}-400); width: ${textContainerWidth}%; font-size: ${newEntityData.font_size / 2}px`"
          >
            {{ newEntityData.text ?? 'Text' }}
          </div>
        </div>
      </section>
    </div>
    <div class="absolute flex gap-4 top-4 left-4 z-10 hover:brightness-80 transition-all">
      <Button
        label="Save"
        textColor="white"
        :theme="themeColor"
        textStyle="bold"
        size="medium"
        @click.prevent="saveChanges"
      >
        <template #icon>
          <SaveIcon color="white" size="25" />
        </template>
      </Button>
      <Button
        v-if="newEntityData.file_width > 200 || newEntityData.file_height > 200"
        label="Crop image"
        textColor="black"
        theme="white"
        textStyle="bold"
        size="medium"
        @click.prevent="openCropImageModal"
      >
        <template #icon>
          <CropIcon color="black" size="25" />
        </template>
      </Button>
    </div>
    <div class="absolute flex gap-4 top-4 right-16 z-10 hover:brightness-80 transition-all">
      <Button
        v-show="
          newEntityData.file_width !== newEntityData.file_width_initial ||
          newEntityData.file_height !== newEntityData.file_height_initial
        "
        label="Original size"
        textColor="white"
        :theme="themeColor"
        textStyle="bold"
        size="medium"
        @click.prevent="returnOriginalSize"
      >
        <template #icon>
          <TrashIcon color="white" size="25" />
        </template>
      </Button>
      <Button
        label="Delete"
        textColor="white"
        theme="red"
        textStyle="bold"
        size="medium"
        @click.prevent="toggleConfirmDeleteImageModal"
      >
        <template #icon>
          <TrashIcon color="white" size="25" />
        </template>
      </Button>
    </div>
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
