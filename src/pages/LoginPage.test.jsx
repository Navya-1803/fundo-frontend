import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage.jsx';

describe('LoginPage', () => {
  it('renders', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});
