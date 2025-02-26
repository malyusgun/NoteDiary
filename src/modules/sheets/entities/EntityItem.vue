<script setup lang="ts">
import type { TEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IDivider, IImage, IParagraph, ITable } from '@/app/interfaces/entities';
interface Props {
  entity: TEntity;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entity']);
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
    <TableEntity
      v-if="entity.entity_type === 'table'"
      v-model:entityData="entity as ITable"
      :isEditMode="isEditMode"
    />
  </div>
</template>

<style scoped></style>
