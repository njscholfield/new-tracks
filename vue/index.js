import Vue from 'vue';
import VueRouter from 'vue-router';
const moment = require('moment');

import Navbar from 'bootstrap-vue/es/components/navbar';
import Alert from 'bootstrap-vue/es/components/alert';
import Modal from 'bootstrap-vue/es/components/modal';

// import { Navbar, Alert, Modal } from 'bootstrap-vue/es/components'; 

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons/faStar';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons/faSoundcloud';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faUser, faCog, faTimes, faPencilAlt, faCheck, faStar, faSearch, faChevronUp } from '@fortawesome/free-solid-svg-icons';
// import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
// import { faSoundcloud } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';

Vue.use(Navbar);
Vue.use(Alert);
Vue.use(Modal);
Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faUser, faCog, faTimes, faPencilAlt, faCheck, faStar, faSearch, faChevronUp, farStar, faSoundcloud);

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