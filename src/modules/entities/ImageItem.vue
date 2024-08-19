<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { deleteEntity, editEntity } from '@/app/helpers';
import { useDataStore } from '@/app/stores/data';
import { useElementSize, useTextareaAutosize, useVModel } from '@vueuse/core';
import MoveMenu from '@/components/editEntityMenu/ImageMoveMenu.vue';
import StateMenu from '@/components/editEntityMenu/ImageStateMenu.vue';
import CropImageModal from '@/modules/CropImageModal.vue';
import SizeMenu from '@/components/editEntityMenu/ImageSizeMenu.vue';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);

const imageContainer = ref();
const { height: imageHeight } = useElementSize(imageContainer);

function editTitle() {
  editEntity({ ...entityData.value, title: entityData.value.title }, entityData.value.entity_uuid);
}
const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text }, entityData.value.entity_uuid);
};
function addTitle() {
  editEntity({ ...entityData.value, title: 'Title' }, entityData.value.entity_uuid);
  entityData.value = { ...entityData.value, title: 'Title' };
}
function removeTitle() {
  const newState = { ...entityData.value };
  newState.title = null;
  editEntity({ ...newState }, entityData.value.entity_uuid);
  entityData.value = newState;
}
function addText() {
  editEntity(
    {
      ...entityData.value,
      text: 'Text',
      text_position: 'right',
      text_size: 'medium',
      paragraph_size: 'medium'
    },
    entityData.value.entity_uuid
  );
  entityData.value = { ...entityData.value, text: 'Text' };
}
function removeText() {
  const newState = { ...entityData.value };
  newState.text = null;
  newState.text_position = null;
  newState.text_size = null;
  newState.paragraph_size = null;
  editEntity({ ...newState }, entityData.value.entity_uuid);
  entityData.value = newState;
}
function editPosition(position: 'left' | 'center' | 'right') {
  entityData.value.image_position = position;
  editEntity({ ...entityData.value, image_position: position }, entityData.value.entity_uuid);
}
function editTextPosition(position: 'left' | 'right') {
  entityData.value.text_position = position;
  editEntity({ ...entityData.value, text_position: position }, entityData.value.entity_uuid);
}
const dataStore = useDataStore();
const homeEntities = computed(() => dataStore.homeEntities);

const isModalCropImage = ref<boolean>(false);
function openUploadFileModal() {
  isModalCropImage.value = true;
}
function saveImage(newUrl: string, newWidth: number, newHeight: number) {
  entityData.value.image_url = newUrl;
  entityData.value.image_width = newWidth;
  entityData.value.image_height = newHeight;
  editEntity({ ...entityData.value }, entityData.value.entity_uuid);
  isModalCropImage.value = false;
}
function scaleImage(scale: string) {
  const initialWidth = Math.ceil(entityData.value.image_width / +entityData.value.image_scale);
  entityData.value.image_width = initialWidth * +scale;
  const initialHeight = Math.ceil(entityData.value.image_height / +entityData.value.image_scale);
  entityData.value.image_height = initialHeight * +scale;
  entityData.value.image_scale = scale;
  editEntity({ ...entityData.value }, entityData.value.entity_uuid);
}
const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' });
</script>

<template>
  <div
    :class="[
      'entityContainer relative flex py-8 px-16',
      {
        'justify-start': entityData.image_position === 'left',
        'justify-center': entityData.image_position === 'center',
        'justify-end': entityData.image_position === 'right'
      }
    ]"
  >
    <CropImageModal
      v-model:isVisible="isModalCropImage"
      v-model:imageInfo="entityData"
      @saveImage="saveImage"
    />
    <div class="flex flex-col">
      <input
        ref="input"
        v-if="entityData.title || entityData.title === ''"
        type="text"
        v-model="entityData.title"
        @change="editTitle"
        placeholder="Enter title..."
        class="w-full mb-4 font-bold text-2xl pl-2"
      />
      <div class="flex gap-4">
        <div
          ref="imageContainer"
          :class="[
            'imageContainer relative leading-none min-h-[100px] min-w-[100px]',
            {
              'order-3': entityData.text_position === 'left'
            }
          ]"
          :style="`width: ${entityData.image_width}px; height: ${entityData.image_height}px`"
        >
          <img
            :src="entityData?.image_url"
            :alt="`Image ${entityData?.title}` || 'Image'"
            :width="entityData.image_width"
            :height="entityData.image_height"
            class="'max-h-[700px] min-h-[100px] object-contain order-1'"
          />
          <div class="speedDialSize absolute left-0 top-0 transition-all select-none">
            <SizeMenu :entityData="entityData" @scaleImage="scaleImage" />
          </div>
        </div>
        <textarea
          v-if="entityData.text_position"
          ref="textarea"
          v-model="entityData.text"
          class="w-max block indent-5 resize-none outline-0 order-2"
          @change="editText"
          @input="triggerResize"
          placeholder="Enter text..."
          rows="2"
          cols="50"
        />
      </div>
      <div class="speedDial absolute left-2 top-2 transition-all select-none">
        <StateMenu
          :entityData="entityData"
          @deleteEntity="deleteEntity"
          @addTitle="addTitle"
          @removeTitle="removeTitle"
          @addText="addText"
          @removeText="removeText"
          @openUploadFileModal="openUploadFileModal"
        />
      </div>
      <div
        v-if="homeEntities.length > 1"
        class="speedDial absolute left-2 bottom-2 transition-all select-none"
      >
        <MoveMenu
          :entityData="entityData"
          @editPosition="editPosition"
          @editTextPosition="editTextPosition"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
.imageContainer .speedDialSize {
  opacity: 0;
}
.imageContainer:hover .speedDialSize {
  opacity: 100;
}
input::placeholder {
  font-weight: 400;
}
</style>
