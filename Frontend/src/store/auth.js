// store/auth.js
import axios from '@/services/axios';

export default {
  namespaced: true,
  state: {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKENS(state, { access, refresh }) {
      state.accessToken = access;
      state.refreshToken = refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },
    LOGOUT(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await axios.post('token/', credentials);
      commit('SET_TOKENS', {
        access: response.data.access,
        refresh: response.data.refresh,
      });
      commit('SET_USER', response.data.user);
    },
    async register({ commit }, userData) {
      await axios.post('/register/', userData);
    },
    async fetchUser({ commit }) {
      const response = await axios.get('/me/');
      commit('SET_USER', response.data);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
  },
};
