<script setup lang="ts">
import Button from '@d.malygin/UI_storybook/components/Button';
import ArrowLeftIcon from '@d.malygin/UI_storybook/icons/Mono/ArrowLeft';
import UserIcon from '@d.malygin/UI_storybook/icons/Mono/User';
import cookies from '@/app/plugins/Cookie';
import customFetch from '@/app/helpers/customFetch';
import type { IUser } from '@/app/interfaces/authorization';
import { getSheetHandler, getUserHandler } from '@/app/helpers/requestHandlers';

const router = useRouter();

const formData = ref({
  nick_name: '',
  password: ''
});
const areCredentialsValid = ref<boolean>(false);

const checkAreCredentialsValid = () => {
  const nickName = formData.value.nick_name;
  const password = formData.value.password;
  if (nickName.length < 4 || password.length < 8) {
    areCredentialsValid.value = false;
    return;
  }
  areCredentialsValid.value = true;
};
const goToSignUp = () => {
  router.push('/auth/signUp');
};
const signIn = async () => {
  const data = await customFetch(`/users/login`, 'POST', formData.value);
  const userDataDB: IUser = {
    ...data,
    user_sheets: JSON.parse(data.user_sheets)
  };

  cookies.set('user_uuid', userDataDB.user_uuid);
  cookies.set('home_uuid', userDataDB.user_sheets[0].sheet_uuid);
  cookies.set('favorite_color', userDataDB.favorite_color);

  getUserHandler(userDataDB);
  getSheetHandler(userDataDB.user_sheets[0]);

  await router.push(`/${userDataDB.user_sheets[0].sheet_uuid}`);
};
</script>

<template>
  <AuthorizationForm>
    <section class="flex flex-col items-center gap-2">
      <div>
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
          @input="checkAreCredentialsValid"
        />
      </div>
      <div class="mb-2">
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
          @input="checkAreCredentialsValid"
        />
      </div>
      <Button
        label="Sign in"
        theme="blue"
        darknessTheme="700"
        textColor="white"
        :class="[
          {
            'brightness-75 pointer-events-none': !areCredentialsValid
          }
        ]"
        @click.prevent="signIn"
        ><UserIcon color="white" size="25"
      /></Button>
    </section>
    <Button
      label="Sign up"
      theme="blue"
      darknessTheme="700"
      textColor="white"
      class="absolute -bottom-20 left-1/2 -translate-x-1/2"
      @click.prevent="goToSignUp"
      ><ArrowLeftIcon size="25" color="white"
    /></Button>
  </AuthorizationForm>
</template>

<style scoped></style>
