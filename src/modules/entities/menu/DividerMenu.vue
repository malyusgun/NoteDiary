<script setup lang="ts">
import { changeEntitiesOrder, deleteEntity, editEntity } from '@/app/helpers';
import type { IDivider } from '@/app/interfaces/entities';
import { useVModel } from '@vueuse/core';
import type { IEntity } from '@/app/interfaces/environment';
import { useDataStore } from '@/app/stores/data';

interface Props {
  entityData: IDivider;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);

const dataStore = useDataStore();
const entities = computed(() => dataStore.entities);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);

const changeHeight = (height: number) => {
  entityData.value.divider_height = height;
  editEntity({ ...entityData.value, divider_height: height });
};
const changeType = (type: 'solid' | 'dashed' | 'dotted') => {
  entityData.value.divider_type = type;
  editEntity({ ...entityData.value, divider_type: type });
};
const speedDialSettings = computed(() => {
  const state = [];
  if (props.entityData?.divider_height !== 0) {
    const solid = {
      label: 'Solid',
      command: () => changeType('solid')
    };
    const dashed = {
      label: 'Dashed',
      command: () => changeType('dashed')
    };
    const dotted = {
      label: 'Dotted',
      command: () => changeType('dotted')
    };
    if (props.entityData?.divider_type === 'solid') {
      state.push(dashed, dotted);
    } else if (props.entityData?.divider_type === 'dashed') {
      state.push(solid, dotted);
    } else {
      state.push(solid, dashed);
    }
  }
  const clear = {
    label: 'Clear',
    command: () => changeHeight(0)
  };
  const smallHeight = {
    label: 'Small',
    command: () => changeHeight(1)
  };
  const mediumHeight = {
    label: 'Medium',
    command: () => changeHeight(2)
  };
  const largeHeight = {
    label: 'Large',
    command: () => changeHeight(4)
  };
  const extraLargeHeight = {
    label: 'Extra large',
    command: () => changeHeight(8)
  };
  if (props.entityData?.divider_height === 0) {
    state.push(smallHeight, mediumHeight, largeHeight, extraLargeHeight);
  } else if (props.entityData?.divider_height === 1) {
    state.push(clear, mediumHeight, largeHeight, extraLargeHeight);
  } else if (props.entityData?.divider_height === 2) {
    state.push(clear, smallHeight, largeHeight, extraLargeHeight);
  } else if (props.entityData?.divider_height === 4) {
    state.push(clear, smallHeight, mediumHeight, extraLargeHeight);
  } else {
    state.push(clear, smallHeight, mediumHeight, largeHeight);
  }
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
  state.push({
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => deleteEntity(props.entityData.entity_uuid)
  });
  return state;
});
</script>

<template>
  <div class="speedDial absolute left-2 top-0 transition-all select-none">
    <div class="relative z-40">
      <SpeedDial :model="speedDialSettings" direction="right" pt:root:class="speedDialRoot size-12">
        <template #button="{ toggleCallback }">
          <button
            class="border p-6 size-10 rounded-full bg-blue-500 flex items-center justify-center"
            @click="toggleCallback"
          >
            <i class="pi pi-cog"></i>
          </button>
        </template>
        <template #item="{ item, toggleCallback }">
          <div
            :class="[
              'flex flex-col bg-black bg-opacity-80 items-center justify-between -translate-8 gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer',
              {
                'text-red-400 font-semibold': item?.icon?.includes('trash'),
                'bg-violet-500': item.label === 'Extra large',
                'bg-red-500': item.label === 'Large',
                'bg-yellow-500': item.label === 'Medium',
                'bg-green-500': item.label === 'Small',
                'bg-blue-500': item.label === 'Clear'
              }
            ]"
            @click="toggleCallback"
          >
            <span :class="item?.icon" />
            <span v-show="item.label === 'Solid'"><SolidIcon /></span>
            <span v-show="item.label === 'Dashed'">
              <DashedIcon />
            </span>
            <span v-show="item.label === 'Dotted'">
              <DottedIcon />
            </span>
            <span class="text-center">
              {{ item.label }}
            </span>
          </div>
        </template>
      </SpeedDial>
    </div>
  </div>
</template>

<style scoped></style>
