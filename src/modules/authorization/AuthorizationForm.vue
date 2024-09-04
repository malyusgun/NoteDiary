<script setup lang="ts"></script>

<template>
  <main style="min-height: 100vh" class="relative w-full h-full bg-gray-900">
    <article
      class="form absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all py-20 px-40 border-4 border-solid border-blue-800 rounded-3xl"
    >
      <slot />
    </article>
  </main>
</template>

<style scoped>
@keyframes slideInFromLeft {
  0% {
    transform: translate(-200%, -50%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}
.form {
  animation: 0.6s ease 0s 1 slideInFromLeft;
}
</style>
