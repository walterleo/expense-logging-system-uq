import Vue from 'vue';
import Vuex from 'vuex';
import VueApexCharts from 'vue-apexcharts';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import store from './store';
import 'vue-select/dist/vue-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-loading-overlay/dist/vue-loading.css';
import './assets/main.scss';
import './filters';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
