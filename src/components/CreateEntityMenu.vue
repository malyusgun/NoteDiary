<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const emit = defineEmits(['addEntity']);

const speedDialItems = ref([
  {
    label: 'Text',
    icon: 'pi pi-pencil',
    command: () => {
      emit('addEntity', {
        type: 'text',
        uuid: uuidv4(),
        text: ''
      });
    }
  },
  {
    label: 'Image',
    icon: 'pi pi-image',
    command: () => {
      emit('addEntity', {
        type: 'image',
        uuid: uuidv4()
      });
    }
  },
  {
    label: 'Table',
    icon: 'pi pi-table',
    command: () => {
      emit('addEntity', {
        type: 'table',
        uuid: uuidv4(),
        columns: [
          {
            name: 'Name',
            type: 'text'
          },
          {
            name: 'Description',
            type: 'text'
          },
          {
            name: 'Status',
            type: 'status'
          }
        ]
      });
    }
  }
]);
</script>

<template>
  <SpeedDial
    :model="speedDialItems"
    direction="right"
    :buttonProps="{ severity: 'info', rounded: true }"
    style="position: absolute; left: 5%; top: 0"
  >
    <template #item="{ item, toggleCallback }">
      <div
        class="flex flex-col items-center justify-between -translate-8 gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer"
        @click="toggleCallback"
      >
        <span :class="item.icon" />
        <span>
          {{ item.label }}
        </span>
      </div>
    </template>
  </SpeedDial>
</template>

<style scoped></style>
