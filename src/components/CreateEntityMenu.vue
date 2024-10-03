<script setup lang="ts">
import { useFileDialog, useWindowSize } from '@vueuse/core';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import { useDataStore } from '@/app/stores/data';
import cookies from '@/app/plugins/Cookie';

const emit = defineEmits(['createEntity']);

const { open: uploadFile, onChange } = useFileDialog({
  accept: 'image/*',
  reset: true
});
const authorizationStore = useAuthorizationStore();
const dataStore = useDataStore();

const themeColor: string = cookies.get('favorite_color');
const isMenu = ref(false);
const userNickName = computed(() => authorizationStore.userNickName);
const entitiesCount = computed(() => dataStore.entities.length);

const addImage = async (files: FileList) => {
  let image = new Image();
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
    const maxHeight = 600;
    const initWidth = image.width;
    if (image.height > maxHeight) {
      const coefficient = maxHeight / image.height;
      image.width *= coefficient;
    }
    let imageWidth = Math.ceil((image.width / (windowWidth.value - 128)) * 100);
    if (imageWidth > 100) {
      imageWidth = 100;
    }
    if (imageWidth < 5) {
      imageWidth = 5;
    }
    console.log(`image.width: ${image.width},
    image.height: ${image.height}`);
    emit('createEntity', {
      entity_type: 'image',
      entity_order: entitiesCount.value + 1,
      image_buffer: buffer,
      entity_position: 'left',
      entity_title_position: 'center',
      font_size: '24',
      text_position: 'right',
      paragraph_size: 'full',
      image_width: imageWidth,
      file_width: initWidth,
      file_height: image.height,
      file_width_initial: initWidth,
      file_height_initial: image.height,
      image_scale: 'x1'
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
    label: 'Divider',
    textStyle: 'bold',
    theme: 'blue',
    onClick: () => {
      emit('createEntity', {
        entity_type: 'divider',
        entity_order: entitiesCount.value + 1,
        divider_height: 1,
        divider_type: 'solid'
      });
    }
  },
  {
    label: 'Paragraph',
    textStyle: 'bold',
    theme: 'green',
    onClick: () => {
      emit('createEntity', {
        entity_type: 'paragraph',
        entity_order: entitiesCount.value + 1,
        text: '',
        paragraph_size: 'full',
        font_size: '24',
        entity_position: 'left'
      });
    }
  },
  {
    label: 'Image',
    textStyle: 'bold',
    theme: 'orange',
    onClick: () => uploadFile()
  },
  {
    label: 'Table',
    textStyle: 'bold',
    theme: 'red',
    onClick: () => {
      emit('createEntity', {
        entity_type: 'table',
        entity_order: entitiesCount.value + 1,
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
  <MenuDial v-model:isActive="isMenu" :items="speedDialItems" size="large" :theme="themeColor">
    <template #1IconAfter>
      <HorizontalLineIcon color="white" size="25" />
    </template>
    <template #2IconAfter>
      <ParagraphIcon color="white" size="25" />
    </template>
    <template #3IconAfter>
      <ImageIcon color="white" size="25" />
    </template>
    <template #4IconAfter>
      <TableIcon color="white" size="30" />
    </template>
  </MenuDial>
</template>

<style scoped></style>
