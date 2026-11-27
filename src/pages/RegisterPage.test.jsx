import { render, screen } from '@testing-library/react';
import RegisterPage from './RegisterPage.jsx';

describe('RegisterPage', () => {
  it('renders', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
  });
});
