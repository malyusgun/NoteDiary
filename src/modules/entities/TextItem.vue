<script setup lang="ts">
import { useElementSize, useTextareaAutosize } from '@vueuse/core';
import type { IText } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers';

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);
const container = ref();

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title });
};
const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text });
};

const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' });
const { height: containerHeight } = useElementSize(container);
</script>

<template>
  <section
    ref="container"
    :class="[
      'entityContainer relative flex px-16',
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
          rows="1"
          spellcheck="false"
          @change="editText"
          @input="triggerResize"
        />
      </div>
      <div v-if="containerHeight < 145" class="aggregate transition-all h-0"></div>
      <TextMenu v-model:entityData="entityData" />
    </div>
  </section>
</template>

<style>
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
.entityContainer:hover .aggregate {
  height: 100px;
  transition: all 0.2s ease-in-out;
}
input::placeholder {
  font-weight: 400;
}
</style>
