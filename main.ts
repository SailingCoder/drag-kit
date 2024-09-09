import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './src/App.vue';


const app = createApp(App);
const pinia = createPinia();
app.use(pinia)
app.mount('#app');
