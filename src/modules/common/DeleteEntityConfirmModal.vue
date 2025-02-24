<script setup lang="ts">
import Modal from '@d.malygin/UI_storybook/components/Modal';
import Button from '@d.malygin/UI_storybook/components/Button';
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
  <Modal v-model:visible="isModalToDeleteEntity" theme="black" width="40%" headerAllowWrap
    ><template #header
      ><p class="font-bold pt-4 mb-4 text-center">
        Are you sure you want to delete thi element?
      </p></template
    >
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
