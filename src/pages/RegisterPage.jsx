import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import FormField from '../components/FormField.jsx';
import { registerUser } from '../services/authService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { hasErrors, validateRegister } from '../utils/validators.js';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

// sign up form, after success the user is sent to the login page
function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(formData);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    setServerError('');
    try {
      const { confirmPassword, ...payload } = formData;
      await registerUser({ ...payload, email: payload.email.trim() });
      navigate('/login', { state: { message: 'Account created, please sign in' } });
    } catch (error) {
      setServerError(getErrorMessage(error, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="to continue to Fundoo Notes">
      {serverError && <div className="form-message error" role="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <FormField label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" />
          <FormField label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} autoComplete="family-name" />
        </div>
        <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <FormField label="Confirm password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <div className="auth-links">
        <span />
        <Link to="/login">Sign in instead</Link>
      </div>
    </AuthCard>
  );
}

export default RegisterPage;
