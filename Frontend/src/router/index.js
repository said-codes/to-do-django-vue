import { createRouter, createWebHistory } from 'vue-router';  // Importaciones correctas
import taskview from '@/views/tasksview.vue';  // Importa tus componentes
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import store from '@/store';  // Importa el store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // Usa createWebHistory
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },  // Ruta protegida
      component: taskview,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { guestOnly: true },  // Solo para usuarios no autenticados
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { guestOnly: true },  // Solo para usuarios no autenticados
    },
  ],
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login');  // Redirige al login si no está autenticado
    } else {
      next();  // Permite el acceso
    }
  } else if (to.matched.some((record) => record.meta.guestOnly)) {
    if (isAuthenticated) {
      next('/');  // Redirige al home si ya está autenticado
    } else {
      next();  // Permite el acceso
    }
  } else {
    next();  // Permite el acceso a otras rutas
  }
});

export default router;  // Exporta el router
