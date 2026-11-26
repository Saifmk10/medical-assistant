import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = Constants.expoConfig?.extra?.supabaseUrl;
  const key = Constants.expoConfig?.extra?.supabasePublishableKey;
  if (typeof url !== 'string' || typeof key !== 'string' || !url || !key) {
    throw new Error('Supabase configuration is missing. Check the mobile setup instructions.');
  }

  const storage = {
    getItem: (name: string) => Platform.OS === 'web'
      ? Promise.resolve(sessionStorage.getItem(name))
      : SecureStore.getItemAsync(name),
    setItem: (name: string, value: string) => Platform.OS === 'web'
      ? Promise.resolve(sessionStorage.setItem(name, value))
      : SecureStore.setItemAsync(name, value),
    removeItem: (name: string) => Platform.OS === 'web'
      ? Promise.resolve(sessionStorage.removeItem(name))
      : SecureStore.deleteItemAsync(name),
  };

  client = createClient(url, key, {
    auth: { storage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'pkce' },
  });
  return client;
}
