<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { useInterfaceStore } from '@/app/stores/interface';
import { useWindowSize, useVModels } from '@vueuse/core';
import type { IImageMainInfo } from '@/app/interfaces';

interface Props {
  isVisible: boolean;
  imageInfo: IImageMainInfo;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isVisible']);
const { isVisible, imageInfo } = useVModels(props, emit);

const imageInstance = new Image();
const finalImageUrl = ref<string>('');
const { width: windowWidth, height: windowHeight } = useWindowSize();

const stageSize = ref({
  width: 200,
  height: 200
});

watch(
  () => imageInfo.value.url,
  () => {
    if (imageInfo.value.url) {
      imageInstance.src = imageInfo.value.url;
      imageInstance.onload = () => {
        const imageHeight = imageInfo.value.height;
        const imageWidth = imageInfo.value.width;
        imageInstance.src = imageInfo.value.url;
        if (imageWidth < (imageHeight * windowWidth.value) / windowHeight.value) {
          imageInstance.onload = () => {
            stageSize.value.height = windowHeight.value * 0.75 - 20;
            imageInstance.height = stageSize.value.height;
            imageInstance.width = +(stageSize.value.height / imageHeight).toFixed(2) * imageWidth;
            stageSize.value.width = imageInstance.width;
          };
        } else {
          imageInstance.onload = () => {
            stageSize.value.width = windowWidth.value * 0.63 - 60;
            imageInstance.width = stageSize.value.width;
            imageInstance.height = +(stageSize.value.width / imageWidth).toFixed(2) * imageHeight;
            stageSize.value.height = imageInstance.height;
          };
        }
      };
    }
  }
);

function saveImage() {
  const interfaceStore = useInterfaceStore();
  interfaceStore.changeHomeBackgroundUrl(finalImageUrl.value);
  finalImageUrl.value = '';
  isVisible.value = false;
}
const modalWidth = computed(() => {
  if (stageSize.value.width > stageSize.value.height) {
    return 63;
  } else {
    return (100 * (stageSize.value.width + 60)) / windowWidth.value;
  }
});
function onCropperChange({ canvas }) {
  finalImageUrl.value = canvas.toDataURL();
}
</script>

<template>
  <div>
    <Dialog
      v-model:visible="isVisible"
      modal
      :draggable="false"
      :style="`width: ${modalWidth}%; position: relative`"
    >
      <template #header>
        <div class="mx-auto select-none">
          <i class="pi pi-upload mr-4" style="font-size: 1.5rem"></i>
          <span class="font-bold text-2xl">Upload background</span>
        </div>
      </template>
      <button
        @click.prevent="saveImage"
        class="absolute top-0 left-2 -translate-y-full bg-blue-600 p-2 px-4 text-lg font-bold transition-all border-0 border-t-2 border-t-solid border-t-black rounded-t-lg select-none"
      >
        Save image
      </button>
      <div
        :style="`position: relative; width: ${stageSize.width}px; height: ${stageSize.height}px;`"
      >
        <Cropper :src="imageInstance.src" @change="onCropperChange"></Cropper>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
