<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Props {
  isActive: boolean;
  size?: 'large' | 'extraLarge';
  color?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isActive']);
const isActive = useVModel(props, 'isActive', emit);
</script>

<template>
  <button
    :style="`background-color: ${color ?? '#0ea5e9'}`"
    :class="[
      'switcher',
      {
        largeSwitcher: size === 'large',
        extraLargeSwitcher: size === 'extraLarge',
        activeSwitcher: isActive
      }
    ]"
    @click.prevent="isActive = !isActive"
  >
    <div
      :class="[
        'switcherCircle',
        {
          largeSwitcherCircle: size === 'large',
          extraLargeSwitcherCircle: size === 'extraLarge',
          activeSwitcherCircle: isActive
        }
      ]"
    ></div>
  </button>
</template>

<style scoped>
.switcher {
  display: flex;
  justify-content: start;
  width: 30px;
  height: 18px;
  padding: 2px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.switcher:hover {
  filter: brightness(90%);
}
.activeSwitcher {
  justify-content: end;
  background-color: black !important;
}
.largeSwitcher {
  width: 35px;
  height: 21px;
  border-radius: 11px;
}
.extraLargeSwitcher {
  width: 40px;
  height: 24px;
  border-radius: 12px;
}
.switcherCircle {
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  float: left;
  transition: all 0.2s ease-in-out;
}
.activeSwitcherCircle {
  float: right;
}
.largeSwitcherCircle {
  width: 17px;
  height: 17px;
}
.extraLargeSwitcherCircle {
  width: 20px;
  height: 20px;
}
</style>
