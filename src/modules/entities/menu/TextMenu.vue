<script setup lang="ts">
import { deleteEntity, editEntity } from '@/app/helpers';
import type { IText } from '@/app/interfaces/entities';
import { useVModel } from '@vueuse/core';

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);

const addTitle = () => {
  editEntity({ ...entityData.value, title: 'Title', entity_title_position: 'center' });
  entityData.value = { ...entityData.value, title: 'Title', entity_title_position: 'center' };
};
const removeTitle = () => {
  const newState = { ...entityData.value };
  newState.title = null;
  editEntity({ ...newState });
  entityData.value = newState;
};
const editPosition = (position: 'left' | 'center' | 'right') => {
  entityData.value.entity_position = position;
  editEntity({ ...entityData.value, entity_position: position });
};
const editTitlePosition = (position: 'left' | 'center' | 'right') => {
  entityData.value.entity_title_position = position;
  editEntity({ ...entityData.value, entity_title_position: position });
};
const changeFontSize = (newSize: '16' | '20' | '24' | '40' | '64') => {
  entityData.value.font_size = newSize;
  editEntity({ ...entityData.value, font_size: newSize });
};
const editParagraphWidth = (widthMode: 'full' | 'half') => {
  entityData.value.paragraph_size = widthMode;
  editEntity({ ...entityData.value, paragraph_size: widthMode });
};
</script>

<template>
  <div class="speedDial absolute left-2 top-0 transition-all select-none">
    <TextStateMenu
      :entityData="entityData"
      @deleteEntity="deleteEntity"
      @addTitle="addTitle"
      @removeTitle="removeTitle"
    />
  </div>
  <div class="speedDial h-12 absolute left-2 top-0 translate-y-full transition-all select-none">
    <TextFontMenu :entityData="entityData" @changeFontSize="changeFontSize" />
  </div>
  <div class="speedDial absolute left-2 top-0 translate-y-24 transition-all select-none">
    <TextPositionMenu
      :entityData="entityData"
      @editPosition="editPosition"
      @editTitlePosition="editTitlePosition"
      @editParagraphWidth="editParagraphWidth"
    />
  </div>
</template>

<style scoped></style>
