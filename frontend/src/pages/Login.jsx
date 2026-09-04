// =============================================================
// Login — role-specific login screen (route: /login/:role)
// -------------------------------------------------------------
// Validates the password against the hardcoded CREDENTIALS table
// (see src/data/mockData.js) through AuthContext.login().
// On success the user is routed to that role's dashboard.
//
// UX details:
//   • Wrong password → error banner + subtle shake animation
//   • Demo hint box shows the hardcoded credential (demo only!)
//   • "Change role" link returns to the landing page
// =============================================================
import { useState } from 'react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES, CREDENTIALS } from '../data/mockData.js';
import {
  IconShield,
  IconStethoscope,
  IconWrench,
  IconAlert,
} from '../components/icons.jsx';

// Same role→icon mapping used on the landing page
const ROLE_ICONS = {
  admin: <IconShield className="h-7 w-7" />,
  doctor: <IconStethoscope className="h-7 w-7" />,
  maintenance: <IconWrench className="h-7 w-7" />,
};

export default function Login() {
  // :role comes from the URL — /login/admin, /login/doctor, ...
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // ---------- Local form state ----------
  const [userId, setUserId] = useState(CREDENTIALS[role]?.id ?? ''); // pre-filled ID (demo convenience)
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // banner text ('' = hidden)
  const [shakeKey, setShakeKey] = useState(0); // bump to retrigger the shake animation

  // Unknown role in the URL → bounce back to role selection
  if (!ROLES[role]) {
    return <Navigate to="/" replace />;
  }

  const roleMeta = ROLES[role];

  // ---------- Submit handler ----------
  const handleSubmit = (e) => {
    e.preventDefault(); // stay an SPA — no browser form post

    const result = login(role, password);

    if (result.ok) {
      // ✅ Success → go to this role's dashboard
      navigate(roleMeta.dashboardPath, { replace: true });
    } else {
      // ❌ Failure → show the error and replay the shake animation
      setError(result.error);
      setShakeKey((k) => k + 1);
    }
  };

  return (
    <PageShell showNav={false}>
      <div className="flex flex-1 items-center justify-center py-10">
        {/* Login card — white panel centred on the blue canvas */}
        <div className="w-full max-w-md animate-fade-in-up rounded-3xl bg-white/95 p-8 shadow-card-hover backdrop-blur">
          {/* Role badge: icon tile + role name */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              {ROLE_ICONS[role]}
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                {roleMeta.label} Login
              </h1>
              <p className="text-sm text-slate-500">{roleMeta.tagline}</p>
            </div>
          </div>

          {/* Error banner — only rendered when `error` is set.
              `key={shakeKey}` remounts it so the shake replays
              on every failed attempt. */}
          {error && (
            <div
              key={shakeKey}
              className="mt-6 flex animate-shake items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              role="alert"
            >
              <IconAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ---------- Credentials form ---------- */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* User ID — pre-filled for the demo, still editable */}
            <div>
              <label
                htmlFor="userId"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
            </div>

            {/* Submit — black pill button in the reference style */}
            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-card-hover active:translate-y-0"
            >
              Sign in to {roleMeta.label} Dashboard
            </button>
          </form>

          {/* Demo hint box — REMOVE before going to production.
              Shows the hardcoded credential so reviewers can log in. */}
          <div className="mt-6 rounded-xl bg-brand-faint px-4 py-3 text-center">
            <p className="text-xs font-semibold text-brand-dark">
              Demo credentials — ID: <span className="font-mono">{CREDENTIALS[role].id}</span>
              {' · '}
              Password: <span className="font-mono">{CREDENTIALS[role].password}</span>
            </p>
          </div>

          {/* Back link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Not {roleMeta.label}?{' '}
            <Link to="/" className="font-semibold text-brand hover:underline">
              Change role
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
