<script setup lang="ts">
import { changeEntitiesOrder } from '@/app/helpers';
import type { IParagraph } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entityData: IParagraph;
}
const props = defineProps<Props>();
const emit = defineEmits(['editParagraphWidth', 'editPosition', 'editTitlePosition']);

const position = computed(() => props.entityData.entity_position);
const titlePosition = computed(() => props.entityData.entity_title_position);

const dataStore = useDataStore();
const entities = computed(() => dataStore.entities);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);

const speedDialMove = computed(() => {
  let state = [];
  const left = {
    label: 'Left',
    icon: 'pi pi-arrow-left',
    command: () => emit('editPosition', 'left')
  };
  const center = {
    label: 'Center',
    icon: 'pi pi-align-center',
    command: () => emit('editPosition', 'center')
  };
  const right = {
    label: 'Right',
    icon: 'pi pi-arrow-right',
    command: () => emit('editPosition', 'right')
  };
  const titleLeft = {
    label: 'Title left',
    icon: 'pi pi-align-left',
    command: () => emit('editTitlePosition', 'left')
  };
  const titleCenter = {
    label: 'Title center',
    icon: 'pi pi-align-center',
    command: () => emit('editTitlePosition', 'center')
  };
  const titleRight = {
    label: 'Title right',
    icon: 'pi pi-align-right',
    command: () => emit('editTitlePosition', 'right')
  };
  switch (titlePosition.value) {
    case 'left':
      state.push(titleCenter, titleRight);
      break;
    case 'center':
      state.push(titleLeft, titleRight);
      break;
    case 'right':
      state.push(titleLeft, titleCenter);
  }
  switch (position.value) {
    case 'left':
      state.push(center, right);
      break;
    case 'center':
      state.push(left, right);
      break;
    case 'right':
      state.push(left, center);
  }
  if (entities.value.length > 1) {
    if (entityIndex.value !== 0) {
      state.push({
        label: 'Up',
        icon: 'pi pi-arrow-up',
        command: () => changeEntitiesOrder(props.entityData.entity_uuid, 'up')
      });
    }
    if (entityIndex.value !== entities.value.length - 1) {
      state.push({
        label: 'Down',
        icon: 'pi pi-arrow-down',
        command: () => changeEntitiesOrder(props.entityData.entity_uuid, 'down')
      });
    }
  }
  if (props.entityData.paragraph_size === 'full') {
    state = state.filter(
      (item) => item.label !== 'Left' && item.label !== 'Center' && item.label !== 'Right'
    );
    state.push({
      label: 'Text half width',
      command: () => emit('editParagraphWidth', 'half')
    });
  } else {
    state.push({
      label: 'Text full width',
      command: () => emit('editParagraphWidth', 'full')
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
              'text-red-400 font-semibold': item?.icon?.includes('trash')
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
