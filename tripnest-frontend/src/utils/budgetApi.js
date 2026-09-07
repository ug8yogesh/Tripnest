import api from './api';

export const budgetApi = {
  get: (tripId) => api.get(`/api/trips/${tripId}/budget`),
  save: (tripId, payload) => api.put(`/api/trips/${tripId}/budget`, payload),
  expenses: (tripId) => api.get(`/api/trips/${tripId}/expenses`),
  summary: (tripId) => api.get(`/api/trips/${tripId}/expenses/summary`),
  addExpense: (tripId, payload) => api.post(`/api/trips/${tripId}/expenses`, payload),
  updateExpense: (tripId, expenseId, payload) => api.put(`/api/trips/${tripId}/expenses/${expenseId}`, payload),
  removeExpense: (tripId, expenseId) => api.delete(`/api/trips/${tripId}/expenses/${expenseId}`),
};
