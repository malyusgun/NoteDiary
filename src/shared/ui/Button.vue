<script setup lang="ts">
import { computed } from 'vue';
import { convertThemeToColorBlackDefault, convertThemeToColorWhiteDefault } from '@/app/helpers';

interface Props {
  label?: string;
  iconPos?: 'left' | 'top' | 'right' | 'bottom';
  textStyle?: 'bold' | 'italic';
  border?:
    | 'white'
    | 'slate'
    | 'blue'
    | 'sky'
    | 'teal'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'pink'
    | 'fuchsia'
    | 'purple'
    | 'indigo'
    | 'rose'
    | 'red'
    | 'black';
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  textColor?:
    | 'white'
    | 'slate'
    | 'blue'
    | 'sky'
    | 'teal'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'pink'
    | 'fuchsia'
    | 'purple'
    | 'indigo'
    | 'rose'
    | 'red'
    | 'black';
  theme?:
    | 'white'
    | 'slate'
    | 'blue'
    | 'sky'
    | 'teal'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'pink'
    | 'fuchsia'
    | 'purple'
    | 'indigo'
    | 'rose'
    | 'red'
    | 'black';
}
const props = defineProps<Props>();
const themeColor = computed(() => convertThemeToColorWhiteDefault(props.theme));
const textColor = computed(() => convertThemeToColorBlackDefault(props.textColor));
const borderColor = computed(() =>
  props.border ? convertThemeToColorBlackDefault(props.border) : ''
);
const textSize = computed(() => {
  if (!props?.size || props.size === 'medium') return '16px';
  switch (props.size) {
    case 'small':
      return '12px';
    case 'large':
      return '20px';
    case 'extraLarge':
      return '24px';
  }
});
const buttonPadding = computed(() => {
  if (!props?.size || props.size === 'medium') return '0.75rem 0.5rem';
  switch (props.size) {
    case 'small':
      return '0.5rem 0.375rem';
    case 'large':
      return '1.2rem 0.8rem';
    case 'extraLarge':
      return '1.8rem 1.2rem';
  }
});
</script>

<template>
  <button
    :class="[
      'button',
      {
        'flex-column': iconPos === 'top' || iconPos === 'bottom',
        border: borderColor
      }
    ]"
    :style="`padding: ${buttonPadding}`"
  >
    <span :style="`background-color: ${themeColor}`" class="background"></span>
    <span
      :style="`color: ${textColor}; font-size: ${textSize}`"
      :class="[
        'text',
        {
          bold: textStyle === 'bold',
          italic: textStyle === 'italic'
        }
      ]"
      >{{ label ?? 'Button' }}</span
    >
    <span
      :class="[
        'icon',
        {
          'order-1': iconPos === 'left' || iconPos === 'top'
        }
      ]"
    >
      <slot name="icon" />
    </span>
  </button>
</template>

<style scoped>
.button {
  position: relative;
  border-radius: 5px;
  display: flex;
  gap: 8px;
  align-items: center;
  user-select: none;
}
.button:hover .background {
  filter: brightness(90%);
}
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  border-radius: 5px;
  transition: filter 0.2s ease-in-out;
}
.text {
  line-height: 1;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-column {
  flex-direction: column;
}
.order-1 {
  order: -1;
}
.bold {
  font-weight: bold;
}
.italic {
  font-style: italic;
}
.border {
  border: 2px solid v-bind(borderColor);
}
</style>
