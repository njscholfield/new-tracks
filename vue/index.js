import Vue from 'vue';
import VueRouter from 'vue-router';
import moment from 'moment';

import Navbar from 'bootstrap-vue/es/components/navbar';
import Jumbotron from 'bootstrap-vue/es/components/jumbotron';
import Layout from 'bootstrap-vue/es/components/layout';
import Alert from 'bootstrap-vue/es/components/alert';
import Modal from 'bootstrap-vue/es/components/modal';

import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import farStar from '@fortawesome/fontawesome-free-regular/faStar';
import faSoundcloud from '@fortawesome/fontawesome-free-brands/faSoundcloud';

import App from './App.vue';

Vue.use(Navbar);
Vue.use(Jumbotron);
Vue.use(Layout);
Vue.use(Alert);
Vue.use(Modal);
Vue.component('font-awesome-icon', FontAwesomeIcon);
fontawesome.library.add(faUser, faCog, faTimes, faPencilAlt, faCheck, faStar, faSearch, farStar, faSoundcloud);

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