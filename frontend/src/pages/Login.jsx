// =============================================================
// Login — single unified login screen (route: /)
// -------------------------------------------------------------
// Validates the user ID + password against the hardcoded
// CREDENTIALS table (see src/data/mockData.js) through
// AuthContext.login(). The role is resolved from the matched
// credentials, and the user is routed to that role's dashboard.
//
// UX details:
//   • Wrong credentials → error banner + subtle shake animation
//   • Demo hint box lists all hardcoded credentials (demo only!)
// =============================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES, CREDENTIALS } from '../data/mockData.js';
import { IconPulse, IconAlert } from '../components/icons.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ---------- Local form state ----------
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // banner text ('' = hidden)
  const [shakeKey, setShakeKey] = useState(0); // bump to retrigger the shake animation

  // ---------- Submit handler ----------
  const handleSubmit = (e) => {
    e.preventDefault(); // stay an SPA — no browser form post

    const result = login(userId, password);

    if (result.ok) {
      // ✅ Success → go to the resolved role's dashboard
      navigate(ROLES[result.role].dashboardPath, { replace: true });
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
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <IconPulse className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                MedCare Portal Login
              </h1>
              <p className="text-sm text-slate-500">
                Sign in with your hospital user ID
              </p>
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
            {/* User ID */}
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
                placeholder="Enter your user ID"
                autoComplete="username"
                autoFocus
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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
            </div>

            {/* Submit — black pill button in the reference style */}
            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-card-hover active:translate-y-0"
            >
              Sign in
            </button>
          </form>

          {/* Demo hint box — REMOVE before going to production.
              Lists all hardcoded credentials so reviewers can log in. */}
          <div className="mt-6 space-y-1 rounded-xl bg-brand-faint px-4 py-3 text-center">
            <p className="text-xs font-semibold text-brand-dark">
              Demo credentials
            </p>
            {Object.values(CREDENTIALS).map((cred) => (
              <p key={cred.id} className="text-xs text-brand-dark">
                <span className="font-mono">{cred.id}</span>
                {' / '}
                <span className="font-mono">{cred.password}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

