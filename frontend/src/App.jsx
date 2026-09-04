// =============================================================
// App — root component & route table
// -------------------------------------------------------------
// Route map:
//   /                        → RoleSelection (pick Admin / Doctor / Maintenance)
//   /login/:role             → Login screen for the chosen role
//   /admin/dashboard         → Admin dashboard       (protected)
//   /doctor/dashboard        → Doctor dashboard      (protected)
//   /maintenance/dashboard   → Maintenance dashboard (protected)
//   *                        → anything else redirects to "/"
//
// "Protected" means the user must be authenticated with the
// matching role — see components/ProtectedRoute.jsx.
// =============================================================
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleSelection from './pages/RoleSelection.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import MaintenanceDashboard from './pages/MaintenanceDashboard.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:role" element={<Login />} />

      {/* Protected dashboards — one per role */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/dashboard"
        element={
          <ProtectedRoute role="maintenance">
            <MaintenanceDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback — unknown URLs go back to role selection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
