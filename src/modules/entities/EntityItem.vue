<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IDivider, IImage, IText } from '@/app/interfaces/entities';
interface Props {
  entity: IEntity;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entity = useVModel(props, 'entity', emit);
</script>

<template>
  <div>
    <DividerItem
      v-if="entity.entity_type === 'divider'"
      v-model:entityData="entity as IDivider"
      :isEditMode="isEditMode"
    />
    <TextItem
      v-if="entity.entity_type === 'text'"
      :entityData="entity as IText"
      :isEditMode="isEditMode"
    />
    <ImageItem
      v-if="entity.entity_type === 'image'"
      v-model:entityData="entity as IImage"
      :isEditMode="isEditMode"
    />
  </div>
</template>

<style scoped></style>
