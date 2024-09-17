<script setup lang="ts">
import { changeEntitiesOrder } from '@/app/helpers';
import cookies from '@/app/plugins/Cookie';

interface Props {
  entityUuid: string;
  entityIndex: number;
  entitiesLength: number;
}
const props = defineProps<Props>();

const isMenu = ref(false);
const themeColor: string = cookies.get('favorite_color');
const menuItems = computed(() => {
  const state = [];
  if (props.entityIndex !== 0) {
    state.push({
      label: 'Up',
      theme: 'black',
      onClick: () => changeEntitiesOrder(props.entityUuid, 'up')
    });
  }
  if (props.entityIndex !== props.entitiesLength - 1) {
    state.push({
      label: 'Down',
      theme: 'black',
      onClick: () => changeEntitiesOrder(props.entityUuid, 'down')
    });
  }
  return state;
});
</script>

<template>
  <div class="settings absolute right-2 top-0 transition-all select-none">
    <MenuDial
      v-model:isActive="isMenu"
      :items="menuItems"
      :theme="themeColor"
      size="extraLarge"
      direction="left"
      ><template #buttonIcon>
        <VerticalArrowsIcon
          :color="themeColor === 'white' ? 'black' : 'white'"
          :size="30"
        /> </template
    ></MenuDial>
  </div>
</template>

<style scoped></style>
