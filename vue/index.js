import Vue from 'vue';
import VueRouter from 'vue-router';
const moment = require('moment');
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

// import { NavbarPlugin, AlertPlugin, ModalPlugin } from 'bootstrap-vue';
// Vue.use(NavbarPlugin);
// Vue.use(AlertPlugin);
// Vue.use(ModalPlugin);

import Navbar from 'bootstrap-vue/es/components/navbar';
import Alert from 'bootstrap-vue/es/components/alert';
import Modal from 'bootstrap-vue/es/components/modal';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faCog, faTimes, faPencilAlt, faCheck, faStar, faSearch, faChevronUp, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';

Vue.use(Navbar);
Vue.use(Alert);
Vue.use(Modal);
Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faUser, faCog, faTimes, faPencilAlt, faCheck, faStar, faSearch, faChevronUp, faMoon, farStar, faSoundcloud);

Vue.filter('moment', (input, formatString) => {
  if(!input) return '';
  return moment(input).format(formatString);
});

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    { path: '/:track', component: App }
  ]
});

const app = new Vue({
  el: '#new-tracks',
  render: h => h(App),
  router: router
});

export default app;
