<script setup lang="ts">
const emit = defineEmits(['openMenu']);
</script>

<template>
  <div class="fixed top-0 left-0 z-50">
    <button
      class="px-4 py-2 text-white font-bold hover:bg-slate-800 transition-all rounded-md"
      @click.prevent="emit('openMenu')"
    >
      Menu
      <HamburgerMenu color="white" size="40" />
    </button>
  </div>
</template>

<style scoped></style>
