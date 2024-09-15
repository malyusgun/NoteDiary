<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import PlusIcon from '@/shared/icons/PlusIcon.vue';
import { computed } from 'vue';

interface Props {
  isActive: boolean;
  items: {
    label: string;
    color?: string;
    onClick?: () => void;
  }[];
  size?: 'large' | 'extraLarge';
  color?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isActive']);
const isActive = useVModel(props, 'isActive', emit);

const elementsSize = computed(() => {
  if (!props?.size) return 30;
  switch (props.size) {
    case 'large':
      return 40;
    case 'extraLarge':
      return 50;
  }
});
</script>

<template>
  <section class="menuContainer">
    <button
      :style="`background-color: ${color ?? 'white'}; width: ${elementsSize}px; height: ${elementsSize}px; transform: ${isActive ? 'rotate(45deg)' : ''};`"
      class="menuButton"
      @click.prevent="isActive = !isActive"
    >
      <slot name="button" />
      <PlusIcon v-if="!$slots.button" :size="elementsSize - 10" />
    </button>
    <ul
      :class="[
        'menuList',
        {
          menuListOpened: isActive
        }
      ]"
      :style="`transform: translateY(-${elementsSize / 2}px) translateX(${isActive ? elementsSize + 10 : 0}px)`"
    >
      <li
        v-for="item of items"
        :key="item.label"
        :style="`background-color: ${item?.color ?? 'white'}; height: ${elementsSize}px`"
        class="menuElement"
        @click.prevent="item?.onClick"
      >
        {{ item.label }}
      </li>
    </ul>
  </section>
  {{ elementsSize }}
</template>

<style scoped>
.menuContainer {
  position: relative;
}
.menuButton {
  position: relative;
  border: 2px solid black;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: 0.2s ease-in-out;
}
.menuButton:hover {
  filter: brightness(75%);
}
.menuList {
  display: flex;
  gap: 10px;
  position: absolute;
  top: 50%;
  left: 0;
  opacity: 0;
  transition: 0.2s ease-in-out;
}
.menuListOpened {
  opacity: 1;
}
.menuElement {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.menuElement:hover {
  filter: brightness(75%);
}
</style>
