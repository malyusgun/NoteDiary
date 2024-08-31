import '@/app/assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

const app = createApp(App);
const theme = 'sky';
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: `{${theme}.50}`,
      100: `{${theme}.100}`,
      200: `{${theme}.200}`,
      300: `{${theme}.300}`,
      400: `{${theme}.400}`,
      500: `{${theme}.500}`,
      600: `{${theme}.600}`,
      700: `{${theme}.700}`,
      800: `{${theme}.800}`,
      900: `{${theme}.900}`,
      950: `{${theme}.950}`
    }
  }
});
app
  .use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        // darkModeSelector: '.darkModeToggle'
      }
    }
  })
  .use(createPinia())
  .use(router)
  .mount('#app');
