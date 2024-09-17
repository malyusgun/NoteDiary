<script setup lang="ts">
import type { IDivider } from '@/app/interfaces/entities';

interface Props {
  entityData: IDivider;
  isEditMode: boolean;
}
defineProps<Props>();
</script>

<template>
  <section class="entityContainer relative px-16 py-6">
    <Divider :type="entityData.divider_type" :height="entityData.divider_height" />
    <DividerSettings v-if="isEditMode" :entityData="entityData" />
    <EntityPositionSettings :entityUuid="entityData.entity_uuid" />
  </section>
</template>

<style>
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
</style>
