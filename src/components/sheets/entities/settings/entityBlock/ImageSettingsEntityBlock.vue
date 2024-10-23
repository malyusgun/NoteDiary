<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';

interface Props {
  newEntityData: IImage;
  isTitle: boolean;
  isText: boolean;
  isEntityWidthFull: boolean;
  themeColor: string;
  settingsListWidth: number;
}
const props = defineProps<Props>();
const dataStore = useDataStore();
const windowWidth = computed(() => dataStore.windowWidth);

const textContainerWidth = computed(() => {
  if (!props.isEntityWidthFull)
    return (
      (100 -
        props.newEntityData.image_width -
        1600 / (0.9 * windowWidth.value - 20 - 40 - 32 - props.settingsListWidth - 64)) /
      2
    );
  return (
    100 -
    props.newEntityData.image_width -
    1600 / (0.9 * windowWidth.value - 20 - 40 - 32 - props.settingsListWidth - 64)
  );
});
</script>

<template>
  <section
    :style="`border-color: var(--${themeColor}-200); align-items: ${
      newEntityData.entity_position === 'right'
        ? 'end'
        : newEntityData.entity_position === 'left'
          ? 'start'
          : newEntityData.entity_position
    }`"
    class="flex grow flex-col gap-4 p-4 w-full min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
  >
    <div
      v-show="isTitle"
      :style="`border-color: var(--${themeColor}-800);
            justify-content: ${newEntityData.entity_title_position}; width: ${isEntityWidthFull ? '100%' : '50%'};
            font-size: ${+newEntityData.font_size / 2 + 5}px`"
      class="flex text-2xl font-bold text-center px-2 py-4 border-2 border-dashed rounded-2xl"
    >
      <h3 class="w-max overflow-ellipsis overflow-hidden whitespace-nowrap">
        {{ newEntityData.title ?? 'Title' }}
      </h3>
    </div>
    <div
      :style="`gap: 16px; justify-content: ${
        newEntityData.entity_position === 'right'
          ? 'end'
          : newEntityData.entity_position === 'left'
            ? 'start'
            : 'center'
      };`"
      class="flex w-full"
    >
      <div
        :class="[
          'relative leading-none',
          {
            'order-3': newEntityData.text_position === 'left'
          }
        ]"
        :style="`width: ${newEntityData.image_width}%`"
      >
        <img
          :src="newEntityData?.image_url"
          :alt="`Image ${newEntityData?.title}` || 'Image'"
          style="max-height: 600px"
          class="object-contain order-1"
        />
      </div>
      <div
        v-show="isText"
        class="textContainer relative leading-none border-2 border-dashed rounded-2xl indent-5 order-2 p-1 overflow-hidden contain-inline-size text"
        :style="`border-color: var(--${themeColor}-400); width: ${textContainerWidth}%; font-size: ${+newEntityData.font_size / 2}px`"
      >
        {{ newEntityData.text ?? 'Text' }}
      </div>
    </div>
  </section>
</template>

<style scoped></style>
