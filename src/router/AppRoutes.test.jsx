import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

vi.mock('../services/noteService.js', () => ({ getAllNotes: vi.fn(() => Promise.resolve({ data: [] })), createNote: vi.fn() }));

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
});
