import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import preset from '~me/preset';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
      preset: preset
  }
});

app.mount('#app')
