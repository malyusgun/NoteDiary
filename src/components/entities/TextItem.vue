<script setup lang="ts">
import type { IText } from '@/interfaces/entities';
import { useDataStore } from '@/stores/data';
import { useTextareaAutosize } from '@vueuse/core';
import { deleteEntity, editEntity } from '@/helpers';
import EditTextEntityMenu from '@/components/EditTextEntityMenu.vue';

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const addTitle = () => {
  editEntity({ ...entityData.value, title: 'Title' }, entityData.value.uuid);
  entityData.value = { ...entityData.value, title: 'Title' };
};

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title }, entityData.value.uuid);
};

const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text }, entityData.value.uuid);
};

const removeTitle = () => {
  const newState = { ...entityData.value };
  delete newState.title;
  editEntity({ ...newState }, entityData.value.uuid);
  entityData.value = newState;
};

const { textarea, triggerResize } = useTextareaAutosize();
</script>

<template>
  <div class="entityContainer relative">
    <input
      ref="input"
      v-if="entityData.title || entityData.title === ''"
      type="text"
      v-model="entityData.title"
      @change="editTitle"
      placeholder="Enter title..."
      class="w-full mb-2 font-bold text-2xl pl-2"
    />
    <textarea
      ref="textarea"
      v-model="entityData.text"
      class="w-full indent-5 resize-none pl-4 -ml-4 border-0 border-l-4 border-solid border-l-blue-400"
      @change="editText"
      @input="triggerResize"
      placeholder="Enter text..."
    />
    <div class="speedDial absolute top-0 left-2 z-50 transition-all select-none">
      <EditTextEntityMenu
        :entityData="entityData"
        @deleteEntity="deleteEntity"
        @addTitle="addTitle"
        @removeTitle="removeTitle"
      />
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
