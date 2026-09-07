import api from './api';

export const groupApi = {
  list: () => api.get('/api/groups'),
  get: (groupId) => api.get(`/api/groups/${groupId}`),
  create: (payload) => api.post('/api/groups', payload),
  invite: (groupId, email) => api.post(`/api/groups/${groupId}/members`, { email }),
  removeMember: (groupId, userId) => api.delete(`/api/groups/${groupId}/members/${userId}`),
  messages: (groupId) => api.get(`/api/groups/${groupId}/messages`),
  sendMessage: (groupId, content) => api.post(`/api/groups/${groupId}/messages`, { content }),
  settlement: (groupId) => api.get(`/api/groups/${groupId}/settlement`),
};
