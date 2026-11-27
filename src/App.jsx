import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import AppRoutes from './router/AppRoutes.jsx';

/**
 * Root component: login state and routing for the whole application.
 *
 * @author Navya Raj
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
