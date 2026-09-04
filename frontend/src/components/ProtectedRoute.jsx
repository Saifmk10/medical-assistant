// =============================================================
// ProtectedRoute — route guard for dashboards
// -------------------------------------------------------------
// Wraps a route element and only renders it when the current
// session matches the required role. Otherwise it redirects:
//   • not logged in at all → that role's login page
//   • logged in as another role → their own dashboard
// =============================================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../data/mockData.js';

export default function ProtectedRoute({ role, children }) {
  const { session } = useAuth();

  // No session → send to the login screen for this role
  if (!session) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  // Logged in but with a different role → send to THEIR dashboard
  if (session.role !== role) {
    return <Navigate to={ROLES[session.role].dashboardPath} replace />;
  }

  // Authorised — render the requested dashboard
  return children;
}
