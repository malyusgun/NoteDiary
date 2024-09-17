<script setup lang="ts">
import { deleteEntity } from '@/app/helpers';
import type { IParagraph } from '@/app/interfaces/entities';

interface Props {
  entityData: IParagraph;
}

const props = defineProps<Props>();

const emit = defineEmits(['deleteEntity', 'addTitle', 'removeTitle']);

const speedDialState = computed(() => {
  const state = [];
  if (!props.entityData?.title && props.entityData?.title !== '') {
    state.push({
      label: 'Title',
      icon: 'pi pi-plus',
      command: () => emit('addTitle')
    });
  }
  if (props.entityData?.title || props.entityData?.title === '') {
    state.push({
      label: 'Title',
      icon: 'pi pi-trash',
      command: () => emit('removeTitle')
    });
  }
  state.push({
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => deleteEntity(props.entityData.entity_uuid)
  });
  return state;
});
const isMenu = ref(false);
</script>

<template>
  <div class="relative z-40">
    <MenuDial v-model:isActive="isMenu" :items="speedDialState" size="large"></MenuDial>
  </div>
</template>

<style>
.speedDialRoot {
  justify-content: flex-start !important;
}
</style>
