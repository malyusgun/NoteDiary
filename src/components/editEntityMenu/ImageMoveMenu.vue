<script setup lang="ts">
import { changeOrderHomeEntity } from '@/app/helpers';
import type { IImage } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['editPosition', 'editTextPosition']);

const position = computed(() => props.entityData.image_position);

const speedDialMove = computed(() => {
  const state = [];
  switch (position.value) {
    case 'left':
      state.push({
        label: 'Center',
        icon: 'pi pi-align-center',
        command: () => emit('editPosition', 'center')
      });
      state.push({
        label: 'Right',
        icon: 'pi pi-arrow-right',
        command: () => emit('editPosition', 'right')
      });
      break;
    case 'center':
      state.push({
        label: 'Left',
        icon: 'pi pi-arrow-left',
        command: () => emit('editPosition', 'left')
      });
      state.push({
        label: 'Right',
        icon: 'pi pi-arrow-right',
        command: () => emit('editPosition', 'right')
      });
      break;
    case 'right':
      state.push({
        label: 'Left',
        icon: 'pi pi-arrow-left',
        command: () => emit('editPosition', 'left')
      });
      state.push({
        label: 'Center',
        icon: 'pi pi-align-center',
        command: () => emit('editPosition', 'center')
      });
  }
  const dataStore = useDataStore();
  const entities = dataStore.homeEntities;
  const entityIndex = entities.findIndex(
    (entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid
  );
  if (entityIndex !== 0) {
    state.push({
      label: 'Up',
      icon: 'pi pi-arrow-up',
      command: () => changeOrderHomeEntity(props.entityData.entity_uuid, 'up')
    });
  }
  if (entityIndex !== entities.length - 1) {
    state.push({
      label: 'Down',
      icon: 'pi pi-arrow-down',
      command: () => changeOrderHomeEntity(props.entityData.entity_uuid, 'down')
    });
  }
  if (props.entityData?.text || props.entityData?.text === '') {
    if (props.entityData?.text_position === 'right') {
      state.push({
        label: 'Text left',
        icon: 'pi pi-align-left',
        command: () => emit('editTextPosition', 'left')
      });
    } else {
      state.push({
        label: 'Text right',
        icon: 'pi pi-align-right',
        command: () => emit('editTextPosition', 'right')
      });
    }
  }
  return state;
});
</script>

<template>
  <div>
    <SpeedDial :model="speedDialMove" direction="right" pt:root:class="speedDialRoot w-4">
      <template #button="{ toggleCallback }">
        <button
          class="border p-6 size-10 rounded-full bg-blue-500 flex items-center justify-center"
          @click="toggleCallback"
        >
          <i class="pi pi-arrows-alt"></i>
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
