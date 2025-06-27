import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Gérer la déconnexion si token expiré
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonction d'inscription
export const register = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction de connexion
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    // Stockage du token JWT dans le localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour récupérer l'utilisateur CAS (si utilisé)
export const getCasUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;  // Default export remains for axios instance
