<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import {
  getImageSpeedDialSizeBiggerLabelsToRemove,
  getImageSpeedDialSizeSmallerLabelsToRemove
} from '@/app/helpers/images';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['scaleImage']);

const speedDialSizeSmaller = computed(() => {
  let state = [
    {
      label: 'x0.25',
      command: () => emit('scaleImage', '0.25')
    },
    {
      label: 'x0.5',
      command: () => emit('scaleImage', '0.5')
    },
    {
      label: 'x0.75',
      command: () => emit('scaleImage', '0.75')
    },
    {
      label: 'x1',
      command: () => emit('scaleImage', '1')
    }
  ];
  const labelsToRemove = getImageSpeedDialSizeSmallerLabelsToRemove(props.entityData);
  state = state.filter((item) => !~labelsToRemove.indexOf(item.label));
  return state.filter((item) => item.label !== `x${props.entityData.image_scale}`);
});

const speedDialSizeBigger = computed(() => {
  let state = [
    {
      label: 'x1',
      command: () => emit('scaleImage', '1')
    },
    {
      label: 'x1.25',
      command: () => emit('scaleImage', '1.25')
    },
    {
      label: 'x1.5',
      command: () => emit('scaleImage', '1.5')
    },
    {
      label: 'x1.75',
      command: () => emit('scaleImage', '1.75')
    },
    {
      label: 'x2',
      command: () => emit('scaleImage', '2')
    }
  ];
  const labelsToRemove = getImageSpeedDialSizeBiggerLabelsToRemove(props.entityData);
  state = state.filter((item) => !~labelsToRemove.indexOf(item.label));
  return state.filter((item) => item.label !== `x${props.entityData.image_scale}`);
});
</script>

<template>
  <div
    class="flex items-center justify-center relative z-40"
    :style="`width: ${props.entityData.image_width}px; height: ${props.entityData.image_height}px`"
  >
    <SpeedDial
      v-if="speedDialSizeSmaller.length"
      :model="speedDialSizeSmaller"
      :radius="70"
      type="semi-circle"
      direction="left"
      :style="{ position: 'absolute', transform: 'translateX(-24px)' }"
      showIcon="pi pi-arrow-down-left-and-arrow-up-right-to-center"
      :buttonProps="{
        rounded: true,
        severity: 'info'
      }"
    >
      <template #item="{ item, toggleCallback }">
        <div
          :class="[
            'w-12 text-md font-semibold bg-opacity-70 items-center justify-between -translate-y-2 py-4 border rounded-full border-surface-200 dark:border-surface-700 cursor-pointer',
            {
              'bg-red-500': item.label.includes('0.25'),
              'bg-orange-500': item.label.includes('0.5'),
              'bg-yellow-500': item.label.includes('0.75'),
              'bg-green-500': item.label.includes('1')
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
    <SpeedDial
      v-if="speedDialSizeBigger.length"
      :model="speedDialSizeBigger"
      :radius="70"
      type="semi-circle"
      direction="right"
      :style="{ position: 'absolute', transform: 'translateX(24px)' }"
      showIcon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
      :buttonProps="{
        rounded: true,
        severity: 'info'
      }"
    >
      <template #item="{ item, toggleCallback }">
        <div
          :class="[
            'w-12 text-md font-semibold bg-opacity-70 items-center justify-between -translate-y-2 py-4 border rounded-full border-surface-200 dark:border-surface-700 cursor-pointer',
            {
              'bg-violet-500': item.label.includes('x2'),
              'bg-red-500': item.label.includes('1.75'),
              'bg-orange-500': item.label.includes('1.5'),
              'bg-yellow-500': item.label.includes('1.25'),
              'bg-green-500': item.label.includes('x1')
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

<style scoped></style>
