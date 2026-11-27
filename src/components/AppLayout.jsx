import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import SearchBar from './SearchBar.jsx';
import Sidebar from './Sidebar.jsx';
import './AppLayout.css';

// frame of every logged in page: navbar on top, sidebar left, page content right
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // search text is shared with the current page through the outlet context
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </Navbar>
      <div className="app-body">
        <Sidebar open={sidebarOpen} />
        <main className="app-content">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
