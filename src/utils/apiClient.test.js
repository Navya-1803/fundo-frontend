import apiClient, { API_BASE_URL, SESSION_EXPIRED_EVENT, attachToken, handleResponseError } from './apiClient.js';
import { getToken, setToken } from './token.js';

describe('apiClient', () => {
  beforeEach(() => localStorage.clear());

  it('points to the backend', () => {
    expect(apiClient.defaults.baseURL).toBe(API_BASE_URL);
  });

  it('adds the bearer token when the user is logged in', () => {
    setToken('jwt');
    expect(attachToken({ headers: {} }).headers.Authorization).toBe('Bearer jwt');
  });

  it('sends no Authorization header without a token', () => {
    expect(attachToken({ headers: {} }).headers.Authorization).toBeUndefined();
  });

  it('clears the session when a protected call returns 401', async () => {
    setToken('expired');
    const listener = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, listener);
    await expect(handleResponseError({ config: { url: '/api/notes' }, response: { status: 401 } })).rejects.toBeDefined();
    expect(getToken()).toBeNull();
    expect(listener).toHaveBeenCalled();
    window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
  });

  it('keeps the session when login itself returns 401', async () => {
    setToken('keep');
    await expect(handleResponseError({ config: { url: '/api/users/login' }, response: { status: 401 } })).rejects.toBeDefined();
    expect(getToken()).toBe('keep');
  });
});
