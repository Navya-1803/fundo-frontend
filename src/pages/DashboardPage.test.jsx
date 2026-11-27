import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DashboardPage from './DashboardPage.jsx';
import { archiveNote, createNote, getAllNotes, moveToTrash, pinNote, updateNote } from '../services/noteService.js';

vi.mock('../services/noteService.js', () => ({
  getAllNotes: vi.fn(),
  createNote: vi.fn(),
  pinNote: vi.fn(),
  archiveNote: vi.fn(),
  moveToTrash: vi.fn(),
  updateNote: vi.fn(),
}));

const notes = [
  { id: 1, title: 'Shopping', description: 'Milk', pinned: false },
  { id: 2, title: 'Ideas', description: '', pinned: true },
];

describe('DashboardPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows pinned and other notes', async () => {
    getAllNotes.mockResolvedValue({ data: notes });
    render(<DashboardPage />);
    expect(screen.getByText('Loading notes...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Pinned' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ideas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Shopping' })).toBeInTheDocument();
  });

  it('shows the empty state', async () => {
    getAllNotes.mockResolvedValue({ data: [] });
    render(<DashboardPage />);
    expect(await screen.findByText('Notes you add appear here')).toBeInTheDocument();
  });

  it('creates a note and reloads the list', async () => {
    getAllNotes.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce({ data: [{ id: 3, title: 'New', pinned: false }] });
    createNote.mockResolvedValue({ data: { id: 3 } });
    render(<DashboardPage />);
    await screen.findByText('Notes you add appear here');
    fireEvent.click(screen.getByRole('button', { name: 'Take a note...' }));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(createNote).toHaveBeenCalledWith({ title: 'New', description: '' }));
    expect(await screen.findByRole('heading', { name: 'New' })).toBeInTheDocument();
  });

  it('shows the loading error', async () => {
    getAllNotes.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { request: {} })));
    render(<DashboardPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server');
  });

  it('pins, archives and trashes a note then reloads', async () => {
    getAllNotes.mockResolvedValue({ data: [{ id: 1, title: 'Shopping', pinned: false }] });
    pinNote.mockResolvedValue({});
    archiveNote.mockResolvedValue({});
    moveToTrash.mockResolvedValue({});
    render(<DashboardPage />);
    await screen.findByRole('heading', { name: 'Shopping' });
    fireEvent.click(screen.getByRole('button', { name: 'Pin' }));
    await waitFor(() => expect(pinNote).toHaveBeenCalledWith(1));
    fireEvent.click(await screen.findByRole('button', { name: 'Archive' }));
    await waitFor(() => expect(archiveNote).toHaveBeenCalledWith(1));
    fireEvent.click(await screen.findByRole('button', { name: 'Trash' }));
    await waitFor(() => expect(moveToTrash).toHaveBeenCalledWith(1));
    expect(getAllNotes).toHaveBeenCalledTimes(4);
  });

  it('shows the error of a failed action', async () => {
    getAllNotes.mockResolvedValue({ data: [{ id: 1, title: 'Shopping', pinned: false }] });
    pinNote.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { response: { data: { message: 'Note not found with id: 1' } } })));
    render(<DashboardPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Pin' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Note not found with id: 1');
  });

  it('edits a note through the dialog', async () => {
    getAllNotes.mockResolvedValue({ data: [{ id: 1, title: 'Shopping', description: 'Milk', pinned: false }] });
    updateNote.mockResolvedValue({});
    render(<DashboardPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Edit Shopping' }));
    fireEvent.change(screen.getByLabelText('Edit title'), { target: { value: 'Groceries' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(updateNote).toHaveBeenCalledWith(1, { title: 'Groceries', description: 'Milk' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
