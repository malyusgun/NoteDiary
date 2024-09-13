<script setup lang="ts">
import { useElementSize, useTextareaAutosize } from '@vueuse/core';
import type { IParagraph } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers';

interface Props {
  entityData: IParagraph;
  isEditMode: boolean;
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
const { height: textareaHeight } = useElementSize(textarea);
</script>

<template>
  <section
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
        :isEditMode="isEditMode"
        @editTitle="editTitle"
      />
      <div class="relative leading-none">
        <textarea
          ref="textarea"
          v-model="entityData.text"
          :class="[
            'w-full indent-5 leading-normal resize-none outline-0',
            {
              'pointer-events-none': !isEditMode
            }
          ]"
          :style="`font-size: ${entityData.font_size}px;`"
          placeholder="Enter text..."
          rows="1"
          spellcheck="false"
          @change="editText"
          @input="triggerResize"
        />
      </div>
      <TextMenu v-if="isEditMode" v-model:entityData="entityData" />
      <EntityPositionSettings />
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
.entityContainer:hover .aggregateHigh {
  height: 140px;
}
.entityContainer:hover .aggregateMedium {
  height: 80px;
}
.entityContainer:hover .aggregateShort {
  height: 35px;
}
input::placeholder {
  font-weight: 400;
}
</style>
