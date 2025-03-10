<template>
    <nav class="navbar" v-if="isAuthenticated">  <!-- Solo se muestra si el usuario está autenticado -->
      <div class="navbar-brand">
        <span class="username">{{ username }}</span>
      </div>
      <div class="navbar-actions">
        <button @click="logout" class="logout-button">Cerrar sesión</button>
      </div>
    </nav>
  </template>

  <script>
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    name: 'NavBar',
    setup() {
      const store = useStore();
      const router = useRouter();

      // Obtiene el nombre del usuario desde el estado global de Vuex
      const username = computed(() => store.state.auth.user?.username);

      // Obtiene el estado de autenticación desde el store
      const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

      // Lógica para cerrar sesión
      const logout = () => {
        console.log('Cerrando sesión...');  // Log de depuración
        store.dispatch('auth/logout').then(() => {
          router.push('/login').then(() => {
            console.log('Redirigiendo a /login...');  // Log de depuración
          }).catch(error => {
            console.error('Error al redirigir:', error);  // Log de error
          });
        }).catch(error => {
          console.error('Error al cerrar sesión:', error);  // Log de error
        });
      };

      return {
        username,
        isAuthenticated,
        logout
      };
    }
  };
  </script>

  <style scoped>
  /* Estilos del componente */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }

  .navbar-brand .username {
    font-size: 18px;
    font-weight: bold;
  }

  .logout-button {
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .logout-button:hover {
    background-color: #c82333;
  }
  </style>
