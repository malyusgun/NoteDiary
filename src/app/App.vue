<script setup lang="ts">
import 'primeicons/primeicons.css';
import BaseSidebarMenu from '@/modules/BaseSidebarMenu.vue';

const visible = ref<boolean>(false);
</script>

<template>
  <router-view />
  <div class="fixed top-0 left-0 z-50">
    <Button
      @click.prevent="visible = !visible"
      label="Menu"
      iconPos="top"
      icon="pi pi-bars"
      severity="secondary"
    />
  </div>
  <Drawer v-model:visible="visible">
    <template #container="{ closeCallback }">
      <BaseSidebarMenu @closeCallback="closeCallback" class="relative z-50" />
    </template>
  </Drawer>
</template>

<style scoped></style>
