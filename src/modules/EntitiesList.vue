<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entities: IEntity[];
}
defineProps<Props>();
const emit = defineEmits(['createEntity']);

const createEntity = (entity: IEntity) => {
  emit('createEntity', entity);
};
</script>

<template>
  <EntityItem
    v-for="entitiesItem of entities"
    :key="entitiesItem.entity_uuid"
    :entity="entitiesItem"
  />
  <div class="relative mt-2">
    <CreateEntityMenu @createEntity="createEntity" />
  </div>
</template>

<style scoped></style>
