<script setup lang="ts">
import AuthorizationForm from '@/modules/authorization/AuthorizationForm.vue';
import { useWebsocketStore } from '@/app/stores/websocket';

const websocketStore = useWebsocketStore();

const formData = ref({
  nick_name: '',
  email: '',
  password: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  favorite_color: ''
});
const signUp = () => {
  if (!formData.value.favorite_color) {
    console.log('Выберите любимый цвет');
    return;
  }
  console.log('signUp!');
  // создание юзера в бд
  const favoriteColor = formData.value.favorite_color;
  delete formData.value.favorite_color;
  const userData = { ...formData.value, settings: { favorite_color: favoriteColor } };
  const dataCreateUser = {
    event: 'createUser',
    body: userData
  };
  websocketStore.sendData(dataCreateUser);
};

const colors = [
  'white',
  'slate',
  'blue',
  'sky',
  'teal',
  'lime',
  'green',
  'yellow',
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
        <label class="block redStar mb-1 pl-1 pointer-events-none select-none" for="email"
          >Email</label
        >
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
      <section>
        <label class="block mb-1 pl-1 pointer-events-none select-none" for="firstName"
          >First name</label
        >
        <input
          id="firstName"
          v-model="formData.first_name"
          style="border-width: 1px"
          class="input block p-1 px-2 mb-4 border-solid border-blue-300 rounded-md transition-all"
          type="text"
          placeholder="Enter your first name"
        />
        <label class="block mb-1 pl-1 pointer-events-none select-none" for="middleName"
          >Middle name</label
        >
        <input
          id="middleName"
          v-model="formData.middle_name"
          style="border-width: 1px"
          class="input block p-1 px-2 mb-4 border-solid border-blue-300 rounded-md transition-all"
          type="text"
          placeholder="Enter your middle name"
        />
        <label class="block mb-1 pl-1 pointer-events-none select-none" for="lastName"
          >Last name</label
        >
        <input
          id="lastName"
          v-model="formData.last_name"
          style="border-width: 1px"
          class="input block p-1 px-2 mb-4 border-solid border-blue-300 rounded-md transition-all"
          type="text"
          placeholder="Enter your last name"
        />
      </section>
      <section class="w-64 relative">
        <h3 class="font-bold w-full text-xl mb-4 select-none">Choose your favorite color:</h3>
        <ul class="grid grid-cols-5 gap-4 mb-6">
          <li
            v-for="item of colors"
            :key="item"
            :style="`background-color: ${item !== 'white' ? `var(--${item}-500)` : 'white'}`"
            :class="[
              `size-10 rounded-md border-2 border-${item === 'white' ? 'gray' : item}-100 border-solid cursor-pointer`,
              {
                'border-blue-800 border-4': formData.favorite_color === item
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
