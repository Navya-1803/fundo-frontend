import apiClient from '../utils/apiClient.js';
import { archiveNote, createNote, getAllNotes, moveToTrash, pinNote, updateNote } from './noteService.js';

vi.mock('../utils/apiClient.js', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  },
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

  it('pins, archives and trashes with PATCH', async () => {
    await pinNote(1);
    await archiveNote(2);
    await moveToTrash(3);
    expect(apiClient.patch).toHaveBeenCalledWith('/api/notes/1/pin');
    expect(apiClient.patch).toHaveBeenCalledWith('/api/notes/2/archive');
    expect(apiClient.patch).toHaveBeenCalledWith('/api/notes/3/trash');
  });

  it('updates a note with PUT', async () => {
    await updateNote(4, { title: 'T', description: 'D' });
    expect(apiClient.put).toHaveBeenCalledWith('/api/notes/4', { title: 'T', description: 'D' });
  });
});
