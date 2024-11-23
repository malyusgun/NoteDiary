<script setup lang="ts">
import customFetch from '@/app/helpers/customFetch';
import type { IUser, IUserSignForm } from '@/app/interfaces/authorization';
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

const userData = computed(() => authorizationStore.userData ?? localStorage.getItem('userData'));

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

  await router.push(`/sheets/${data.homeSheet.sheet_uuid}`);
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
          class="absolute text-red-600 -top-7 left-0"
          >{{ errorText }}</label
        >
        <input
          id="code"
          v-model="code"
          style="border-width: 1px"
          class="input block p-1 px-2 border-solid border-blue-300 rounded-md transition-all"
          type="text"
          placeholder="Enter your code"
          maxlength="6"
          required
          @input="errorText = ''"
        />
      </div>
      <button
        :class="[
          'px-6 py-2 font-bold text-2xl bg-blue-700 border-2 border-solid border-blue-100 rounded-lg select-none',
          {
            'brightness-75 pointer-events-none': isCodeExpired || code.length !== 6
          }
        ]"
        @click.prevent="signUp"
      >
        Confirm mail
      </button>
      <p v-show="isCodeExpired" class="w-80 text-red-600 text-center">{{ errorText }}</p>
    </section>
    <button
      class="flex gap-2 absolute -bottom-20 left-0 p-2 font-bold text-xl bg-blue-700 border-2 border-solid border-blue-100 rounded-lg select-none"
      @click.prevent="backToSignUp"
    >
      <ArrowLeftIcon color="white" /> Sign up
    </button>
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
