<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  iconPos?: 'left' | 'top' | 'right' | 'bottom'
  textStyle?: 'bold' | 'italic'
  border?: 'white' | 'black'
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
    | 'black'
}
const props = defineProps<Props>()
const colorTheme = computed(() => {
  if (!props?.theme) return '#0ea5e9'
  switch (props?.theme) {
    case 'white':
      return '#ffffff'
    case 'slate':
      return '#64748b'
    case 'blue':
      return '#3b82f6'
    case 'sky':
      return '#0ea5e9'
    case 'teal':
      return '#14b8a6'
    case 'lime':
      return '#84cc16'
    case 'green':
      return '#22c55e'
    case 'yellow':
      return '#eab308'
    case 'orange':
      return '#f97316'
    case 'pink':
      return '#ec4899'
    case 'fuchsia':
      return '#d946ef'
    case 'purple':
      return '#a855f7'
    case 'indigo':
      return '#6366f1'
    case 'rose':
      return '#f43f5e'
    case 'red':
      return '#ef4444'
    case 'black':
      return '#000000'
  }
  return '#ffffff'
})
const textColor = computed(() => {
  if (!props.theme) return '#ffffff'
  if (props.theme === 'white') return '#000000'
  return '#ffffff'
})
</script>

<template>
  <button
    :class="[
      'button',
      {
        'flex-column': iconPos === 'top' || iconPos === 'bottom',
        'border-black': theme === 'white' || border === 'black',
        'border-white': border === 'white'
      }
    ]"
  >
    <span :style="`background-color: ${colorTheme}`" class="background"></span>
    <span
      :class="[
        'icon',
        {
          'order-2': iconPos === 'right' || iconPos === 'bottom'
        }
      ]"
    >
      <slot name="icon" />
    </span>
    <span
      :style="`color: ${textColor}`"
      :class="[
        'text',
        {
          bold: textStyle === 'bold',
          italic: textStyle === 'italic'
        }
      ]"
      >{{ label ?? 'Button' }}</span
    >
  </button>
</template>

<style scoped>
.button {
  position: relative;
  border-radius: 5px;
  display: flex;
  align-items: center;
  user-select: none;
}
.button:hover .background {
  filter: brightness(90%);
}
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  border-radius: 5px;
  transition: filter 0.2s ease-in-out;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.text {
  padding: 0.75rem 0.5rem;
}
.flex-column {
  flex-direction: column;
}
.border-black {
  border: 1px solid black;
}
.border-white {
  border: 1px solid white;
}
.order-2 {
  order: 2;
}
.bold {
  font-weight: bold;
}
.italic {
  font-style: italic;
}
</style>
