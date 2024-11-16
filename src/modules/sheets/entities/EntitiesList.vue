<script setup lang="ts">
import { useDataStore } from '@/app/stores/data';

interface Props {
  isEditMode: boolean;
}
defineProps<Props>();

const entities = computed(() => useDataStore().entities);
</script>

<template>
  <EntityItem
    v-for="entitiesItem of entities"
    :key="entitiesItem.entity_uuid"
    :entity="entitiesItem"
    :isEditMode="isEditMode"
  />
  <div class="my-4" style="margin-left: 64px; min-height: 55px">
    <Transition name="bounce">
      <CreateEntityMenu v-if="isEditMode" />
    </Transition>
  </div>
</template>

<style scoped></style>
