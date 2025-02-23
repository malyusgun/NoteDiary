<script setup lang="ts">
import { useInterfaceStore } from '@/app/stores/interface';
import { setDefaultSheetBackground } from '@/app/helpers/images';

interface Props {
  isEditMode: boolean;
  isMenuVisible: boolean;
  backgroundUrl: string;
}
defineProps<Props>();
const emit = defineEmits(['uploadFile']);

const interfaceStore = useInterfaceStore();
const isDarkMode = computed(() => interfaceStore.isDarkMode);
const defaultBackgroundUrl = computed<string>(() => interfaceStore.defaultSheetBackground);
</script>

<template>
  <main
    id="sheetContainer"
    :class="[
      {
        'mr-[-10px] pr-[10px]': isMenuVisible
      }
    ]"
    :style="`background-color: ${isDarkMode ? 'black' : 'light'}`"
  >
    <article style="min-height: 200px" class="backgroundContainer relative">
      <img
        :src="backgroundUrl"
        alt="Background image"
        class="w-full pointer-events-none select-none"
      />
      <SheetBackgroundMenu
        v-show="isEditMode"
        :isBackgroundDefault="backgroundUrl !== defaultBackgroundUrl"
        @uploadFile="emit('uploadFile', $event)"
        @setDefaultBackground="setDefaultSheetBackground"
      />
    </article>
    <article>
      <Suspense>
        <div ref="entitiesContainer" class="w-full pt-4">
          <EntitiesList :isEditMode="isEditMode" />
        </div>
        <template #fallback><BaseLoader /></template
      ></Suspense>
    </article>
  </main>
</template>

<style scoped></style>
