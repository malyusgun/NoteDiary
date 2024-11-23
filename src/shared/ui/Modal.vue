<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';
import { convertThemeToColorWhiteDefault } from '@/app/helpers';
import type { TThemeColor } from './interfaces/index';

interface Props {
  isVisible: boolean;
  theme?: TThemeColor;
  width?: number | string;
  onClose?: () => never;
}
const props = defineProps<Props>();
const themeColor = computed(() => convertThemeToColorWhiteDefault(props.theme));
const textColor = computed(() => {
  if (!props.theme) return '#000000';
  if (props.theme === 'white') return '#000000';
  return '#ffffff';
});
const emit = defineEmits(['update:isVisible']);
const isVisible = useVModel(props, 'isVisible', emit);
const onKeydown = (event) => {
  if (event.key === 'Escape' && isVisible.value) isVisible.value = false;
};
document.addEventListener('keydown', onKeydown);
const unwatch = watch(isVisible, () => {
  if (!isVisible.value) {
    props.onClose();
  }
});
if (!props.onClose) {
  unwatch();
}
</script>

<template>
  <article>
    <section
      :class="[
        'modalBackground',
        {
          openedModalBackground: isVisible
        }
      ]"
    ></section>
    <section
      :style="`color: ${textColor}; background-color: ${themeColor}; width: ${width}`"
      :class="[
        'modal',
        {
          openedModal: isVisible
        }
      ]"
    >
      <header class="modalHeader">
        <slot name="header" />
        <div class="buttonClose" @click.prevent="isVisible = false">
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
              :fill="textColor ?? '#ffffff'"
            />
          </svg>
        </div>
      </header>
      <slot />
    </section>
  </article>
</template>

<style scoped>
.modalBackground {
  position: fixed;
  top: -100%;
  left: -100%;
  width: 250vw;
  height: 250vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -50;
  opacity: 0;
}
.openedModalBackground {
  z-index: 60;
  opacity: 1;
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: -50;
  min-width: 250px;
  min-height: 100px;
  padding: 20px;
  border: 2px solid gray;
  border-radius: 10px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.5);
  transition: all ease-in-out 0.2s;
  user-select: none;
}
.openedModal {
  user-select: auto;
  z-index: 9999;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.modalHeader {
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0 50px;
  margin-bottom: 20px;
  min-height: 1rem;
}
.buttonClose {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  cursor: pointer;
}
</style>
