<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';

interface Props {
  title?: string | null;
  entityData: IEntity;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:title', 'editTitle']);
const title = useVModel(props, 'title', emit);
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
        'text-end': entityData.entity_title_position === 'right'
      }
    ]"
    @change="$emit('editTitle')"
  />
</template>

<style scoped></style>
