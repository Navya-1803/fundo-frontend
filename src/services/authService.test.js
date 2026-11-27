import apiClient from '../utils/apiClient.js';
import { forgotPassword, loginUser, registerUser, resetPassword } from './authService.js';

vi.mock('../utils/apiClient.js', () => ({ default: { post: vi.fn(() => Promise.resolve({ data: {} })) } }));

describe('authService', () => {
  it('registers through the users endpoint', async () => {
    const data = { firstName: 'Navya', email: 'n@example.com', password: 'secret123' };
    await registerUser(data);
    expect(apiClient.post).toHaveBeenCalledWith('/api/users/register', data);
  });

  it('logs in through the users endpoint', async () => {
    await loginUser({ email: 'n@example.com', password: 'secret123' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/users/login', { email: 'n@example.com', password: 'secret123' });
  });

  it('requests and resets a password', async () => {
    await forgotPassword('n@example.com');
    await resetPassword({ email: 'n@example.com', otp: '123456', newPassword: 'newpass123' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/users/forgot-password', { email: 'n@example.com' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/users/reset-password', { email: 'n@example.com', otp: '123456', newPassword: 'newpass123' });
  });
});
