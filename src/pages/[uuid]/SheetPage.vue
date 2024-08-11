<script setup lang="ts">
const route = useRoute();
const sheetUuid = computed(() => route.path.split('/')[1]);
</script>

<template>
  <header>
    <h1 class="text-center text-4xl py-4">Личная жизнь</h1>
    <p>uuid: {{ sheetUuid }}</p>
  </header>
</template>

<style scoped></style>
