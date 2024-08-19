<script setup lang="ts">
import { useAuthorizationStore } from '@/app/stores/authorization';

const authorizationStore = useAuthorizationStore();
const userNickName = computed(() => authorizationStore.userNickName);
</script>

<template>
  <div>
    <Avatar label="D" class="mr-2" size="large" shape="circle" style="background-color: #60a5fa" />
    <span class="text-xl">@{{ userNickName }}</span>
  </div>
  <a
    href="/settings"
    class="pi pi-cog ml-auto p-2 -m-2 hover:cursor-pointer"
    style="font-size: 2rem"
  ></a>
</template>

<style scoped></style>
