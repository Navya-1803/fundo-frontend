import apiClient from '../utils/apiClient.js';
import { createNote, getAllNotes } from './noteService.js';

vi.mock('../utils/apiClient.js', () => ({
  default: { get: vi.fn(() => Promise.resolve({ data: [] })), post: vi.fn(() => Promise.resolve({ data: {} })) },
}));

describe('noteService', () => {
  it('loads the dashboard notes', async () => {
    await getAllNotes();
    expect(apiClient.get).toHaveBeenCalledWith('/api/notes');
  });

  it('creates a note', async () => {
    await createNote({ title: 'Shopping', description: 'Milk' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/notes', { title: 'Shopping', description: 'Milk' });
  });
});
