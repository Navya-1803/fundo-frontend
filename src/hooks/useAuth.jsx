import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SESSION_EXPIRED_EVENT } from '../utils/apiClient.js';
import { getToken, removeToken, setToken } from '../utils/token.js';

const AuthContext = createContext(null);

/**
 * Keeps the login state of the whole app. Pages call login() after a
 * successful login request and logout() from the navbar.
 */
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const login = useCallback((newToken) => {
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
  }, []);

  // the API client fires this event when the backend rejects the token
  useEffect(() => {
    const onExpired = () => setTokenState(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const value = useMemo(() => ({ token, isAuthenticated: Boolean(token), login, logout }), [token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
