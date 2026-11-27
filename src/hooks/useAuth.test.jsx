import { act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from './useAuth.jsx';
import { SESSION_EXPIRED_EVENT } from '../utils/apiClient.js';
import { getToken } from '../utils/token.js';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth', () => {
  beforeEach(() => localStorage.clear());

  it('logs in and out', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    act(() => result.current.login('jwt'));
    expect(result.current.isAuthenticated).toBe(true);
    expect(getToken()).toBe('jwt');
    act(() => result.current.logout());
    expect(result.current.isAuthenticated).toBe(false);
    expect(getToken()).toBeNull();
  });

  it('logs out when the session expires', () => {
    localStorage.setItem('fundoo_token', 'old');
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    act(() => window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT)));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('must be used inside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used inside AuthProvider');
    console.error.mockRestore();
  });
});
