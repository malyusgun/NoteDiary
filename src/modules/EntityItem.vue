<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import TextItem from '@/modules/entities/TextItem.vue';
import ImageItem from '@/modules/entities/ImageItem.vue';
import Divider from '@/shared/BaseDivider.vue';
import { useVModel } from '@vueuse/core';
interface Props {
  entity: IEntity;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entity = useVModel(props, 'entity', emit);
</script>

<template>
  <div>
    <TextItem v-if="entity.entity_type === 'text'" :entityData="entity" />
    <ImageItem v-if="entity.entity_type === 'image'" v-model:entityData="entity" />
    <div class="px-16">
      <Divider />
    </div>
  </div>
</template>

<style scoped></style>
