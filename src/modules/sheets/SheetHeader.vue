<script setup lang="ts">
import ToggleSwitch from '@d.malygin/UI_storybook/components/ToggleSwitch';
import { useVModel } from '@vueuse/core';
import cookies from '@/app/plugins/Cookie';
import type { TTheme } from '@/app/interfaces/environment';

interface Props {
  title: string;
  isEditMode: boolean;
  isMenuVisible: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isEditMode']);
const isEditMode = useVModel(props, 'isEditMode', emit);
const themeColor: TTheme = cookies.get('favorite_color');
</script>

<template>
  <header
    :class="[
      'fixed z-20 w-full bg-black',
      {
        'pr-[10px]': isMenuVisible
      }
    ]"
  >
    <h1 class="text-center text-5xl font-semibold py-4">{{ title }}</h1>
    <button
      :class="[
        'absolute top-6 -my-2 py-2 flex items-center justify-center gap-2',
        {
          'right-6': !isMenuVisible,
          'right-[34px]': isMenuVisible
        }
      ]"
      @click="isEditMode = !isEditMode"
    >
      <span class="font-medium select-none">Edit mode</span>
      <ToggleSwitch :active="isEditMode" :theme="themeColor" darknessNegativeTheme="100" />
    </button>
  </header>
</template>

<style scoped></style>
