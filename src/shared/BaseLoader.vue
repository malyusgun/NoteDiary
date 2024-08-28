<script setup lang="ts"></script>

<template>
  <div class="loader flex gap-4">
    <div class="dot size-8 rounded-full bg-gray-100"></div>
    <div class="dot size-8 rounded-full bg-gray-100"></div>
    <div class="dot size-8 rounded-full bg-gray-100"></div>
  </div>
</template>

<style scoped>
.loader .dot {
  animation: bounce 0.5s infinite alternate;
}
@keyframes bounce {
  to {
    translate: 0 -16px;
  }
}
.loader .dot:nth-child(2) {
  animation-delay: 100ms;
}
.loader .dot:nth-child(3) {
  animation-delay: 200ms;
}
</style>
