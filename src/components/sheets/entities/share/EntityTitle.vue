<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import { editEntity } from '@/app/helpers/entities';

interface Props {
  title?: string | null;
  entityData: IEntity;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:title']);
const title = useVModel(props, 'title', emit);

let titleTimeout: ReturnType<typeof setTimeout>;
const editTitle = async () => {
  clearTimeout(titleTimeout);
  titleTimeout = setTimeout(
    async () => await editEntity({ ...props.entityData, title: props.entityData.title }),
    600
  );
};
</script>

<template>
  <input
    v-if="entityData.title || entityData.title === ''"
    ref="input"
    v-model="title"
    type="text"
    placeholder="Enter title..."
    :style="`font-size: ${+entityData.font_size + 10}px`"
    :class="[
      'w-full mb-4 font-bold pl-2',
      {
        'text-center': entityData.entity_title_position === 'center',
        'text-end': entityData.entity_title_position === 'right',
        'pointer-events-none': !isEditMode
      }
    ]"
    size="1"
    @input="editTitle"
  />
</template>

<style scoped></style>
