import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import preset from '~me/preset';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
      preset: preset,
      options: {
        darkModeSelector: '.app-dark',
    }
  }
});

app.mount('#app')
