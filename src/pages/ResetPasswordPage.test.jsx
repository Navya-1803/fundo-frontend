import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage.jsx';
import { resetPassword } from '../services/authService.js';

vi.mock('../services/authService.js', () => ({ resetPassword: vi.fn() }));

function LoginProbe() {
  return <p>{useLocation().state?.message}</p>;
}

const renderPage = (state = { email: 'navya@example.com', otp: '123456' }) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/reset-password', state }]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<LoginProbe />} />
      </Routes>
    </MemoryRouter>,
  );

const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('ResetPasswordPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows the OTP and prefills the email', () => {
    renderPage();
    expect(screen.getByRole('status')).toHaveTextContent('123456');
    expect(screen.getByLabelText('Email')).toHaveValue('navya@example.com');
  });

  it('validates the form', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(screen.getByText('OTP must be 6 digits')).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('resets the password and goes to login', async () => {
    resetPassword.mockResolvedValue({ data: { message: 'Password changed successfully, please sign in' } });
    renderPage();
    fill('OTP', '123456');
    fill('New password', 'newpass123');
    fill('Confirm password', 'newpass123');
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(await screen.findByText('Password changed successfully, please sign in')).toBeInTheDocument();
    expect(resetPassword).toHaveBeenCalledWith({ email: 'navya@example.com', otp: '123456', newPassword: 'newpass123' });
  });

  it('shows the backend error for a wrong OTP', async () => {
    resetPassword.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { response: { data: { message: 'Invalid or expired OTP' } } })));
    renderPage();
    fill('OTP', '000000');
    fill('New password', 'newpass123');
    fill('Confirm password', 'newpass123');
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid or expired OTP');
  });
});
