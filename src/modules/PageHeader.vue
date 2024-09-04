<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Props {
  title: string;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isEditMode']);
const isEditMode = useVModel(props, 'isEditMode', emit);
</script>

<template>
  <header class="fixed z-50 w-full bg-black">
    <h1 class="text-center text-5xl font-semibold py-4">{{ title }}</h1>
    <button
      class="absolute right-6 top-6 -my-2 py-2 flex items-center justify-center gap-2"
      @click.prevent="isEditMode = !isEditMode"
    >
      <span class="font-medium select-none">Edit mode</span>
      <ToggleSwitch v-model="isEditMode" />
    </button>
  </header>
</template>

<style scoped></style>
