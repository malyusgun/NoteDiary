<script setup lang="ts">
interface Props {
  color?: string;
  size?: string | number;
}
defineProps<Props>();
</script>

<template>
  <svg
    :width="`${size ?? 40}px`"
    :height="`${size ?? 40}px`"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 3V14.8C6 15.9201 6 16.4802 6.21799 16.908C6.40973 17.2843 6.71569 17.5903 7.09202 17.782C7.51984 18 8.0799 18 9.2 18H15M21 18H18M18 21V9.2C18 8.0799 18 7.51984 17.782 7.09202C17.5903 6.71569 17.2843 6.40973 16.908 6.21799C16.4802 6 15.9201 6 14.8 6H9M3 6H6"
      :stroke="color ?? '#000000'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped></style>
