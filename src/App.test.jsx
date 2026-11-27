import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Fundoo Notes' })).toBeInTheDocument();
  });
});
