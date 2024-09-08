<script setup lang="ts">
import { useDataStore } from '@/app/stores/data';

const route = useRoute();
const dataStore = useDataStore();
const emit = defineEmits(['closeMenu']);

const sheets = ref();
const expandedKeys = ref({});

const expandSheet = (sheet) => {
  if (sheet.children && sheet.children.length) {
    expandedKeys.value[sheet.key] = true;

    for (let child of sheet.children) {
      expandSheet(child);
    }
  }
};
const expandAll = () => {
  for (let sheet of sheets.value) {
    expandSheet(sheet);
  }
  expandedKeys.value = { ...expandedKeys.value };
};

onMounted(() => {
  sheets.value = dataStore.sheets;
  expandAll();
});
</script>

<template>
  <div class="flex flex-col h-full p-4">
    <MenuHeader @closeMenu="emit('closeMenu')" />
    <BaseDivider />
    <nav>
      <h3 class="text-xl">Menu</h3>
      <div style="margin-left: 58px" class="mt-4 -mb-2 select-none font-bold">
        <a v-if="route.path !== '/'" href="/"
          ><i class="pi pi-home text-gray-400 pr-2"></i>Главное меню</a
        >
        <span v-else><i class="pi pi-home text-gray-400 pr-2"></i>Главное меню</span>
      </div>
      <Tree
        v-model:expandedKeys="expandedKeys"
        :value="sheets"
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
