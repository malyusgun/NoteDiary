<script setup lang="ts">
import InputDiv from '@d.malygin/UI_storybook/components/InputDiv';
import Button from '@d.malygin/UI_storybook/components/Button';
import ArrowLeftIcon from '@d.malygin/UI_storybook/icons/Mono/ArrowLeft';
import customFetch from '@/app/helpers/customFetch';
import type { IUser } from '@/app/interfaces/authorization';
import cookies from '@/app/plugins/Cookie';
import {
  createEntityHandler,
  getSheetHandler,
  getUserHandler
} from '@/app/helpers/requestHandlers';
import { useAuthorizationStore } from '@/app/stores/authorization';

const router = useRouter();
const authorizationStore = useAuthorizationStore();

const code = ref<string>('');
const errorText = ref<string>('');
const isCodeExpired = ref<boolean>(false);

const userData = computed(
  () => authorizationStore.userData ?? JSON.parse(localStorage.getItem('userData'))
);

onMounted(async () => {
  if (!authorizationStore.codeMail) {
    const userUuid = cookies.get('user_uuid');
    const codeDB = await customFetch(`/users/${userUuid}/code`, 'GET');
    if (codeDB === 'expired') {
      errorText.value = 'Время действия кода истекло. Пожалуйста, повторите попытку авторизации.';
      isCodeExpired.value = true;
      return;
    }
    authorizationStore.setCodeMail(codeDB);
  }
});

const backToSignUp = () => {
  router.push('/auth/signUp');
};
const showCodeIsWrong = () => {
  errorText.value = 'Неверный код.';
};

const signUp = async () => {
  if (authorizationStore.codeMail !== code.value) {
    showCodeIsWrong();
    return;
  }
  const user_uuid = cookies.get('user_uuid');
  const data = await customFetch(`/users/registration`, 'POST', { user_uuid, ...userData.value });
  const userDataDB: IUser = {
    ...data.createdUser,
    user_sheets: JSON.parse(data.createdUser.user_sheets)
  };

  cookies.set('home_uuid', userDataDB.user_sheets[0].sheet_uuid);
  cookies.set('favorite_color', userDataDB.favorite_color);

  getUserHandler(userDataDB);
  getSheetHandler(data.homeSheet);
  createEntityHandler(data.startEntity);

  await router.push(`/${data.homeSheet.sheet_uuid}`);
};
</script>

<template>
  <AuthorizationForm>
    <section class="flex flex-col items-center gap-8">
      <p lang="ru" class="w-80 text text-center pl-1 text-lg pointer-events-none select-none">
        Для подтверждения электронной почты введите код, отправленный на введённый Вами адрес:
      </p>
      <div class="relative">
        <label
          v-if="errorText && !isCodeExpired"
          for="code"
          class="absolute text-red-600 -top-7 left-1/2 -translate-x-1/2"
          >{{ errorText }}</label
        >
        <InputDiv
          v-model="code"
          theme="blue"
          size="large"
          darkness-theme="900"
          scheme="6by1"
          @input="errorText = ''"
        />
      </div>
      <Button
        theme="blue"
        darkness-theme="700"
        label="Confirm mail"
        :class="[
          {
            'brightness-75 pointer-events-none': isCodeExpired || code.length !== 6
          }
        ]"
        @click.prevent="signUp"
      />
      <p v-show="isCodeExpired" class="w-80 text-red-600 text-center">{{ errorText }}</p>
    </section>
    <Button
      theme="blue"
      darkness-theme="700"
      label="Sign up"
      class="absolute -bottom-20 left-0"
      @click.prevent="backToSignUp"
    >
      <ArrowLeftIcon color="white" />
    </Button>
  </AuthorizationForm>
</template>

<style scoped>
.text {
  hyphens: auto;
}
.text::first-letter {
  padding-left: 10px;
}
.input:hover {
  border-color: var(--blue-500);
}
.input:focus {
  border-color: var(--blue-700);
}
</style>
