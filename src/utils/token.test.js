import { getToken, isLoggedIn, removeToken, setToken } from './token.js';

describe('token utils', () => {
  beforeEach(() => localStorage.clear());

  it('stores and reads the token', () => {
    setToken('abc');
    expect(getToken()).toBe('abc');
    expect(isLoggedIn()).toBe(true);
  });

  it('removes the token', () => {
    setToken('abc');
    removeToken();
    expect(getToken()).toBeNull();
    expect(isLoggedIn()).toBe(false);
  });
});
