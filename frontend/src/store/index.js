import Vue from 'vue';
import Vuex from 'vuex';
import attendance from './modules/attendance';
import auth from './modules/auth';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    attendance
  },
  state: {
    snackbar: {
      show: false,
      message: '',
      color: 'primary'
    },
    user: null, 
    token: null,
  },
  mutations: {
    SET_USER(state, userData) {
      state.user = userData.user;
      state.token = userData.token;
    },
    SET_SNACKBAR(state, snackbar) {
      state.snackbar = {
        ...state.snackbar,
        ...snackbar,
        show: true
      }
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const userData = await auth.login(credentials);  
        commit('SET_USER', userData);  
      } catch (error) {
        throw error;
      }
    },
    async register({ commit }, credentials) {
      try {
        const userData = await auth.register(credentials);  
        commit('SET_USER', userData); 
      } catch (error) {
        throw error;
      }
    },
    showSnackbar({ commit }, snackbar) {
      commit('SET_SNACKBAR', snackbar)
    }
  }
})
