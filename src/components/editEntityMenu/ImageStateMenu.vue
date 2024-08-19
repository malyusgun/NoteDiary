<script setup lang="ts">
import { deleteEntity } from '@/app/helpers';
import type { IImage } from '@/app/interfaces/entities';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits([
  'deleteEntity',
  'addTitle',
  'removeTitle',
  'addText',
  'removeText',
  'openUploadFileModal'
]);

const speedDialState = computed(() => {
  const state = [];
  if (!props.entityData?.title && props.entityData?.title !== '') {
    state.push({
      label: 'Title',
      icon: 'pi pi-pencil',
      command: () => emit('addTitle')
    });
  }
  if (props.entityData?.title || props.entityData?.title === '') {
    state.push({
      label: 'Title',
      icon: 'pi pi-trash',
      command: () => emit('removeTitle')
    });
  }
  if (!props.entityData?.text && props.entityData?.text !== '') {
    state.push({
      label: 'Text',
      icon: 'pi pi-pencil',
      command: () => emit('addText')
    });
  }
  if (props.entityData?.text || props.entityData?.text === '') {
    state.push({
      label: 'Text',
      icon: 'pi pi-trash',
      command: () => emit('removeText')
    });
  }
  if (props.entityData.image_width > 200 && props.entityData.image_height > 200) {
    state.push({
      label: 'Crop',
      icon: 'pi pi-expand',
      command: () => emit('openUploadFileModal')
    });
  }
  state.push({
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => deleteEntity(props.entityData.entity_uuid)
  });
  return state;
});
</script>

<template>
  <div>
    <SpeedDial
      :model="speedDialState"
      direction="right"
      pt:root:class="speedDialRoot w-4"
      class="absolute"
    >
      <template #button="{ toggleCallback }">
        <button
          class="border p-6 size-10 rounded-full bg-blue-500 flex items-center justify-center"
          @click="toggleCallback"
        >
          <i class="pi pi-pen-to-square"></i>
        </button>
      </template>
      <template #item="{ item, toggleCallback }">
        <div
          :class="[
            ' flex flex-col bg-black bg-opacity-80 items-center justify-between -translate-8 gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer',
            {
              'text-red-400 font-semibold': item.icon.includes('trash') || item.icon.includes('ban')
            }
          ]"
          @click="toggleCallback"
        >
          <span :class="item.icon" />
          <span class="text-center">
            {{ item.label }}
          </span>
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
