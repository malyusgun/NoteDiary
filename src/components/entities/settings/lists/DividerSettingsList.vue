<script setup lang="ts">
import type { TTheme } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { IDivider } from '@/app/interfaces/entities';
import ToggleButton from '@/shared/ui/ToggleButton.vue';
import {
  entityHeightOptions,
  entityTypeOptions
} from '@/components/entities/settings/lists/constants/options';

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
        <ToggleButton
          v-model:value="newEntityData.divider_type"
          :theme="themeColor"
          :options="entityTypeOptions"
          rounded="true"
          :border="themeColor"
          :activeBGColor="themeColor"
        />
      </div>
    </li>
    <li class="flex flex-col items-center" style="min-width: 150px; min-height: 100px">
      <p class="py-2 text-center">Height</p>
      <div class="flex items-center">
        <ToggleButton
          v-model:value="newEntityData.divider_height"
          :theme="themeColor"
          :options="entityHeightOptions"
          rounded="true"
          :border="themeColor"
          :activeBGColor="themeColor"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
