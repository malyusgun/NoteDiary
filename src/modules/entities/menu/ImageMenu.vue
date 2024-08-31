<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useDataStore } from '@/app/stores/data';
import type { IImage } from '@/app/interfaces/entities';
import { deleteEntity, editEntity } from '@/app/helpers';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData', 'openCropImageModal']);
const entityData = useVModel(props, 'entityData', emit);

const dataStore = useDataStore();
const homeEntities = computed(() => dataStore.homeEntities);

const addTitle = () => {
  editEntity({
    ...entityData.value,
    title: 'Title',
    entity_title_position: 'center',
    font_size: entityData.value.font_size ?? '24'
  });
  entityData.value = { ...entityData.value, title: 'Title', entity_title_position: 'center' };
};
const removeTitle = () => {
  const newState = { ...entityData.value };
  newState.title = null;
  editEntity({ ...newState });
  entityData.value = newState;
};
const addText = () => {
  editEntity({
    ...entityData.value,
    text: 'Text',
    text_position: 'right',
    font_size: entityData.value.font_size ?? '24',
    paragraph_size: 'full'
  });
  entityData.value = { ...entityData.value, text: 'Text' };
};
const removeText = () => {
  const newState = { ...entityData.value };
  ['text', 'text_position', 'font_size', 'paragraph_size'].forEach((item) => {
    newState[item] = null;
  });
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
const editTextPosition = (position: 'left' | 'right') => {
  entityData.value.text_position = position;
  editEntity({ ...entityData.value, text_position: position });
};
const editParagraphWidth = (widthMode: 'full' | 'half') => {
  entityData.value.paragraph_size = widthMode;
  editEntity({ ...entityData.value, paragraph_size: widthMode });
};
const changeFontSize = (newSize: '16' | '20' | '24' | '40' | '64') => {
  entityData.value.font_size = newSize;
  editEntity({ ...entityData.value, font_size: newSize });
};
</script>

<template>
  <section style="height: 146px" class="speedDial absolute left-2 top-0 transition-all select-none">
    <ImageStateMenu
      :entityData="entityData"
      class="h-12"
      @deleteEntity="deleteEntity"
      @addTitle="addTitle"
      @removeTitle="removeTitle"
      @addText="addText"
      @removeText="removeText"
      @openCropImageModal="$emit('openCropImageModal')"
    />
    <div v-if="entityData?.text || entityData?.title">
      <TextFontMenu :entityData="entityData" class="h-12" @changeFontSize="changeFontSize" />
    </div>
    <div v-if="homeEntities.length > 1">
      <ImagePositionMenu
        :entityData="entityData"
        @editPosition="editPosition"
        @editTitlePosition="editTitlePosition"
        @editTextPosition="editTextPosition"
        @editParagraphWidth="editParagraphWidth"
      />
    </div>
  </section>
</template>

<style scoped></style>
