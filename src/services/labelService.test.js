import apiClient from '../utils/apiClient.js';
import {
  addLabelToNote,
  createLabel,
  deleteLabel,
  getLabels,
  getNotesByLabel,
  removeLabelFromNote,
  renameLabel,
} from './labelService.js';

vi.mock('../utils/apiClient.js', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({})),
  },
}));

describe('labelService', () => {
  it('manages labels', async () => {
    await getLabels();
    await createLabel('Work');
    await renameLabel(1, 'Office');
    await deleteLabel(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/labels');
    expect(apiClient.post).toHaveBeenCalledWith('/api/labels', { name: 'Work' });
    expect(apiClient.put).toHaveBeenCalledWith('/api/labels/1', { name: 'Office' });
    expect(apiClient.delete).toHaveBeenCalledWith('/api/labels/1');
  });

  it('labels notes', async () => {
    await getNotesByLabel(2);
    await addLabelToNote(5, 2);
    await removeLabelFromNote(5, 2);
    expect(apiClient.get).toHaveBeenCalledWith('/api/labels/2/notes');
    expect(apiClient.post).toHaveBeenCalledWith('/api/notes/5/labels/2');
    expect(apiClient.delete).toHaveBeenCalledWith('/api/notes/5/labels/2');
  });
});
