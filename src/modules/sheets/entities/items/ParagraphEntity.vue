<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core';
import type { IParagraph } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers/entities';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entityData: IParagraph;
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
  editEntity({ ...entityData.value, text: entityData.value.text });
};
const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' });
const editTextAndTriggerResize = () => {
  triggerResize();
  clearTimeout(textTimeout);
  textTimeout = setTimeout(() => editText(), 600);
};
const saveChanges = (newState: IParagraph) => {
  editEntity(newState);
  entityData.value = newState;
};
</script>

<template>
  <section
    :class="[
      'entityContainer relative flex px-16',
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
      <div class="relative leading-none">
        <textarea
          ref="textarea"
          v-model="entityData.text"
          :class="[
            'w-full indent-5 leading-normal resize-none outline-0',
            {
              'pointer-events-none': !`isEditMode`
            }
          ]"
          :style="`font-size: ${entityData.font_size}px;`"
          placeholder="Enter text..."
          rows="1"
          spellcheck="false"
          @input="editTextAndTriggerResize"
        />
      </div>
      <ParagraphSettings v-if="isEditMode" :entityData="entityData" @saveChanges="saveChanges" />
      <EntityPositionSettings
        v-if="isEditMode && entitiesLength > 1"
        :entityUuid="entityData.entity_uuid"
        :entityIndex="entityIndex"
        :entitiesLength="entitiesLength"
      />
    </div>
  </section>
</template>

<style>
.entityContainer .settings {
  opacity: 0;
}
.entityContainer:hover .settings {
  opacity: 100;
}
.entityContainer:hover .aggregateHigh {
  height: 140px;
}
.entityContainer:hover .aggregateMedium {
  height: 80px;
}
.entityContainer:hover .aggregateShort {
  height: 35px;
}
input::placeholder {
  font-weight: 400;
}
</style>
