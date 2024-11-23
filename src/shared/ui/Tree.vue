<script setup lang="ts">
import { computed, ref } from 'vue';
import { convertThemeToColorWhiteDefault, icons } from './helpers/index';
import type { ITreeItem, TThemeColor } from './interfaces/index';
import TriangleOpenIcon from '@/shared/ui/icons/TriangleOpenIcon.vue';

interface Props {
  items?: ITreeItem[];
  maxWidth?: number;
  expand?: boolean;
  theme?: TThemeColor;
  disabled?: boolean;
  onClick?: (link?: string) => void | never | typeof link;
}
const props = withDefaults(defineProps<Props>(), {
  maxWidth: 300,
  disabled: false,
  onClick: () => null
});
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
      isOpen: props?.expand,
      label: item.label
    });
    if (item.children) {
      for (let child of item.children) {
        state.value.push({
          isOpen: props?.expand,
          label: child.label
        });
        if (child.children) {
          for (let grandChild of child.children) {
            state.value.push({
              isOpen: props?.expand,
              label: grandChild.label
            });
          }
        }
      }
    }
  }
};
watch(
  [items],
  () => {
    if (items.value) setInitialState();
  },
  {
    immediate: true
  }
);
const toggleIsOpen = (item) =>
  state.value.map((itemState) => {
    if (itemState.label === item.label) itemState.isOpen = !itemState.isOpen;
  });
</script>

<template>
  <ul :style="`background-color: ${themeColor ?? 'white'}; max-width: ${maxWidth}px`" class="tree">
    <li
      v-for="item of items"
      :key="item.label"
      :class="[
        'item',
        {
          openContent: state.find((itemState) => itemState.label === item.label && itemState.isOpen)
        }
      ]"
    >
      <section
        :class="[
          'textContainer',
          {
            pointer: !disabled && item.children
          }
        ]"
      >
        <TriangleOpenIcon
          v-if="item.children && !disabled"
          :class="[
            'openButton',
            {
              openButtonOpened: state.find(
                (itemState) => itemState.label === item.label && itemState.isOpen
              )
            }
          ]"
          :color="textColor"
          size="15"
          @click.prevent="toggleIsOpen(item)"
        />
        <component
          :is="icons[item.iconBefore]"
          v-if="item.iconBefore"
          :color="item.iconColor"
          size="20"
        />
        <a :href="item.link" class="label" @click.prevent="onClick(item.link)">{{ item.label }}</a>
        <component
          :is="icons[item.iconAfter]"
          v-if="item.iconAfter"
          :color="item.iconColor"
          size="20"
        />
      </section>
      <div class="children">
        <div
          v-for="child of item.children"
          :key="child.label"
          :class="[
            'item',
            {
              pl50: !child.children,
              openContent: state.find(
                (itemState) => itemState.label === child.label && itemState.isOpen
              )
            }
          ]"
        >
          <section
            :class="[
              'textContainer',
              {
                pointer: !disabled && child.children
              }
            ]"
          >
            <TriangleOpenIcon
              v-if="child.children && !disabled"
              :class="[
                'openButton',
                {
                  openButtonOpened: state.find(
                    (itemState) => itemState.label === child.label && itemState.isOpen
                  )
                }
              ]"
              :color="textColor"
              size="15"
              @click.prevent="toggleIsOpen(child)"
            />
            <component
              :is="icons[child.iconBefore]"
              v-if="child.iconBefore"
              :color="child.iconColor"
              size="20"
            />
            <a :href="child.link" class="label" @click.prevent="onClick(child.link)">{{
              child.label
            }}</a>
            <component
              :is="icons[child.iconAfter]"
              v-if="child.iconAfter"
              :color="child.iconColor"
              size="20"
            />
          </section>
          <div class="children">
            <div
              v-for="grandChild of child.children"
              :key="grandChild.label"
              :class="[
                'item',
                {
                  pl50: !grandChild.children,
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
                <p :href="grandChild.link" class="label" @click.prevent="onClick(grandChild.link)">
                  {{ grandChild.label }}
                </p>
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
    </li>
  </ul>
</template>

<style scoped>
.tree {
  padding: 15px 25px 15px 15px;
}
.item {
  width: 100%;
  padding-left: 20px;
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
  margin-right: 15px;
  transition: transform 0.3s ease;
}
.openButtonOpened {
  transform: rotate(180deg);
}
.children {
  width: 100%;
  padding-left: 25px;
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
  position: relative;
  display: flex;
  gap: 10px;
}
.flex {
  display: flex;
  align-items: start;
  justify-content: end;
}
.pointer {
  cursor: pointer;
}
.pl50 {
  padding-left: 50px;
}
</style>
