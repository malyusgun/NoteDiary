<script setup lang="ts">
interface Props {
  height?: number;
  type?: 'solid' | 'dashed' | 'dotted';
}
defineProps<Props>();
</script>

<template>
  <div :style="`border-bottom: ${height ?? 1}px ${type ?? 'solid'} #6b7280`" class="w-full"></div>
</template>

<style scoped></style>
