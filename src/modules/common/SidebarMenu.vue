<script setup lang="ts">
import TreeList from '@d.malygin/UI_storybook/components/TreeList';
import Drawer from '@d.malygin/UI_storybook/components/Drawer';
import Divider from '@d.malygin/UI_storybook/components/Divider';
import ExitIcon from '@d.malygin/UI_storybook/icons/Mono/Exit';
import SettingsIcon from '@d.malygin/UI_storybook/icons/Mono/Settings';
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useVModel } from '@vueuse/core';
import { convertSheetsForTree } from '@/app/helpers/sheets';

interface Props {
  isMenuVisible: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isMenuVisible']);
const isMenuVisible = useVModel(props, 'isMenuVisible', emit);

const router = useRouter();
const authorizationStore = useAuthorizationStore();
const sheets = computed(() => useDataStore().sheetsData);
const sheetsTree = computed(() => convertSheetsForTree(sheets.value));
const userData = computed(() => authorizationStore.userData);

const logout = async () => {
  await authorizationStore.logout();
};
const onClickTreeItem = (item: { route: string }) => {
  const route = item.route.slice(1);
  useDataStore().setCurrentSheetUuid(route);
  router.push(route);
  router.push({ path: '/' });
  router.go(0);
};
</script>

<template>
  <Drawer
    v-model:visible="isMenuVisible"
    width="400"
    theme="black"
    headerHeight="90px"
    paddingRightOnActive="10px"
    headerDivider
  >
    <template #header
      ><section class="flex justify-between items-center">
        <div class="inline-flex items-center gap-6">
          <img
            src="../../app/assets/ShelfNoteLogoCircle.png"
            alt="ShelfNote logo"
            class="bg-white size-20 rounded-full"
          />
          <span class="font-semibold text-4xl">NoteDiary</span>
        </div>
      </section>
    </template>
    <section class="flex items-center justify-between">
      <div>
        <p class="text-xl w-48 overflow-ellipsis overflow-hidden text-nowrap">
          @{{ userData?.nick_name }}
        </p>
      </div>
      <a href="/settings" class="ml-auto mr-1 p-2 hover:cursor-pointer"
        ><SettingsIcon
          class="p-2 cursor-pointer hover:brightness-75 transition-all"
          color="white"
          size="50"
      /></a>
      <button @click.prevent="logout">
        <ExitIcon color="#f00" class="hover:brightness-75 transition-all" />
      </button>
    </section>
    <nav class="mt-4">
      <h3 class="text-xl">Menu</h3>
      <TreeList :items="sheetsTree" theme="black" expand @onClick="onClickTreeItem"> </TreeList>
    </nav>
  </Drawer>
</template>

<style scoped></style>
