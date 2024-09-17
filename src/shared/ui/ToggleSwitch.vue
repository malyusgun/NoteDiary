<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';

interface Props {
  isActive: boolean;
  size?: 'small' | 'large';
  theme?:
    | 'white'
    | 'slate'
    | 'blue'
    | 'sky'
    | 'teal'
    | 'lime'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'pink'
    | 'fuchsia'
    | 'purple'
    | 'indigo'
    | 'rose'
    | 'red';
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isActive']);
const isActive = useVModel(props, 'isActive', emit);

const themeColor = computed(() => {
  switch (props.theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#64748b';
    case 'blue':
      return '#3b82f6';
    case 'sky':
      return '#0ea5e9';
    case 'teal':
      return '#14b8a6';
    case 'lime':
      return '#84cc16';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'orange':
      return '#f97316';
    case 'pink':
      return '#ec4899';
    case 'fuchsia':
      return '#d946ef';
    case 'purple':
      return '#a855f7';
    case 'indigo':
      return '#6366f1';
    case 'rose':
      return '#f43f5e';
    case 'red':
      return '#ef4444';
  }
  return '#0ea5e9';
});
const sizes = computed(() => {
  if (!props?.size)
    return {
      containerWidth: 35,
      containerHeight: 21,
      padding: 3,
      borderRadius: 11,
      circleSize: 15,
      transformXCircle: 14
    };
  switch (props.size) {
    case 'small':
      return {
        containerWidth: 30,
        containerHeight: 18,
        padding: 2,
        borderRadius: 9,
        circleSize: 14,
        transformXCircle: 12
      };
    case 'large':
      return {
        containerWidth: 40,
        containerHeight: 24,
        padding: 3,
        borderRadius: 12,
        circleSize: 18,
        transformXCircle: 14
      };
  }
  return '';
});
</script>

<template>
  <button
    :style="`min-width: ${sizes.containerWidth}px; min-height: ${sizes.containerHeight}px; border-radius: ${sizes.borderRadius}px; padding: ${sizes.padding}px;`"
    class="switcher"
    @click.prevent="isActive = !isActive"
  >
    <span
      :style="`background-color: ${themeColor ?? '#0ea5e9'}; border-radius: ${sizes.borderRadius}px;`"
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
  background-color: rgba(187, 197, 204, 0.66) !important;
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
