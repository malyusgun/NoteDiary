<script setup lang="ts">
import { useFileDialog, useWindowSize } from '@vueuse/core';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useFilesWebsocketStore } from '@/app/stores/filesWebsocket';
import { useDataStore } from '@/app/stores/data';
import cookies from '@/app/plugins/Cookie';
import { calcImageWidth } from '@/app/helpers/images';
import { addImageOnLoad, createEntity } from '@/app/helpers/entities';

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
    // TODO посмотреть, работает ли корректно вынос функции
    await addImageOnLoad(image, url);
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
      createEntity({
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
      createEntity({
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
      createEntity({
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
