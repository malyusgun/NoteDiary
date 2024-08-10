<script setup lang="ts">
import { changeOrderHomeEntity, deleteEntity } from '@/helpers';
import type { IText } from '@/interfaces/entities';
import { useDataStore } from '@/stores/data';
import type { IEntity } from '@/interfaces/environment';

interface Props {
  entityData: IText;
}

const props = defineProps<Props>();

const emit = defineEmits([
  'deleteEntity',
  'addTitle',
  'removeTitle'
  // 'toLeftPosition',
  // 'toCenterPosition',
  // 'toRightPosition',
  // 'toggleIsResizable'
]);

// const isResizable = computed(() => props.isResizable);
// const position = computed(() => props.entityData.position);

const speedDialState = computed(() => {
  const state = [];
  if (!props.entityData?.title && props.entityData?.title !== '') {
    state.push({
      label: 'Add title',
      icon: 'pi pi-pencil',
      command: () => emit('addTitle')
    });
  }
  if (props.entityData?.title || props.entityData?.title === '') {
    state.push({
      label: 'Remove title',
      icon: 'pi pi-trash',
      command: () => emit('removeTitle')
    });
  }
  // state.push({
  //   label: !isResizable.value ? 'Resize' : 'Stop resize',
  //   icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
  //   command: () => emit('toggleIsResizable')
  // });
  // switch (position.value) {
  //   case 'left':
  //     state.push({
  //       label: 'Move to center',
  //       icon: 'pi pi-align-center',
  //       command: () => emit('toCenterPosition')
  //     });
  //     state.push({
  //       label: 'Move to right',
  //       icon: 'pi pi-arrow-right',
  //       command: () => emit('toRightPosition')
  //     });
  //     break;
  //   case 'center':
  //     state.push({
  //       label: 'Move to left',
  //       icon: 'pi pi-arrow-left',
  //       command: () => emit('toLeftPosition')
  //     });
  //     state.push({
  //       label: 'Move to right',
  //       icon: 'pi pi-arrow-right',
  //       command: () => emit('toRightPosition')
  //     });
  //     break;
  //   case 'right':
  //     state.push({
  //       label: 'Move to left',
  //       icon: 'pi pi-arrow-left',
  //       command: () => emit('toLeftPosition')
  //     });
  //     state.push({
  //       label: 'Move to center',
  //       icon: 'pi pi-align-center',
  //       command: () => emit('toCenterPosition')
  //     });
  // }
  state.push({
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => deleteEntity(props.entityData.uuid)
  });
  return state;
});

const speedDialMove = computed(() => {
  const state = [];
  const dataStore = useDataStore();
  const entities = dataStore.homeEntities;
  const entityIndex = entities.findIndex(
    (entity: IEntity) => entity.uuid === props.entityData.uuid
  );
  if (entityIndex !== 0) {
    state.push({
      label: 'Move up',
      icon: 'pi pi-arrow-up',
      command: () => changeOrderHomeEntity(props.entityData.uuid, 'up')
    });
  }
  if (entityIndex !== entities.length - 1) {
    state.push({
      label: 'Move down',
      icon: 'pi pi-arrow-down',
      command: () => changeOrderHomeEntity(props.entityData.uuid, 'down')
    });
  }
  return state;
});
</script>

<template>
  <div class="relative">
    <SpeedDial
      :model="speedDialState"
      direction="right"
      pt:root:class="speedDialRoot w-16 -translate-y-12"
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
            'flex flex-col bg-black bg-opacity-70 items-center justify-between -translate-8 gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer',
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
    <SpeedDial :model="speedDialMove" direction="right" pt:root:class="speedDialRoot w-16">
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
            'flex flex-col bg-black bg-opacity-70 items-center justify-between -translate-8 gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer',
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
