import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage.jsx';
import { forgotPassword } from '../services/authService.js';

vi.mock('../services/authService.js', () => ({ forgotPassword: vi.fn() }));

function ResetProbe() {
  const { state } = useLocation();
  return <p>{`${state.email} ${state.otp}`}</p>;
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/forgot-password']}>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetProbe />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ForgotPasswordPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('validates the email', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Send OTP' }));
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it('requests the OTP and opens the reset page', async () => {
    forgotPassword.mockResolvedValue({ data: { message: 'OTP sent', otp: '123456' } });
    renderPage();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'navya@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send OTP' }));
    expect(await screen.findByText('navya@example.com 123456')).toBeInTheDocument();
  });

  it('shows the backend error', async () => {
    forgotPassword.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { response: { data: { message: 'No account found with this email' } } })));
    renderPage();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nobody@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send OTP' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No account found with this email');
  });
});
