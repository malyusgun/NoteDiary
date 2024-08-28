<script setup lang="ts">
interface Props {
  isBackgroundDefault: boolean;
}
defineProps<Props>();
const emit = defineEmits(['uploadFile', 'setDefaultBackground']);
</script>

<template>
  <div
    class="changeImageBlock absolute top-2 right-2 bg-black p-2 rounded-md hover:text-gray-300 transition-all select-none"
  >
    <input
      type="file"
      onclick="this.value = null"
      title="Change image"
      accept="image/*"
      class="w-2 pr-[135px] -mr-[135px] py-2 -my-2 pl-2 -ml-2 opacity-0"
      @change="$emit('uploadFile', $event)"
    />
    <span><i class="pi pi-image mr-2"></i>Change image</span>
  </div>
  <button
    v-if="isBackgroundDefault"
    class="returnDefaultImageBlock absolute top-16 right-2 bg-blue-600 p-2 transition-all rounded-md border-2 border-solid border-black select-none"
    @click.prevent="$emit('setDefaultBackground')"
  >
    Return default image
  </button>
</template>

<style scoped></style>
