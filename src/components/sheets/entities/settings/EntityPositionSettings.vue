<script setup lang="ts">
import MenuDial from '@d.malygin/UI_storybook/components/MenuDial';
import ArrowsVerticalIcon from '@d.malygin/UI_storybook/icons/Mono/ArrowsVertical';
import { changeEntitiesOrder } from '@/app/helpers/entities';
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
      onClick: async () => await changeEntitiesOrder(props.entityUuid, 'up')
    });
  }
  if (props.entityIndex !== props.entitiesLength - 1) {
    state.push({
      label: 'Down',
      theme: 'black',
      onClick: async () => await changeEntitiesOrder(props.entityUuid, 'down')
    });
  }
  return state;
});
</script>

<template>
  <div class="settings absolute right-2 top-0 transition-all select-none">
    <MenuDial v-model:active="isMenu" :items="menuItems" :theme="themeColor" direction="left"
      ><template #buttonIcon>
        <ArrowsVerticalIcon
          :color="themeColor === 'white' ? 'black' : 'white'"
          :size="25"
        /> </template
    ></MenuDial>
  </div>
</template>

<style scoped></style>
