import Vue from 'vue';
import VueRouter from 'vue-router';

import Navbar from 'bootstrap-vue/es/components/navbar';
import Jumbotron from 'bootstrap-vue/es/components/jumbotron';
import Layout from 'bootstrap-vue/es/components/layout';
import Alert from 'bootstrap-vue/es/components/alert';

import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faSoundcloud from '@fortawesome/fontawesome-free-brands/faSoundcloud';

import App from './App.vue';

Vue.use(Navbar);
Vue.use(Jumbotron);
Vue.use(Layout);
Vue.use(Alert);
Vue.component('font-awesome-icon', FontAwesomeIcon);
fontawesome.library.add(faUser, faCog, faTimes, faSoundcloud);

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