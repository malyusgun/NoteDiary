<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import CloseCircle from '@/shared/icons/CloseCircle.vue';

interface Props {
  isVisible: boolean;
  theme: 'light' | 'dark';
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isVisible']);
const isVisible = useVModel(props, 'isVisible', emit);
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
      :style="`color: ${theme === 'light' ? 'black' : 'white'}; background-color: ${theme === 'light' ? 'white' : 'black'}`"
      :class="[
        'modal',
        {
          openedModal: isVisible
        }
      ]"
    >
      <header class="modalHeader">
        <slot name="header" />
        <button class="buttonClose" @click.prevent="isVisible = false">
          <CloseCircle :color="theme === 'light' ? 'white' : 'black'" />
        </button>
      </header>
      <slot />
    </section>
  </article>
</template>

<style scoped>
.modalBackground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -50;
  opacity: 0;
}
.openedModalBackground {
  z-index: 60;
  opacity: 1;
}
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -50;
  padding: 20px;
  border: 2px solid gray;
  border-radius: 10px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.5);
  transition: all ease-in-out 0.2s;
}
.openedModal {
  z-index: 9999;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.modalHeader {
  font-weight: bold;
  font-size: 1.5rem;
  padding-right: 50px;
  margin-bottom: 20px;
  min-height: 1rem;
}
.buttonClose {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
}
</style>
