import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import ArchivePage from './ArchivePage.jsx';
import { archiveNote, getArchivedNotes, moveToTrash } from '../services/noteService.js';

vi.mock('../services/noteService.js', () => ({ getArchivedNotes: vi.fn(), archiveNote: vi.fn(), moveToTrash: vi.fn() }));

// renders the page the way the app layout does, with a search text
const renderWithSearch = (searchQuery) =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={{ searchQuery }} />}>
          <Route path="/" element={<ArchivePage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('ArchivePage', () => {
  afterEach(() => vi.clearAllMocks());

  it('lists archived notes', async () => {
    getArchivedNotes.mockResolvedValue({ data: [{ id: 1, title: 'Old idea', archived: true }] });
    render(<ArchivePage />);
    expect(await screen.findByRole('heading', { name: 'Old idea' })).toBeInTheDocument();
  });

  it('shows the empty state', async () => {
    getArchivedNotes.mockResolvedValue({ data: [] });
    render(<ArchivePage />);
    expect(await screen.findByText('Your archived notes appear here')).toBeInTheDocument();
  });

  it('unarchives and trashes notes', async () => {
    getArchivedNotes.mockResolvedValue({ data: [{ id: 1, title: 'Old idea', archived: true }] });
    archiveNote.mockResolvedValue({});
    moveToTrash.mockResolvedValue({});
    render(<ArchivePage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Unarchive' }));
    await waitFor(() => expect(archiveNote).toHaveBeenCalledWith(1));
    fireEvent.click(await screen.findByRole('button', { name: 'Trash' }));
    await waitFor(() => expect(moveToTrash).toHaveBeenCalledWith(1));
  });

  it('filters archived notes with the search text', async () => {
    getArchivedNotes.mockResolvedValue({ data: [{ id: 1, title: 'Old idea' }, { id: 2, title: 'Recipe' }] });
    renderWithSearch('recipe');
    expect(await screen.findByRole('heading', { name: 'Recipe' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Old idea' })).not.toBeInTheDocument();
  });
});
