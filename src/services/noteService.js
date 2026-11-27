import apiClient from '../utils/apiClient.js';

// note calls of the backend NoteController, the token is added by apiClient
export const getAllNotes = () => apiClient.get('/api/notes');

export const createNote = (note) => apiClient.post('/api/notes', note);
