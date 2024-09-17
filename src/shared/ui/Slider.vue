<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';
import { convertThemeToColorBlackDefault, convertThemeToColorWhiteDefault } from '@/app/helpers';

interface Props {
  value: string | number;
  width?: number;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  theme?: string;
  backgroundColor?: string;
  orientation?: 'horizontal' | 'vertical';
  isSmooth?: any;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isActive']);
const value = useVModel(props, 'value', emit);
const sliderButtonSize = computed(() => {
  if (!props.size) return '40px';
  switch (props.size) {
    case 'small':
      return '25px';
    case 'medium':
      return '40px';
    case 'large':
      return '70px';
    case 'extraLarge':
      return '100px';
  }
});
const sliderHeight = computed(() => `${Math.floor(sliderButtonSize.value.slice(0, -2) / 3)}px`);
const sliderBorderRadius = props.isSmooth ? sliderHeight.value : '0%';
const sliderButtonBorderRadius = props.isSmooth ? '50%' : '0%';
const themeColor = computed(() => convertThemeToColorWhiteDefault(props.theme));
const themeBackground = computed(() => convertThemeToColorBlackDefault(props.backgroundColor));
</script>

<template>
  <div class="slideContainer" :style="`width: ${width}px`">
    <input v-model="value" type="range" class="slider" />
  </div>
</template>

<style scoped>
.slideContainer {
  width: 100%;
}
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: v-bind(sliderHeight);
  background: v-bind(themeBackground);
  outline: none;
  border-radius: v-bind(sliderBorderRadius);
  filter: brightness(100%);
  -webkit-transition: 0.2s;
  transition: filter 0.2s;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: v-bind(sliderButtonSize);
  height: v-bind(sliderButtonSize);
  border-radius: v-bind(sliderButtonBorderRadius);
  background: v-bind(themeColor);
  -webkit-transition: 0.2s;
  transition: filter 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  filter: brightness(90%);
}

.slider::-moz-range-thumb {
  width: v-bind(sliderButtonSize);
  height: v-bind(sliderButtonSize);
  background: v-bind(themeColor);
  cursor: pointer;
}
</style>
