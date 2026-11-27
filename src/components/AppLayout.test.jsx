import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useOutletContext } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import { getLabels } from '../services/labelService.js';
import { AuthProvider } from '../hooks/useAuth.jsx';

vi.mock('../services/labelService.js', () => ({ getLabels: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Work' }] })) }));

// shows the search text the layout passes to its pages
function SearchProbe() {
  const { searchQuery } = useOutletContext();
  return <p>query: {searchQuery}</p>;
}

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

  it('passes the search text to the page', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<SearchProbe />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
    fireEvent.change(screen.getByLabelText('Search notes'), { target: { value: 'milk' } });
    expect(screen.getByText('query: milk')).toBeInTheDocument();
  });

  it('shows labels in the sidebar and opens the label editor', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<p>page</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(await screen.findByRole('link', { name: /Work/ })).toBeInTheDocument();
    expect(getLabels).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Edit labels/ }));
    expect(screen.getByRole('dialog', { name: 'Edit labels' })).toBeInTheDocument();
  });
});
