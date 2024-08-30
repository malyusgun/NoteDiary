<script setup lang="ts">
import { deleteEntity, editEntity } from '@/app/helpers';
import type { IDivider } from '@/app/interfaces/entities';
import { useVModel } from '@vueuse/core';

interface Props {
  entityData: IDivider;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);

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
  if (props.entityData?.divider_height === 1) {
    state.push(mediumHeight, largeHeight, extraLargeHeight);
  } else if (props.entityData?.divider_height === 2) {
    state.push(smallHeight, largeHeight, extraLargeHeight);
  } else if (props.entityData?.divider_height === 4) {
    state.push(smallHeight, mediumHeight, extraLargeHeight);
  } else {
    state.push(smallHeight, mediumHeight, largeHeight);
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
    <div class="relative z-50">
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
                'bg-green-500': item.label === 'Small'
              }
            ]"
            @click="toggleCallback"
          >
            <span :class="item?.icon" />
            <span v-show="item.label === 'Solid'"
              ><svg
                fill="#fff"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23 13H1v-2h22z" />
                <path fill="none" d="M0 0h24v24H0z" /></svg
            ></span>
            <span v-show="item.label === 'Dashed'">
              <svg
                fill="#fff"
                width="20px"
                height="20px"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 7.5C0 7.22386 0.223858 7 0.5 7H3C3.27614 7 3.5 7.22386 3.5 7.5C3.5 7.77614 3.27614 8 3 8H0.5C0.223858 8 0 7.77614 0 7.5ZM5.75 7.5C5.75 7.22386 5.97386 7 6.25 7H8.75C9.02614 7 9.25 7.22386 9.25 7.5C9.25 7.77614 9.02614 8 8.75 8H6.25C5.97386 8 5.75 7.77614 5.75 7.5ZM12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12Z"
                  fill="#fff"
                />
              </svg>
            </span>
            <span v-show="item.label === 'Dotted'">
              <svg
                fill="#fff"
                width="20px"
                height="20px"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.5 6.625C1.01675 6.625 0.625 7.01675 0.625 7.5C0.625 7.98325 1.01675 8.375 1.5 8.375C1.98325 8.375 2.375 7.98325 2.375 7.5C2.375 7.01675 1.98325 6.625 1.5 6.625ZM5.5 6.625C5.01675 6.625 4.625 7.01675 4.625 7.5C4.625 7.98325 5.01675 8.375 5.5 8.375C5.98325 8.375 6.375 7.98325 6.375 7.5C6.375 7.01675 5.98325 6.625 5.5 6.625ZM9.5 6.625C9.01675 6.625 8.625 7.01675 8.625 7.5C8.625 7.98325 9.01675 8.375 9.5 8.375C9.98325 8.375 10.375 7.98325 10.375 7.5C10.375 7.01675 9.98325 6.625 9.5 6.625ZM12.625 7.5C12.625 7.01675 13.0168 6.625 13.5 6.625C13.9832 6.625 14.375 7.01675 14.375 7.5C14.375 7.98325 13.9832 8.375 13.5 8.375C13.0168 8.375 12.625 7.98325 12.625 7.5Z"
                  fill="#fff"
                />
              </svg>
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
