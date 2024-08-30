<script setup lang="ts">
import type { IDivider } from '@/app/interfaces/entities';

interface Props {
  entityData: IDivider;
}
defineProps<Props>();
</script>

<template>
  <section class="entityContainer relative px-16 py-6">
    <BaseDivider :type="entityData.divider_type" :height="entityData.divider_height" />
    <DividerMenu :entityData="entityData" />
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
