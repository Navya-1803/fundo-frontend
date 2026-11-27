import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import RegisterPage from './RegisterPage.jsx';
import { registerUser } from '../services/authService.js';

vi.mock('../services/authService.js', () => ({ registerUser: vi.fn() }));

// stands in for the login page and shows the message passed by the register page
function LoginProbe() {
  const location = useLocation();
  return <p>{location.state?.message}</p>;
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginProbe />} />
      </Routes>
    </MemoryRouter>,
  );

const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

const fillValidForm = () => {
  fill('First name', 'Navya');
  fill('Last name', 'Raj');
  fill('Email', 'navya@example.com');
  fill('Password', 'secret123');
  fill('Confirm password', 'secret123');
};

describe('RegisterPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows validation errors and does not call the backend', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('registers and goes to login', async () => {
    registerUser.mockResolvedValue({ data: { id: 1 } });
    renderPage();
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    await waitFor(() => expect(screen.getByText('Account created, please sign in')).toBeInTheDocument());
    expect(registerUser).toHaveBeenCalledWith({ firstName: 'Navya', lastName: 'Raj', email: 'navya@example.com', password: 'secret123' });
  });

  it('shows the backend error', async () => {
    registerUser.mockImplementation(() =>
      Promise.reject(Object.assign(new Error('Conflict'), { response: { data: { message: 'Email already registered' } } })),
    );
    renderPage();
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email already registered');
  });
});
