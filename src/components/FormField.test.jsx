import { fireEvent, render, screen } from '@testing-library/react';
import FormField from './FormField.jsx';

describe('FormField', () => {
  it('connects label and input and reports changes', () => {
    const onChange = vi.fn();
    render(<FormField label="Email" name="email" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows the error message', () => {
    render(<FormField label="Email" name="email" value="" onChange={() => {}} error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});
