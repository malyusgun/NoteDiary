<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import TextItem from '@/modules/entities/TextItem.vue';
import ImageItem from '@/modules/entities/ImageItem.vue';

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
      <Divider />
    </div>
  </div>
</template>

<style scoped></style>
