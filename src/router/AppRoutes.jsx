import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import GuestRoute from '../components/GuestRoute.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import ArchivePage from '../pages/ArchivePage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import LabelPage from '../pages/LabelPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ReminderPage from '../pages/ReminderPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import TrashPage from '../pages/TrashPage.jsx';

// every screen of the application and who is allowed to open it
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
      {/* every logged in page shares the navbar and sidebar layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reminders" element={<ReminderPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/labels/:labelId" element={<LabelPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
