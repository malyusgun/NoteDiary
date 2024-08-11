<script setup lang="ts">
import LogoAndLabel from '@/components/LogoAndLabel.vue';
import { useDataStore } from '@/stores/data';
import UserInfoHeaderWithSettings from '@/components/UserInfoHeaderWithSettings.vue';

const route = useRoute();
const emit = defineEmits(['closeCallback']);
const dataStore = useDataStore();
const sheets = ref();

const expandAll = () => {
  for (let sheet of sheets.value) {
    expandSheet(sheet);
  }

  expandedKeys.value = { ...expandedKeys.value };
};

const expandSheet = (sheet) => {
  if (sheet.children && sheet.children.length) {
    expandedKeys.value[sheet.key] = true;

    for (let child of sheet.children) {
      expandSheet(child);
    }
  }
};
onMounted(() => {
  sheets.value = dataStore.sheets;
  expandAll();
});

const expandedKeys = ref({});
</script>

<template>
  <div class="flex flex-col h-full p-4">
    <section class="flex justify-between items-center mb-6">
      <LogoAndLabel />
      <Button
        severity="contrast"
        @click="emit('closeCallback')"
        icon="pi pi-times"
        rounded
        outlined
      ></Button>
    </section>
    <section class="flex items-center justify-between mb-6">
      <UserInfoHeaderWithSettings />
    </section>
    <Divider />
    <nav>
      <h3 class="text-xl">Menu</h3>
      <div class="ml-[58px] mt-4 -mb-2 select-none font-bold">
        <a v-if="route.path !== '/'" href="/"
          ><i class="pi pi-home text-gray-400 pr-2"></i>Главное меню</a
        >
        <span v-else><i class="pi pi-home text-gray-400 pr-2"></i>Главное меню</span>
      </div>
      <Tree
        :value="sheets"
        v-model:expandedKeys="expandedKeys"
        pt:root:class="pl-0"
        pt:sheetLabel:class="text-white"
      >
        <template #url="slotProps">
          <a
            :href="slotProps.node.data"
            :class="[
              'block',
              {
                'bg-sky-900 p-2 ml-0 -m-2 rounded-md': route.path === slotProps.node.data
              }
            ]"
            >{{ slotProps.node.label }}</a
          >
        </template>
      </Tree>
    </nav>
  </div>
</template>

<style scoped></style>
