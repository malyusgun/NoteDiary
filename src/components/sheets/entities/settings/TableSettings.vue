<script setup lang="ts">
import Table from '@d.malygin/UI_storybook/components/Table';
import Button from '@d.malygin/UI_storybook/components/Button';
import type { ITable } from '@/app/interfaces/entities';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';
import { convertThemeToColorWhiteDefault } from '@/app/helpers';
import { deleteEntity } from '@/app/helpers/entities';
import SettingsIcon from '@d.malygin/UI_storybook/icons/Mono/Settings';
import Modal from '@d.malygin/UI_storybook/components/Modal';

interface Props {
  entityData: ITable;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges']);

const prevEntityData = computed(() => props.entityData);
const newEntityData = ref({ ...props.entityData });
const isModal = ref<boolean>(false);
const isModalToDeleteTable = ref<boolean>(false);

const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);
const isTitle = ref(!!newEntityData.value.title);

const openSettings = () => {
  isModal.value = true;
  newEntityData.value = { ...prevEntityData.value };
};
const saveChanges = () => {
  if (isTitle.value !== !!prevEntityData.value.title) {
    if (isTitle.value) {
      newEntityData.value.title = 'Title';
    } else {
      newEntityData.value.title = null;
    }
  }
  if (JSON.stringify(prevEntityData.value) !== JSON.stringify(newEntityData.value)) {
    emit('saveChanges', newEntityData.value);
  }
  isModal.value = false;
};
const toggleConfirmDeleteTable = () => {
  isModalToDeleteTable.value = !isModalToDeleteTable.value;
};
const deleteTable = async () => {
  await deleteEntity(prevEntityData.value.entity_uuid);
  isModalToDeleteTable.value = false;
  isModal.value = false;
};
const onCloseModal = () => {
  setTimeout(() => {
    newEntityData.value = { ...prevEntityData.value };
    isTitle.value = !!prevEntityData.value.title;
  }, 300);
};
</script>

<template>
  <button
    :style="`background-color: ${themeColorConverted}`"
    class="settings absolute left-2 top-0 transition-all select-none size-10 flex justify-center items-center rounded-full hover:brightness-75 cursor-pointer"
    @click.prevent="openSettings"
  >
    <SettingsIcon color="white" size="25" />
  </button>
  <Modal
    v-model:visible="isModal"
    theme="black"
    width="90%"
    height="max-content"
    @onClose="onCloseModal"
    ><template #header><h3 class="w-max mx-auto">Edit Table</h3></template>
    <DeleteEntityConfirmModal
      v-model:isModalToDeleteEntity="isModalToDeleteTable"
      @deleteEntity="deleteTable"
      @toggleConfirmDeleteEntityModal="toggleConfirmDeleteTable"
    />
    <div class="p-10 flex gap-16 items-center">
      <section
        :style="`border-color: var(--${themeColor}-200); height: 320px`"
        class="grow flex flex-col gap-4 p-4 min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
      >
        <div :style="`justify-content: ${newEntityData.entity_position};`" class="flex">
          <div
            v-show="isTitle"
            :style="`border-color: var(--${themeColor}-800); justify-content: ${newEntityData.entity_title_position}`"
            class="flex text-2xl font-bold text-center px-2 py-4 border-2 border-dashed rounded-2xl"
          >
            <h3 class="w-2/3 overflow-ellipsis overflow-hidden whitespace-nowrap">
              {{ newEntityData.title ?? 'Title' }}
            </h3>
          </div>
        </div>
        <div :style="`justify-content: ${newEntityData.entity_position}`" class="grow flex">
          <Table
            :data="newEntityData.table_data"
            :columns="newEntityData.table_columns"
            :multipleSort="newEntityData.multipleSort"
            :gap="newEntityData.gap"
            :size="newEntityData.size"
            :showAllLines="newEntityData.showAllLines"
            :stripedRows="newEntityData.stripedRows"
            :center="newEntityData.center"
            :fontSize="newEntityData.fontSize"
            :theme="newEntityData.theme"
            :textColor="newEntityData.textColor"
            :darknessTheme="newEntityData.darknessTheme"
            :darknessTextColor="newEntityData.darknessTextColor"
            :paginator="newEntityData.paginator"
            :editable="false"
          />
        </div>
      </section>
      <EntitySettingsModalHeader
        :newEntityData="newEntityData"
        :themeColor="themeColor"
        @saveChanges="saveChanges"
        @toggleConfirmDeleteImageModal="toggleConfirmDeleteTable"
      />
    </div>
  </Modal>
</template>

<style scoped></style>
