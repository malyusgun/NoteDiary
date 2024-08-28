<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useFileDialog, useWindowSize } from '@vueuse/core';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';

const emit = defineEmits(['createEntity']);

const { open: uploadFile, onChange } = useFileDialog({
  accept: 'image/*',
  reset: true
});
const authorizationStore = useAuthorizationStore();
const userNickName = computed(() => authorizationStore.userNickName);

const addImage = async (files: FileList) => {
  let image = new Image();
  const imageUuid = uuidv4();
  if (!files[0]) return;
  const url = URL.createObjectURL(files[0]);
  image.src = url;
  image.onload = async () => {
    const filesWebsocketStore = useFilesWebsocketStore();
    filesWebsocketStore.saveImageUrl(url);
    const response = await fetch(url);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const { width: windowWidth } = useWindowSize();
    const maxWidth = windowWidth.value - 128;
    if (image.width > maxWidth) {
      image.height = Math.floor(maxWidth / image.width) * image.height;
      image.width = maxWidth;
    }
    emit('createEntity', {
      entity_type: 'image',
      entity_uuid: imageUuid,
      image_buffer: buffer,
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
      emit('createEntity', {
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
      emit('createEntity', {
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
    :button-props="{ severity: 'info', rounded: true }"
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
