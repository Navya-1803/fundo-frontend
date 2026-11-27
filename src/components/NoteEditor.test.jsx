import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NoteEditor from './NoteEditor.jsx';

const openEditor = () => fireEvent.click(screen.getByRole('button', { name: 'Take a note...' }));

describe('NoteEditor', () => {
  it('creates a note and collapses again', async () => {
    const onCreate = vi.fn(() => Promise.resolve());
    render(<NoteEditor onCreate={onCreate} />);
    openEditor();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Shopping ' } });
    fireEvent.change(screen.getByLabelText('Note text'), { target: { value: 'Milk' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({ title: 'Shopping', description: 'Milk' }));
    expect(await screen.findByRole('button', { name: 'Take a note...' })).toBeInTheDocument();
  });

  it('just closes when nothing was typed', () => {
    const onCreate = vi.fn();
    render(<NoteEditor onCreate={onCreate} />);
    openEditor();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Take a note...' })).toBeInTheDocument();
  });

  it('requires a title when only text is given', () => {
    const onCreate = vi.fn();
    render(<NoteEditor onCreate={onCreate} />);
    openEditor();
    fireEvent.change(screen.getByLabelText('Note text'), { target: { value: 'no title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('shows an error when saving fails', async () => {
    const onCreate = vi.fn(() => Promise.reject(new Error('Cannot reach the server')));
    render(<NoteEditor onCreate={onCreate} />);
    openEditor();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server');
  });
});
