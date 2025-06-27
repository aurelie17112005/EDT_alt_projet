import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    attendanceList: [],
  },
  mutations: {
    SET_ATTENDANCE(state, attendance) {
      state.attendanceList.push(attendance);
    },
  },
  actions: {
    async scan({ commit }, { token, timestamp }) {
      const response = await api.post('/attendance/scan', { token, timestamp });
      commit('SET_ATTENDANCE', response.data);
    },
    async validate({ commit }, { pairId }) {
      const response = await api.post('/attendance/validate', { pairId });
      commit('SET_ATTENDANCE', response.data);
    },
  },
};
