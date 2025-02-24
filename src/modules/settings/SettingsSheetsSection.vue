<script setup lang="ts">
import TreeList from '@d.malygin/UI_storybook/components/TreeList';
import DocumentAddIcon from '@d.malygin/UI_storybook/icons/Mono/DocumentAdd';
import DocumentDeleteIcon from '@d.malygin/UI_storybook/icons/Mono/DocumentDelete';
import DocumentEditIcon from '@d.malygin/UI_storybook/icons/Mono/DocumentEdit';
import Button from '@d.malygin/UI_storybook/components/Button';
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
      <TreeList
        v-if="sheets.length"
        :items="sheets"
        :maxWidth="treeMaxWidth"
        theme="black"
        expand
        class="mb-5"
      ></TreeList>
      <section>
        <Button
          class="mb-4 !flex"
          label="Добавить"
          :theme="themeColor"
          textColor="white"
          size="small"
          width="140"
          @click.prevent="openModal('add')"
        >
          <DocumentAddIcon color="white" size="30" />
        </Button>
        <Button
          class="mb-4 !flex"
          label="Изменить"
          :theme="themeColor"
          textColor="white"
          size="small"
          @click.prevent="openModal('edit')"
        >
          <DocumentEditIcon color="white" size="30" />
        </Button>
        <Button
          label="Удалить"
          :theme="themeColor"
          textColor="white"
          size="small"
          @click.prevent="openModal('delete')"
        >
          <DocumentDeleteIcon color="white" size="30" />
        </Button>
      </section>
    </article>
  </div>
</template>

<style scoped></style>
