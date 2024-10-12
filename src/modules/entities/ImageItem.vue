<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { editEntity, sendReturnOriginalSize } from '@/app/helpers';
import { sendCropImage } from '@/app/helpers/images';
import type { IEntity } from '@/app/interfaces/environment';
import { useDataStore } from '@/app/stores/data';
import { useVModel } from '@vueuse/core';

interface Props {
  entityData: IImage;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:entityData']);
const entityData = useVModel(props, 'entityData', emit);

const dataStore = useDataStore();
const entities = computed(() => dataStore.entities);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);
const entitiesLength = computed(() => entities.value.length);

const textContainerWidth = computed(() => {
  if (entityData.value?.paragraph_size === 'half') return (100 - entityData.value.image_width) / 2;
  return 100 - entityData.value.image_width;
});

let titleTimeout;
let textTimeout;
const editTitle = () => {
  clearTimeout(titleTimeout);
  titleTimeout = setTimeout(
    () => editEntity({ ...entityData.value, title: entityData.value.title }),
    600
  );
};
const editText = () => {
  clearTimeout(textTimeout);
  textTimeout = setTimeout(
    () => editEntity({ ...entityData.value, text: entityData.value.text }),
    600
  );
};
const saveChanges = (newState: IImage) => {
  editEntity(newState);
  entityData.value = newState;
};
const returnOriginalSize = () => {
  const newState = entityData.value;
  newState.file_width = newState.file_width_initial;
  newState.file_height = newState.file_height_initial;
  entityData.value = newState;
  sendReturnOriginalSize(newState);
  // entityData.value.image_url = newState.image_url_initial;
};
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
    <div
      :class="[
        {
          'w-1/2': entityData.paragraph_size === 'half',
          'w-full': entityData.paragraph_size === 'full'
        }
      ]"
    >
      <EntityTitle
        v-model:title="entityData.title"
        :entityData="entityData"
        :isEditMode="isEditMode"
        @editTitle="editTitle"
      />
      <div
        style="gap: 32px"
        :class="[
          'flex py-2',
          {
            'justify-start': entityData.entity_position === 'left',
            'justify-center': entityData.entity_position === 'center',
            'justify-end': entityData.entity_position === 'right'
          }
        ]"
      >
        <div
          :class="[
            'imageContainer relative leading-none',
            {
              'order-3': entityData.text_position === 'left'
            }
          ]"
          :style="`width: ${entityData.image_width}%`"
        >
          <img
            :src="entityData?.image_url"
            :alt="`Image ${entityData?.title}` || 'Image'"
            style="min-height: 100px; max-height: 1000px"
            class="object-contain order-1"
          />
        </div>
        <div
          v-show="entityData.text || entityData.text === ''"
          class="textContainer relative leading-none"
          :style="`width: ${textContainerWidth}%`"
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
            :style="`font-size: ${entityData.font_size}px`"
            spellcheck="false"
            @input="editText"
          />
        </div>
      </div>
      <ImageSettings
        v-if="isEditMode"
        :entityData="entityData"
        @saveChanges="saveChanges"
        @returnOriginalSize="returnOriginalSize"
      />
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
