<script setup lang="ts">
import { convertThemeToColorWhiteDefault, editEntity } from '@/app/helpers';
import type { IParagraph } from '@/app/interfaces/entities';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';

interface Props {
  entityData: IParagraph;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges']);
const entityData = props.entityData;
let newEntityData = ref({ ...entityData });
const isModal = ref<boolean>(false);

const changeFontSize = (newSize: '16' | '20' | '24' | '40' | '64') => {
  entityData.font_size = newSize;
  editEntity({ ...entityData, font_size: newSize });
};
const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);
const isTitle = ref(!!entityData.title);
const isEntityWidthFull = ref(entityData.paragraph_size === 'full');

const maxLines = computed(() => {
  if (isTitle.value) {
    return Math.floor(168 / 24);
  } else {
    return Math.floor(240 / 24);
  }
});
const entityPositionOptions = [
  {
    label: 'left',
    value: 0
  },
  {
    label: 'center',
    value: 1
  },
  {
    label: 'right',
    value: 2
  }
];
const entityTitlePositionOptions = [
  {
    label: 'left',
    value: 0
  },
  {
    label: 'center',
    value: 1
  },
  {
    label: 'right',
    value: 2
  }
];
const saveChanges = () => {
  const entityPosition = isEntityWidthFull.value ? 'full' : 'half';
  if (entityPosition !== entityData.entity_position) {
    newEntityData.value.paragraph_size = entityPosition;
  }
  if (isTitle.value !== !!entityData.title) {
    if (isTitle.value) {
      newEntityData.value.title = 'Title';
    } else {
      newEntityData.value.title = null;
    }
  }
  if (JSON.stringify(entityData) !== JSON.stringify(newEntityData.value)) {
    console.log('they are different, I will save it. New data:', newEntityData.value);
    emit('saveChanges', newEntityData.value);
  }
  console.log('newEntityData.value :', newEntityData.value);
  isModal.value = false;
};
</script>

<template>
  <button
    :style="`background-color: ${themeColorConverted}`"
    class="settings absolute left-2 top-0 transition-all select-none size-10 flex justify-center items-center rounded-full hover:brightness-75 cursor-pointer"
    @click.prevent="isModal = true"
  >
    <SettingsIcon color="white" size="25" />
  </button>
  <Modal v-model:isVisible="isModal" theme="black" width="70%"
    ><template #header><h3 class="w-max mx-auto">Edit paragraph</h3></template>
    <div class="p-10 flex gap-16 items-center">
      <ParagraphSettingsList
        v-model:newEntityData="newEntityData"
        v-model:isTitle="isTitle"
        v-model:isEntityWidthFull="isEntityWidthFull"
        :themeColor="themeColor"
        :entityPositionOptions="entityPositionOptions"
        :entityTitlePositionOptions="entityTitlePositionOptions"
      />
      <section
        :style="`border-color: var(--${themeColor}-200); height: 320px`"
        class="grow flex flex-col gap-4 p-4 min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
      >
        <div :style="`justify-content: ${newEntityData.entity_position};`" class="flex">
          <div
            v-show="isTitle"
            :style="`border-color: var(--${themeColor}-800); justify-content: ${newEntityData.entity_title_position}; width: ${isEntityWidthFull ? '100%' : '50%'}`"
            class="flex text-2xl font-bold text-center px-2 py-4 border-2 border-dashed rounded-2xl"
          >
            <h3 class="w-2/3 overflow-ellipsis overflow-hidden whitespace-nowrap">
              {{ newEntityData.title ?? 'Title' }}
            </h3>
          </div>
        </div>
        <div :style="`justify-content: ${newEntityData.entity_position}`" class="grow flex">
          <div
            :style="`border-color: var(--${themeColor}-400); width: ${isEntityWidthFull ? '100%' : '50%'};`"
            class="h-full p-4 pb-2 border-2 border-dashed rounded-2xl overflow-hidden"
          >
            <p class="pb-0 overflow-hidden contain-inline-size text">{{ newEntityData.text }}</p>
          </div>
        </div>
      </section>
      <div class="absolute top-4 right-16 z-10 hover:brightness-80 transition-all">
        <Button label="Delete" textColor="white" theme="red" textStyle="bold" size="medium">
          <template #icon>
            <TrashIcon color="white" size="25" />
          </template>
        </Button>
      </div>
      <div
        class="absolute top-4 left-4 z-10 hover:brightness-80 transition-all"
        @click.prevent="saveChanges"
      >
        <Button label="Save" textColor="white" :theme="themeColor" textStyle="bold" size="medium">
          <template #icon>
            <SaveIcon color="white" size="25" />
          </template>
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.text {
  --max-lines: v-bind(maxLines);
  overflow: hidden;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--max-lines);
}
</style>
