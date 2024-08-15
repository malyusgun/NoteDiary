<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { deleteEntity, editEntity } from '@/app/helpers';
import { useDataStore } from '@/app/stores/data';
import { useElementSize } from '@vueuse/core';
import MoveImageMenu from '@/components/editEntityMenu/image/MoveImageMenu.vue';
import StateImageMenu from '@/components/editEntityMenu/image/StateImageMenu.vue';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);
// const imageUrl = ref<string>();
onMounted(() => {
  console.log('entityData.value', entityData.value);

  // const reader = new FileReader();
  // const imageData = new Blob(entityData.value.image_data.data, {
  //   type: 'image/x-icon;'
  // });
  // reader.readAsDataURL(imageData);
  // reader.addEventListener('load', () => {
  //   imageUrl.value = reader.result;
  //   console.log(' imageUrl.value', imageUrl.value);
  // });
});
const imageContainer = ref();
const { width: imageWidth, height: imageHeight } = useElementSize(imageContainer);

const editTitle = () => {
  editEntity({ ...entityData.value, title: entityData.value.title }, entityData.value.entity_uuid);
};

const addTitle = () => {
  imageHeight.value = imageHeight.value + 48;
  console.log('imageHeight.value', imageHeight.value);
  editEntity(
    { ...entityData.value, title: 'Title', image_height: imageHeight.value },
    entityData.value.entity_uuid
  );
  entityData.value = { ...entityData.value, title: 'Title' };
};
const removeTitle = () => {
  const newState = { ...entityData.value };
  delete newState.title;
  imageHeight.value = imageHeight.value - 48;
  editEntity({ ...newState, image_height: imageHeight.value }, entityData.value.entity_uuid);
  entityData.value = newState;
};

const isResizable = defineModel({ default: false });
const toggleIsResizable = () => {
  isResizable.value = !isResizable.value;
  if (!isResizable.value) {
    editEntity(
      { ...entityData.value, image_height: imageHeight.value, image_width: imageWidth.value },
      entityData.value.entity_uuid
    );
    console.log(entityData.value);
  }
};
const editPosition = (position: 'left' | 'center' | 'right') => {
  entityData.value.image_position = position;
  editEntity({ ...entityData.value, image_position: position }, entityData.value.entity_uuid);
};

const dataStore = useDataStore();
const homeEntities = computed(() => dataStore.homeEntities);
</script>

<template>
  <div
    :class="[
      'entityContainer relative flex py-8 px-16',
      {
        'justify-start': entityData.image_position === 'left',
        'justify-center': entityData.image_position === 'center',
        'justify-end': entityData.image_position === 'right'
      }
    ]"
  >
    <div class="flex flex-col">
      <input
        ref="input"
        v-if="entityData.title || entityData.title === ''"
        type="text"
        v-model="entityData.title"
        @change="editTitle"
        placeholder="Enter title..."
        class="w-full mb-4 font-bold text-2xl pl-2"
        :style="`width: ${entityData.image_width}px`"
      />
      <div
        ref="imageContainer"
        :class="[
          'inline-block overflow-hidden leading-none max-h-[700px] min-h-[100px] min-w-[100px]',
          {
            resize: isResizable,
            'min-h-[148px]': entityData.title || entityData.title === ''
          }
        ]"
        :style="`height: ${entityData.image_height}px; width: ${entityData.image_width}px`"
      >
        <img
          :src="entityData?.image_data"
          :alt="`Image ${entityData?.title}` || 'Image'"
          class="max-h-[700px] min-h-[100px] object-contain"
        />
      </div>
      <div class="speedDial absolute left-2 top-2 transition-all select-none">
        <StateImageMenu
          :entityData="entityData"
          :isResizable="isResizable"
          @deleteEntity="deleteEntity"
          @addTitle="addTitle"
          @removeTitle="removeTitle"
          @toggleIsResizable="toggleIsResizable"
        />
      </div>
      <div
        v-if="homeEntities.length > 1"
        class="speedDial absolute left-2 bottom-2 transition-all select-none"
      >
        <MoveImageMenu
          :entityData="entityData"
          :isResizable="isResizable"
          @editPosition="editPosition"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
input::placeholder {
  font-weight: 400;
}
</style>
