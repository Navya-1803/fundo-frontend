import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LabelModal from './LabelModal.jsx';
import { createLabel, deleteLabel, renameLabel } from '../services/labelService.js';

vi.mock('../services/labelService.js', () => ({ createLabel: vi.fn(), renameLabel: vi.fn(), deleteLabel: vi.fn() }));

const labels = [{ id: 1, name: 'Work' }];

describe('LabelModal', () => {
  afterEach(() => vi.clearAllMocks());

  it('creates a label and notifies the parent', async () => {
    createLabel.mockResolvedValue({});
    const onChanged = vi.fn(() => Promise.resolve());
    render(<LabelModal labels={labels} onChanged={onChanged} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('New label name'), { target: { value: ' Travel ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(createLabel).toHaveBeenCalledWith('Travel'));
    expect(onChanged).toHaveBeenCalled();
  });

  it('renames and deletes labels', async () => {
    renameLabel.mockResolvedValue({});
    deleteLabel.mockResolvedValue({});
    render(<LabelModal labels={labels} onChanged={() => Promise.resolve()} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('Label Work'), { target: { value: 'Office' } });
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }));
    await waitFor(() => expect(renameLabel).toHaveBeenCalledWith(1, 'Office'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete Work' }));
    await waitFor(() => expect(deleteLabel).toHaveBeenCalledWith(1));
  });

  it('shows the backend error', async () => {
    createLabel.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { response: { data: { message: 'Label already exists: Work' } } })));
    render(<LabelModal labels={labels} onChanged={() => Promise.resolve()} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('New label name'), { target: { value: 'Work' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Label already exists: Work');
  });

  it('closes with Done', () => {
    const onClose = vi.fn();
    render(<LabelModal labels={[]} onChanged={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onClose).toHaveBeenCalled();
  });
});
