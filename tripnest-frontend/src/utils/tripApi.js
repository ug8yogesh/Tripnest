import api from './api';

export const tripApi = {
  list: () => api.get('/api/trips'),
  get: (tripId) => api.get(`/api/trips/${tripId}`),
  create: (payload) => api.post('/api/trips', payload),
  update: (tripId, payload) => api.put(`/api/trips/${tripId}`, payload),
  remove: (tripId) => api.delete(`/api/trips/${tripId}`),
};
