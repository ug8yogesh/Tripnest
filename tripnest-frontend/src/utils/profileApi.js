import api from './api';

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (payload) => api.put('/api/profile', payload),
};
