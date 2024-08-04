<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import BaseMenu from '@/modules/BaseMenu.vue';
const baseMenu = ref();
const toggleMenu = (event) => {
  baseMenu.value.toggle(event);
};
</script>

<template>
  <header>
    <div class="wrapper">
      <h1>ggggggggggggggggggggggggggggggggggggggggggggggg</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <Button @click="toggleMenu">Menu</Button>
  <BaseMenu ref="baseMenu" />
  <RouterView />
</template>

<style scoped></style>
