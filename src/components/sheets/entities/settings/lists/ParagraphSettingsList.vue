<script setup lang="ts">
import type { TTheme } from '@/app/interfaces/environment';
import { useVModels } from '@vueuse/core';
import type { IParagraph } from '@/app/interfaces/entities';
import {
  entityIsTitleOptions,
  entityPositionOptions,
  entityTitlePositionOptions,
  isEntityWidthFullOptions
} from '@/components/sheets/entities/settings/lists/constants/options';

interface Props {
  newEntityData: IParagraph;
  isTitle: boolean;
  isEntityWidthFull: boolean;
  themeColor: TTheme;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:newEntityData', 'update:isTitle', 'update:isEntityWidthFull']);
const { newEntityData, isTitle, isEntityWidthFull } = useVModels(props, emit);
</script>

<template>
  <ul class="flex gap-2 h-full">
    <li class="flex flex-col items-center gap-4" style="min-width: 150px; min-height: 193px">
      <div>
        <p class="py-2 text-center">Title</p>
        <div class="flex items-center">
          <ToggleButton
            v-model:value="isTitle"
            :theme="themeColor"
            :options="entityIsTitleOptions"
            rounded="true"
            :border="themeColor"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <Transition name="fading">
          <div v-show="isTitle" class="flex flex-col items-center">
            <p class="py-2 text-center">Title position</p>
            <ToggleButton
              v-model:value="newEntityData.entity_title_position"
              :theme="themeColor"
              :options="entityTitlePositionOptions"
              rounded="true"
              size="small"
              :border="themeColor"
            >
              <template #1Icon><AlignLeftIcon /></template>
              <template #2Icon><AlignCenterIcon /></template>
              <template #3Icon><AlignRightIcon /></template>
            </ToggleButton>
          </div>
        </Transition>
      </div>
    </li>
    <li class="flex flex-col items-center gap-4" style="min-width: 150px; min-height: 193px">
      <div>
        <div class="flex flex-col items-center">
          <p class="py-2 text-center">Paragraph width</p>
          <ToggleButton
            v-model:value="isEntityWidthFull"
            :theme="themeColor"
            :options="isEntityWidthFullOptions"
            rounded="true"
            :border="themeColor"
          />
        </div>
      </div>
      <div class="flex gap-8 items-center justify-between">
        <Transition name="fading">
          <div v-show="!isEntityWidthFull" class="flex flex-col items-center">
            <p class="py-2">Paragraph position</p>
            <ToggleButton
              v-model:value="newEntityData.entity_position"
              :theme="themeColor"
              :options="entityPositionOptions"
              rounded="true"
              size="small"
              :border="themeColor"
              ><template #1Icon><AlignLeftIcon /></template>
              <template #2Icon><AlignCenterIcon /></template>
              <template #3Icon><AlignRightIcon /></template>
            </ToggleButton>
          </div>
        </Transition>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
