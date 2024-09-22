<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import type { IImage } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers';
import { cropImage } from '@/app/helpers/images';
import type { IEntity } from '@/app/interfaces/environment';
import { useDataStore } from '@/app/stores/data';

interface Props {
  entityData: IImage;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const dataStore = useDataStore();
const entities = computed(() => dataStore.entities);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);
const entitiesLength = computed(() => entities.value.length);

const isModalCropImage = ref<boolean>(false);
const { width: windowWidth } = useWindowSize();

const textContainerWidth = computed(() => {
  if (entityData.value?.paragraph_size === 'half')
    return (windowWidth.value - 160 - entityData.value.image_width) / 2;
  return windowWidth.value - 160 - entityData.value.image_width;
});

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title });
};
const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text });
};
const saveChanges = (newState: IImage) => {
  editEntity(newState);
  entityData.value = newState;
};
const saveImage = async (newUrl: string, newWidth: number, newHeight: number) => {
  entityData.value.imageUrl = newUrl;
  entityData.value.image_width = newWidth;
  entityData.value.image_height = newHeight;
  await cropImage(newUrl, entityData.value);
  isModalCropImage.value = false;
};
const scaleImage = (scale: string) => {
  const initialWidth = Math.ceil(entityData.value.image_width / +entityData.value.image_scale);
  entityData.value.image_width = initialWidth * +scale;
  const initialHeight = Math.ceil(entityData.value.image_height / +entityData.value.image_scale);
  entityData.value.image_height = initialHeight * +scale;
  entityData.value.image_scale = scale;
  editEntity({ ...entityData.value });
};
const openCropImageModal = () => (isModalCropImage.value = true);
</script>

<template>
  <section
    :class="[
      'entityContainer relative flex px-16 transition-all',
      {
        'justify-start': entityData.entity_position === 'left',
        'justify-center': entityData.entity_position === 'center',
        'justify-end': entityData.entity_position === 'right'
      }
    ]"
  >
    <CropImageModal
      v-model:isVisible="isModalCropImage"
      v-model:imageInfo="entityData"
      @saveImage="saveImage"
    />
    <div class="flex flex-col">
      <EntityTitle
        v-model:title="entityData.title"
        :entityData="entityData"
        :isEditMode="isEditMode"
        @editTitle="editTitle"
      />
      <div style="gap: 32px" class="flex" :style="`height: ${entityData.image_height}px`">
        <div
          :class="[
            'imageContainer relative leading-none',
            {
              'order-3': entityData.text_position === 'left'
            }
          ]"
          :style="`width: ${entityData.image_width}px; height: ${entityData.image_height}px; min-width: 100px; min-height: 100px`"
        >
          <img
            :src="entityData?.imageUrl"
            :alt="`Image ${entityData?.title}` || 'Image'"
            :width="entityData.image_width"
            :height="entityData.image_height"
            style="min-height: 100px; max-height: 700px"
            class="object-contain order-1"
          />
        </div>
        <div
          v-show="entityData.text || entityData.text === ''"
          class="textContainer relative leading-none"
          :style="`width: ${textContainerWidth}px; height: ${entityData.image_height}px`"
        >
          <textarea
            ref="textarea"
            v-model="entityData.text"
            :class="[
              'w-full indent-5 leading-normal overflow-auto resize-none outline-0 order-2',
              {
                'pointer-events-none': !isEditMode
              }
            ]"
            placeholder="Enter text..."
            rows="7"
            :style="`font-size: ${entityData.font_size}px; height: ${entityData.image_height}px;`"
            spellcheck="false"
            @change="editText"
          />
        </div>
      </div>
      <ImageSettings v-if="isEditMode" :entityData="entityData" @saveChanges="saveChanges" />
      <EntityPositionSettings
        v-if="isEditMode && entitiesLength > 1"
        :entityUuid="entityData.entity_uuid"
        :entityIndex="entityIndex"
        :entitiesLength="entitiesLength"
      />
    </div>
  </section>
</template>

<style scoped>
.entityContainer:hover .aggregateHigh {
  height: 65px;
}
.entityContainer:hover .aggregateShort {
  height: 30px;
}
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
.imageContainer .speedDialSize {
  opacity: 0;
}
.imageContainer:hover .speedDialSize {
  opacity: 100;
}
input::placeholder {
  font-weight: 400;
}
</style>
