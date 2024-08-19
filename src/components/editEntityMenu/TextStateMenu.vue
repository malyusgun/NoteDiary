<script setup lang="ts">
import { deleteEntity } from '@/app/helpers';
import type { IText } from '@/app/interfaces/entities';

interface Props {
  entityData: IText;
}

const props = defineProps<Props>();

const emit = defineEmits(['deleteEntity', 'addTitle', 'removeTitle']);

const speedDialState = computed(() => {
  const state = [];
  if (!props.entityData?.title && props.entityData?.title !== '') {
    state.push({
      label: 'Title',
      icon: 'pi pi-plus',
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
    <SpeedDial :model="speedDialState" direction="right" pt:root:class="speedDialRoot size-12">
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
            'flex flex-col bg-black bg-opacity-80 items-center justify-between -translate-8 gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer',
            {
              'text-red-400 font-semibold': item.icon.includes('trash')
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
