<script setup lang="ts">
import Slider from '@d.malygin/UI_storybook/components/Slider';
import SelectButton from '@d.malygin/UI_storybook/components/SelectButton';
import AlignLeftIcon from '@d.malygin/UI_storybook/icons/Mono/AlignLeft';
import AlignCenterIcon from '@d.malygin/UI_storybook/icons/Mono/AlignCenter';
import AlignRightIcon from '@d.malygin/UI_storybook/icons/Mono/AlignRight';
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
        v-model="newEntityData.image_scale"
        width="300px"
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
          <SelectButton
            v-model="isTitle"
            :theme="themeColor"
            :options="entityIsTitleOptions"
            activeBackgroundColor="white"
            rounded
          />
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between col-span-2">
          <Transition name="fading">
            <div v-show="isTitle" class="flex flex-col items-center">
              <p class="py-2 text-center">Title position</p>
              <SelectButton
                v-model="newEntityData.entity_title_position"
                :theme="themeColor"
                :options="entityTitlePositionOptions"
                activeBackgroundColor="white"
                rounded
              >
                <template #1Icon><AlignLeftIcon /></template>
                <template #2Icon><AlignCenterIcon /></template>
                <template #3Icon><AlignRightIcon /></template
              ></SelectButton>
            </div>
          </Transition>
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between col-span-2">
          <Transition name="fading">
            <div v-show="isText" class="flex flex-col items-center">
              <p class="py-2">Text position</p>
              <SelectButton
                v-model="newEntityData.text_position"
                :theme="themeColor"
                :options="entityTextPositionOptions"
                activeBackgroundColor="white"
                rounded
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
                <SelectButton
                  v-model="isText"
                  :theme="themeColor"
                  :options="entityIsTextOptions"
                  activeBackgroundColor="white"
                  rounded
                />
              </div>
            </div>
          </Transition>
        </div>
        <div style="height: 108px" class="flex gap-8 items-center justify-between">
          <Transition name="fading">
            <div v-show="!(isText && isEntityWidthFull)" class="flex flex-col items-center">
              <p class="py-2 text-center">Block position</p>
              <SelectButton
                v-model="newEntityData.entity_position"
                :theme="themeColor"
                :options="entityPositionOptions"
                activeBackgroundColor="white"
                rounded
                ><template #1Icon><AlignLeftIcon /></template>
                <template #2Icon><AlignCenterIcon /></template>
                <template #3Icon><AlignRightIcon /></template
              ></SelectButton>
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
              <SelectButton
                v-model="isEntityWidthFull"
                :theme="themeColor"
                :options="isEntityWidthFullOptions"
                activeBackgroundColor="white"
                rounded
              />
            </div>
          </Transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
