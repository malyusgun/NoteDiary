<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Props {
  formData: {
    nick_name: string;
    phone_number: string;
    email: string;
    password: string;
  };
}
const props = defineProps<Props>();
const emit = defineEmits(['update:formData']);
const formData = useVModel(props, 'formData', emit);
</script>

<template>
  <section>
    <label class="block redStar mb-1 pl-1 pointer-events-none select-none" for="nickName"
      >Nick name</label
    >
    <input
      id="nickName"
      v-model="formData.nick_name"
      style="border-width: 1px"
      class="input block p-1 px-2 mb-4 border-solid border-blue-300 rounded-md transition-all"
      type="text"
      placeholder="Enter your nick name"
      required
    />
    <label class="block redStar mb-1 pl-1 pointer-events-none select-none" for="email">Email</label>
    <input
      id="email"
      v-model="formData.email"
      style="border-width: 1px"
      class="input block p-1 px-2 mb-4 border-solid border-blue-300 rounded-md transition-all"
      type="text"
      placeholder="Enter your email"
      required
    />
    <label class="block redStar mb-1 pl-1 pointer-events-none select-none" for="password"
      >Password</label
    >
    <input
      id="password"
      v-model="formData.password"
      style="border-width: 1px"
      class="input block p-1 px-2 mb-4 border-solid border-blue-300 rounded-md transition-all"
      type="password"
      placeholder="Enter your password"
      required
    />
  </section>
</template>

<style scoped></style>
