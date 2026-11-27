import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// main navigation between the note views
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Notes', icon: '\u{1F4A1}' },
  { to: '/reminders', label: 'Reminders', icon: '\u{1F514}' },
  { to: '/archive', label: 'Archive', icon: '\u{1F4E5}' },
  { to: '/trash', label: 'Trash', icon: '\u{1F5D1}' },
];

function Sidebar({ open = true, labels = [], onEditLabels, children }) {
  return (
    <nav className={`sidebar ${open ? 'open' : 'collapsed'}`} aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
          <span className="sidebar-label">{item.label}</span>
        </NavLink>
      ))}
      {labels.map((label) => (
        <NavLink key={label.id} to={`/labels/${label.id}`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-icon" aria-hidden="true">&#127991;</span>
          <span className="sidebar-label">{label.name}</span>
        </NavLink>
      ))}
      {onEditLabels && (
        <button type="button" className="sidebar-link sidebar-button" onClick={onEditLabels}>
          <span className="sidebar-icon" aria-hidden="true">&#9998;</span>
          <span className="sidebar-label">Edit labels</span>
        </button>
      )}
      {children}
    </nav>
  );
}

export default Sidebar;
