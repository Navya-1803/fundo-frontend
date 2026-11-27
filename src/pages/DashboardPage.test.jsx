import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage.jsx';

describe('DashboardPage', () => {
  it('renders', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
