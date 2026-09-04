// =============================================================
// AuthContext — global authentication state
// -------------------------------------------------------------
// FRONTEND-ONLY auth (per project requirements):
// credentials are hardcoded in src/data/mockData.js and the
// session is kept in sessionStorage so a page refresh keeps the
// user logged in. Swap `login()` for a real API call later.
// =============================================================
import { createContext, useContext, useState, useCallback } from 'react';
import { CREDENTIALS } from '../data/mockData.js';

// The context object (null default → must be used inside provider)
const AuthContext = createContext(null);

// Keys used for sessionStorage persistence
const STORAGE_KEY = 'medcare_auth';

// Read any previously stored session (runs once on app load)
function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // corrupted storage → treat as logged out
  }
}

export function AuthProvider({ children }) {
  // `session` shape: { role: 'admin'|'doctor'|'maintenance', name, title }
  const [session, setSession] = useState(readStoredSession);

  // ---------------------------------------------------------
  // login(role, password)
  // Validates against the hardcoded CREDENTIALS table.
  // Returns { ok: true } on success, { ok: false, error } otherwise.
  // ---------------------------------------------------------
  const login = useCallback((role, password) => {
    const creds = CREDENTIALS[role];

    // Unknown role (tampered URL param, etc.)
    if (!creds) {
      return { ok: false, error: 'Unknown role.' };
    }

    // Wrong password
    if (creds.password !== password) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }

    // Success — build the session object and persist it
    const next = { role, name: creds.name, title: creds.title };
    setSession(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { ok: true };
  }, []);

  // ---------------------------------------------------------
  // logout() — clears state + storage; caller navigates home
  // ---------------------------------------------------------
  const logout = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // Everything below is available to any component via useAuth()
  const value = {
    session,
    isAuthenticated: Boolean(session),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Convenience hook — components call `const { session, login } = useAuth()`
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
