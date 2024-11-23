<script setup lang="ts">
import PlusCircleIcon from '@/shared/icons/PlusCircleIcon.vue';
import { useVModel } from '@vueuse/core';
import type { TTheme } from '@/app/interfaces/environment';
import { createSheet, deleteSheet, replaceSheet } from '@/app/helpers/sheets';
import { useDataStore } from '@/app/stores/data';

interface Props {
  modalMode: 'add' | 'edit' | 'delete';
  isModal: boolean;
  themeColor: TTheme;
}
const props = defineProps<Props>();
const emit = defineEmits(['isModal', 'update:isModal']);
const isModal = useVModel(props, 'isModal', emit);
const isParent = ref<boolean>(false);
const sheetName = ref<string>('');
const parent = ref<string>('');
const sheetError = ref<string>('');
const parentError = ref<string>('');

const sheets = computed(() => useDataStore().sheetsData);

watch([isParent, sheetName, parent], () => {
  sheetError.value = '';
  parentError.value = '';
});
const submitModal = () => {
  if (sheetName.value === '') {
    sheetError.value = 'Введите название страницы';
    return;
  }
  if (
    props.modalMode === 'add' &&
    sheets.value.find((sheet) => sheet.sheet_title === sheetName.value)
  ) {
    sheetError.value = 'Страница с таким названием уже существует';
    return;
  }
  if (isParent.value && parent.value === '') {
    parentError.value = 'Введите название родительской страницы';
    return;
  }
  if (isParent.value && !sheets.value.find((sheet) => parent.value === sheet.sheet_title)) {
    parentError.value = 'Введённой в качестве родителя страницы не существует';
    return;
  }
  if (props.modalMode === 'add') {
    createSheet(sheetName.value, parent.value);
    isModal.value = false;
    return;
  }
  if (props.modalMode === 'edit') {
    replaceSheet(sheetName.value, isParent ? parent.value : null);
    isModal.value = false;
    return;
  }
  deleteSheet(sheetName.value);
  isModal.value = false;
};
</script>

<template>
  <Modal v-model:isVisible="isModal" theme="black">
    <template #header
      ><h2 v-show="modalMode === 'add'">Добавить страницу</h2>
      <h2 v-show="modalMode === 'edit'">Переместить страницу</h2>
      <h2 v-show="modalMode === 'delete'">Удалить страницу</h2></template
    >
    <Divider class="mb-2" />
    <article class="p-2 relative">
      <p class="h-8 mb-2 flex gap-12 items-start justify-between">
        Название:
        <input
          v-model="sheetName"
          class="px-1 border-2 border-white border-solid rounded-md"
          type="text"
        />
      </p>
      <section v-show="modalMode !== 'delete'">
        <div class="h-6 mb-2 flex items-end justify-between">
          <p>
            <span>Родитель:</span>
            <input v-model="isParent" type="checkbox" class="ml-2 size-6 align-text-bottom" />
          </p>
          <transition name="fastFading" mode="out-in">
            <input
              v-show="isParent"
              v-model="parent"
              class="ml-2 px-1 border-2 border-white border-solid rounded-md"
              type="text"
            />
          </transition>
        </div>
      </section>
      <section class="mt-4">
        <Button
          class="ml-auto"
          border="white"
          :theme="themeColor"
          textColor="white"
          size="small"
          :label="modalMode === 'add' ? 'Добавить' : modalMode === 'edit' ? 'Изменить' : 'Удалить'"
          @click.prevent="submitModal"
        >
          <PlusCircleIcon v-show="modalMode === 'add'" size="20" color="white" />
          <EditIcon v-show="modalMode === 'edit'" size="20" color="white" />
          <TrashIcon v-show="modalMode === 'delete'" size="20" color="white" />
        </Button>
      </section>
      <section class="absolute bottom-1 left-2 font-light">
        <p class="w-2/3 text-red-600">{{ sheetError }}</p>
        <p class="w-2/3 text-red-600">{{ parentError }}</p>
      </section>
    </article>
  </Modal>
</template>

<style scoped></style>
