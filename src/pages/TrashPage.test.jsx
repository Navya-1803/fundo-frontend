import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TrashPage from './TrashPage.jsx';
import { deleteNoteForever, getTrashedNotes, moveToTrash } from '../services/noteService.js';

vi.mock('../services/noteService.js', () => ({ getTrashedNotes: vi.fn(), moveToTrash: vi.fn(), deleteNoteForever: vi.fn() }));

describe('TrashPage', () => {
  beforeEach(() => getTrashedNotes.mockResolvedValue({ data: [{ id: 4, title: 'Old', trashed: true }] }));
  afterEach(() => vi.restoreAllMocks() && vi.clearAllMocks());

  it('restores a note', async () => {
    moveToTrash.mockResolvedValue({});
    render(<TrashPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Restore' }));
    await waitFor(() => expect(moveToTrash).toHaveBeenCalledWith(4));
  });

  it('deletes forever after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    deleteNoteForever.mockResolvedValue({});
    render(<TrashPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Delete forever' }));
    await waitFor(() => expect(deleteNoteForever).toHaveBeenCalledWith(4));
  });

  it('keeps the note when the user cancels', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<TrashPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Delete forever' }));
    expect(deleteNoteForever).not.toHaveBeenCalled();
  });

  it('shows the empty state', async () => {
    getTrashedNotes.mockResolvedValue({ data: [] });
    render(<TrashPage />);
    expect(await screen.findByText('No notes in trash')).toBeInTheDocument();
  });
});
