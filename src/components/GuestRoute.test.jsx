import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

const renderAt = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<GuestRoute><p>login form</p></GuestRoute>} />
          <Route path="/dashboard" element={<p>dashboard</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

describe('GuestRoute', () => {
  beforeEach(() => localStorage.clear());

  it('shows the page to guests', () => {
    renderAt();
    expect(screen.getByText('login form')).toBeInTheDocument();
  });

  it('sends logged in users to the dashboard', () => {
    localStorage.setItem('fundoo_token', 'jwt');
    renderAt();
    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });
});
