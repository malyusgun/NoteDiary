<script setup lang="ts">
import Divider from '@d.malygin/UI_storybook/components/Divider';
import Button from '@d.malygin/UI_storybook/components/Button';
import ArrowLeftIcon from '@d.malygin/UI_storybook/icons/Mono/ArrowLeft';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';
import { goBack } from '@/app/router';
import ChangeSheetsModal from '@/modules/settings/ChangeSheetsModal.vue';
import SettingsSheetsSection from '@/modules/settings/SettingsSheetsSection.vue';
import { getUser } from '@/app/helpers';

const isModal = ref<boolean>(false);
const modalMode = ref<'add' | 'edit' | 'delete'>('add');

const themeColor: TTheme = cookies.get('favorite_color');
const setModalMode = (mode: 'add' | 'edit' | 'delete') => {
  modalMode.value = mode;
};

onMounted(async () => {
  await getUser();
});
</script>

<template>
  <div class="w-full min-h-screen bg-black">
    <ChangeSheetsModal v-model:isModal="isModal" :modalMode="modalMode" :themeColor="themeColor" />
    <header class="relative">
      <Button
        label="Вернуться"
        :theme="themeColor"
        textColor="white"
        size="small"
        class="absolute top-4 left-4"
        @click.prevent="goBack"
      >
        <ArrowLeftIcon size="20" color="white" />
      </Button>
      <h1 class="my-6 mx-auto w-max text-5xl">Настройки</h1>
      <Divider darknessColor="100" />
    </header>
    <main class="min-h-screen">
      <SettingsSheetsSection
        v-model:isModal="isModal"
        :modalMode="modalMode"
        :themeColor="themeColor"
        @setModalMode="setModalMode"
      />
    </main>
  </div>
</template>

<style scoped></style>
