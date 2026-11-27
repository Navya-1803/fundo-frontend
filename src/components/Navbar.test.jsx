import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

const renderNavbar = (props = {}) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Navbar {...props} />} />
          <Route path="/login" element={<p>login page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

describe('Navbar', () => {
  beforeEach(() => localStorage.setItem('fundoo_token', 'jwt'));

  it('shows the title and toggles the sidebar', () => {
    const onToggleSidebar = vi.fn();
    renderNavbar({ title: 'Archive', onToggleSidebar });
    expect(screen.getByText('Archive')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it('logs out and goes to login', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(localStorage.getItem('fundoo_token')).toBeNull();
  });
});
