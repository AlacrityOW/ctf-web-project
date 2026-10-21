// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your custom auth hook

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for the background cookie-check to settle
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verifying permissions...</p>
      </div>
    );
  }

  // 2. If the user is NOT authenticated, kick them back to login page
  if (!isAuthenticated) {
    // 'state: { from: location }' remembers where they were trying to go 
    // so you can automatically redirect them back after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If they are logged in, safely render the page
  return children;
}