import Vue from 'vue';
import VueRouter from 'vue-router';
const moment = require('moment');
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

import { NavbarPlugin, AlertPlugin, ModalPlugin } from 'bootstrap-vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faStream } from '@fortawesome/free-solid-svg-icons/faStream';
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faDice } from '@fortawesome/free-solid-svg-icons/faDice';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons/faStar';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons/faSoundcloud';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';

Vue.use(NavbarPlugin);
Vue.use(AlertPlugin);
Vue.use(ModalPlugin);
Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faUser, faCog, faTimes, faPencilAlt, faCheck, faStar, faSearch, faChevronUp, faChevronDown, faStream, faMusic, faMoon, faDice, farStar, faSoundcloud);

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
