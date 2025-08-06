import api from './api';

export const expedienteService = {
  getAll: async (params = {}) => {
    const response = await api.get('/expedientes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/expedientes/${id}`);
    return response.data;
  },

  create: async (expedienteData) => {
    const response = await api.post('/expedientes', expedienteData);
    return response.data;
  },

  update: async (id, expedienteData) => {
    const response = await api.put(`/expedientes/${id}`, expedienteData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/expedientes/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/expedientes/stats/dashboard');
    return response.data;
  }
};