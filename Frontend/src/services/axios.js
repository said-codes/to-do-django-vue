import axios from 'axios';
import store from '@/store';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

// Agrega el token a cada petición si está disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para refrescar el token en caso de 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        store.dispatch('auth/logout');
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        // Usamos la ruta correcta sin el prefijo "api/"
        const response = await api.post('token/refresh/', {
          refresh: refreshToken,
        });
        localStorage.setItem('accessToken', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          'Failed to refresh token:',
          refreshError.response ? refreshError.response.data : refreshError
        );
        store.dispatch('auth/logout');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
