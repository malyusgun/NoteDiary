<script setup lang="ts">
import cookies from '@/app/plugins/Cookie';
import customFetch from '@/app/helpers/customFetch';
import {
  createEntityHandler,
  getSheetHandler,
  getUserHandler
} from '@/app/helpers/requestHandlers';
import type { IUser } from '@/app/interfaces/authorization';

const router = useRouter();

const formData = ref({
  nick_name: '',
  email: '',
  password: '',
  favorite_color: ''
});

const signUp = async () => {
  if (!formData.value.favorite_color) {
    console.log('Выберите любимый цвет');
    return;
  }
  const userData = formData.value;
  const data = await customFetch(`/users`, 'POST', userData);
  const userDataDB: IUser = {
    ...data.createdUser,
    user_sheets: JSON.parse(data.createdUser.user_sheets)
  };

  cookies.set('home_uuid', userDataDB.user_sheets[0].sheet_uuid);
  cookies.set('user_uuid', userDataDB.user_uuid);
  cookies.set('favorite_color', userDataDB.favorite_color);

  getUserHandler(userDataDB);
  getSheetHandler(data.homeSheet);
  createEntityHandler(data.startEntity);

  await router.push(`/${data.homeSheet.sheet_uuid}`);
};

const colors = [
  'slate',
  'blue',
  'sky',
  'teal',
  'lime',
  'green',
  'yellow',
  'amber',
  'orange',
  'pink',
  'fuchsia',
  'purple',
  'indigo',
  'rose',
  'red'
];
</script>

<template>
  <AuthorizationForm>
    <h2 class="text-center text-3xl font-bold mb-8 select-none">Register</h2>
    <form class="flex gap-24">
      <SignUpCredentials v-model:formData="formData" />
      <section class="w-64 relative">
        <h3 class="font-bold w-full text-xl mb-4 select-none">Choose your favorite color:</h3>
        <ul class="grid grid-cols-5 gap-4 mb-6">
          <li
            v-for="item of colors"
            :key="item"
            :style="`background-color: var(--${item}-500)`"
            :class="[
              `size-10 rounded-md border-2 border-${item}-100 border-solid cursor-pointer`,
              {
                '!border-blue-800 border-4': formData.favorite_color === item
              }
            ]"
            @click.prevent="formData.favorite_color = item"
          ></li>
        </ul>
        <button
          class="absolute -right-10 -bottom-12 px-6 py-2 font-bold text-2xl bg-blue-700 border-2 border-solid border-blue-100 rounded-lg select-none"
          @click.prevent="signUp"
        >
          Sign up
        </button>
      </section>
    </form>
  </AuthorizationForm>
</template>

<style scoped>
.input:hover {
  border-color: var(--blue-500);
}
.input:focus {
  border-color: var(--blue-700);
}
.redStar::after {
  position: relative;
  right: -4px;
  top: 0;
  content: '*';
  font-weight: bold;
  color: var(--red-500);
}
</style>
