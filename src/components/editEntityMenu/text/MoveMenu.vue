<script setup lang="ts">
import { changeOrderHomeEntity } from '@/app/helpers';
import type { IText } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entityData: IText;
}

const props = defineProps<Props>();

// const isResizable = computed(() => props.isResizable);
// const position = computed(() => props.entityData.position);

const speedDialMove = computed(() => {
  const state = [];
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
  return state;
});
</script>

<template>
  <div>
    <SpeedDial :model="speedDialMove" direction="right" pt:root:class="speedDialRoot size-12">
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
