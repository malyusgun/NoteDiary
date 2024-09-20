<script setup lang="ts">
import type { IImage } from '@/app/interfaces/entities';
import { convertThemeToColorWhiteDefault, deleteEntity, editEntity } from '@/app/helpers';
import type { TTheme } from '@/app/interfaces/environment';
import cookies from '@/app/plugins/Cookie';
import type { IToggleButtonItem } from '@/app/interfaces/ui';

interface Props {
  entityData: IImage;
}
const props = defineProps<Props>();
const emit = defineEmits(['saveChanges']);
const entityData = computed(() => props.entityData);
const newEntityData = ref({ ...entityData.value });
watch(entityData, () => (newEntityData.value = entityData.value));
const isModal = ref<boolean>(false);

const addText = () => {
  editEntity({
    ...entityData.value,
    text: 'Text',
    text_position: 'right',
    font_size: entityData.value.font_size ?? '24',
    paragraph_size: 'full'
  });
  newEntityData.value = { ...entityData.value, text: 'Text' };
};
const removeText = () => {
  const newState = { ...entityData.value };
  ['text', 'text_position', 'font_size', 'paragraph_size'].forEach((item) => {
    newState[item] = null;
  });
  editEntity({ ...newState });
  newEntityData.value = newState;
};
const changeFontSize = (newSize: '16' | '20' | '24' | '40' | '64') => {
  entityData.value.font_size = newSize;
  editEntity({ ...entityData.value, font_size: newSize });
};
const themeColor: TTheme = cookies.get('favorite_color');
const themeColorConverted = convertThemeToColorWhiteDefault(themeColor);
const isTitle = ref(!!entityData.value.title);
const isText = ref(!!entityData.value.text);
const isEntityWidthFull = ref(entityData.value.paragraph_size === 'full');

const maxLines = computed(() => {
  if (isTitle.value) {
    return Math.floor(168 / 24);
  } else {
    return Math.floor(240 / 24);
  }
});
const entityIsTitleOptions = ref([
  {
    label: 'Off',
    value: false,
    textStyle: 'bold'
  },
  {
    label: 'On',
    value: true,
    textStyle: 'bold'
  }
]);
const entityIsTextOptions = ref([
  {
    label: 'Off',
    value: false,
    textStyle: 'bold'
  },
  {
    label: 'On',
    value: true,
    textStyle: 'bold'
  }
]);
const entityPositionOptions = ref([
  {
    label: 'left',
    isLabelHidden: true
  },
  {
    label: 'center',
    isLabelHidden: true
  },
  {
    label: 'right',
    isLabelHidden: true
  }
]);
const entityTitlePositionOptions = ref([
  {
    label: 'left',
    isLabelHidden: true
  },
  {
    label: 'center',
    isLabelHidden: true
  },
  {
    label: 'right',
    isLabelHidden: true
  }
]);
const entityTextPositionOptions = ref([
  {
    label: 'Left',
    value: 'left',
    textStyle: 'bold'
  },
  {
    label: 'Right',
    value: 'right',
    textStyle: 'bold'
  }
]);
const entityParagraphSizeOptions = ref([
  {
    label: 'Half',
    value: 'half',
    textStyle: 'bold'
  },
  {
    label: 'Full',
    value: 'full',
    textStyle: 'bold'
  }
]);
const imageScaleOptions = ref([
  {
    label: 'x0.25',
    value: 0,
    color: 'var(--purple-700)'
  },
  {
    label: 'x0.5',
    value: 1,
    color: 'var(--indigo-500)'
  },
  {
    label: 'x0.75',
    value: 2,
    color: 'var(--sky-500)'
  },
  {
    label: 'x1',
    value: 3,
    color: 'var(--green-500)'
  },
  {
    label: 'x1.25',
    value: 4,
    color: 'var(--yellow-500)'
  },
  {
    label: 'x1.5',
    value: 5,
    color: 'var(--orange-500)'
  },
  {
    label: 'x1.75',
    value: 6,
    color: 'var(--red-500)'
  },
  {
    label: 'x2',
    value: 7,
    color: 'var(--red-800)'
  }
]);
const saveChanges = () => {
  const entityPosition = isEntityWidthFull.value ? 'full' : 'half';
  if (entityPosition !== entityData.value.entity_position) {
    newEntityData.value.paragraph_size = entityPosition;
  }
  if (isTitle.value !== !!entityData.value.title) {
    if (isTitle.value) {
      newEntityData.value.title = 'Title';
    } else {
      newEntityData.value.title = null;
    }
  }
  if (isText.value !== !!entityData.value.title) {
    if (isText.value) {
      newEntityData.value.title = 'Text';
    } else {
      newEntityData.value.title = null;
    }
  }
  if (JSON.stringify(entityData) !== JSON.stringify(newEntityData.value)) {
    emit('saveChanges', newEntityData.value);
  }
  isModal.value = false;
};
</script>

<template>
  <button
    :style="`background-color: ${themeColorConverted}`"
    class="settings absolute left-2 top-0 select-none size-10 hover:brightness-75 transition-all cursor-pointer"
    @click.prevent="isModal = true"
  >
    <SettingsIcon color="white" size="25" />
  </button>
  <Modal v-model:isVisible="isModal" theme="black" width="90%"
    ><template #header><h3 class="w-max mx-auto">Edit paragraph</h3></template>
    <div class="p-10 flex gap-16 items-center">
      <ImageSettingsList
        v-model:newEntityData="newEntityData"
        v-model:isTitle="isTitle"
        v-model:isText="isText"
        v-model:isEntityWidthFull="isEntityWidthFull"
        :themeColor="themeColor"
        :entityIsTitleOptions="entityIsTitleOptions"
        :entityIsTextOptions="entityIsTextOptions"
        :entityPositionOptions="entityPositionOptions"
        :entityTitlePositionOptions="entityTitlePositionOptions"
        :entityTextPositionOptions="entityTextPositionOptions"
        :entityParagraphSizeOptions="entityParagraphSizeOptions"
        :imageScaleOptions="imageScaleOptions"
      />
      <section
        :style="`border-color: var(--${themeColor}-200); height: 450px`"
        class="grow flex flex-col gap-4 p-4 min-h-full border-2 border-slate-100 border-dashed rounded-2xl"
      >
        <div :style="`justify-content: ${newEntityData.entity_position};`" class="flex">
          <div
            v-show="isTitle"
            :style="`border-color: var(--${themeColor}-800);
            justify-content: ${newEntityData.entity_title_position}; width: ${isEntityWidthFull ? '100%' : '50%'}`"
            class="flex text-2xl font-bold text-center px-2 py-4 border-2 border-dashed rounded-2xl"
          >
            <h3 class="w-2/3 overflow-ellipsis overflow-hidden whitespace-nowrap">
              {{ newEntityData.title ?? 'Title' }}
            </h3>
          </div>
        </div>
        <div class="flex">
          <div :style="`justify-content: ${newEntityData.entity_position}`" class="flex">
            <div
              v-show="isText"
              :style="`border-color: var(--${themeColor}-400); width: ${isEntityWidthFull ? '100%' : '50%'};`"
              class="h-full p-4 pb-2 border-2 border-dashed rounded-2xl overflow-hidden"
            >
              <p class="pb-0 overflow-hidden contain-inline-size text">
                {{ newEntityData.text ?? 'Text' }}
              </p>
            </div>
          </div>
          <img class="h-max" :src="newEntityData.imageUrl" alt="" />
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
.settings {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>
