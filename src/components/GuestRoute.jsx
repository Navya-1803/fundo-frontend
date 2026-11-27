import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

// login and register pages are skipped when the user is already logged in
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default GuestRoute;
