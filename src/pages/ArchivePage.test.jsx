import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ArchivePage from './ArchivePage.jsx';
import { archiveNote, getArchivedNotes, moveToTrash } from '../services/noteService.js';

vi.mock('../services/noteService.js', () => ({ getArchivedNotes: vi.fn(), archiveNote: vi.fn(), moveToTrash: vi.fn() }));

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
});
