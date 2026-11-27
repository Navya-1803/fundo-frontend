import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import FormField from '../components/FormField.jsx';
import { forgotPassword } from '../services/authService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { isValidEmail } from '../utils/validators.js';

// asks for the email, the backend then emails a one time password to it
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
      // the backend emails the OTP, the next page only shows where it was sent
      navigate('/reset-password', { state: { email: email.trim(), message: response.data.message } });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not send the OTP'));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot password" subtitle="We will email you a one time password">
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
