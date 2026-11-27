import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EditNoteModal from './EditNoteModal.jsx';

const note = { id: 7, title: 'Shopping', description: 'Milk' };

describe('EditNoteModal', () => {
  it('saves the edited note and closes', async () => {
    const onSave = vi.fn(() => Promise.resolve());
    const onClose = vi.fn();
    render(<EditNoteModal note={note} onSave={onSave} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Edit title'), { target: { value: 'Groceries ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(7, { title: 'Groceries', description: 'Milk' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not save an empty title', () => {
    const onSave = vi.fn();
    render(<EditNoteModal note={note} onSave={onSave} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('Edit title'), { target: { value: ' ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('closes with Cancel, Escape and the backdrop', () => {
    const onClose = vi.fn();
    render(<EditNoteModal note={note} onSave={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('keeps the dialog open when saving fails', async () => {
    const onClose = vi.fn();
    render(<EditNoteModal note={note} onSave={() => Promise.reject(new Error('Note not found with id: 7'))} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Note not found with id: 7');
    expect(onClose).not.toHaveBeenCalled();
  });
});
