// client side checks give quick feedback, the backend validates again

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// same rule as the backend: at least 8 characters with a letter and a digit
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const isValidEmail = (email) => EMAIL_PATTERN.test((email || '').trim());

export const isStrongPassword = (password) => PASSWORD_PATTERN.test(password || '');

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateRegister = ({ firstName, email, password, confirmPassword }) => {
  const errors = {};
  if (!firstName?.trim()) errors.firstName = 'First name is required';
  else if (firstName.trim().length < 2) errors.firstName = 'First name must have at least 2 characters';
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email';
  if (!isStrongPassword(password)) {
    errors.password = 'Password must be at least 8 characters and contain a letter and a digit';
  }
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateResetPassword = ({ email, otp, newPassword, confirmPassword }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'Enter a valid email';
  if (!/^\d{6}$/.test((otp || '').trim())) errors.otp = 'OTP must be 6 digits';
  if (!isStrongPassword(newPassword)) {
    errors.newPassword = 'Password must be at least 8 characters and contain a letter and a digit';
  }
  if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateNote = ({ title, description }) => {
  const errors = {};
  if (!title?.trim()) errors.title = 'Title is required';
  else if (title.trim().length > 100) errors.title = 'Title must be at most 100 characters';
  if ((description || '').length > 2000) errors.description = 'Description must be at most 2000 characters';
  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
