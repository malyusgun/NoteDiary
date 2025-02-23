<script setup lang="ts">
import Button from '@d.malygin/UI_storybook/components/Button';
import ArrowRightIcon from '@d.malygin/UI_storybook/icons/Mono/ArrowRight';
import UserIcon from '@d.malygin/UI_storybook/icons/Mono/User';
import customFetch from '@/app/helpers/customFetch';
import { useAuthorizationStore } from '@/app/stores/authorization';
import cookies from '@/app/plugins/Cookie';
import type { IUserSignForm } from '@/app/interfaces/authorization';

const router = useRouter();
const authorizationStore = useAuthorizationStore();

const formData = ref({
  nick_name: '',
  email: '',
  password: '',
  favorite_color: ''
});
const areCredentialsValid = ref<boolean>(false);

const checkAreCredentialsValid = () => {
  const nickName = formData.value.nick_name;
  const email = formData.value.email;
  const password = formData.value.password;
  if (nickName.length < 4 || password.length < 8 || email.length < 11 || !email.includes('@')) {
    areCredentialsValid.value = false;
    return;
  }
  areCredentialsValid.value = true;
};
const goToSignIn = () => {
  router.push('/auth/signIn');
};
const openConfirmMailPage = async () => {
  if (!formData.value.favorite_color) {
    console.log('Выберите любимый цвет');
    return;
  }
  const userData = formData.value;
  const data = await customFetch('/users/confirm', 'POST', userData);
  localStorage.setItem('userData', JSON.stringify(userData));
  authorizationStore.setUserData(userData as IUserSignForm);
  authorizationStore.setCodeMail(data.code);
  cookies.set('user_uuid', data.user_uuid);

  await router.push(`/auth/confirmMail`);
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
  <AuthorizationForm :isSignUpPage="true">
    <h2 class="text-center text-3xl font-bold mb-8 select-none">Register</h2>
    <form class="flex gap-24">
      <SignUpCredentials
        v-model:formData="formData"
        @checkAreCredentialsValid="checkAreCredentialsValid"
      />
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
        <div class="flex gap-6 absolute -right-[136px] -bottom-12">
          <Button
            :class="[
              {
                'brightness-75 pointer-events-none': !areCredentialsValid
              }
            ]"
            label="Sign up"
            theme="blue"
            darknessTheme="700"
            textColor="white"
            @click.prevent="openConfirmMailPage"
          >
            <UserIcon color="white" size="25" />
          </Button>
          <Button
            label="Sign in"
            theme="blue"
            darknessTheme="700"
            textColor="white"
            @click.prevent="goToSignIn"
          >
            <ArrowRightIcon color="white" size="25" />
          </Button>
        </div>
      </section>
    </form>
  </AuthorizationForm>
</template>

<style scoped></style>
