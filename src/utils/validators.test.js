import {
  hasErrors,
  isStrongPassword,
  isValidEmail,
  validateLogin,
  validateNote,
  validateRegister,
  validateResetPassword,
} from './validators.js';

describe('validators', () => {
  it('checks email format', () => {
    expect(isValidEmail('navya@example.com')).toBe(true);
    expect(isValidEmail('navya@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('checks password strength like the backend', () => {
    expect(isStrongPassword('secret123')).toBe(true);
    expect(isStrongPassword('short1')).toBe(false);
    expect(isStrongPassword('onlyletters')).toBe(false);
  });

  it('validates the login form', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
    expect(hasErrors(validateLogin({ email: 'navya@example.com', password: 'x' }))).toBe(false);
  });

  it('validates the register form', () => {
    const errors = validateRegister({ firstName: 'N', email: 'bad', password: 'abc', confirmPassword: 'abd' });
    expect(Object.keys(errors)).toEqual(['firstName', 'email', 'password', 'confirmPassword']);
    expect(
      hasErrors(validateRegister({ firstName: 'Navya', email: 'navya@example.com', password: 'secret123', confirmPassword: 'secret123' })),
    ).toBe(false);
  });

  it('validates a note', () => {
    expect(validateNote({ title: ' ' }).title).toBe('Title is required');
    expect(validateNote({ title: 'a'.repeat(101) }).title).toBeDefined();
    expect(validateNote({ title: 'ok', description: 'a'.repeat(2001) }).description).toBeDefined();
    expect(hasErrors(validateNote({ title: 'Shopping', description: 'Milk' }))).toBe(false);
  });

  it('validates the reset password form', () => {
    expect(Object.keys(validateResetPassword({ email: 'x', otp: '12', newPassword: 'a', confirmPassword: 'b' }))).toEqual([
      'email',
      'otp',
      'newPassword',
      'confirmPassword',
    ]);
    expect(
      hasErrors(validateResetPassword({ email: 'n@example.com', otp: '123456', newPassword: 'newpass123', confirmPassword: 'newpass123' })),
    ).toBe(false);
  });
});
