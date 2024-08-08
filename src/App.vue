<script setup lang="ts">
import 'primeicons/primeicons.css';
import BaseMenu from '@/modules/BaseMenu.vue';
const visible = ref<boolean>(false);
</script>

<template>
  <router-view />
  <div class="fixed top-0 left-0">
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
      <BaseMenu @closeCallback="closeCallback" />
    </template>
  </Drawer>
</template>

<style scoped></style>
