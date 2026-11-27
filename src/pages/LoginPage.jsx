import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { loginUser } from '../services/authService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { hasErrors, validateLogin } from '../utils/validators.js';

// sign in form, the token from the backend is stored through the auth context
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  // message passed by register or reset password pages
  const infoMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    setServerError('');
    try {
      const response = await loginUser({ email: formData.email.trim(), password: formData.password });
      login(response.data.token);
      // go back to the page the user wanted before being sent to login
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error, 'Login failed'));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Sign in" subtitle="to continue to Fundoo Notes">
      {infoMessage && !serverError && <div className="form-message success" role="status">{infoMessage}</div>}
      {serverError && <div className="form-message error" role="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Create account</Link>
      </div>
    </AuthCard>
  );
}

export default LoginPage;
