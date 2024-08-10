<script setup lang="ts">
import type { IEntity } from '@/interfaces/environment';
import TextItem from '@/components/entities/TextItem.vue';
import ImageItem from '@/components/entities/ImageItem.vue';

interface Props {
  entity: IEntity;
}
defineProps<Props>();
</script>

<template>
  <div>
    <TextItem v-if="entity.type === 'text'" :entityData="entity" />
    <ImageItem v-if="entity.type === 'image'" :entityData="entity" />
  </div>
</template>

<style scoped></style>
