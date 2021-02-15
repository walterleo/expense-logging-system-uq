import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categoriesUpdateFlag: 0,
    categoryCreatedFlag: 0,
  },
  mutations: {
    categoriesUpdated(state) {
      state.categoriesUpdateFlag += 1;
    },
    categoryCreatedFlag(state) {
      state.categoryCreatedFlag += 1;
    },
  },
});
