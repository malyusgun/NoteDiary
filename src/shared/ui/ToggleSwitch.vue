<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';
import {
  convert800ThemeToColorGrayDefault,
  convertThemeToColorBlackDefault
} from './helpers/index';
import type { TThemeColor } from './interfaces/index';

interface Props {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  theme?: TThemeColor;
  negativeTheme?: TThemeColor;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isActive']);
const isActive = useVModel(props, 'isActive', emit);

const themeColor = computed(() => convertThemeToColorBlackDefault(props.theme));
const inactiveColor = computed(() => convert800ThemeToColorGrayDefault(props.negativeTheme));
const sizes = computed(() => {
  if (!props?.size) {
    return {
      containerWidth: 45,
      containerHeight: 27,
      padding: 4,
      borderRadius: 14,
      circleSize: 19,
      transformXCircle: 18
    };
  }
  switch (props.size) {
    case 'small':
      return {
        containerWidth: 35,
        containerHeight: 21,
        padding: 3,
        borderRadius: 11,
        circleSize: 15,
        transformXCircle: 14
      };
    case 'large':
      return {
        containerWidth: 55,
        containerHeight: 33,
        padding: 4,
        borderRadius: 17,
        circleSize: 25,
        transformXCircle: 22
      };
    case 'extraLarge':
      return {
        containerWidth: 70,
        containerHeight: 42,
        padding: 6,
        borderRadius: 21,
        circleSize: 30,
        transformXCircle: 28
      };
  }
  return {
    containerWidth: 45,
    containerHeight: 27,
    padding: 4,
    borderRadius: 14,
    circleSize: 19,
    transformXCircle: 18
  };
});
</script>

<template>
  <button
    :style="`width: ${sizes.containerWidth}px; min-height: ${sizes.containerHeight}px; border-radius: ${sizes.borderRadius}px; padding: ${sizes.padding}px;`"
    class="switcher"
    @click.prevent="isActive = !isActive"
  >
    <span
      :style="`background-color: ${themeColor}; border-radius: ${sizes.borderRadius}px;`"
      :class="[
        'activeBackground',
        {
          inactiveBackground: !isActive
        }
      ]"
    ></span>
    <span
      :style="`width: ${sizes.circleSize}px; height: ${sizes.circleSize}px; transform: translateX(${isActive ? sizes.transformXCircle : 0}px);`"
      class="switcherCircle"
    ></span>
  </button>
</template>

<style scoped>
.switcher {
  position: relative;
  cursor: pointer;
}
.activeBackground {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s ease-in-out;
}
.inactiveBackground {
  background-color: v-bind(inactiveColor) !important;
  transition: background-color 0.2s ease-in-out;
}
.switcher:hover .inactiveBackground {
  filter: brightness(90%);
}
.switcherCircle {
  display: block;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
}
</style>
