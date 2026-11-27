import { fireEvent, render, screen } from '@testing-library/react';
import NoteCard from './NoteCard.jsx';

describe('NoteCard', () => {
  it('shows title, description and actions', () => {
    render(<NoteCard note={{ id: 1, title: 'Shopping', description: 'Milk', pinned: false }} actions={<button type="button">Archive</button>} />);
    expect(screen.getByRole('heading', { name: 'Shopping' })).toBeInTheDocument();
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
    expect(screen.queryByText('Pinned')).not.toBeInTheDocument();
  });

  it('marks pinned notes', () => {
    render(<NoteCard note={{ id: 2, title: 'Ideas', pinned: true }} />);
    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('pinned');
  });

  it('opens the note when the text is clicked', () => {
    const onOpen = vi.fn();
    const note = { id: 3, title: 'Todo', description: 'x' };
    render(<NoteCard note={note} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit Todo' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Edit Todo' }), { key: 'Enter' });
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(onOpen).toHaveBeenCalledWith(note);
  });

  it('shows the reminder chip', () => {
    render(<NoteCard note={{ id: 5, title: 'Call', reminderTime: '2030-01-01T09:00:00' }} />);
    expect(screen.getByText(/2030/)).toBeInTheDocument();
  });

  it('shows label chips', () => {
    render(<NoteCard note={{ id: 6, title: 'Report', labels: [{ id: 1, name: 'Work' }] }} />);
    expect(screen.getByText('Work')).toBeInTheDocument();
  });
});
