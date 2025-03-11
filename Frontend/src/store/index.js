// store/index.js
import { createStore } from 'vuex';
import auth from './auth';
import api from '@/services/axios';

export default createStore({
  state: {
    username: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
  },
  actions: {
    fetchUserData({ commit }) {
      api.get('/me/')
        .then(response => {
          commit('setUsername', response.data.username);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    },
  },
  modules: {
    auth,
  },
});
