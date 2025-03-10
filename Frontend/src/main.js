import { createApp } from 'vue'; // Import createApp from Vue
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'mdb-vue-ui-kit/css/mdb.min.css';

// Create the app instance
const app = createApp(App);

// Disable production tip (equivalent to Vue.config.productionTip = false in Vue 2)
app.config.productionTip = false;

// Use router and store
app.use(router);
app.use(store);

// Mount the app
app.mount('#app');
