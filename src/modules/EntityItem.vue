<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IImage, IText } from '@/app/interfaces/entities';
interface Props {
  entity: IEntity;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entity = useVModel(props, 'entity', emit);
</script>

<template>
  <div>
    <TextItem v-if="entity.entity_type === 'text'" :entityData="entity as IText" />
    <ImageItem v-if="entity.entity_type === 'image'" v-model:entityData="entity as IImage" />
    <div class="px-16">
      <BaseDivider />
    </div>
  </div>
</template>

<style scoped></style>
