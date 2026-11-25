import { apiGet, apiPost } from './apiClient';
import { PROFILE_API_BASE_URL } from './config';

interface Profile {
  id: string;
  fullName: string;
  email: string | undefined;
}

export async function syncProfile(profile: Profile, signal: AbortSignal): Promise<void> {
  if (!profile.id || !profile.email) throw new Error('The signed-in account must have an ID and email.');
  const options = { baseUrl: PROFILE_API_BASE_URL, signal };
  const lookup = new URLSearchParams({ user_id: profile.id });
  const existing = await apiGet<unknown>(`/get-user?${lookup.toString()}`, options);
  if (existing !== null) {
    if (typeof existing === 'object' && !Array.isArray(existing) && 'id' in existing && existing.id === profile.id) return;
    throw new Error('Could not look up the user profile.');
  }

  const params = new URLSearchParams({
    id: profile.id,
    username: profile.fullName,
    email: profile.email,
  });
  const result = await apiPost<unknown>(`/new-user?${params.toString()}`, undefined, options);
  if (
    typeof result !== 'object' || result === null || Array.isArray(result) ||
    !('message' in result) || result.message !== 'User created successfully'
  ) {
    throw new Error('Could not create the user profile.');
  }
}
