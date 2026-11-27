import logo from '../assets/logo.svg';
import './AuthCard.css';

// common frame for login, register and password pages
function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="" width="36" height="36" />
          <span>Fundoo Notes</span>
        </div>
        <h1>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </section>
    </div>
  );
}

export default AuthCard;
