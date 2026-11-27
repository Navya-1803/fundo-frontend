import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';
import { loginUser } from '../services/authService.js';
import { getToken } from '../utils/token.js';

vi.mock('../services/authService.js', () => ({ loginUser: vi.fn() }));

const renderPage = (state) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<p>dashboard</p>} />
          <Route path="/archive" element={<p>archive</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('LoginPage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.clearAllMocks());

  it('validates the form before calling the backend', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it('stores the token and opens the dashboard', async () => {
    loginUser.mockResolvedValue({ data: { token: 'jwt-token', message: 'Login successful' } });
    renderPage();
    fill('Email', 'navya@example.com');
    fill('Password', 'secret123');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('dashboard')).toBeInTheDocument();
    expect(getToken()).toBe('jwt-token');
  });

  it('returns to the page the user wanted', async () => {
    loginUser.mockResolvedValue({ data: { token: 'jwt-token' } });
    renderPage({ from: '/archive' });
    fill('Email', 'navya@example.com');
    fill('Password', 'secret123');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('archive')).toBeInTheDocument();
  });

  it('shows the backend error for wrong credentials', async () => {
    loginUser.mockImplementation(() =>
      Promise.reject(Object.assign(new Error('Unauthorized'), { response: { status: 401, data: { message: 'Invalid email or password' } } })),
    );
    renderPage();
    fill('Email', 'navya@example.com');
    fill('Password', 'wrong1234');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
    expect(getToken()).toBeNull();
  });

  it('shows the message passed from the register page', () => {
    renderPage({ message: 'Account created, please sign in' });
    expect(screen.getByRole('status')).toHaveTextContent('Account created, please sign in');
  });
});
