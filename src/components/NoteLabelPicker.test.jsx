import { fireEvent, render, screen } from '@testing-library/react';
import NoteLabelPicker from './NoteLabelPicker.jsx';

const labels = [{ id: 1, name: 'Work' }, { id: 2, name: 'Home' }];
const note = { id: 5, title: 'Report', labels: [{ id: 1, name: 'Work' }] };

describe('NoteLabelPicker', () => {
  it('shows the current labels as checked and toggles them', () => {
    const onToggle = vi.fn(() => Promise.resolve());
    render(<NoteLabelPicker note={note} labels={labels} onToggle={onToggle} onClose={() => {}} />);
    expect(screen.getByLabelText('Work')).toBeChecked();
    expect(screen.getByLabelText('Home')).not.toBeChecked();
    fireEvent.click(screen.getByLabelText('Home'));
    expect(onToggle).toHaveBeenCalledWith(5, 2, true);
    fireEvent.click(screen.getByLabelText('Work'));
    expect(onToggle).toHaveBeenCalledWith(5, 1, false);
  });

  it('explains when there are no labels', () => {
    render(<NoteLabelPicker note={note} labels={[]} onToggle={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/No labels yet/)).toBeInTheDocument();
  });

  it('shows the error of a failed change', async () => {
    render(<NoteLabelPicker note={note} labels={labels} onToggle={() => Promise.reject(new Error('Label not found with id: 2'))} onClose={() => {}} />);
    fireEvent.click(screen.getByLabelText('Home'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Label not found with id: 2');
  });

  it('checks the box at once and reverts it when saving fails', async () => {
    let rejectCall;
    const onToggle = vi.fn(() => new Promise((resolve, reject) => { rejectCall = reject; }));
    render(<NoteLabelPicker note={note} labels={labels} onToggle={onToggle} onClose={() => {}} />);
    fireEvent.click(screen.getByLabelText('Home'));
    expect(screen.getByLabelText('Home')).toBeChecked();
    rejectCall(new Error('Cannot reach the server'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server');
    expect(screen.getByLabelText('Home')).not.toBeChecked();
  });
});
