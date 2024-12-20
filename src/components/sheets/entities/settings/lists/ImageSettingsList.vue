<script setup lang="ts">
import type { TTheme } from '@/app/interfaces/environment';
import { useVModels } from '@vueuse/core';
import type { IImage } from '@/app/interfaces/entities';
import {
  imageScaleOptions,
  entityIsTitleOptions,
  entityIsTextOptions,
  entityPositionOptions,
  entityTitlePositionOptions,
  entityTextPositionOptions,
  isEntityWidthFullOptions
} from '@/components/sheets/entities/settings/lists/constants/options';
import { filterImageScaleOptions, scaleImage } from '@/app/helpers/images';

interface Props {
  newEntityData: IImage;
  isTitle: boolean;
  isText: boolean;
  isEntityWidthFull: boolean;
  themeColor: TTheme;
}
const props = defineProps<Props>();
const emit = defineEmits([
  'update:newEntityData',
  'update:isTitle',
  'update:isText',
  'update:isEntityWidthFull'
]);
const { newEntityData, isTitle, isText, isEntityWidthFull } = useVModels(props, emit);
const scales = ref(imageScaleOptions);
scales.value = filterImageScaleOptions(newEntityData.value, isText.value, isEntityWidthFull.value);
watch([isText, isEntityWidthFull], () => {
  scales.value = filterImageScaleOptions(
    newEntityData.value,
    isText.value,
    isEntityWidthFull.value
  );
});
watch(
  () => newEntityData.value.image_scale,
  (cur, prev) => {
    newEntityData.value = scaleImage(newEntityData.value, prev);
  }
);
</script>

<template>
  <div>
    <div class="flex flex-col items-center" style="min-width: 30%; min-height: 100px">
      <p class="py-2">Image size</p>
      <Slider
        v-model:value="newEntityData.image_scale"
        width="300px"
        size="small"
        :max="scales.length - 1"
        :options="scales"
        :isSmooth="true"
        backgroundColor="white"
        :theme="themeColor"
      />
    </div>
    <ul class="flex gap-2 h-full" style="min-width: 35%">
      <li class="flex flex-col items-center justify-between gap-4" style="min-width: 150px">
        <div>
          <p class="py-2 text-center">Title</p>
          <ToggleButton
            v-model:value="isTitle"
            :theme="themeColor"
            :options="entityIsTitleOptions"
            rounded="true"
            :border="themeColor"
          />
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between col-span-2">
          <Transition name="fading">
            <div v-show="isTitle" class="flex flex-col items-center">
              <p class="py-2 text-center">Title position</p>
              <ToggleButton
                v-model:value="newEntityData.entity_title_position"
                :theme="themeColor"
                :options="entityTitlePositionOptions"
                rounded="true"
                :border="themeColor"
              >
                <template #1Icon><AlignLeftIcon /></template>
                <template #2Icon><AlignCenterIcon /></template>
                <template #3Icon><AlignRightIcon /></template
              ></ToggleButton>
            </div>
          </Transition>
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between col-span-2">
          <Transition name="fading">
            <div v-show="isText" class="flex flex-col items-center">
              <p class="py-2">Text position</p>
              <ToggleButton
                v-model:value="newEntityData.text_position"
                :theme="themeColor"
                :options="entityTextPositionOptions"
                rounded="true"
                :border="themeColor"
              />
            </div>
          </Transition>
        </div>
      </li>
      <li class="flex flex-col items-center justify-between gap-4" style="min-width: 150px">
        <div style="height: 108px">
          <Transition name="fading">
            <div v-show="newEntityData.image_width <= 75" class="flex flex-col items-center">
              <p class="py-2 text-center">Text</p>
              <div class="flex items-center">
                <ToggleButton
                  v-model:value="isText"
                  :theme="themeColor"
                  :options="entityIsTextOptions"
                  rounded="true"
                  :border="themeColor"
                />
              </div>
            </div>
          </Transition>
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between">
          <Transition name="fading">
            <div v-show="!(isText && isEntityWidthFull)" class="flex flex-col items-center">
              <p class="py-2 text-center">Block position</p>
              <ToggleButton
                v-model:value="newEntityData.entity_position"
                :theme="themeColor"
                :options="entityPositionOptions"
                rounded="true"
                :border="themeColor"
                ><template #1Icon><AlignLeftIcon /></template>
                <template #2Icon><AlignCenterIcon /></template>
                <template #3Icon><AlignRightIcon /></template
              ></ToggleButton>
            </div>
          </Transition>
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between">
          <Transition name="fading">
            <div
              v-show="isText && newEntityData.image_width <= 50"
              class="flex flex-col items-center"
            >
              <p class="py-2">Text width</p>
              <ToggleButton
                v-model:value="isEntityWidthFull"
                :theme="themeColor"
                :options="isEntityWidthFullOptions"
                rounded="true"
                :border="themeColor"
              />
            </div>
          </Transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
