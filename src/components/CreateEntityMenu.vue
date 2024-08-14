<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useFileDialog } from '@vueuse/core';

const emit = defineEmits(['addEntity']);

const {
  files,
  open: uploadFile,
  reset,
  onChange
} = useFileDialog({
  accept: 'image/*'
});

const addImage = (files: FileList) => {
  console.log('files', files);
  let image = new Image();

  const file = files[0];
  const reader = new FileReader();
  console.log('file', file, 'type: ', typeof file);
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    const url = reader.result;
    image.src = url;
    console.log('image width and height: ', image.width, image.height);
    console.log('url length: ', url.length);
    emit('addEntity', {
      entity_type: 'image',
      entity_uuid: uuidv4(),
      image_data: url,
      image_position: 'left',
      image_height: 300
    });
  });
};
onChange((files) => {
  if (files && files?.length > 0) {
    addImage(files);
  }
});

const speedDialItems = ref([
  {
    label: 'Text',
    icon: 'pi pi-pencil',
    command: () => {
      emit('addEntity', {
        entity_type: 'text',
        entity_uuid: uuidv4(),
        text: ''
      });
    }
  },
  {
    label: 'Image',
    icon: 'pi pi-image',
    command: () => uploadFile()
  },
  {
    label: 'Table',
    icon: 'pi pi-table',
    command: () => {
      emit('addEntity', {
        entity_type: 'table',
        entity_uuid: uuidv4(),
        table_columns: [
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
