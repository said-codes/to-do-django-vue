// store/index.js
import { createStore } from 'vuex'; // Import createStore from Vuex
import auth from './auth';
import axios from 'axios';  // Importa axios


// Create and export the Vuex store
export default createStore({
  state: {
    username: ''  // Estado global para almacenar el nombre del usuario
  },
  mutations: {
    // Mutación para actualizar el nombre del usuario en el estado
    setUsername(state, username) {
      state.username = username;
    }
  },
  actions: {
    // Acción para obtener los datos del usuario desde el backend
    fetchUserData({ commit }) {
      axios.get('/me/')
        .then(response => {
          commit('setUsername', response.data.username);  // Actualiza el estado con el nombre del usuario
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  },
  modules: {
    auth,
  },
});
