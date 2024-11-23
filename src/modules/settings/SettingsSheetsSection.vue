<script setup lang="ts">
import type { TTheme } from '@/app/interfaces/environment';
import { useDataStore } from '@/app/stores/data';
import { useVModel } from '@vueuse/core';
import { convertSheetsForTree } from '@/app/helpers/sheets';

interface Props {
  modalMode: 'add' | 'edit' | 'delete';
  isModal: boolean;
  themeColor: TTheme;
}

const props = defineProps<Props>();
const emit = defineEmits(['isModal', 'update:isModal', 'setModalMode']);
const isModal = useVModel(props, 'isModal', emit);

const treeMaxWidth = 600;
const sheets = computed(() => convertSheetsForTree(useDataStore().sheetsData));

const openModal = (mode: 'add' | 'edit' | 'delete') => {
  isModal.value = true;
  emit('setModalMode', mode);
};
</script>

<template>
  <div>
    <h2 class="my-4 ml-8 w-max text-3xl">Страницы</h2>
    <article class="ml-4 flex gap-16">
      <Tree
        v-if="sheets.length"
        :expand="true"
        theme="black"
        :items="sheets"
        :maxWidth="treeMaxWidth"
        class="mb-5"
      ></Tree>
      <section>
        <Button
          class="mb-4"
          border="white"
          :theme="themeColor"
          textColor="white"
          size="small"
          label="Добавить"
          width="140"
          @click.prevent="openModal('add')"
        >
          <PageAddIcon color="white" size="30" />
        </Button>
        <Button
          class="mb-4"
          border="white"
          :theme="themeColor"
          textColor="white"
          size="small"
          label="Изменить"
          width="140"
          @click.prevent="openModal('edit')"
        >
          <PageEditIcon color="white" size="30" />
        </Button>
        <Button
          border="white"
          :theme="themeColor"
          textColor="white"
          size="small"
          label="Удалить"
          width="140"
          @click.prevent="openModal('delete')"
        >
          <PageDeleteIcon color="white" size="30" />
        </Button>
      </section>
    </article>
  </div>
</template>

<style scoped></style>
