import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import DashboardPage from './DashboardPage.jsx';
import { archiveNote, createNote, getAllNotes, moveToTrash, pinNote, updateNote } from '../services/noteService.js';
import { setReminder } from '../services/reminderService.js';

vi.mock('../services/noteService.js', () => ({
  getAllNotes: vi.fn(),
  createNote: vi.fn(),
  pinNote: vi.fn(),
  archiveNote: vi.fn(),
  moveToTrash: vi.fn(),
  updateNote: vi.fn(),
}));
vi.mock('../services/reminderService.js', () => ({ setReminder: vi.fn() }));

const notes = [
  { id: 1, title: 'Shopping', description: 'Milk', pinned: false },
  { id: 2, title: 'Ideas', description: '', pinned: true },
];

// renders the page the way the app layout does, with a search text
const renderWithSearch = (searchQuery) =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={{ searchQuery }} />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

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

  it('filters notes with the search text', async () => {
    getAllNotes.mockResolvedValue({ data: notes });
    renderWithSearch('milk');
    expect(await screen.findByRole('heading', { name: 'Shopping' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Ideas' })).not.toBeInTheDocument();
  });

  it('tells when nothing matches', async () => {
    getAllNotes.mockResolvedValue({ data: notes });
    renderWithSearch('zzz');
    expect(await screen.findByText('No matching notes')).toBeInTheDocument();
  });

  it('sets a reminder through the picker', async () => {
    getAllNotes.mockResolvedValue({ data: [{ id: 1, title: 'Shopping', pinned: false }] });
    setReminder.mockResolvedValue({});
    render(<DashboardPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Remind me' }));
    fireEvent.change(screen.getByLabelText('Date and time'), { target: { value: '2999-02-01T10:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save reminder' }));
    await waitFor(() => expect(setReminder).toHaveBeenCalledWith(1, '2999-02-01T10:00:00', undefined));
  });
});
