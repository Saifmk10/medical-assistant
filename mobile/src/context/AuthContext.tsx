// =============================================================
// context/AuthContext.tsx — signed-in patient session state
// -------------------------------------------------------------
// TO CONNECT THE REAL BACKEND:
//   Replace `login()`'s body with a real POST /auth/login call and
//   store the returned token (e.g. via expo-secure-store) instead of
//   just holding the patient object in memory.
// =============================================================
import React, { createContext, useContext, useMemo, useState } from 'react';
import { MOCK_PATIENT } from '../data/mockPatient';
import type { Patient } from '../types';

interface AuthContextValue {
  patient: Patient | null;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);

  const login = async (_phone: string) => {
    // Simulated login — replace with a real API call + OTP verification.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPatient(MOCK_PATIENT);
  };

  const logout = () => setPatient(null);

  const value = useMemo(
    () => ({ patient, isAuthenticated: patient !== null, login, logout }),
    [patient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
