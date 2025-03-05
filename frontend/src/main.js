// import './assets/main.css'
import router from './router/index';
import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios';
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
const app = createApp(App);
app.use(router)
app.use(createPinia());
app.mount('#app')
