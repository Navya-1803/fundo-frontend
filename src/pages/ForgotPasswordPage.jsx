import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import FormField from '../components/FormField.jsx';
import { forgotPassword } from '../services/authService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { isValidEmail } from '../utils/validators.js';

// asks for the email and requests a one time password from the backend
function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    setServerError('');
    setLoading(true);
    try {
      const response = await forgotPassword(email.trim());
      // no mail server is connected, so the OTP from the response is shown on the next page
      navigate('/reset-password', { state: { email: email.trim(), otp: response.data.otp, message: response.data.message } });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not send the OTP'));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot password" subtitle="Enter your email to get a one time password">
      {serverError && <div className="form-message error" role="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} autoComplete="email" />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
      <div className="auth-links">
        <Link to="/login">Back to sign in</Link>
        <span />
      </div>
    </AuthCard>
  );
}

export default ForgotPasswordPage;
