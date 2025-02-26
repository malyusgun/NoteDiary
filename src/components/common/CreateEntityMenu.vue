<script setup lang="ts">
import MenuDial from '@d.malygin/UI_storybook/components/MenuDial';
import ImageIcon from '@d.malygin/UI_storybook/icons/Mono/Image';
import ParagraphIcon from '@d.malygin/UI_storybook/icons/Mono/Paragraph';
import TableIcon from '@d.malygin/UI_storybook/icons/Mono/Table';
import LineDiagonalIcon from '@d.malygin/UI_storybook/icons/Mono/LineDiagonal';
import { useFileDialog } from '@vueuse/core';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useDataStore } from '@/app/stores/data';
import cookies from '@/app/plugins/Cookie';
import { addImageOnLoad, createEntity } from '@/app/helpers/entities';

const { open: uploadFile, onChange } = useFileDialog({
  accept: 'image/*',
  reset: true
});

const themeColor: string = cookies.get('favorite_color');
const isMenu = ref(false);
const entitiesCount = computed(() => useDataStore().entities.length);

const addImage = async (files: FileList) => {
  let image = new Image();
  if (!files[0]) return;
  const url = URL.createObjectURL(files[0]);
  image.src = url;
  image.onload = async () => {
    await addImageOnLoad(image, url, entitiesCount.value);
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
    onClick: async () => {
      await createEntity({
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
    onClick: async () => {
      await createEntity({
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
    onClick: async () => {
      await createEntity({
        entity_type: 'table',
        entity_position: 'left',
        entity_order: entitiesCount.value + 1,
        size: 'normal',
        theme: 'black',
        darknessTheme: '500',
        fontSize: '16px',
        editable: false,
        table_data: [[]],
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
            type: 'tag'
          }
        ]
      });
    }
  }
]);
</script>

<template>
  <MenuDial
    v-model:active="isMenu"
    :items="speedDialItems"
    size="large"
    iconColor="white"
    :theme="themeColor"
  >
    <template #1IconAfter>
      <LineDiagonalIcon color="white" size="25" />
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
