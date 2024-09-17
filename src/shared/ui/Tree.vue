<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  items?: {
    text: string;
    link?: string;
    color?: string;
    children?: {
      text: string;
      link?: string;
      color?: string;
      children?: {
        text: string;
        link?: string;
        color?: string;
      }[];
    }[];
  }[];
  maxWidth?: number;
  expand?: boolean;
  theme?:
    | 'white'
    | 'slate'
    | 'blue'
    | 'sky'
    | 'teal'
    | 'lime'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'pink'
    | 'fuchsia'
    | 'purple'
    | 'indigo'
    | 'rose'
    | 'red'
    | 'black';
}
const props = defineProps<Props>();
const items = computed(() => props.items);
const themeColor = computed(() => {
  if (!props?.theme) return '#ffffff';
  switch (props?.theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#64748b';
    case 'blue':
      return '#3b82f6';
    case 'sky':
      return '#0ea5e9';
    case 'teal':
      return '#14b8a6';
    case 'lime':
      return '#84cc16';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'orange':
      return '#f97316';
    case 'pink':
      return '#ec4899';
    case 'fuchsia':
      return '#d946ef';
    case 'purple':
      return '#a855f7';
    case 'indigo':
      return '#6366f1';
    case 'rose':
      return '#f43f5e';
    case 'red':
      return '#ef4444';
    case 'black':
      return '#000000';
  }
  return '#ffffff';
});
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
      text: item.text
    });
    if (item.children) {
      for (let child of item.children) {
        state.value.push({
          isOpen: props?.expand ?? false,
          text: child.text
        });
        console.log('child', child);
        if (child.children) {
          for (let grandChild of child.children) {
            state.value.push({
              isOpen: props?.expand ?? false,
              text: grandChild.text
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
    if (itemState.text === item.text) itemState.isOpen = !itemState.isOpen;
  });
</script>

<template>
  <ul
    :style="`background-color: ${themeColor ?? 'white'}; max-width: ${maxWidth ?? 300}px`"
    class="tree"
  >
    <li
      v-for="(item, index) of items"
      :key="item.text"
      :class="[
        'item flex',
        {
          openItem: state.find((itemState) => itemState.text === item.text && itemState.isOpen)
        }
      ]"
    >
      <svg
        v-if="item.children"
        :class="[
          'openButton',
          {
            openButtonOpened: state.find(
              (itemState) => itemState.text === item.text && itemState.isOpen
            )
          }
        ]"
        width="25px"
        height="25px"
        viewBox="0 -0.5 28 28"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
        @click.prevent="toggleIsOpen(item)"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
          sketch:type="MSPage"
        >
          <g
            id="Icon-Set-Filled"
            sketch:type="MSLayerGroup"
            transform="translate(-156.000000, -623.000000)"
            :fill="textColor ?? '#000000'"
          >
            <path
              id="open"
              d="M183,647.998 L157,647.998 C156.448,647.998 156,648.446 156,648.999 C156,649.552 156.448,650 157,650 L183,650 C183.552,650 184,649.552 184,648.999 C184,648.446 183.552,647.998 183,647.998 L183,647.998 Z M158.014,645.995 L182.018,645.995 C184.375,645.995 184.296,644.608 183.628,643.574 L171.44,624.555 C170.882,623.771 169.22,623.703 168.56,624.555 L156.372,643.574 C155.768,644.703 155.687,645.995 158.014,645.995 L158.014,645.995 Z"
              sketch:type="MSShapeGroup"
            ></path>
          </g>
        </g>
      </svg>
      <div
        :class="[
          'content',
          {
            openContent: state.find((itemState) => itemState.text === item.text && itemState.isOpen)
          }
        ]"
      >
        <div class="textContainer">
          <slot :name="`${index + 1}IconBefore`" />
          <a :href="item.link" class="text">{{ item.text }}</a>
          <slot :name="`${index + 1}IconAfter`" />
        </div>
        <div class="children">
          <div v-for="(child, indexChild) of item.children" :key="child.text" class="flex item">
            <svg
              v-if="child.children"
              :class="[
                'openButton',
                {
                  openButtonOpened: state.find(
                    (itemState) => itemState.text === child.text && itemState.isOpen
                  )
                }
              ]"
              width="25px"
              height="25px"
              viewBox="0 -0.5 28 28"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
              @click.prevent="toggleIsOpen(child)"
            >
              <g
                id="Page-1"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
                sketch:type="MSPage"
              >
                <g
                  id="Icon-Set-Filled"
                  sketch:type="MSLayerGroup"
                  transform="translate(-156.000000, -623.000000)"
                  :fill="textColor ?? '#000000'"
                >
                  <path
                    id="open"
                    d="M183,647.998 L157,647.998 C156.448,647.998 156,648.446 156,648.999 C156,649.552 156.448,650 157,650 L183,650 C183.552,650 184,649.552 184,648.999 C184,648.446 183.552,647.998 183,647.998 L183,647.998 Z M158.014,645.995 L182.018,645.995 C184.375,645.995 184.296,644.608 183.628,643.574 L171.44,624.555 C170.882,623.771 169.22,623.703 168.56,624.555 L156.372,643.574 C155.768,644.703 155.687,645.995 158.014,645.995 L158.014,645.995 Z"
                    sketch:type="MSShapeGroup"
                  ></path>
                </g>
              </g>
            </svg>
            <div
              :class="[
                'content',
                {
                  openContent: state.find(
                    (itemState) => itemState.text === child.text && itemState.isOpen
                  )
                }
              ]"
            >
              <div class="textContainer">
                <slot :name="`${index + 1}-${indexChild + 1}IconBefore`" />
                <a :href="child.link" class="text">{{ child.text }}</a>
                <slot :name="`${index + 1}-${indexChild + 1}IconAfter`" />
              </div>
              <div class="children">
                <div
                  v-for="(grandChild, indexGrandChild) of child.children"
                  :key="grandChild.text"
                  class="flex item"
                >
                  <div
                    :class="[
                      'content',
                      {
                        openContent: state.find(
                          (itemState) => itemState.text === grandChild.text && itemState.isOpen
                        )
                      }
                    ]"
                  >
                    <div class="textContainer">
                      <slot
                        :name="`${index + 1}-${indexChild + 1}-${indexGrandChild + 1}IconBefore`"
                      />
                      <p :href="grandChild.link" class="text">{{ grandChild.text }}</p>
                      <slot
                        :name="`${index + 1}-${indexChild + 1}-${indexGrandChild + 1}IconAfter`"
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
.text {
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
