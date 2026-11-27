import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../hooks/useAuth.jsx';
import './Navbar.css';

// top bar with the menu toggle, app name and logout button
function Navbar({ title = 'Fundoo Notes', onToggleSidebar, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <button type="button" className="icon-button" aria-label="Toggle menu" onClick={onToggleSidebar}>
        &#9776;
      </button>
      <img src={logo} alt="" width="32" height="32" />
      <span className="navbar-title">{title}</span>
      <div className="navbar-center">{children}</div>
      <button type="button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
