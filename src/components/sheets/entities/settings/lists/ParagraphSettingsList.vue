<script setup lang="ts">
import AlignLeftIcon from '@d.malygin/UI_storybook/icons/Mono/AlignLeft';
import AlignCenterIcon from '@d.malygin/UI_storybook/icons/Mono/AlignCenter';
import AlignRightIcon from '@d.malygin/UI_storybook/icons/Mono/AlignRight';
import SelectButton from '@d.malygin/UI_storybook/components/SelectButton';
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
          <SelectButton
            v-model="isTitle"
            :theme="themeColor"
            activeBackgroundColor="white"
            :options="entityIsTitleOptions"
            rounded
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <Transition name="fading">
          <div v-show="isTitle" class="flex flex-col items-center">
            <p class="py-2 text-center">Title position</p>
            <SelectButton
              v-model="newEntityData.entity_title_position"
              :theme="themeColor"
              :options="entityTitlePositionOptions"
              activeBackgroundColor="white"
              size="small"
              rounded
            >
              <template #1Icon><AlignLeftIcon /></template>
              <template #2Icon><AlignCenterIcon /></template>
              <template #3Icon><AlignRightIcon /></template>
            </SelectButton>
          </div>
        </Transition>
      </div>
    </li>
    <li class="flex flex-col items-center gap-4" style="min-width: 150px; min-height: 193px">
      <div>
        <div class="flex flex-col items-center">
          <p class="py-2 text-center">Paragraph width</p>
          <SelectButton
            v-model="isEntityWidthFull"
            :theme="themeColor"
            activeBackgroundColor="white"
            :options="isEntityWidthFullOptions"
            rounded
          />
        </div>
      </div>
      <div class="flex gap-8 items-center justify-between">
        <Transition name="fading">
          <div v-show="!isEntityWidthFull" class="flex flex-col items-center">
            <p class="py-2">Paragraph position</p>
            <SelectButton
              v-model="newEntityData.entity_position"
              :theme="themeColor"
              activeBackgroundColor="white"
              :options="entityPositionOptions"
              size="small"
              rounded
              ><template #1Icon><AlignLeftIcon /></template>
              <template #2Icon><AlignCenterIcon /></template>
              <template #3Icon><AlignRightIcon /></template>
            </SelectButton>
          </div>
        </Transition>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
