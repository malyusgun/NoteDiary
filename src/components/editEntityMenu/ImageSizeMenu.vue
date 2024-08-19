<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['scaleImage', 'editTextPosition']);

const speedDialSize = computed(() => {
  let state = [
    {
      label: 'x0.25',
      icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
      command: () => emit('scaleImage', '0.25')
    },
    {
      label: 'x0.5',
      icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
      command: () => emit('scaleImage', '0.5')
    },
    {
      label: 'x0.75',
      icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
      command: () => emit('scaleImage', '0.75')
    },
    {
      label: 'x1',
      icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
      command: () => emit('scaleImage', '1')
    }
  ];
  const initialImageWidth = Math.ceil(props.entityData.image_width / +props.entityData.image_scale);
  const initialImageHeight = Math.ceil(
    props.entityData.image_height / +props.entityData.image_scale
  );
  if (initialImageWidth <= 400 || initialImageHeight <= 400) {
    state = state.filter((item) => item.label !== 'x0.25');
    if (initialImageWidth <= 200 || initialImageHeight <= 200) {
      state = state.filter((item) => item.label !== 'x0.5');
      if (initialImageWidth <= 95 || initialImageHeight <= 95) {
        state = state.filter((item) => item.label !== 'x0.75');
      }
    }
  }
  return state.filter((item) => item.label !== `x${props.entityData.image_scale}`);
});
const speedDialSizeBigger = computed(() => {
  let state = [
    {
      label: 'x1',
      icon: 'pi pi-pencil',
      command: () => emit('scaleImage', '1')
    },
    {
      label: 'x1.25',
      icon: 'pi pi-pencil',
      command: () => emit('scaleImage', '1.25')
    },
    {
      label: 'x1.5',
      icon: 'pi pi-pencil',
      command: () => emit('scaleImage', '1.5')
    },
    {
      label: 'x1.75',
      icon: 'pi pi-pencil',
      command: () => emit('scaleImage', '1.75')
    },
    {
      label: 'x2',
      icon: 'pi pi-pencil',
      command: () => emit('scaleImage', '2')
    }
  ];
  const initialImageWidth = Math.ceil(props.entityData.image_width / +props.entityData.image_scale);
  const initialImageHeight = Math.ceil(
    props.entityData.image_height / +props.entityData.image_scale
  );
  if (initialImageWidth >= 960 || initialImageHeight >= 960) {
    state = state.filter((item) => item.label !== 'x1.25');
    if (initialImageWidth >= 800 || initialImageHeight >= 800) {
      state = state.filter((item) => item.label !== 'x1.5');
      if (initialImageWidth >= 685 || initialImageHeight >= 685) {
        state = state.filter((item) => item.label !== 'x1.75');
        if (initialImageWidth >= 600 || initialImageHeight >= 600) {
          state = state.filter((item) => item.label !== 'x2');
        }
      }
    }
  }
  return state.filter((item) => item.label !== `x${props.entityData.image_scale}`);
});
</script>

<template>
  <div
    class="flex items-center justify-center relative z-50"
    :style="`width: ${props.entityData.image_width}px; height: ${props.entityData.image_height}px`"
  >
    <SpeedDial
      v-if="speedDialSize.length"
      :model="speedDialSize"
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
