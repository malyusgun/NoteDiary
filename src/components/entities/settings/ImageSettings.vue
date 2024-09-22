<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { convertThemeToColorWhiteDefault, deleteEntity, editEntity } from '@/app/helpers';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';
import { useWindowSize } from '@vueuse/core';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges']);
const entityData = computed(() => props.entityData);
const newEntityData = ref({ ...entityData.value });
watch(entityData, () => (newEntityData.value = entityData.value));
const isModal = ref<boolean>(false);
const { width: windowWidth } = useWindowSize();

const changeFontSize = (newSize: '16' | '20' | '24' | '40' | '64') => {
  entityData.value.font_size = newSize;
  editEntity({ ...entityData.value, font_size: newSize });
};
const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);
const isTitle = ref(!!entityData.value.title);
const isText = ref(!!entityData.value.text);
const isEntityWidthFull = ref(entityData.value.paragraph_size === 'full');
const isModalToDeleteImage = ref<boolean>(false);
const textContainerWidth = computed(() => {
  if (!isEntityWidthFull.value)
    return (windowWidth.value - 160 - newEntityData.value.image_width) / 2;
  return windowWidth.value - 160 - newEntityData.value.image_width;
});
const maxLines = computed(() => {
  if (isText.value) {
    return Math.floor(newEntityData.value.image_height / newEntityData.value.font_size);
  } else {
    return 0;
  }
});
const saveChanges = () => {
  const entityPosition = isEntityWidthFull.value ? 'full' : 'half';
  if (entityPosition !== entityData.value.paragraph_size) {
    newEntityData.value.paragraph_size = entityPosition;
  }
  if (isTitle.value !== !!entityData.value.title) {
    if (isTitle.value) {
      newEntityData.value.title = 'Title';
    } else {
      newEntityData.value.title = null;
    }
  }
  if (isText.value !== !!entityData.value.text) {
    if (isText.value) {
      newEntityData.value.text = 'Text';
    } else {
      newEntityData.value.text = null;
    }
  }
  if (JSON.stringify(entityData.value) !== JSON.stringify(newEntityData.value)) {
    emit('saveChanges', newEntityData.value);
  }
  isModal.value = false;
};
const toggleConfirmToDeleteImage = () => {
  isModalToDeleteImage.value = !isModalToDeleteImage.value;
};
const deleteImage = () => {
  deleteEntity(entityData.value.entity_uuid);
  isModalToDeleteImage.value = false;
  isModal.value = false;
};
</script>

<template>
  <button
    :style="`background-color: ${themeColorConverted}`"
    class="settings absolute left-2 top-0 select-none size-10 hover:brightness-75 transition-all cursor-pointer"
    @click.prevent="isModal = true"
  >
    <SettingsIcon color="white" size="25" />
  </button>
  <Modal v-model:isVisible="isModal" theme="black" width="90%"
    ><template #header><h3 class="w-max mx-auto">Edit image block</h3></template>
    <pre>{{ newEntityData }}</pre>
    <Modal v-model:isVisible="isModalToDeleteImage" theme="black" width="30%"
      ><p class="font-bold pt-4 mb-4 text-center">Are you sure you want to delete this element?</p>
      <div class="flex justify-between">
        <Button
          label="Yes, delete"
          theme="red"
          textColor="white"
          textStyle="bold"
          @click.prevent="deleteImage"
        />
        <Button
          label="Cancel"
          theme="white"
          textColor="black"
          @click.prevent="toggleConfirmToDeleteImage"
        /></div
    ></Modal>
    <div class="p-10 flex gap-16 items-center">
      <ImageSettingsList
        v-model:newEntityData="newEntityData"
        v-model:isTitle="isTitle"
        v-model:isText="isText"
        v-model:isEntityWidthFull="isEntityWidthFull"
        :themeColor="themeColor"
      />
      <section
        :style="`border-color: var(--${themeColor}-200); height: 450px; align-items: ${newEntityData.entity_position === 'right' ? 'end' : newEntityData.entity_position}`"
        class="flex grow flex-col gap-4 p-4 w-full min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
      >
        <div
          v-show="isTitle"
          :style="`border-color: var(--${themeColor}-800);
            justify-content: ${newEntityData.entity_title_position}; width: ${isEntityWidthFull ? '100%' : '50%'}; font-size: ${newEntityData.font_size / 2 + 5}px`"
          class="flex text-2xl font-bold text-center px-2 py-4 border-2 border-dashed rounded-2xl"
        >
          <h3 class="w-max overflow-ellipsis overflow-hidden whitespace-nowrap">
            {{ newEntityData.title ?? 'Title' }}
          </h3>
        </div>
        <div style="gap: 32px" class="flex" :style="`height: ${newEntityData.image_height / 2}px`">
          <div
            :class="[
              'relative leading-none',
              {
                'order-3': newEntityData.text_position === 'left'
              }
            ]"
            :style="`width: ${newEntityData.image_width / 2}px; height: ${newEntityData.image_height / 2}px; min-width: 50px; min-height: 50px`"
          >
            <img
              :src="entityData?.imageUrl"
              :alt="`Image ${newEntityData?.title}` || 'Image'"
              :width="newEntityData.image_width / 2"
              :height="newEntityData.image_height / 2"
              style="min-height: 100px; max-height: 700px"
              class="object-contain order-1"
            />
          </div>
          {{ textContainerWidth }}
          <div
            v-show="isText"
            class="textContainer grow relative leading-none border-2 border-dashed rounded-2xl"
            :style="`border-color: var(--${themeColor}-400); width: ${textContainerWidth / 2}px; height: ${entityData.image_height / 2}px`"
          >
            <p
              class="w-full indent-5 leading-normal order-2 p-1 overflow-hidden contain-inline-size text"
              :style="`font-size: ${newEntityData.font_size / 2}px; height: ${entityData.image_height / 2}px;`"
            >
              {{ newEntityData.text ?? 'Text' }}
            </p>
          </div>
        </div>
      </section>
    </div>
    <div class="absolute top-4 right-16 z-10 hover:brightness-80 transition-all">
      <Button
        label="Delete"
        textColor="white"
        theme="red"
        textStyle="bold"
        size="medium"
        @click.prevent="toggleConfirmToDeleteImage"
      >
        <template #icon>
          <TrashIcon color="white" size="25" />
        </template>
      </Button>
    </div>
    <div class="absolute top-4 left-4 z-10 hover:brightness-80 transition-all">
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
