import store from '@/store';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout')
    }
    return Promise.reject(error)
  }
)

export default api