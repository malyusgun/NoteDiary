<script setup lang="ts">
import { useAuthorizationStore } from '@/app/stores/authorization';

const emit = defineEmits(['closeMenu']);
const authorizationStore = useAuthorizationStore();
const userNickName = computed(() => authorizationStore.userNickName);

const logout = () => {
  authorizationStore.logout();
};
</script>

<template>
  <section class="flex justify-between items-center mb-4">
    <LogoAndLabel />
    <Button
      severity="danger"
      icon="pi pi-times"
      rounded
      outlined
      @click="emit('closeMenu')"
    ></Button>
  </section>
  <section class="flex items-center justify-between">
    <div>
      <p class="text-xl w-48 overflow-ellipsis overflow-hidden text-nowrap">@{{ userNickName }}</p>
    </div>
    <a
      href="/settings"
      class="pi pi-cog ml-auto mr-1 p-2 hover:cursor-pointer"
      style="font-size: 2rem"
    ></a>
    <button @click.prevent="logout">
      <i class="pi pi-sign-out text-red-500 p-2" style="font-size: 1.5rem"></i>
    </button>
  </section>
</template>

<style scoped></style>
