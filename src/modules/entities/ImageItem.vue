<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { deleteEntity, editEntity } from '@/app/helpers';
import { useDataStore } from '@/app/stores/data';
import { useVModel, useWindowSize } from '@vueuse/core';
import PositionMenu from '@/components/editEntityMenu/ImagePositionMenu.vue';
import StateMenu from '@/components/editEntityMenu/ImageStateMenu.vue';
import CropImageModal from '@/modules/CropImageModal.vue';
import SizeMenu from '@/components/editEntityMenu/ImageSizeMenu.vue';
import FontMenu from '@/components/editEntityMenu/TextFontMenu.vue';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);
onMounted(() => {
  const prevUrl = entityData.value.image_url;
  const newData = fetch('');
});
function editTitle() {
  editEntity({ ...entityData.value, title: entityData.value.title }, entityData.value.entity_uuid);
}
const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text }, entityData.value.entity_uuid);
};
function addTitle() {
  editEntity(
    { ...entityData.value, title: 'Title', entity_title_position: 'center' },
    entityData.value.entity_uuid
  );
  entityData.value = { ...entityData.value, title: 'Title', entity_title_position: 'center' };
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
      font_size: '20',
      paragraph_size: 'full'
    },
    entityData.value.entity_uuid
  );
  entityData.value = { ...entityData.value, text: 'Text' };
}
function removeText() {
  const newState = { ...entityData.value };
  newState.text = null;
  newState.text_position = null;
  newState.font_size = null;
  newState.paragraph_size = null;
  editEntity({ ...newState }, entityData.value.entity_uuid);
  entityData.value = newState;
}
function editPosition(position: 'left' | 'center' | 'right') {
  entityData.value.entity_position = position;
  editEntity({ ...entityData.value, entity_position: position }, entityData.value.entity_uuid);
}
function editTitlePosition(position: 'left' | 'center' | 'right') {
  entityData.value.entity_title_position = position;
  editEntity(
    { ...entityData.value, entity_title_position: position },
    entityData.value.entity_uuid
  );
}
function editTextPosition(position: 'left' | 'right') {
  entityData.value.text_position = position;
  editEntity({ ...entityData.value, text_position: position }, entityData.value.entity_uuid);
}
function editParagraphWidth(widthMode: 'full' | 'half') {
  entityData.value.paragraph_size = widthMode;
  editEntity({ ...entityData.value, paragraph_size: widthMode }, entityData.value.entity_uuid);
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
function changeFontSize(newSize: '16' | '20' | '24' | '40' | '64') {
  entityData.value.font_size = newSize;
  editEntity({ ...entityData.value, font_size: newSize }, entityData.value.entity_uuid);
}

const { width: windowWidth } = useWindowSize();
const textContainerWidth = computed(() => {
  if (entityData.value?.paragraph_size === 'half')
    return (windowWidth.value - 150 - entityData.value.image_width) / 2;
  return windowWidth.value - 150 - entityData.value.image_width;
});
</script>

<template>
  <div
    :class="[
      'entityContainer relative flex py-8 px-16',
      {
        'justify-start': entityData.entity_position === 'left',
        'justify-center': entityData.entity_position === 'center',
        'justify-end': entityData.entity_position === 'right'
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
        :style="`font-size: ${+entityData.font_size + 10}px`"
        :class="[
          'w-full mb-4 font-bold pl-2',
          {
            'text-center': entityData.entity_title_position === 'center',
            'text-end': entityData.entity_title_position === 'right'
          }
        ]"
      />
      <div class="flex gap-8" :style="`height: ${entityData.image_height}px`">
        <div
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
        <div
          class="textContainer relative leading-none"
          :style="`width: ${textContainerWidth}px; height: ${entityData.image_height}px`"
        >
          <textarea
            v-if="entityData.text_position"
            ref="textarea"
            v-model="entityData.text"
            class="w-full indent-5 leading-normal overflow-auto resize-none outline-0 order-2"
            @change="editText"
            placeholder="Enter text..."
            rows="7"
            :style="`font-size: ${entityData.font_size}px; height: ${entityData.image_height}px;`"
            spellcheck="false"
          />
        </div>
      </div>
      <div class="speedDial absolute left-2 top-0 transition-all select-none">
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
        class="speedDial h-12 absolute left-2 top-1/2 -translate-y-1/2 transition-all select-none"
      >
        <FontMenu :entityData="entityData" @changeFontSize="changeFontSize" />
      </div>
      <div
        v-if="homeEntities.length > 1"
        class="speedDial absolute left-2 bottom-0 transition-all select-none"
      >
        <PositionMenu
          :entityData="entityData"
          @editPosition="editPosition"
          @editTitlePosition="editTitlePosition"
          @editTextPosition="editTextPosition"
          @editParagraphWidth="editParagraphWidth"
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
