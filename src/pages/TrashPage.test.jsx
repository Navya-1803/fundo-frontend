import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import TrashPage from './TrashPage.jsx';
import { deleteNoteForever, getTrashedNotes, moveToTrash } from '../services/noteService.js';

vi.mock('../services/noteService.js', () => ({ getTrashedNotes: vi.fn(), moveToTrash: vi.fn(), deleteNoteForever: vi.fn() }));

// renders the page the way the app layout does, with a search text
const renderWithSearch = (searchQuery) =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={{ searchQuery }} />}>
          <Route path="/" element={<TrashPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

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

  it('tells when no trashed note matches the search', async () => {
    renderWithSearch('zzz');
    expect(await screen.findByText('No matching notes')).toBeInTheDocument();
  });
});
