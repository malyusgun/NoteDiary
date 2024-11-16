<script setup lang="ts"></script>

<template>
  <Suspense>
    <router-view />
    <template #fallback><BaseLoader /></template>
  </Suspense>
</template>

<style scoped></style>
