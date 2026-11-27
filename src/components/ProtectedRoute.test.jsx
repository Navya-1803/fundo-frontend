import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

const renderAt = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>login page</p>} />
          <Route path="/dashboard" element={<ProtectedRoute><p>secret dashboard</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

describe('ProtectedRoute', () => {
  beforeEach(() => localStorage.clear());

  it('redirects to login without a token', () => {
    renderAt();
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('shows the page with a token', () => {
    localStorage.setItem('fundoo_token', 'jwt');
    renderAt();
    expect(screen.getByText('secret dashboard')).toBeInTheDocument();
  });
});
