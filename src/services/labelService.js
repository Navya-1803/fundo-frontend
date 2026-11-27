import apiClient from '../utils/apiClient.js';

// label calls of the backend LabelController and NoteController
export const getLabels = () => apiClient.get('/api/labels');

export const createLabel = (name) => apiClient.post('/api/labels', { name });

export const renameLabel = (labelId, name) => apiClient.put(`/api/labels/${labelId}`, { name });

export const deleteLabel = (labelId) => apiClient.delete(`/api/labels/${labelId}`);

export const getNotesByLabel = (labelId) => apiClient.get(`/api/labels/${labelId}/notes`);

export const addLabelToNote = (noteId, labelId) => apiClient.post(`/api/notes/${noteId}/labels/${labelId}`);

export const removeLabelFromNote = (noteId, labelId) => apiClient.delete(`/api/notes/${noteId}/labels/${labelId}`);
