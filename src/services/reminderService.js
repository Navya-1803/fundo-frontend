import apiClient from '../utils/apiClient.js';

// reminder calls of the backend ReminderController
export const setReminder = (noteId, reminderTime, message) => apiClient.post('/api/reminders', { noteId, reminderTime, message });

export const getReminders = () => apiClient.get('/api/reminders');

export const removeReminder = (noteId) => apiClient.delete(`/api/reminders/${noteId}`);
