<script setup lang="ts">
import Modal from '@d.malygin/UI_storybook/components/Modal';
import Divider from '@d.malygin/UI_storybook/components/Divider';
import Button from '@d.malygin/UI_storybook/components/Button';
import SaveIcon from '@d.malygin/UI_storybook/icons/Mono/Save';
import SettingsIcon from '@d.malygin/UI_storybook/icons/Mono/Settings';
import TrashIcon from '@d.malygin/UI_storybook/icons/Mono/Trash';
import { convertThemeToColorWhiteDefault } from '@/app/helpers';
import { deleteEntity } from '@/app/helpers/entities';
import type { IDivider } from '@/app/interfaces/entities';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';

interface Props {
  entityData: IDivider;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges']);

const prevEntityData = computed(() => props.entityData);
const newEntityData = ref({ ...props.entityData });
const isModal = ref<boolean>(false);
const isModalToDeleteDivider = ref<boolean>(false);

const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);

const openSettings = () => {
  isModal.value = true;
  newEntityData.value = { ...prevEntityData.value };
};
const saveChanges = () => {
  if (JSON.stringify(prevEntityData.value) !== JSON.stringify(newEntityData.value)) {
    emit('saveChanges', newEntityData.value);
  }
  isModal.value = false;
};
const toggleConfirmToDeleteDivider = () => {
  isModalToDeleteDivider.value = !isModalToDeleteDivider.value;
};
const deleteDivider = async () => {
  await deleteEntity(prevEntityData.value.entity_uuid);
  isModalToDeleteDivider.value = false;
  isModal.value = false;
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
  <Modal v-model:visible="isModal" theme="black" width="90%" height="max-content"
    ><template #header><h3 class="w-max mx-auto">Edit divider</h3></template>
    <Modal v-model:visible="isModalToDeleteDivider" theme="black" width="40%" headerAllowWrap
      ><template #header
        ><p class="font-bold pt-4 mb-4 text-center">
          Are you sure you want to delete this divider?
        </p></template
      >
      <div class="flex justify-between">
        <Button
          label="Yes, delete"
          theme="red"
          textColor="white"
          textStyle="bold"
          @click.prevent="deleteDivider"
        />
        <Button
          label="Cancel"
          theme="white"
          textColor="black"
          @click.prevent="toggleConfirmToDeleteDivider"
        /></div
    ></Modal>
    <div class="p-10 pt-4">
      <DividerSettingsList v-model:newEntityData="newEntityData" :themeColor="themeColor" />
      <section
        :style="`border-color: var(--${themeColor}-200); height: 32px`"
        class="mt-8 flex flex-col justify-center gap-4 p-8 min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
      >
        <Divider
          :type="newEntityData.divider_type"
          :height="newEntityData.divider_height"
          darknessColor="100"
        />
      </section>
      <div
        class="absolute top-4 right-16 z-10 hover:brightness-80 transition-all"
        @click.prevent="toggleConfirmToDeleteDivider"
      >
        <Button label="Delete" textColor="white" theme="red" textStyle="bold">
          <TrashIcon color="white" size="25" />
        </Button>
      </div>
      <div
        class="absolute top-4 left-4 z-10 hover:brightness-80 transition-all"
        @click.prevent="saveChanges"
      >
        <Button label="Save" textColor="white" :theme="themeColor" textStyle="bold">
          <SaveIcon color="white" size="25" />
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
