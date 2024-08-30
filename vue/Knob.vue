<script setup>
import { ref, computed } from 'vue';

const sliderValue = ref(10);
const knobTheme = computed(() => {
  if (sliderValue.value < 2) {
    return '#f0edf0';
  }
  if (sliderValue.value < 4) {
    return '#00ff7b';
  }
  if (sliderValue.value < 8) {
    return 'yellow';
  }
  if (sliderValue.value < 10) {
    return '#ff7b00';
  }
  return 'red';
});
</script>

<template>
  <div class="card flex justify-center">
    <Knob
      v-model="sliderValue"
      :valueColor="knobTheme"
      rangeColor="black"
      :textColor="knobTheme"
      step="1"
      min="0"
      max="10"
      size="50"
      readonly
      :pt:text="{ style: 'font-weight: bold; font-size: 28px' }"
    />
    <Slider v-model="sliderValue" min="1" max="10" class="w-112" />
  </div>
</template>

<style>
.w-112 {
  width: 112px;
}
</style>
