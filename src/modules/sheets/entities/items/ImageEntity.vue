<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers/entities';
import { sendReturnOriginalSize } from '@/app/helpers/images';
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
const entitiesLength = computed(() => entities.value.length);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);

const textContainerWidth = computed(() => {
  if (entityData.value?.paragraph_size === 'half') return (100 - entityData.value.image_width) / 2;
  return 100 - entityData.value.image_width;
});
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
};
</script>

<template>
  <article
    :class="[
      'entityContainer relative flex px-16 transition-all',
      {
        'justify-start': entityData.entity_position === 'left',
        'justify-center': entityData.entity_position === 'center',
        'justify-end': entityData.entity_position === 'right'
      }
    ]"
  >
    <section
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
      />
      <ImageEntityImageWithText
        :entityData="entityData"
        :textContainerWidth="textContainerWidth"
        :isEditMode="isEditMode"
      />
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
    </section>
  </article>
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
