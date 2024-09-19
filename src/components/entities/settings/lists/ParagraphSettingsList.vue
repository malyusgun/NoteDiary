<script setup lang="ts">
import type { TTheme } from '@/app/interfaces/environment';
import { useVModels } from '@vueuse/core';
import type { IParagraph } from '@/app/interfaces/entities';

interface Props {
  newEntityData: IParagraph;
  isTitle: boolean;
  isEntityWidthFull: boolean;
  themeColor: TTheme;
  entityPositionOptions: {
    label: string;
    value: number;
  }[];
  entityTitlePositionOptions: {
    label: string;
    value: number;
  }[];
}
const props = defineProps<Props>();
const emit = defineEmits(['update:newEntityData', 'update:isTitle', 'update:isEntityWidthFull']);
const { newEntityData, isTitle, isEntityWidthFull } = useVModels(props, emit);
</script>

<template>
  <ul class="flex gap-8 h-full" style="min-width: 35%">
    <li class="flex flex-col items-center gap-4" style="min-width: 150px">
      <div>
        <p class="py-2 text-center">Title</p>
        <div class="flex items-center">
          Off
          <ToggleSwitch v-model:isActive="isTitle" class="mx-2" :theme="themeColor" />
          On
        </div>
      </div>
      <div style="height: 108px" class="flex gap-8 items-center justify-between col-span-2">
        <Transition name="fading">
          <div v-show="isTitle" class="flex flex-col items-center">
            <p class="py-2 text-center">Title position</p>
            <Slider
              v-model:value="newEntityData.entity_title_position"
              :theme="themeColor"
              width="150"
              size="small"
              isSmooth="true"
              backgroundColor="white"
              min="0"
              max="2"
              step="1"
              :options="entityTitlePositionOptions"
            />
          </div>
        </Transition>
      </div>
    </li>
    <li class="flex flex-col items-center gap-4" style="min-width: 150px">
      <div>
        <p class="py-2 text-center">Paragraph width</p>
        <div class="flex items-center">
          Half
          <ToggleSwitch
            v-model:isActive="isEntityWidthFull"
            class="mx-2"
            :theme="themeColor"
            :negativeTheme="themeColor"
          />
          Full
        </div>
      </div>
      <div style="height: 108px" class="flex gap-8 items-center justify-between col-span-2">
        <Transition name="fading">
          <div v-show="!isEntityWidthFull" class="flex flex-col items-center">
            <p class="py-2">Paragraph position</p>
            <Slider
              v-model:value="newEntityData.entity_position"
              :theme="themeColor"
              width="150"
              size="small"
              isSmooth="true"
              backgroundColor="white"
              min="0"
              max="2"
              step="1"
              :options="entityPositionOptions"
            />
          </div>
        </Transition>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
