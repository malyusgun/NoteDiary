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
const sheets = ref();
const userData = computed(() => authorizationStore.userData);

onMounted(() => {
  sheets.value = useDataStore().sheets;
});

const logout = async () => {
  await authorizationStore.logout();
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
    <Divider class="mt-4" />
    <nav class="mt-4">
      <h3 class="text-xl">Menu</h3>
      <Tree :expand="true" theme="black" :items="sheets"> </Tree>
    </nav>
  </Drawer>
</template>

<style scoped></style>
