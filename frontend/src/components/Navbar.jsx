// =============================================================
// Navbar — top navigation bar
// -------------------------------------------------------------
// Mirrors the reference theme: logo pinned left, a white pill
// container in the middle with black/white toggle buttons, and
// (when logged in) the user chip + logout on the right.
//
// Props:
//   showNav  — hide the centre pill on auth screens (cleaner)
// =============================================================
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../data/mockData.js';
import Logo from './Logo.jsx';
import { IconLogout } from './icons.jsx';

export default function Navbar({ showNav = true }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  // Sign out and return to the role-selection landing page
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="relative z-20 flex w-full items-center justify-between px-4 py-4 sm:px-8">
      {/* Left — brand logo; clicking it always returns home */}
      <button onClick={() => navigate('/')} aria-label="Go to home" className="shrink-0">
        <Logo />
      </button>

      {/* Centre — white pill nav (reference theme signature element).
          Absolutely centred so it stays put regardless of side content. */}
      {showNav && (
        <nav className="absolute left-1/2 hidden -translate-x-1/2 sm:block">
          <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-card">
            <span className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white">
              {session ? `${ROLES[session.role].label} Portal` : 'MedCare HMS'}
            </span>
            <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
              24 × 7 Care
            </span>
          </div>
        </nav>
      )}

      {/* Right — authenticated user chip + logout, or spacer */}
      {session ? (
        <div className="flex items-center gap-3">
          {/* User identity chip */}
          <div className="hidden items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur md:flex">
            {/* Pulsing green dot = active session */}
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-green-400" />
            <span className="text-sm font-semibold text-white">{session.name}</span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-200 hover:bg-slate-800"
          >
            <IconLogout className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : (
        // Keeps the flex layout balanced when logged out
        <div className="w-24" aria-hidden="true" />
      )}
    </header>
  );
}
