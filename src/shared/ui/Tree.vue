<script setup lang="ts">
import { computed, ref } from 'vue';
import { convertThemeToColorWhiteDefault, icons } from './helpers/index';
import type { ITableItem, TThemeColor } from './interfaces/index';
import TriangleOpenIcon from '@/shared/ui/icons/TriangleOpenIcon.vue';

interface Props {
  items?: ITableItem[];
  maxWidth?: number;
  expand?: boolean;
  theme?: TThemeColor;
}
const props = defineProps<Props>();
const items = computed(() => props.items);
const themeColor = computed(() => convertThemeToColorWhiteDefault(props.theme));
const textColor = computed(() => {
  if (!props.theme) return '#000000';
  if (props.theme === 'white') return '#000000';
  return '#ffffff';
});

const state = ref([]);
const setInitialState = () => {
  if (!props?.items) return;
  for (let item of props.items) {
    state.value.push({
      isOpen: props?.expand ?? false,
      label: item.label
    });
    if (item.children) {
      for (let child of item.children) {
        state.value.push({
          isOpen: props?.expand ?? false,
          label: child.label
        });
        if (child.children) {
          for (let grandChild of child.children) {
            state.value.push({
              isOpen: props?.expand ?? false,
              label: grandChild.label
            });
          }
        }
      }
    }
  }
};
watch([items], () => {
  if (items.value) setInitialState();
});
const toggleIsOpen = (item) =>
  state.value.map((itemState) => {
    if (itemState.label === item.label) itemState.isOpen = !itemState.isOpen;
  });
</script>

<template>
  <ul
    :style="`background-color: ${themeColor ?? 'white'}; max-width: ${maxWidth ?? 300}px`"
    class="tree"
  >
    <li
      v-for="item of items"
      :key="item.label"
      :class="[
        'item flex',
        {
          openItem: state.find((itemState) => itemState.label === item.label && itemState.isOpen)
        }
      ]"
    >
      <TriangleOpenIcon
        v-if="item.children"
        :class="[
          'openButton',
          {
            openButtonOpened: state.find(
              (itemState) => itemState.label === item.label && itemState.isOpen
            )
          }
        ]"
        :color="textColor"
        size="25"
        @click.prevent="toggleIsOpen(item)"
      />
      <div
        :class="[
          'content',
          {
            openContent: state.find(
              (itemState) => itemState.label === item.label && itemState.isOpen
            )
          }
        ]"
      >
        <div class="textContainer">
          <component
            :is="icons[item.iconBefore]"
            v-if="item.iconBefore"
            :color="item.iconColor"
            size="20"
          />
          <a :href="item.link" class="label">{{ item.label }}</a>
          <component
            :is="icons[item.iconAfter]"
            v-if="item.iconAfter"
            :color="item.iconColor"
            size="20"
          />
        </div>
        <div class="children">
          <div v-for="child of item.children" :key="child.label" class="flex item">
            <TriangleOpenIcon
              v-if="child.children"
              :class="[
                'openButton',
                {
                  openButtonOpened: state.find(
                    (itemState) => itemState.label === child.label && itemState.isOpen
                  )
                }
              ]"
              :color="textColor"
              size="25"
              @click.prevent="toggleIsOpen(child)"
            />
            <div
              :class="[
                'content',
                {
                  openContent: state.find(
                    (itemState) => itemState.label === child.label && itemState.isOpen
                  )
                }
              ]"
            >
              <div class="textContainer">
                <component
                  :is="icons[child.iconBefore]"
                  v-if="child.iconBefore"
                  :color="child.iconColor"
                  size="20"
                />
                <a :href="child.link" class="label">{{ child.label }}</a>
                <component
                  :is="icons[child.iconAfter]"
                  v-if="child.iconAfter"
                  :color="child.iconColor"
                  size="20"
                />
              </div>
              <div class="children">
                <div v-for="grandChild of child.children" :key="grandChild.label" class="flex item">
                  <div
                    :class="[
                      'content',
                      {
                        openContent: state.find(
                          (itemState) => itemState.label === grandChild.label && itemState.isOpen
                        )
                      }
                    ]"
                  >
                    <div class="textContainer">
                      <component
                        :is="icons[grandChild.iconBefore]"
                        v-if="grandChild.iconBefore"
                        :color="grandChild.iconColor"
                        size="20"
                      />
                      <p :href="grandChild.link" class="label">{{ grandChild.label }}</p>
                      <component
                        :is="icons[grandChild.iconAfter]"
                        v-if="grandChild.iconAfter"
                        :color="grandChild.iconColor"
                        size="20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.tree {
  padding: 15px 25px 15px 15px;
}
.item {
  position: relative;
}
.content {
  width: 100%;
  padding-left: 25px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: v-bind(themeColor);
}
.label {
  display: inline-block;
  position: relative;
  padding: 4px 0;
  z-index: 3;
  color: v-bind(textColor);
  background-color: v-bind(themeColor);
  word-break: break-word;
}
.openButton {
  position: absolute;
  z-index: 3;
  top: 5px;
  left: 0;
  cursor: pointer;
  padding: 5px;
  margin: -5px -5px -5px 0;
  transition: transform 0.3s ease;
}
.openButtonOpened {
  transform: rotate(180deg);
}
.children {
  width: 100%;
  padding-left: 10px;
  opacity: 0;
  max-height: 0;
  transform: translateY(-100%);
  transition: all 0.3s ease;
}
.openContent > .children {
  transform: translateY(0);
  opacity: 1;
  max-height: 1000px;
}
.textContainer {
  display: flex;
  gap: 10px;
  margin-left: 10px;
}
.flex {
  display: flex;
  align-items: start;
  justify-content: end;
}
</style>
