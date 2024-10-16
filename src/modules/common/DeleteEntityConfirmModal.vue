<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface IProps {
  isModalToDeleteEntity: boolean;
}
const props = defineProps<IProps>();
const emit = defineEmits([
  'update:isModalToDeleteEntity',
  'deleteEntity',
  'toggleConfirmDeleteEntityModal'
]);
const isModalToDeleteEntity = useVModel(props, 'isModalToDeleteEntity', emit);
</script>

<template>
  <Modal v-model:isVisible="isModalToDeleteEntity" theme="black" width="30%"
    ><p class="font-bold pt-4 mb-4 text-center">Are you sure you want to delete this element?</p>
    <div class="flex justify-between">
      <Button
        label="Yes, delete"
        theme="red"
        textColor="white"
        textStyle="bold"
        @click.prevent="emit('deleteEntity')"
      />
      <Button
        label="Cancel"
        theme="white"
        textColor="black"
        @click.prevent="emit('toggleConfirmDeleteEntityModal')"
      /></div
  ></Modal>
</template>

<style scoped></style>
