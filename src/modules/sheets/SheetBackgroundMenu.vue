<script setup lang="ts">
interface Props {
  isBackgroundDefault: boolean;
}
defineProps<Props>();
defineEmits(['uploadFile', 'setDefaultBackground']);
</script>

<template>
  <section class="changeImageBlock absolute top-2 right-6 transition-all">
    <div
      class="bg-black p-2 mb-1 rounded-md hover:text-gray-300 transition-all select-none cursor-pointer"
    >
      <p class="flex"><ImageEditIcon color="white" size="25" class="mr-2" />Change image</p>
    </div>
    <div class="bg-black p-2 mb-1 rounded-md hover:text-gray-300 transition-all select-none">
      <input
        type="file"
        onclick="this.value = null"
        title="Change image"
        accept="image/*"
        style="padding-right: 135px; margin-right: -135px"
        class="w-2 py-1 -my-2 pl-2 -ml-2 opacity-0"
        @change="$emit('uploadFile', $event)"
      />
      <p class="flex"><UploadIcon color="white" size="25" class="mr-2" />Upload image</p>
    </div>
    <button
      v-if="isBackgroundDefault"
      class="bg-blue-600 p-2 transition-all rounded-md border-2 border-solid border-black select-none"
      @click.prevent="$emit('setDefaultBackground')"
    >
      Return default image
    </button>
  </section>
</template>

<style scoped></style>
