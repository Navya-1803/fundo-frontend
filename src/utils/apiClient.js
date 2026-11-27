import axios from 'axios';
import { getToken, removeToken } from './token.js';

// event fired when the backend rejects the token, the auth context listens to it
export const SESSION_EXPIRED_EVENT = 'fundoo:session-expired';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// attaches the JWT to every request so services do not need to do it
export const attachToken = (config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// a 401 on a protected call means the token is missing or expired
export const handleResponseError = (error) => {
  const isAuthCall = error?.config?.url?.startsWith('/api/users');
  if (error?.response?.status === 401 && !isAuthCall) {
    removeToken();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
  return Promise.reject(error);
};

apiClient.interceptors.request.use(attachToken);
apiClient.interceptors.response.use((response) => response, handleResponseError);

export default apiClient;
