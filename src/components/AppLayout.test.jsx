import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

describe('AppLayout', () => {
  it('renders navbar, sidebar and the child page', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<p>page content</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(screen.getByText('page content')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveClass('open');
    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(screen.getByRole('navigation')).toHaveClass('collapsed');
  });
});
