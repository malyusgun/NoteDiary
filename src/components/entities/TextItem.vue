<script setup lang="ts">
import type { IText } from '@/interfaces/entities';
import type { IEntity } from '@/interfaces/environment';
import { useDataStore } from '@/stores/data';
import {useTextareaAutosize} from "@vueuse/core";

interface Props {
  entityData: IText;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const dataStore = useDataStore();

const editEntity = (newState: IEntity) => {
  let prevState = dataStore.homeEntities;
  prevState = prevState.map((entity: IEntity) => {
    if (entity.uuid !== entityData.value.uuid) return entity;
    return newState;
  });
  dataStore.editHomeEntities(prevState);
};

const addTitle = () => {
  editEntity({ ...entityData.value, title: 'Title' });
  entityData.value = { ...entityData.value, title: 'Title' };
};

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title });
};

const editText = () => {
  editEntity({ ...entityData.value, text: entityData.value.text });
};

const deleteEntity = () => {
  let prevState = dataStore.homeEntities;
  prevState = prevState.filter((entity: IEntity) => entity.uuid !== entityData.value.uuid);
  dataStore.editHomeEntities(prevState);
}
const { textarea, triggerResize  } = useTextareaAutosize();
</script>

<template>
  <div class="textContainer relative">
    <input ref="input" v-if="entityData?.title" type="text" v-model="entityData.title" @change="editTitle" @input="triggerResize" class="w-full mb-2 font-bold pl-2" />
    <textarea ref="textarea" v-model="entityData.text" class="w-full indent-5 resize-none pl-4 -ml-4 border-0 border-l-4 border-solid border-l-blue-400" @change="editText" @input="triggerResize" placeholder="Enter text..."/>
    <button
        v-if="!entityData.title"
        @click.prevent="addTitle"
        class="addTitleButton absolute top-0 left-4 bg-blue-500 py-0.5 px-2 rounded-md -translate-y-full border-2 border-solid border-black transition-all select-none"
    >
      Add title
    </button>
    <button
        @click.prevent="deleteEntity"
        class="deleteEntityButton absolute top-0 right-4 bg-blue-500 py-0.5 px-2 rounded-md -translate-y-full border-2 border-solid border-black transition-all select-none"
    >
      <i class="pi pi-trash pr-2"></i>Delete
    </button>
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
.textContainer > .addTitleButton,
.textContainer > .deleteEntityButton {
  opacity: 0;
}
.textContainer:hover > .addTitleButton,
.textContainer:hover > .deleteEntityButton{
  opacity: 100;
}
</style>
