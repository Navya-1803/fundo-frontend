import apiClient from '../utils/apiClient.js';

// user account calls of the backend UserController
export const registerUser = (data) => apiClient.post('/api/users/register', data);

export const loginUser = (data) => apiClient.post('/api/users/login', data);
