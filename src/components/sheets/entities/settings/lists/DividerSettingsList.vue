<script setup lang="ts">
import SelectButton from '@d.malygin/UI_storybook/components/SelectButton';
import type { TTheme } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IDivider } from '@/app/interfaces/entities';
import {
  entityHeightOptions,
  entityTypeOptions
} from '@/components/sheets/entities/settings/lists/constants/options';

interface Props {
  newEntityData: IDivider;
  themeColor: TTheme;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:newEntityData', 'update:isTitle', 'update:isEntityWidthFull']);
const newEntityData = useVModel(props, 'newEntityData', emit);
</script>

<template>
  <ul class="flex justify-center gap-8 h-full">
    <li class="flex flex-col items-center" style="min-width: 150px; min-height: 100px">
      <p class="py-2 text-center">Type</p>
      <div class="flex items-center">
        <SelectButton
          v-model:value="newEntityData.divider_type"
          :theme="themeColor"
          :options="entityTypeOptions"
          rounded
        />
      </div>
    </li>
    <li class="flex flex-col items-center" style="min-width: 150px; min-height: 100px">
      <p class="py-2 text-center">Height</p>
      <div class="flex items-center">
        <SelectButton
          v-model:value="newEntityData.divider_height"
          :theme="themeColor"
          :options="entityHeightOptions"
          rounded
        />
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
