import { fireEvent, render, screen } from '@testing-library/react';
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

  it('links to the reminders page', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Reminders/ })).toHaveAttribute('href', '/reminders');
  });

  it('lists labels and opens the label editor', () => {
    const onEditLabels = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar labels={[{ id: 3, name: 'Work' }]} onEditLabels={onEditLabels} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Work/ })).toHaveAttribute('href', '/labels/3');
    fireEvent.click(screen.getByRole('button', { name: /Edit labels/ }));
    expect(onEditLabels).toHaveBeenCalled();
  });
});
