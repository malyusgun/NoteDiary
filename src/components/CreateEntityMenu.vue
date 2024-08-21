<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useFileDialog } from '@vueuse/core';

const emit = defineEmits(['addEntity']);

const { open: uploadFile, onChange } = useFileDialog({
  accept: 'image/*',
  reset: true
});

const addImage = async (files: FileList) => {
  let image = new Image();
  const imageUuid = uuidv4();
  const file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    image.src = String(reader.result);
  });
  image.onload = () => {
    emit('addEntity', {
      entity_type: 'image',
      entity_uuid: imageUuid,
      image_url: image.src,
      entity_position: 'left',
      entity_title_position: 'center',
      image_width: image.width,
      image_height: image.height,
      image_scale: '1'
    });
  };
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
        text: '',
        paragraph_size: 'full',
        font_size: '24',
        entity_position: 'left'
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
