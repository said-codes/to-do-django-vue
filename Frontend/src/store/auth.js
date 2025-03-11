import api from '@/services/axios'

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null, // Recupera el usuario
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.username = user.username
      localStorage.setItem('user', JSON.stringify(user)) // Guardar usuario en localStorage

    },
    SET_TOKENS(state, { access, refresh }) {
      state.accessToken = access
      state.refreshToken = refresh
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
    },
    LOGOUT(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('user') // Eliminar usuario del localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      try {
        // Se usa la ruta 'token/' sin prefijo "api/"
        const response = await api.post('token/', credentials)
        console.log("Respuesta del login:", response.data) // <-- Verificar si viene el refresh

        commit('SET_TOKENS', {
          access: response.data.access,
          refresh: response.data.refresh,
        })
        // Una vez autenticado, obtener el usuario
        await dispatch('fetchUser')

        // Si el backend envía user en la respuesta del login, lo guardamos
        if (response.data.user) {
          commit('SET_USER', response.data.user)
        }


        console.log("Access Token guardado:", localStorage.getItem("accessToken"))
        console.log("Refresh Token guardado:", localStorage.getItem("refreshToken"))

        // Opcional: si el backend envía información del usuario, se guarda
        if (response.data.user) {
          commit('SET_USER', response.data.user)
        }
      } catch (error) {
        console.error(
          'Error during login:',
          error.response ? error.response.data : error
        )
        throw error
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await api.post('register/', userData) //  Usa api.post
        commit('SET_USER', response.data)
        return response.data
      } catch (error) {
        console.error('Error en el registro:', error.response?.data || error.message)
        throw error
      }
    },
    async fetchUser({ commit, state }) {
      try {
        const response = await api.get('me/', {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });
        commit('SET_USER', response.data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    }
    ,
    logout({ commit }) {
      commit('LOGOUT')
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
    getUsername: (state) => state.username,

  },
}
