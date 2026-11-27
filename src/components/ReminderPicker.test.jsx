import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReminderPicker from './ReminderPicker.jsx';

const note = { id: 3, title: 'Call mom' };

describe('ReminderPicker', () => {
  it('saves a future reminder with seconds added', async () => {
    const onSave = vi.fn(() => Promise.resolve());
    const onClose = vi.fn();
    render(<ReminderPicker note={note} onSave={onSave} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Date and time'), { target: { value: '2999-01-01T09:30' } });
    fireEvent.change(screen.getByLabelText('Message (optional)'), { target: { value: ' Ring ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save reminder' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(3, '2999-01-01T09:30:00', 'Ring'));
    expect(onClose).toHaveBeenCalled();
  });

  it('rejects a time in the past', () => {
    const onSave = vi.fn();
    render(<ReminderPicker note={note} onSave={onSave} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('Date and time'), { target: { value: '2000-01-01T09:30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save reminder' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Reminder time must be in the future');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows the backend error', async () => {
    render(<ReminderPicker note={note} onSave={() => Promise.reject(new Error('Note not found with id: 3'))} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Save reminder' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Note not found with id: 3');
  });
});
