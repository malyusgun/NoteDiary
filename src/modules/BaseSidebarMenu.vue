<script setup lang="ts">
import { useDataStore } from '@/app/stores/data';
import Tree from '@/shared/Tree.vue';
import { useAuthorizationStore } from '@/app/stores/authorization';
import HomeIcon from '@/shared/icons/HomeIcon.vue';

const authorizationStore = useAuthorizationStore();

const route = useRoute();
const dataStore = useDataStore();
const userNickName = computed(() => authorizationStore.userNickName);

const logout = () => {
  authorizationStore.logout();
};
const sheets = ref();

onMounted(() => {
  sheets.value = dataStore.sheets;
});
</script>

<template>
  <div class="flex flex-col">
    <section class="flex items-center justify-between">
      <div>
        <p class="text-xl w-48 overflow-ellipsis overflow-hidden text-nowrap">
          @{{ userNickName }}
        </p>
      </div>
      <a
        href="/settings"
        class="pi pi-cog ml-auto mr-1 p-2 hover:cursor-pointer"
        style="font-size: 2rem"
      ></a>
      <SettingsIcon
        class="p-2 cursor-pointer hover:brightness-75 transition-all"
        color="white"
        size="50"
      />
      <button @click.prevent="logout">
        <ExitIcon color="#f00" class="hover:brightness-75 transition-all" />
      </button>
    </section>
    <Divider class="mt-4" />
    <nav class="mt-4">
      <h3 class="text-xl">Menu</h3>
      <div class="mt-4 -mb-2 ml-4 select-none font-bold">
        <a v-if="route.path !== '/'" href="/" class="text-lg flex gap-4"
          ><HomeIcon color="white" size="20" />Главное меню</a
        >
        <span v-else><i class="pi pi-home text-gray-400 pr-2"></i>Главное меню</span>
      </div>
      <Tree :expand="true" theme="black" :items="sheets">
        <!--        <template #url="slotProps">-->
        <!--          <a-->
        <!--            :href="slotProps.node.data"-->
        <!--            :class="[-->
        <!--              'block',-->
        <!--              {-->
        <!--                'bg-sky-900 p-2 ml-0 -m-2 rounded-md': route.path === slotProps.node.data-->
        <!--              }-->
        <!--            ]"-->
        <!--            >{{ slotProps.node.label }}</a-->
        <!--          >-->
        <!--        </template>-->
      </Tree>
    </nav>
  </div>
</template>

<style scoped></style>
