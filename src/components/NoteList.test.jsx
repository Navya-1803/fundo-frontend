import { render, screen } from '@testing-library/react';
import NoteList from './NoteList.jsx';

describe('NoteList', () => {
  it('renders one card per note with its actions', () => {
    const notes = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
    render(<NoteList notes={notes} renderActions={(note) => <button type="button">Open {note.title}</button>} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Open B' })).toBeInTheDocument();
  });

  it('shows the empty message', () => {
    render(<NoteList notes={[]} emptyMessage="Notes you add appear here" />);
    expect(screen.getByText('Notes you add appear here')).toBeInTheDocument();
  });
});
