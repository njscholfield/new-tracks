import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';

Vue.use(BootstrapVue);

const app = new Vue({
  el: '#new-tracks',
  render: h => h(App)
});

export default app;