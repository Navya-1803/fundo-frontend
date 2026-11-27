import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import FormField from '../components/FormField.jsx';
import { resetPassword } from '../services/authService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { hasErrors, validateResetPassword } from '../utils/validators.js';

// sets a new password using the OTP from the forgot password page
function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [formData, setFormData] = useState({ email: state?.email || '', otp: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateResetPassword(formData);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    setServerError('');
    try {
      const response = await resetPassword({ email: formData.email.trim(), otp: formData.otp.trim(), newPassword: formData.newPassword });
      navigate('/login', { replace: true, state: { message: response.data.message } });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not reset the password'));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset password" subtitle="Enter the OTP and choose a new password">
      {state?.message && !serverError && (
        <div className="form-message success" role="status">
          {state.message}. Check your inbox (and spam folder) for the 6 digit code.
        </div>
      )}
      {serverError && <div className="form-message error" role="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="OTP" name="otp" value={formData.otp} onChange={handleChange} error={errors.otp} autoComplete="one-time-code" />
        <FormField label="New password" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} error={errors.newPassword} autoComplete="new-password" />
        <FormField label="Confirm password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Saving...' : 'Reset password'}
        </button>
      </form>
      <div className="auth-links">
        <Link to="/forgot-password">Send a new OTP</Link>
        <Link to="/login">Sign in</Link>
      </div>
    </AuthCard>
  );
}

export default ResetPasswordPage;
