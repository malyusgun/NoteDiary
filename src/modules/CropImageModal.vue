<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';
import { useWindowSize, useVModels } from '@vueuse/core';
import type { IImageMainInfo } from '@/app/interfaces';
import type { IImage } from '@/app/interfaces/entities';

interface Props {
  isVisible: boolean;
  imageInfo: IImageMainInfo | IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isVisible', 'saveImage']);
const { isVisible, imageInfo } = useVModels(props, emit);

const imageInstance = new Image();
const finalImageUrl = ref<string>('');
const { width: windowWidth, height: windowHeight } = useWindowSize();

const stageSize = ref({
  width: 200,
  height: 200
});

watch(
  () => isVisible.value,
  () => {
    if (imageInfo.value.imageUrl && isVisible.value) {
      imageInstance.src = imageInfo.value.imageUrl;
      imageInstance.onload = () => {
        const imageHeight = imageInfo.value.image_height;
        const imageWidth = imageInfo.value.image_width;
        imageInstance.src = imageInfo.value.imageUrl;
        if (imageWidth < (imageHeight * windowWidth.value) / windowHeight.value) {
          imageInstance.onload = () => {
            if (imageHeight < windowHeight.value * 0.75 - 20) {
              stageSize.value.width = imageWidth;
              stageSize.value.height = imageHeight;
              imageInstance.width = stageSize.value.width;
              imageInstance.height = stageSize.value.height;
            } else {
              stageSize.value.height = windowHeight.value * 0.75 - 20;
              imageInstance.height = stageSize.value.height;
              imageInstance.width = +(stageSize.value.height / imageHeight).toFixed(2) * imageWidth;
              stageSize.value.width = imageInstance.width;
            }
          };
        } else {
          imageInstance.onload = () => {
            if (imageWidth < windowWidth.value * 0.63 - 60) {
              stageSize.value.width = imageWidth;
              stageSize.value.height = imageHeight;
              imageInstance.width = stageSize.value.width;
              imageInstance.height = stageSize.value.height;
            } else {
              stageSize.value.width = windowWidth.value * 0.63 - 60;
              imageInstance.width = stageSize.value.width;
              imageInstance.height = +(stageSize.value.width / imageWidth).toFixed(2) * imageHeight;
              stageSize.value.height = imageInstance.height;
            }
          };
        }
      };
    }
  },
  {
    immediate: true
  }
);

const modalWidth = computed(() => {
  if (
    stageSize.value.width < windowWidth.value * 0.63 - 60 ||
    stageSize.value.width <= stageSize.value.height
  ) {
    return (100 * (stageSize.value.width + 60)) / windowWidth.value;
  } else return 63;
});
const onCropperChange = async ({ canvas }) => {
  imageInstance.width = canvas.width;
  imageInstance.height = canvas.height;
  finalImageUrl.value = canvas.toDataURL();
};
const submitForm = () => {
  emit('saveImage', finalImageUrl.value, imageInstance.width, imageInstance.height);
  finalImageUrl.value = '';
};
</script>

<template>
  <div>
    <Dialog
      v-model:visible="isVisible"
      :draggable="false"
      :style="`width: ${modalWidth}%; position: relative`"
    >
      <template #header>
        <div class="mx-auto select-none">
          <i
            class="pi pi-upload mr-4"
            :style="stageSize.width < 400 ? 'font-size: 1rem' : 'font-size: 1.5rem'"
          ></i>
          <span
            :class="[
              'font-bold text-2xl',
              {
                'text-lg': stageSize.width < 400
              }
            ]"
            >Crop image</span
          >
        </div>
      </template>
      <button
        class="absolute top-0 left-2 -translate-y-full bg-blue-600 p-2 px-4 text-lg font-bold transition-all border-0 border-t-2 border-t-solid border-t-black rounded-t-lg select-none"
        @click.prevent="submitForm"
      >
        Save image
      </button>
      <div
        :style="`position: relative; width: ${stageSize.width}px; height: ${stageSize.height}px;`"
      >
        <Cropper
          :src="imageInstance.src"
          :minWidth="200"
          :minHeight="200"
          @change="onCropperChange"
        ></Cropper>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
