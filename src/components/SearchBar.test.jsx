import { fireEvent, render, screen } from '@testing-library/react';
import SearchBar from './SearchBar.jsx';

describe('SearchBar', () => {
  it('reports typed text', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Search notes'), { target: { value: 'milk' } });
    expect(onChange).toHaveBeenCalledWith('milk');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('clears the search', () => {
    const onChange = vi.fn();
    render(<SearchBar value="milk" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
