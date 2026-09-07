import api from './api';

export const destinationApi = {
  list: () => api.get('/api/destinations'),
  popular: () => api.get('/api/destinations/popular'),
  get: (id) => api.get(`/api/destinations/${id}`),
  create: (payload) => api.post('/api/destinations/admin', payload),
  update: (id, payload) => api.put(`/api/destinations/admin/${id}`, payload),
  remove: (id) => api.delete(`/api/destinations/admin/${id}`),
};
