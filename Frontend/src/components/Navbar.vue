<template>
  <nav class="navbar" v-if="isAuthenticated">
    <div class="navbar-brand">
      <div class="dropdown" @click="toggleDropdown">
        <button class="dropdown-toggle">
          {{ username || 'Usuario' }}
        </button>
        <div :class="['dropdown-menu', { 'active': isDropdownOpen }]">
          <button @click.stop="logout" class="dropdown-item">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'NavBar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isDropdownOpen = ref(false);

    const username = computed(() => store.getters['auth/currentUser']?.username || 'Usuario');
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const logout = () => {
      store.dispatch('auth/logout').then(() => {
        router.push('/login');
      }).catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
    };

    return {
      username,
      isAuthenticated,
      logout,
      isDropdownOpen,
      toggleDropdown
    };
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.dropdown-toggle {
  background: none;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 50px;
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 20px;
  top: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
}

.dropdown-menu.active {
  display: block;
}

.dropdown-item {
  width: 100%;
  padding: 10px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}
</style>
