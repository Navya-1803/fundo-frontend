import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// main navigation between the note views
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Notes', icon: '\u{1F4A1}' },
  { to: '/reminders', label: 'Reminders', icon: '\u{1F514}' },
  { to: '/archive', label: 'Archive', icon: '\u{1F4E5}' },
  { to: '/trash', label: 'Trash', icon: '\u{1F5D1}' },
];

function Sidebar({ open = true, children }) {
  return (
    <nav className={`sidebar ${open ? 'open' : 'collapsed'}`} aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
          <span className="sidebar-label">{item.label}</span>
        </NavLink>
      ))}
      {children}
    </nav>
  );
}

export default Sidebar;
