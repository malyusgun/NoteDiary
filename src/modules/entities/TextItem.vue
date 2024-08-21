<script setup lang="ts">
import type { IText } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';
import { useTextareaAutosize } from '@vueuse/core';
import { deleteEntity, editEntity } from '@/app/helpers';
import StateMenu from '@/components/editEntityMenu/TextStateMenu.vue';
import PositionMenu from '@/components/editEntityMenu/TextPositionMenu.vue';
import FontMenu from '@/components/editEntityMenu/TextFontMenu.vue';

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const addTitle = () => {
  editEntity(
    { ...entityData.value, title: 'Title', entity_title_position: 'center' },
    entityData.value.entity_uuid
  );
  entityData.value = { ...entityData.value, title: 'Title', entity_title_position: 'center' };
};

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title }, entityData.value.entity_uuid);
};

const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text }, entityData.value.entity_uuid);
};

const removeTitle = () => {
  const newState = { ...entityData.value };
  newState.title = null;
  editEntity({ ...newState }, entityData.value.entity_uuid);
  entityData.value = newState;
};

const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' });

const dataStore = useDataStore();
const homeEntities = computed(() => dataStore.homeEntities);
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
function changeFontSize(newSize: '16' | '20' | '24' | '40' | '64') {
  entityData.value.font_size = newSize;
  editEntity({ ...entityData.value, font_size: newSize }, entityData.value.entity_uuid);
}
function editParagraphWidth(widthMode: 'full' | 'half') {
  entityData.value.paragraph_size = widthMode;
  editEntity({ ...entityData.value, paragraph_size: widthMode }, entityData.value.entity_uuid);
}
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
    <div
      :class="[
        {
          'w-1/2': entityData.paragraph_size === 'half',
          'w-full': entityData.paragraph_size === 'full'
        }
      ]"
    >
      <input
        ref="input"
        v-if="entityData.title || entityData.title === ''"
        type="text"
        v-model="entityData.title"
        @change="editTitle"
        placeholder="Enter title..."
        :style="`font-size: ${+entityData.font_size + 10}px`"
        :class="[
          'w-full mb-4 font-bold text-6xl pl-2',
          {
            'text-center': entityData.entity_title_position === 'center',
            'text-end': entityData.entity_title_position === 'right'
          }
        ]"
      />
      <div class="relative leading-none">
        <textarea
          ref="textarea"
          v-model="entityData.text"
          class="w-full indent-5 leading-normal resize-none outline-0"
          :style="`font-size: ${entityData.font_size}px;`"
          @change="editText"
          @input="triggerResize"
          placeholder="Enter text..."
          rows="3"
          spellcheck="false"
        />
      </div>
      <div class="speedDial absolute left-2 top-0 transition-all select-none">
        <StateMenu
          :entityData="entityData"
          @deleteEntity="deleteEntity"
          @addTitle="addTitle"
          @removeTitle="removeTitle"
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
          @editParagraphWidth="editParagraphWidth"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
input::placeholder {
  font-weight: 400;
}
</style>
