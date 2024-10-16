<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IDivider, IImage, IParagraph } from '@/app/interfaces/entities';
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
    <DividerEntity
      v-if="entity.entity_type === 'divider'"
      :entityData="entity as IDivider"
      :isEditMode="isEditMode"
    />
    <ParagraphEntity
      v-if="entity.entity_type === 'paragraph'"
      :entityData="entity as IParagraph"
      :isEditMode="isEditMode"
    />
    <ImageEntity
      v-if="entity.entity_type === 'image'"
      v-model:entityData="entity as IImage"
      :isEditMode="isEditMode"
    />
  </div>
</template>

<style scoped></style>
