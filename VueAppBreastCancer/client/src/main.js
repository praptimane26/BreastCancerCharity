/*import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')*/

import Vue from "vue";
import App from "./App.vue";
import { VueRouter } from "vue-router";
//import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VeeValidate from "vee-validate";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import { nav } from "./components/Navbar.vue"

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueRouter);

const routes = [
    { path: '/login', component: nav }
]

const router = new VueRouter ({
    routes,
    mode: 'history'
})

new Vue({
    render: (h) => h(App),
    router,
}).$mount("#app");
