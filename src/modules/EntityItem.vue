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
    <TextItem v-if="entity.entity_type === 'text'" :entityData="entity" />
    <ImageItem v-if="entity.entity_type === 'image'" :entityData="entity" />
    <div class="px-16">
      <div class="w-full h-[1px] bg-gray-500"></div>
    </div>
  </div>
</template>

<style scoped></style>
