import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import VueSplide from '@splidejs/vue-splide';
import VueVirtualScroller from 'vue-virtual-scroller'

import './assets/main.css';
import './assets/style.css';
import '@splidejs/vue-splide/css';
import '@splidejs/vue-splide/css/core';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(VueSplide);
app.use(VueVirtualScroller);

app.mount('#app');