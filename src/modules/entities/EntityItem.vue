<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IDivider, IImage, IText } from '@/app/interfaces/entities';
interface Props {
  entity: IEntity;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entity = useVModel(props, 'entity', emit);
</script>

<template>
  <div>
    <DividerItem v-if="entity.entity_type === 'divider'" v-model:entityData="entity as IDivider" />
    <TextItem v-if="entity.entity_type === 'text'" :entityData="entity as IText" />
    <ImageItem v-if="entity.entity_type === 'image'" v-model:entityData="entity as IImage" />
  </div>
</template>

<style scoped></style>
