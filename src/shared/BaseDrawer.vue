<script setup lang="ts">
import { useVModel } from '@vueuse/core';

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
        'drawerBackground',
        {
          openedDrawerBackground: isVisible
        }
      ]"
      @click.prevent="isVisible = false"
    ></section>
    <section
      :style="`color: ${theme === 'light' ? 'black' : 'white'}; background-color: ${theme === 'light' ? 'white' : 'black'}`"
      :class="[
        'drawer',
        {
          openedDrawer: isVisible
        }
      ]"
    >
      <header class="drawerHeader">
        <slot name="header" />
        <button class="buttonClose" @click.prevent="isVisible = false">Cls</button>
      </header>
      <slot />
    </section>
  </article>
</template>

<style scoped>
.drawerBackground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -50;
  opacity: 0;
}
.openedDrawerBackground {
  z-index: 60;
  opacity: 1;
}
.drawer {
  position: absolute;
  top: 0;
  z-index: -50;
  width: 400px;
  height: 100vh;
  padding: 20px;
  transform: translateX(-100%);
  transition: all ease-out 0.25s;
  border-right: 2px solid gray;
}
.openedDrawer {
  z-index: 9999;
  transform: translateX(0);
}
.drawerHeader {
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
