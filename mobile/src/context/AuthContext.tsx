import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';
import type { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { getSupabase } from '../services/supabase';
import type { Patient } from '../types';

const redirectUrl = 'medical-assistant://auth/callback';

interface AuthContextValue {
  patient: Patient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function patientFromUser(user: User): Patient {
  const name = user.user_metadata.full_name;
  return {
    id: user.id,
    name: typeof name === 'string' && name.trim() ? name : 'Patient',
    email: user.email ?? '',
    phone: user.phone || 'Not provided',
    dateOfBirth: 'Not provided',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;

    Promise.resolve().then(async () => {
      if (!active) return;
      const client = getSupabase();
      const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
        if (active) {
          setSession(nextSession);
          setIsLoading(false);
        }
      });
      const appState = AppState.addEventListener('change', (state) => {
        if (state === 'active') client.auth.startAutoRefresh();
        else client.auth.stopAutoRefresh();
      });
      if (AppState.currentState === 'active') client.auth.startAutoRefresh();
      cleanup = () => {
        subscription.unsubscribe();
        appState.remove();
        client.auth.stopAutoRefresh();
      };
      const { error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
    }).catch((cause: unknown) => {
      if (active) {
        setError(cause instanceof Error ? cause.message : 'Could not restore your session.');
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      cleanup?.();
    };
  }, []);

  const login = useCallback(async () => {
    if (Platform.OS === 'web') throw new Error('Google sign-in is configured for the mobile app only.');
    if (typeof crypto === 'undefined' || !crypto.subtle || typeof TextEncoder === 'undefined') {
      throw new Error('Secure sign-in is unavailable on this device.');
    }
    setError(null);
    const client = getSupabase();
    const { data, error: oauthError } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
    });
    if (oauthError) throw oauthError;
    if (!data.url) throw new Error('Supabase did not provide a sign-in URL.');
    if (new URL(data.url).searchParams.get('code_challenge_method') !== 's256') {
      throw new Error('Secure sign-in could not be initialized. Please try again.');
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
    if (result.type !== 'success') throw new Error('Sign-in was cancelled or did not complete.');
    const callback = new URL(result.url);
    const expected = new URL(redirectUrl);
    if (callback.protocol !== expected.protocol || callback.host !== expected.host || callback.pathname !== expected.pathname) {
      throw new Error('Sign-in returned an unexpected redirect URL.');
    }
    const callbackError = callback.searchParams.get('error_description') || callback.searchParams.get('error');
    if (callbackError) throw new Error(`Google sign-in failed: ${callbackError}`);
    const code = callback.searchParams.get('code');
    if (!code) throw new Error('Sign-in did not return an authorization code. Check the Supabase redirect URL.');
    const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;
  }, []);

  const logout = useCallback(async () => {
    const { error: signOutError } = await getSupabase().auth.signOut({ scope: 'local' });
    if (signOutError) throw signOutError;
  }, []);

  const value = useMemo(() => ({
    patient: session?.user ? patientFromUser(session.user) : null,
    isAuthenticated: session !== null,
    isLoading,
    error,
    login,
    logout,
  }), [session, isLoading, error, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
