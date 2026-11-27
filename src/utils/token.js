// all token handling lives here so the storage key is defined in one place
const TOKEN_KEY = 'fundoo_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const isLoggedIn = () => Boolean(getToken());
