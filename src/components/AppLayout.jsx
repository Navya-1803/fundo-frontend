import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLabels } from '../hooks/useLabels.js';
import LabelModal from './LabelModal.jsx';
import Navbar from './Navbar.jsx';
import SearchBar from './SearchBar.jsx';
import Sidebar from './Sidebar.jsx';
import './AppLayout.css';

// frame of every logged in page: navbar on top, sidebar left, page content right
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // search text is shared with the current page through the outlet context
  const [searchQuery, setSearchQuery] = useState('');
  // labels are shown in the sidebar and offered on every note
  const { labels, reloadLabels } = useLabels();
  const [editingLabels, setEditingLabels] = useState(false);

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </Navbar>
      <div className="app-body">
        <Sidebar open={sidebarOpen} labels={labels} onEditLabels={() => setEditingLabels(true)} />
        <main className="app-content">
          <Outlet context={{ searchQuery, labels, reloadLabels }} />
        </main>
      </div>
      {editingLabels && <LabelModal labels={labels} onChanged={reloadLabels} onClose={() => setEditingLabels(false)} />}
    </div>
  );
}

export default AppLayout;
