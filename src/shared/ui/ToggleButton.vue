<script setup lang="ts">
import { computed } from 'vue';
import { convertThemeToColorBlackDefault, convertThemeToColorWhiteDefault } from './helpers/index';
import { useVModel } from '@vueuse/core';
type TTheme =
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
  | 'red'
  | 'black';
interface Props {
  value: any;
  options: {
    label: string;
    value?: any;
    textColor?: TTheme;
    backgroundColor?: TTheme;
    isLabelHidden?: boolean;
    iconPos?: string;
    textStyle?: 'bold' | 'italic';
  }[];
  border?: TTheme;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  theme?: TTheme;
  rounded?: any;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:value']);
const value = useVModel(props, 'value', emit);
const activeBGColor = computed(() =>
  props.theme ? convertThemeToColorBlackDefault(props.theme) : ''
);
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
const buttonHeight = computed(() => {
  if (!props?.size || props.size === 'medium') return '40px';
  switch (props.size) {
    case 'small':
      return '24px';
    case 'large':
      return '68px';
    case 'extraLarge':
      return '114px';
  }
});
</script>

<template>
  <div
    :class="[
      'buttonGroup',
      {
        'rounded-full': props.rounded,
        border: borderColor
      }
    ]"
  >
    <button
      v-for="(item, index) of options"
      :key="item.label"
      :class="[
        'button',
        {
          'flex-column': item.iconPos === 'top' || item.iconPos === 'bottom'
        }
      ]"
      :style="`padding: ${buttonPadding}`"
      @click.prevent="value = item?.value ?? item.label"
    >
      <span
        :style="`background-color: ${activeBGColor && (value === item.value || value === item.label) ? activeBGColor : convertThemeToColorWhiteDefault(item.backgroundColor)}`"
        :class="[
          'background',
          {
            'rounded-left': index === 0,
            'rounded-left-full': index === 0 && props.rounded,
            'rounded-right': index === options.length - 1,
            'rounded-right-full': index === options.length - 1 && props.rounded
          }
        ]"
      ></span>
      <span
        v-if="!item.isLabelHidden"
        :style="`color: ${convertThemeToColorBlackDefault(item.textColor)}; font-size: ${textSize}`"
        :class="[
          'text',
          {
            bold: item.textStyle === 'bold',
            italic: item.textStyle === 'italic'
          }
        ]"
        >{{ item.label ?? 'Button' }}</span
      >
      <slot
        :class="[
          'icon',
          {
            'order-1': item.iconPos === 'left' || item.iconPos === 'top'
          }
        ]"
        :name="`${index + 1}Icon`"
      />
    </button>
  </div>
</template>

<style scoped>
.buttonGroup {
  display: flex;
  border-radius: 0.5rem;
  position: relative;
}
.button {
  position: relative;
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
  z-index: -2;
  top: 0;
  left: 0;
  transition: filter 0.2s ease-in-out;
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
.rounded-left {
  border-radius: 0.5rem 0 0 0.5rem;
}
.rounded-left-full {
  border-radius: v-bind(buttonHeight) 0 0 v-bind(buttonHeight);
}
.rounded-right {
  border-radius: 0 0.5rem 0.5rem 0;
}
.rounded-right-full {
  border-radius: 0 v-bind(buttonHeight) v-bind(buttonHeight) 0;
}
.rounded-full {
  border-radius: v-bind(buttonHeight);
}
</style>
