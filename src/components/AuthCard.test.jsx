import { render, screen } from '@testing-library/react';
import AuthCard from './AuthCard.jsx';

describe('AuthCard', () => {
  it('shows title, subtitle and content', () => {
    render(<AuthCard title="Sign in" subtitle="to continue"><p>form</p></AuthCard>);
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText('to continue')).toBeInTheDocument();
    expect(screen.getByText('form')).toBeInTheDocument();
    expect(screen.getByText('Fundoo Notes')).toBeInTheDocument();
  });
});
