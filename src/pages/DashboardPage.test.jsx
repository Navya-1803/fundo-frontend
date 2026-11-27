import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DashboardPage from './DashboardPage.jsx';
import { createNote, getAllNotes } from '../services/noteService.js';

vi.mock('../services/noteService.js', () => ({ getAllNotes: vi.fn(), createNote: vi.fn() }));

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
});
