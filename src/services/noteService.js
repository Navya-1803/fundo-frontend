import apiClient from '../utils/apiClient.js';

// note calls of the backend NoteController, the token is added by apiClient
export const getAllNotes = () => apiClient.get('/api/notes');

export const createNote = (note) => apiClient.post('/api/notes', note);

// pin, archive and trash toggle the state of the note on the backend
export const pinNote = (noteId) => apiClient.patch(`/api/notes/${noteId}/pin`);

export const archiveNote = (noteId) => apiClient.patch(`/api/notes/${noteId}/archive`);

export const moveToTrash = (noteId) => apiClient.patch(`/api/notes/${noteId}/trash`);

export const updateNote = (noteId, note) => apiClient.put(`/api/notes/${noteId}`, note);

export const getArchivedNotes = () => apiClient.get('/api/notes/archived');

export const getTrashedNotes = () => apiClient.get('/api/notes/trash');

// permanent delete, the backend only allows it for notes in trash
export const deleteNoteForever = (noteId) => apiClient.delete(`/api/notes/${noteId}`);
