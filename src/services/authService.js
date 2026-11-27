import apiClient from '../utils/apiClient.js';

// user account calls of the backend UserController
export const registerUser = (data) => apiClient.post('/api/users/register', data);

export const loginUser = (data) => apiClient.post('/api/users/login', data);

export const forgotPassword = (email) => apiClient.post('/api/users/forgot-password', { email });

export const resetPassword = (data) => apiClient.post('/api/users/reset-password', data);
