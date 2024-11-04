<script setup lang="ts">
import { useDataStore } from '@/app/stores/data';
import { useAuthorizationStore } from '@/app/stores/authorization';
import { useVModel } from '@vueuse/core';

interface Props {
  isMenuVisible: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:isMenuVisible']);
const isMenuVisible = useVModel(props, 'isMenuVisible', emit);

const authorizationStore = useAuthorizationStore();
const dataStore = useDataStore();
const sheets = ref();
const userNickName = computed(() => authorizationStore.userNickName);

onMounted(() => {
  sheets.value = dataStore.user_sheets;
});

const logout = () => {
  authorizationStore.logout();
};
</script>

<template>
  <Drawer v-model:isVisible="isMenuVisible" width="400" theme="black">
    <template #header
      ><section class="flex justify-between items-center mb-4">
        <div class="inline-flex items-center gap-6">
          <img
            src="../../app/assets/ShelfNoteLogoCircle.png"
            alt="ShelfNote logo"
            class="bg-white size-20 rounded-full"
          />
          <span class="font-semibold text-4xl">ShelfNote</span>
        </div>
      </section>
    </template>
    <section class="flex items-center justify-between">
      <div>
        <p class="text-xl w-48 overflow-ellipsis overflow-hidden text-nowrap">
          @{{ userNickName }}
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
    <Divider class="mt-4" />
    <nav class="mt-4">
      <h3 class="text-xl">Menu</h3>
      <Tree :expand="true" theme="black" :items="sheets">
        <template #1IconBefore>
          <HamburgerIcon color="white" size="20" />
        </template>
        <template #1-2IconAfter>
          <DottedIcon color="white" size="20" />
        </template>
        <template #1-1IconBefore>
          <ParagraphIcon color="white" size="20" />
        </template>
        <template #1-1-2IconBefore>
          <DottedIcon color="white" size="20" />
        </template>
        <template #1-2-1IconBefore>
          <ImageIcon color="white" size="20" />
        </template>
      </Tree>
    </nav>
  </Drawer>
</template>

<style scoped></style>
