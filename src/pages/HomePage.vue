<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import EntityItem from '@/modules/EntityItem.vue';
import CreateEntityMenu from '@/components/CreateEntityMenu.vue';
import { setDefaultHomeBackground, uploadFile } from '@/helpers';
import { useInterfaceStore } from '@/stores/interface';
import type { IEntity } from '@/interfaces/environment';
import { useDataStore } from '@/stores/data';

const backgroundImage = ref();
const { height: backgroundImageHeight } = useElementSize(backgroundImage);
const entitiesContainer = ref();
const { height: entitiesHeight } = useElementSize(entitiesContainer);

const dataStore = useDataStore();
const interfaceStore = useInterfaceStore();

// const entities = ref(JSON.parse(localStorage.getItem('homeEntities') || '[]'));
const entities = computed(() => dataStore.homeEntities);

const addEntity = (newEntity: IEntity) => {
  console.log('entities.value', entities.value);
  const prevState = [...entities.value];
  prevState.push(newEntity);
  dataStore.editHomeEntities(prevState);
  // let prevValue = JSON.parse(localStorage.getItem('homeEntities') || '[]');
  // prevValue.push(newEntity);
  // localStorage.setItem('homeEntities', JSON.stringify(prevValue));
  // entities.value.push(newEntity);
};

const backgroundUrl = computed<string>(() => interfaceStore.homeBackgroundUrl);
watchEffect(() => {
  console.log('entities: ', entities.value);
});
</script>

<template>
  <header>
    <h1 class="text-center text-4xl py-4">Home page</h1>
  </header>
  <main class="flex flex-col">
    <Splitter
      :style="`height: calc(${backgroundImageHeight - 3}px + ${entitiesHeight}px + 100px);`"
      layout="vertical"
      stateKey="homeSplitter"
      stateStorage="local"
    >
      <SplitterPanel
        ref="splitterBackground"
        :pt:root:style="`position: relative; background-image: url(${backgroundUrl}); background-size: 100% auto; max-height: ${backgroundImageHeight - 3}px; min-height: 200px;`"
        class="splitterPanelBackground"
      >
        <div
          class="changeImageBlock absolute top-2 right-2 bg-black p-2 rounded-md hover:text-gray-300 transition-all cursor-pointer select-none"
        >
          <input
            type="file"
            @change="uploadFile($event)"
            title="Change image"
            accept="image/*"
            class="w-2 pr-[135px] -mr-[135px] py-2 -my-2 pl-2 -ml-2 opacity-0 cursor-pointer"
          /><span class="cursor-pointer"><i class="pi pi-image mr-2"></i>Change image</span>
        </div>
        <button
          @click.prevent="setDefaultHomeBackground"
          class="returnDefaultImageBlock absolute top-16 right-2 bg-blue-600 p-2 transition-all rounded-md border-2 border-solid border-black select-none"
        >
          Return default image
        </button>
      </SplitterPanel>
      <SplitterPanel class="flex items-start justify-center"
        ><div ref="entitiesContainer" class="pt-6 px-4">
          <p class="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad autem cum dolores doloribus
            dolorum, earum illum nam nemo nesciunt odit pariatur quam quisquam reprehenderit
            sapiente ullam unde ut vel, voluptatem! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad autem cum dolores doloribus
            dolorum, earum illum nam nemo nesciunt odit pariatur quam quisquam reprehenderit
            sapiente ullam unde ut vel, voluptatem!
          </p>
          <EntityItem
            v-for="entitiesItem of entities"
            :entity="entitiesItem"
            :key="entitiesItem.uuid"
            class="mb-6"
          />
          <div class="relative">
            <CreateEntityMenu @addEntity="addEntity" />
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </main>
  <img
    ref="backgroundImage"
    :src="backgroundUrl"
    alt="background image"
    class="absolute w-full -top-full -left-full"
  />
</template>

<style scoped>
.splitterPanelBackground > .changeImageBlock,
.splitterPanelBackground > .returnDefaultImageBlock {
  opacity: 0;
}
.splitterPanelBackground:hover > .changeImageBlock,
.splitterPanelBackground:hover > .returnDefaultImageBlock {
  opacity: 100;
}
</style>
