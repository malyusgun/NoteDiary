<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core';
import type { IText } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers';

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title });
};
const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text });
};

const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' });
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
      <EntityTitle
        v-model:title="entityData.title"
        :entityData="entityData"
        @editTitle="editTitle"
      />
      <div class="relative leading-none">
        <textarea
          ref="textarea"
          v-model="entityData.text"
          class="w-full indent-5 leading-normal resize-none outline-0"
          :style="`font-size: ${entityData.font_size}px;`"
          placeholder="Enter text..."
          rows="3"
          spellcheck="false"
          @change="editText"
          @input="triggerResize"
        />
      </div>
      <TextMenu v-model:entityData="entityData" />
    </div>
  </div>
</template>

<style>
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
