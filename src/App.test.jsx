import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('starts on the login page for guests', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});
