import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

describe('Sidebar', () => {
  it('links to every note view and marks the current one', () => {
    render(
      <MemoryRouter initialEntries={['/archive']}>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Notes/ })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /Trash/ })).toHaveAttribute('href', '/trash');
    expect(screen.getByRole('link', { name: /Archive/ })).toHaveClass('active');
  });

  it('can be collapsed', () => {
    render(
      <MemoryRouter>
        <Sidebar open={false} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('navigation')).toHaveClass('collapsed');
  });
});
