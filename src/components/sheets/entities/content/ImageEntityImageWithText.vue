<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { useVModel } from '@vueuse/core';
import { editEntity } from '@/app/helpers/entities';

interface Props {
  entityData: IImage;
  textContainerWidth: number;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);

let textTimeout: ReturnType<typeof setTimeout>;
const editText = async () => {
  clearTimeout(textTimeout);
  textTimeout = setTimeout(
    async () => await editEntity({ ...entityData.value, text: entityData.value.text }),
    600
  );
};
</script>

<template>
  <div
    style="gap: 32px"
    :class="[
      'flex py-2',
      {
        'justify-start': entityData.entity_position === 'left',
        'justify-center': entityData.entity_position === 'center',
        'justify-end': entityData.entity_position === 'right'
      }
    ]"
  >
    <div
      :class="[
        'imageContainer relative leading-none',
        {
          'order-3': entityData.text_position === 'left'
        }
      ]"
      :style="`width: ${entityData.image_width}%`"
    >
      <img
        :src="entityData?.image_url"
        :alt="`Image ${entityData?.title}` || 'Image'"
        style="min-height: 100px; max-height: 1000px"
        class="object-contain order-1"
      />
    </div>
    <div
      v-show="entityData.text || entityData.text === ''"
      class="textContainer relative leading-none"
      :style="`width: ${textContainerWidth}%`"
    >
      <textarea
        ref="textarea"
        v-model="entityData.text"
        :class="[
          'w-full indent-5 leading-normal overflow-auto resize-none outline-0 order-2',
          {
            'pointer-events-none': !isEditMode
          }
        ]"
        placeholder="Enter text..."
        rows="7"
        :style="`font-size: ${entityData.font_size}px`"
        spellcheck="false"
        @input="editText"
      />
    </div>
  </div>
</template>

<style scoped></style>
