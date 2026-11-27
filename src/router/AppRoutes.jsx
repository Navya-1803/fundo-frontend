import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import GuestRoute from '../components/GuestRoute.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

// every screen of the application and who is allowed to open it
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      {/* every logged in page shares the navbar and sidebar layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
