<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entityData: IEntity;
}
defineProps<Props>();
const emit = defineEmits(['changeFontSize']);

const speedDialSizeFont = computed(() => {
  return [
    {
      label: 'Very small',
      value: '16',
      command: () => emit('changeFontSize', '16')
    },
    {
      label: 'Small',
      value: '20',
      command: () => emit('changeFontSize', '20')
    },
    {
      label: 'Medium',
      value: '24',
      command: () => emit('changeFontSize', '24')
    },
    {
      label: 'Large',
      value: '40',
      command: () => emit('changeFontSize', '40')
    },
    {
      label: 'Extra large',
      value: '64',
      command: () => emit('changeFontSize', '64')
    }
  ];
});
</script>

<template>
  <div class="h-12">
    <SpeedDial
      v-if="speedDialSizeFont.length"
      :model="speedDialSizeFont"
      direction="right"
      showIcon="pi pi-arrows-h"
      pt:root:class="speedDialRoot w-4"
    >
      <template #button="{ toggleCallback }">
        <button
          class="border p-6 size-10 rounded-full bg-blue-500 flex items-center justify-center"
          @click="toggleCallback"
        >
          <p>
            <span style="font-size: 1.5rem">T</span><span style="font-size: 1rem">T</span
            ><span style="font-size: 0.6rem">T</span>
          </p>
        </button>
      </template>
      <template #item="{ item, toggleCallback }">
        <div
          :class="[
            ' text-md font-semibold bg-opacity-70 items-center justify-between -translate-y-4 p-4 border rounded-md border-surface-200 dark:border-surface-700 cursor-pointer',
            {
              'bg-violet-500': item.label === 'Extra large',
              'bg-red-500': item.label === 'Large',
              'bg-yellow-500': item.label === 'Medium',
              'bg-green-500': item.label === 'Small',
              'bg-blue-500': item.label === 'Very small',
              'opacity-50 cursor-not-allowed pointer-events-none':
                item.value == entityData.font_size
            }
          ]"
          @click="toggleCallback"
        >
          <div class="text-center">
            {{ item.label }}
          </div>
        </div>
      </template>
    </SpeedDial>
  </div>
</template>

<style>
.speedDialRoot {
  justify-content: flex-start !important;
}
</style>
