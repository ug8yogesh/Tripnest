import api from './api';

export const itineraryApi = {
  list: (tripId) => api.get(`/api/trips/${tripId}/itinerary`),
  createDay: (tripId, payload) => api.post(`/api/trips/${tripId}/itinerary`, payload),
  updateDay: (tripId, itineraryId, payload) => api.put(`/api/trips/${tripId}/itinerary/${itineraryId}`, payload),
  removeDay: (tripId, itineraryId) => api.delete(`/api/trips/${tripId}/itinerary/${itineraryId}`),
  listActivities: (itineraryId) => api.get(`/api/itineraries/${itineraryId}/activities`),
  createActivity: (itineraryId, payload) => api.post(`/api/itineraries/${itineraryId}/activities`, payload),
  updateActivity: (itineraryId, activityId, payload) => api.put(`/api/itineraries/${itineraryId}/activities/${activityId}`, payload),
  removeActivity: (itineraryId, activityId) => api.delete(`/api/itineraries/${itineraryId}/activities/${activityId}`),
};
