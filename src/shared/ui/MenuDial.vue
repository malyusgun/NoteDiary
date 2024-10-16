<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import PlusIcon from '@/shared/icons/PlusIcon.vue';
import { computed } from 'vue';
import { convertThemeToColorWhiteDefault } from './helpers/index';

interface Props {
  isActive: boolean;
  items: {
    label: string;
    theme?: string;
    textStyle?: 'bold' | 'italic';
    onClick?: () => void;
  }[];
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  theme?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isActive']);
const isActive = useVModel(props, 'isActive', emit);

const themeColor = computed(() => convertThemeToColorWhiteDefault(props.theme));
const textColor = computed(() => {
  if (!props.theme) return '#000000';
  if (props.theme === 'white') return '#000000';
  return '#ffffff';
});
const elementsSize = computed(() => {
  if (!props?.size) return 40;
  switch (props.size) {
    case 'small':
      return 30;
    case 'medium':
      return 40;
    case 'large':
      return 55;
    case 'extraLarge':
      return 70;
  }
});
const menuListStyles = computed(() => {
  if (!props.direction)
    return `transform: translateY(-${elementsSize.value / 2}px) translateX(${isActive.value ? elementsSize.value + 10 : 0}px)`;
  switch (props.direction) {
    case 'right':
      return `transform: translateY(-${elementsSize.value / 2}px) translateX(${isActive.value ? elementsSize.value + 10 : 0}px)`;
    case 'left':
      return `flex-direction: row-reverse; transform: translateY(-${elementsSize.value / 2}px) ${isActive.value ? `translateX(calc(-100% - 10px))` : ''}`;
    case 'up':
      return `transform: translateY(-${isActive.value ? (0.5 + props.items.length) * elementsSize.value + 10 : elementsSize.value / 2}px)`;
    case 'down':
      return `transform: translateY(${isActive.value ? 20 : 0}px)`;
  }
});
const onClick = () => {
  isActive.value = false;
};
watch(isActive, () => {
  if (isActive.value) {
    setTimeout(() => {
      document.addEventListener('click', onClick);
    }, 0);
  } else {
    document.removeEventListener('click', onClick);
  }
});
</script>

<template>
  <section class="menuContainer">
    <button
      :style="`background-color: ${themeColor ?? 'white'}; width: ${elementsSize}px; height: ${elementsSize}px; transform: ${isActive ? 'rotate(135deg)' : ''};`"
      class="menuButton"
      @click.prevent="isActive = !isActive"
    >
      <slot name="buttonIcon" />
      <PlusIcon v-if="!$slots.buttonIcon" :size="elementsSize - 10" :color="textColor" />
    </button>
    <ul
      :class="[
        'menuList',
        {
          menuListColumn: direction === 'up' || direction === 'down',
          menuListOpened: isActive
        }
      ]"
      :style="menuListStyles"
    >
      <li
        v-for="(item, index) of items"
        :key="item.label"
        :style="`height: ${elementsSize}px; background-color: ${convertThemeToColorWhiteDefault(item.theme)};
        color: ${!item.theme || item.theme === 'white' ? 'black' : 'white'}; border-color: ${!item.theme || item.theme === 'white' ? 'black' : 'white'}`"
        class="menuElement"
        @click.prevent="item?.onClick"
      >
        <slot :name="`${index + 1}IconBefore`" />
        <p
          style="padding: 5px"
          :class="[
            '',
            {
              bold: item.textStyle === 'bold',
              italic: item.textStyle === 'italic'
            }
          ]"
        >
          {{ item.label }}
        </p>
        <slot :name="`${index + 1}IconAfter`" />
      </li>
    </ul>
  </section>
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
  pointer-events: none;
  gap: 10px;
  position: absolute;
  top: 50%;
  left: 0;
  opacity: 0;
  transition: 0.2s ease-in-out;
}
.menuListColumn {
  flex-direction: column;
}
.menuListOpened {
  pointer-events: auto;
  opacity: 1;
}
.menuElement {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.menuElement:hover {
  filter: brightness(75%);
}
.bold {
  font-weight: bold;
}
.italic {
  font-style: italic;
}
</style>
