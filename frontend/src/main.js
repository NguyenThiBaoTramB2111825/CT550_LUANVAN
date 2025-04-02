
// import router from './router/index';
// import { createApp } from 'vue'
// import App from './App.vue'
// import axios from 'axios';
// import { createPinia } from "pinia";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// const app = createApp(App);
// app.use(router)
// app.use(createPinia());
// app.mount('#app')



import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import axios from 'axios';
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');

// Import Bootstrap JS sau khi app được mount
import 'bootstrap/dist/js/bootstrap.bundle.min.js';