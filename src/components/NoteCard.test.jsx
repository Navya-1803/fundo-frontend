import { render, screen } from '@testing-library/react';
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
});
