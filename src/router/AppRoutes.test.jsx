import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

vi.mock('../services/noteService.js', () => ({
  getAllNotes: vi.fn(() => Promise.resolve({ data: [] })),
  getArchivedNotes: vi.fn(() => Promise.resolve({ data: [] })),
  getTrashedNotes: vi.fn(() => Promise.resolve({ data: [] })),
}));

const renderAt = (path) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  );

describe('AppRoutes', () => {
  beforeEach(() => localStorage.clear());

  it('shows the register page', () => {
    renderAt('/register');
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  });

  it('sends unknown urls of guests to login', () => {
    renderAt('/somewhere');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('opens the dashboard for logged in users', () => {
    localStorage.setItem('fundoo_token', 'jwt');
    renderAt('/');
    expect(screen.getByRole('button', { name: 'Take a note...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('opens archive and trash pages', async () => {
    localStorage.setItem('fundoo_token', 'jwt');
    renderAt('/trash');
    expect(await screen.findByText('No notes in trash')).toBeInTheDocument();
  });
});
