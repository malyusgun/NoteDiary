<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entities: IEntity[];
  isEditMode: boolean;
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
    :isEditMode="isEditMode"
  />
  <div class="my-4" style="margin-left: 64px">
    <Transition name="bounce">
      <CreateEntityMenu v-if="isEditMode" @createEntity="createEntity" />
    </Transition>
    <div v-if="!isEditMode" style="height: 50px"></div>
  </div>
</template>

<style scoped></style>
