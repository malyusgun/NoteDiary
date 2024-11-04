<script setup lang="ts">
import type { IEntity } from '@/app/interfaces/environment';
import { useVModel } from '@vueuse/core';
import type { TThemeColor } from '@/shared/ui/interfaces';

interface Props {
  newEntityData: IEntity;
  themeColor: string;
}
const props = defineProps<Props>();
const emit = defineEmits([
  'saveChanges',
  'toggleConfirmDeleteImageModal',
  'openCropImageModal',
  'update:newEntityData'
]);
const newEntityData = useVModel(props, 'newEntityData', emit);

const returnOriginalSize = () => {
  const newState = { ...newEntityData.value };
  newState.image_url = newState.image_url_initial;
  newState.file_width = newState.file_width_initial;
  newState.file_height = newState.file_height_initial;
  newState.image_width = newState.image_width_initial;
  newState.image_scale = 'x1';
  newEntityData.value = { ...newState };
};
</script>

<template>
  <div class="absolute flex gap-4 top-4 left-4 z-10 hover:brightness-80 transition-all">
    <Button
      label="Save"
      textColor="white"
      :theme="themeColor as TThemeColor"
      textStyle="bold"
      size="medium"
      @click.prevent="$emit('saveChanges')"
    >
      <template #icon>
        <SaveIcon color="white" size="25" />
      </template>
    </Button>
    <!--    <Button-->
    <!--      v-if="newEntityData.file_width > 200 || newEntityData.file_height > 200"-->
    <!--      label="Crop image"-->
    <!--      textColor="black"-->
    <!--      theme="white"-->
    <!--      textStyle="bold"-->
    <!--      size="medium"-->
    <!--      @click.prevent="$emit('openCropImageModal')"-->
    <!--    >-->
    <!--      <template #icon>-->
    <!--        <CropIcon color="black" size="25" />-->
    <!--      </template>-->
    <!--    </Button>-->
  </div>
  <div class="absolute flex gap-4 top-4 right-16 z-10 hover:brightness-80 transition-all">
    <!--    <Button-->
    <!--      v-if="newEntityData.file_width"-->
    <!--      v-show="-->
    <!--        newEntityData.file_width !== newEntityData.file_width_initial ||-->
    <!--        newEntityData.file_height !== newEntityData.file_height_initial-->
    <!--      "-->
    <!--      label="Original size"-->
    <!--      textColor="white"-->
    <!--      :theme="themeColor"-->
    <!--      textStyle="bold"-->
    <!--      size="medium"-->
    <!--      @click.prevent="returnOriginalSize"-->
    <!--    >-->
    <!--      <template #icon>-->
    <!--        <TrashIcon color="white" size="25" />-->
    <!--      </template>-->
    <!--    </Button>-->
    <Button
      label="Delete"
      textColor="white"
      theme="red"
      textStyle="bold"
      size="medium"
      @click.prevent="$emit('toggleConfirmDeleteImageModal')"
    >
      <template #icon>
        <TrashIcon color="white" size="25" />
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
