import api from '@/services/api'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role
  },
  mutations: {
    SET_USER(state, { user, token }) {
      state.user = user
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        commit('SET_USER', {
          user: response.data.user,
          token: response.data.token
        })
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },
    async register({ commit }, credentials) {
      try {
        const response = await api.post('/auth/register', credentials)
        commit('SET_USER', {
          user: response.data.user,
          token: response.data.token
        })
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
    async fetchUser({ commit }) {
      try {
        const res = await api.get('/auth/me')
        commit('SET_USER', {
          user: res.data,
          token: localStorage.getItem('token') // optionnel
        })
      } catch (err) {
        commit('CLEAR_AUTH')
        console.warn('❌ fetchUser failed:', err)
      }
    }

  }
}