import { getErrorMessage } from './errorMessage.js';

describe('getErrorMessage', () => {
  it('uses the backend message', () => {
    expect(getErrorMessage({ response: { data: { message: 'Invalid email or password' } } })).toBe('Invalid email or password');
  });

  it('joins validation errors', () => {
    const error = { response: { data: { message: 'Validation failed', validationErrors: { email: 'Enter a valid email', title: 'Title is required' } } } };
    expect(getErrorMessage(error)).toBe('Enter a valid email, Title is required');
  });

  it('explains when the server cannot be reached', () => {
    expect(getErrorMessage({ request: {} })).toContain('Cannot reach the server');
  });

  it('falls back to a default message', () => {
    expect(getErrorMessage({}, 'fallback')).toBe('fallback');
    expect(getErrorMessage({ response: { data: {} } }, 'fallback')).toBe('fallback');
  });
});
