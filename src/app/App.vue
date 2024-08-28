<script setup lang="ts">
import 'primeicons/primeicons.css';

const visible = ref<boolean>(false);
</script>

<template>
  <Suspense>
    <div>
      <router-view />
      <div class="fixed top-0 left-0 z-50">
        <Button
          label="Menu"
          iconPos="top"
          icon="pi pi-bars"
          severity="contrast"
          size="small"
          @click.prevent="visible = !visible"
        />
      </div>
      <Drawer v-model:visible="visible">
        <template #container="{ closeCallback }">
          <BaseSidebarMenu class="relative z-50" @closeCallback="closeCallback" />
        </template>
      </Drawer>
    </div>
    <template #fallback><BaseLoader /></template>
  </Suspense>
</template>

<style scoped></style>
