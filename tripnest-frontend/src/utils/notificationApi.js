import api from './api';

export const notificationApi = {
  list: () => api.get('/api/notifications'),
  markRead: (notificationId) => api.patch(`/api/notifications/${notificationId}/read`),
};
