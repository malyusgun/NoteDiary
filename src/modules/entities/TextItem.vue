<script setup lang="ts">
import type { IText } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';
import { useTextareaAutosize } from '@vueuse/core';
import { deleteEntity, editEntity } from '@/app/helpers';
import StateMenu from '@/components/editEntityMenu/TextStateMenu.vue';
import MoveMenu from '@/components/editEntityMenu/TextMoveMenu.vue';

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const addTitle = () => {
  editEntity({ ...entityData.value, title: 'Title' }, entityData.value.entity_uuid);
  entityData.value = { ...entityData.value, title: 'Title' };
};

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title }, entityData.value.entity_uuid);
};

const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text }, entityData.value.entity_uuid);
};

const removeTitle = () => {
  const newState = { ...entityData.value };
  newState.title = null;
  editEntity({ ...newState }, entityData.value.entity_uuid);
  entityData.value = newState;
};

const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' });

const dataStore = useDataStore();
const homeEntities = computed(() => dataStore.homeEntities);
</script>

<template>
  <div class="entityContainer relative py-8 px-16">
    <input
      ref="input"
      v-if="entityData.title || entityData.title === ''"
      type="text"
      v-model="entityData.title"
      @change="editTitle"
      placeholder="Enter title..."
      class="w-full mb-4 font-bold text-2xl pl-2"
    />
    <textarea
      ref="textarea"
      v-model="entityData.text"
      class="w-full indent-5 resize-none outline-0"
      @change="editText"
      @input="triggerResize"
      placeholder="Enter text..."
      rows="2"
    />
    <div class="speedDial absolute left-2 top-2 transition-all select-none">
      <StateMenu
        :entityData="entityData"
        @deleteEntity="deleteEntity"
        @addTitle="addTitle"
        @removeTitle="removeTitle"
      />
    </div>
    <div
      v-if="homeEntities.length > 1"
      class="speedDial absolute left-2 bottom-2 transition-all select-none"
    >
      <MoveMenu :entityData="entityData" />
    </div>
  </div>
</template>

<style scoped>
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}
.entityContainer > .speedDial {
  opacity: 0;
}
.entityContainer:hover > .speedDial {
  opacity: 100;
}
input::placeholder {
  font-weight: 400;
}
</style>
